import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { createHash } from 'node:crypto';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true
});

/**
 * Computes deterministic SHA-256 hash of text content
 * @param {string} content
 * @returns {string}
 */
export function computeSha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Validates an SVG document thoroughly using XML parser and AST inspection
 * Requirement 44 & 45: AST-aware, no regex parsing, comprehensive multi-color detection
 * @param {string} svgContent
 * @param {string} [contextName='']
 * @returns {import('./types.mjs').ValidationResult}
 */
export function validateSvg(svgContent, contextName = '') {
  const trimmed = (svgContent || '').trim();
  const sha = computeSha256(trimmed);

  if (!trimmed) {
    return {
      status: 'FAILED',
      message: 'Empty SVG content or file is empty',
      sha256: sha,
      isMultiColor: false,
      xmlValid: false,
      renderable: false,
      elementCount: 0
    };
  }

  // 1. Guard against HTML error pages (404, 500, Cloudflare challenge, etc.)
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('<!doctype html') ||
    lower.includes('<html') ||
    lower.includes('<head') ||
    lower.includes('<body') ||
    lower.includes('404 not found') ||
    lower.includes('403 forbidden')
  ) {
    return {
      status: 'FAILED',
      message: 'Received HTML error page instead of authentic SVG',
      sha256: sha,
      isMultiColor: false,
      xmlValid: false,
      renderable: false,
      elementCount: 0
    };
  }

  // 2. Validate XML syntax using XMLValidator
  const xmlValidation = XMLValidator.validate(trimmed);
  if (xmlValidation !== true) {
    return {
      status: 'FAILED',
      message: `Malformed XML syntax: ${xmlValidation.err?.msg || 'Parse error'} at line ${xmlValidation.err?.line || '?'}`,
      sha256: sha,
      isMultiColor: false,
      xmlValid: false,
      renderable: false,
      elementCount: 0
    };
  }

  // 3. Parse XML DOM tree
  let parsed;
  try {
    parsed = parser.parse(trimmed);
  } catch (err) {
    return {
      status: 'FAILED',
      message: `XML parse exception: ${err.message}`,
      sha256: sha,
      isMultiColor: false,
      xmlValid: false,
      renderable: false,
      elementCount: 0
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      status: 'FAILED',
      message: 'Parsed XML output is not an object',
      sha256: sha,
      isMultiColor: false,
      xmlValid: false,
      renderable: false,
      elementCount: 0
    };
  }

  // 4. Validate SVG root tag
  const rootKeys = Object.keys(parsed).filter(k => !k.startsWith('?'));
  const svgKey = rootKeys.find(k => k.toLowerCase() === 'svg');

  if (!svgKey) {
    return {
      status: 'FAILED',
      message: `Root tag is <${rootKeys[0] || 'none'}>, expected <svg>`,
      sha256: sha,
      isMultiColor: false,
      xmlValid: false,
      renderable: false,
      elementCount: 0
    };
  }

  const svgNode = parsed[svgKey];
  if (!svgNode || typeof svgNode !== 'object') {
    return {
      status: 'FAILED',
      message: '<svg> root node is empty',
      sha256: sha,
      isMultiColor: false,
      xmlValid: false,
      renderable: false,
      elementCount: 0
    };
  }

  // 5. Validate ViewBox or dimensions
  const viewBox = svgNode['@_viewBox'] || svgNode['@_viewbox'];
  const width = svgNode['@_width'];
  const height = svgNode['@_height'];

  if (!viewBox && (!width || !height)) {
    return {
      status: 'FAILED',
      message: 'SVG lacks both viewBox and width/height attributes',
      sha256: sha,
      isMultiColor: false,
      xmlValid: true,
      renderable: false,
      elementCount: 0
    };
  }

  // 6. AST-Aware Element Counting and Multi-Color Detection (Requirement 45)
  let elementCount = 0;
  const graphicTags = ['path', 'polygon', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'g', 'use', 'image'];
  const gradientTags = ['lineargradient', 'radialgradient', 'meshgradient', 'pattern'];
  const distinctColors = new Set();
  let hasGradient = false;

  function extractColorsFromStyle(styleStr) {
    if (!styleStr || typeof styleStr !== 'string') return;
    const rules = styleStr.split(';');
    for (const rule of rules) {
      const [prop, val] = rule.split(':').map(s => s?.trim().toLowerCase());
      if ((prop === 'fill' || prop === 'stroke' || prop === 'stop-color') && val) {
        if (val !== 'none' && val !== 'currentcolor' && val !== 'inherit' && !val.startsWith('url(')) {
          distinctColors.add(val);
        } else if (val.startsWith('url(')) {
          hasGradient = true;
        }
      }
    }
  }

  function scanNode(node) {
    if (!node || typeof node !== 'object') return;
    for (const [key, val] of Object.entries(node)) {
      const lowerKey = key.toLowerCase();

      // Count graphic tags
      if (graphicTags.includes(lowerKey)) {
        if (Array.isArray(val)) {
          elementCount += val.length;
        } else {
          elementCount += 1;
        }
      }

      // Detect gradient definitions
      if (gradientTags.includes(lowerKey)) {
        hasGradient = true;
      }

      // Check fill attribute
      if ((lowerKey === '@_fill' || lowerKey === '@_stroke') && typeof val === 'string') {
        const c = val.trim().toLowerCase();
        if (c.startsWith('url(')) {
          hasGradient = true;
        } else if (c && c !== 'none' && c !== 'currentcolor' && c !== 'inherit') {
          distinctColors.add(c);
        }
      }

      // Check stop-color attribute for gradients
      if (lowerKey === '@_stop-color' && typeof val === 'string') {
        const c = val.trim().toLowerCase();
        if (c && c !== 'none' && c !== 'currentcolor' && c !== 'inherit') {
          distinctColors.add(c);
        }
      }

      // Check inline style attribute
      if (lowerKey === '@_style' && typeof val === 'string') {
        extractColorsFromStyle(val);
      }

      // Check embedded CSS in <style>
      if (lowerKey === 'style' && typeof val === 'object' && val['#text']) {
        extractColorsFromStyle(val['#text']);
      }

      // Recurse into child objects/arrays
      if (typeof val === 'object') {
        if (Array.isArray(val)) {
          for (const item of val) scanNode(item);
        } else {
          scanNode(val);
        }
      }
    }
  }

  scanNode(svgNode);

  if (elementCount === 0 && !svgNode['#text']) {
    return {
      status: 'FAILED',
      message: 'SVG contains no graphic vector elements (path, polygon, rect, circle, etc.)',
      sha256: sha,
      isMultiColor: false,
      xmlValid: true,
      renderable: false,
      elementCount: 0
    };
  }

  // Requirement 45: A multi-color SVG can contain multiple distinct colors OR gradients
  const isMultiColor = hasGradient || distinctColors.size > 1;

  return {
    status: 'VALID',
    message: isMultiColor
      ? `Valid multi-color SVG (${distinctColors.size} colors, ${hasGradient ? 'with gradients, ' : ''}${elementCount} elements)`
      : `Valid monochrome SVG (${elementCount} elements)`,
    sha256: sha,
    isMultiColor,
    xmlValid: true,
    renderable: true,
    svgRenderable: true,
    elementCount,
    distinctColors: Array.from(distinctColors),
    hasGradient,
    viewBox,
    width: Number(width) || undefined,
    height: Number(height) || undefined
  };
}
