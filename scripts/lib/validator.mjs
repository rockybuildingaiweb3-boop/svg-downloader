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
 * Validates an SVG document thoroughly using XML parser
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
      isMultiColor: false
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
      isMultiColor: false
    };
  }

  // 2. Validate XML syntax using XMLValidator
  const xmlValidation = XMLValidator.validate(trimmed);
  if (xmlValidation !== true) {
    return {
      status: 'FAILED',
      message: `Malformed XML syntax: ${xmlValidation.err?.msg || 'Parse error'} at line ${xmlValidation.err?.line || '?'}`,
      sha256: sha,
      isMultiColor: false
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
      isMultiColor: false
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      status: 'FAILED',
      message: 'Parsed XML output is not an object',
      sha256: sha,
      isMultiColor: false
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
      isMultiColor: false
    };
  }

  const svgNode = parsed[svgKey];
  if (!svgNode || typeof svgNode !== 'object') {
    return {
      status: 'FAILED',
      message: '<svg> root node is empty',
      sha256: sha,
      isMultiColor: false
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
      isMultiColor: false
    };
  }

  // 6. Check for vector child elements (path, polygon, rect, circle, g, etc.)
  const graphicTags = ['path', 'polygon', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'g', 'use', 'image'];
  const hasGraphics = graphicTags.some(tag => {
    return svgNode[tag] !== undefined || svgNode[tag.toUpperCase()] !== undefined;
  });

  if (!hasGraphics && !svgNode['#text']) {
    return {
      status: 'FAILED',
      message: 'SVG contains no graphic elements (path, polygon, rect, g, etc.)',
      sha256: sha,
      isMultiColor: false
    };
  }

  // 7. Detect multi-color elements without crude regex
  let isMultiColor = false;
  const distinctFills = new Set();

  function scanColors(node) {
    if (!node || typeof node !== 'object') return;
    for (const [key, val] of Object.entries(node)) {
      if (key === '@_fill' && typeof val === 'string') {
        const c = val.trim().toLowerCase();
        if (c && c !== 'none' && c !== 'currentcolor' && c !== 'inherit') {
          distinctFills.add(c);
        }
      }
      if (typeof val === 'object') {
        if (Array.isArray(val)) {
          for (const item of val) scanColors(item);
        } else {
          scanColors(val);
        }
      }
    }
  }

  scanColors(svgNode);
  if (distinctFills.size > 1) {
    isMultiColor = true;
  }

  // If valid, determine WARNING vs VALID
  if (isMultiColor) {
    return {
      status: 'WARNING',
      message: `Multi-color logo (${distinctFills.size} distinct colors: ${[...distinctFills].slice(0, 3).join(', ')})`,
      sha256: sha,
      isMultiColor: true,
      viewBox,
      width: Number(width) || undefined,
      height: Number(height) || undefined
    };
  }

  return {
    status: 'VALID',
    message: 'Valid vector SVG',
    sha256: sha,
    isMultiColor: false,
    viewBox,
    width: Number(width) || undefined,
    height: Number(height) || undefined
  };
}
