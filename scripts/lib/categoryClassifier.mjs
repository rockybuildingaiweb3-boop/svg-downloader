/**
 * Multi-Category Classification Engine
 *
 * Implements:
 * 1. Multi-category metadata (primaryCategory, categories[], categorySource, categoryConfidence)
 * 2. Multi-tier evidence derivation (curated hints, source metadata, semantic heuristics)
 * 3. Support for uncategorized (<0.20) and needs-review (0.20 - 0.49)
 * 4. Language-neutral category IDs
 */

// Canonical category IDs
export const VALID_CATEGORIES = [
  'brands',
  'technology',
  'developer-tools',
  'cloud',
  'databases',
  'ai',
  'web3',
  'apps',
  'social',
  'design',
  'gaming',
  'infrastructure',
  'security',
  'productivity',
  'media',
  'communication',
  'uncategorized',
  'needs-review'
];

// Mapping from legacy curated collection names to standard IDs
const CURATED_CATEGORY_MAP = {
  mainstream: 'technology',
  brands: 'brands',
  technologies: 'technology',
  technology: 'technology',
  apps: 'apps',
  cloud: 'cloud',
  databases: 'databases',
  'developer-tools': 'developer-tools',
  devtools: 'developer-tools',
  tools: 'developer-tools',
  design: 'design',
  social: 'social',
  gaming: 'gaming',
  web3: 'web3',
  custom: 'brands',
  bigtech: 'brands',
  ai: 'ai'
};

// Keyword patterns for semantic heuristics
const SEMANTIC_PATTERNS = [
  {
    category: 'ai',
    weight: 0.90,
    keywords: [
      'openai', 'anthropic', 'claude', 'deepseek', 'mistral', 'huggingface', 'cohere',
      'midjourney', 'stability', 'langchain', 'ollama', 'pytorch', 'tensorflow', 'scikit',
      'keras', 'pandas', 'numpy', 'jupyter', 'gemini', 'copilot', 'perplexity', 'chatgpt',
      'artificialintelligence', 'machinelearning', 'neural', 'llm', 'generative', 'runway',
      'groq', 'elevenlabs', 'sora', 'replicate'
    ]
  },
  {
    category: 'web3',
    weight: 0.90,
    keywords: [
      'crypto', 'bitcoin', 'ethereum', 'solana', 'binance', 'polygon', 'web3', 'nft',
      'metamask', 'uniswap', 'coinbase', 'chainlink', 'cardano', 'tether', 'avalanche',
      'polkadot', 'near', 'arbitrum', 'optimism', 'monero', 'dogecoin', 'ripple', 'xrp',
      'ledger', 'trezor', 'opensea', 'phantom', 'trustwallet', 'solidity', 'ipfs',
      'blockchain', 'decentralized', 'pancakeswap', 'aave', 'makerdao', 'sushiswap'
    ]
  },
  {
    category: 'cloud',
    weight: 0.88,
    keywords: [
      'amazonwebservices', 'aws', 'googlecloud', 'gcp', 'microsoftazure', 'azure',
      'cloudflare', 'digitalocean', 'heroku', 'vercel', 'netlify', 'linode', 'openstack',
      'ovh', 'scaleway', 'serverless', 'flyio', 'render', 'supabase', 'firebase',
      'backblaze', 'fastly', 'akamai', 'hetzner', 'vultr', 'upcloud', 'cloud'
    ]
  },
  {
    category: 'databases',
    weight: 0.88,
    keywords: [
      'database', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite',
      'mariadb', 'couchdb', 'cassandra', 'neo4j', 'elasticsearch', 'dynamodb',
      'cockroachdb', 'clickhouse', 'influxdb', 'prisma', 'drizzle', 'supabase',
      'faunadb', 'planetscale', 'timescaledb', 'rethinkdb', 'realm', 'arangodb',
      'memcached', 'surrealdb', 'scylladb', 'meilisearch', 'typesense', 'neo4j'
    ]
  },
  {
    category: 'infrastructure',
    weight: 0.88,
    keywords: [
      'kubernetes', 'k8s', 'docker', 'terraform', 'ansible', 'jenkins', 'gitlab',
      'circleci', 'argocd', 'helm', 'prometheus', 'grafana', 'nginx', 'apache',
      'caddy', 'traefik', 'vagrant', 'puppet', 'consul', 'envoy', 'istio', 'linux',
      'ubuntu', 'debian', 'redhat', 'centos', 'archlinux', 'fedora', 'alpinelinux',
      'sentry', 'datadog', 'newrelic', 'splunk', 'elastic', 'kibana', 'logstash',
      'kafka', 'rabbitmq', 'zeromq', 'openresty', 'harbor', 'portainer', 'podman',
      'packer', 'freebsd', 'suse', 'opensuse', 'gentoo', 'rockylinux', 'almalinux'
    ]
  },
  {
    category: 'security',
    weight: 0.88,
    keywords: [
      'security', '1password', 'bitwarden', 'okta', 'auth0', 'nordvpn', 'snyk',
      'hashicorpvault', 'crowdstrike', 'tor', 'wireguard', 'openvpn', 'wireshark',
      'kalilinux', 'letsencrypt', 'yubico', 'proton', 'certbot', 'kaspersky',
      'malwarebytes', 'metasploit', 'snort', 'owasp', 'lastpass', 'keepass',
      'auth', 'oauth', 'jwt', 'cybersecurity', 'firewall', 'burpsuite', 'clamav'
    ]
  },
  {
    category: 'developer-tools',
    weight: 0.85,
    keywords: [
      'git', 'github', 'visualstudiocode', 'vscode', 'intellij', 'pycharm', 'webstorm',
      'vim', 'neovim', 'sublime', 'postman', 'insomnia', 'npm', 'yarn', 'pnpm',
      'webpack', 'vite', 'esbuild', 'turborepo', 'babel', 'typescript', 'eslint',
      'prettier', 'jest', 'vitest', 'cypress', 'playwright', 'terminal', 'bash',
      'zsh', 'powershell', 'cmake', 'gradle', 'maven', 'ant', 'gulp', 'grunt',
      'sublimetext', 'atom', 'eclipse', 'netbeans', 'xcode', 'androidstudio',
      'postman', 'hoppscotch', 'swagger', 'graphql', 'grpc', 'openapi', 'pip',
      'composer', 'cargo', 'nuget', 'homebrew', 'chocolatey', 'bun', 'deno'
    ]
  },
  {
    category: 'design',
    weight: 0.85,
    keywords: [
      'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'indesign', 'aftereffects',
      'premiere', 'blender', 'canva', 'framer', 'invision', 'dribbble', 'behance',
      'affinity', 'gimp', 'inkscape', 'rive', 'spline', 'unrealengine', 'unity',
      'artstation', 'pixiv', 'deviantart', 'krita', 'cinema4d', 'autodesk',
      'maya', '3dsmax', 'coreldraw', 'fontsource', 'googlefonts', 'unsplash'
    ]
  },
  {
    category: 'social',
    weight: 0.85,
    keywords: [
      'twitter', 'x', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube',
      'reddit', 'mastodon', 'threads', 'snapchat', 'pinterest', 'whatsapp',
      'telegram', 'discord', 'signal', 'wechat', 'line', 'tumblr', 'medium',
      'bluesky', 'quora', 'vk', 'weibo', 'clubhouse', 'twitch', 'vimeo',
      'patreon', 'kickstarter', 'substack', 'discourse', 'disqus'
    ]
  },
  {
    category: 'gaming',
    weight: 0.85,
    keywords: [
      'steam', 'playstation', 'xbox', 'nintendo', 'epicgames', 'unity', 'unreal',
      'twitch', 'riotgames', 'blizzard', 'ea', 'ubisoft', 'roblox', 'minecraft',
      'sega', 'atari', 'ign', 'itchio', 'gog', 'gameloft', 'valve', 'squareenix',
      'capcom', 'konami', 'bandainamco', 'battlenet', 'origin', 'discord'
    ]
  },
  {
    category: 'media',
    weight: 0.85,
    keywords: [
      'spotify', 'applemusic', 'soundcloud', 'netflix', 'primevideo', 'hulu',
      'disneyplus', 'vimeo', 'deezer', 'tidal', 'audible', 'pocketcasts',
      'pandora', 'shazam', 'tunein', 'lastfm', 'bandcamp', 'plex', 'kodi'
    ]
  },
  {
    category: 'communication',
    weight: 0.85,
    keywords: [
      'slack', 'teams', 'microsoftteams', 'zoom', 'skype', 'signal', 'mattermost',
      'matrix', 'element', 'thunderbird', 'gmail', 'outlook', 'protonmail',
      'roundcube', 'fastmail', 'mumble', 'teamspeak', 'rocketchat', 'zulip'
    ]
  },
  {
    category: 'productivity',
    weight: 0.85,
    keywords: [
      'notion', 'linear', 'jira', 'confluence', 'trello', 'asana', 'airtable',
      'obsidian', 'evernote', 'miro', 'loom', 'coda', 'basecamp', 'monday',
      'clickup', 'todoist', 'roamresearch', 'logseq', 'onenote', 'dropbox',
      'googledrive', 'box', 'nextcloud', 'owncloud', 'googleworkspace'
    ]
  },
  {
    category: 'apps',
    weight: 0.80,
    keywords: [
      'googlechrome', 'chrome', 'firefox', 'brave', 'microsoftedge', 'safari',
      'opera', 'vivaldi', 'torbrowser', 'windows', 'macos', 'android', 'ios',
      'linux', 'libreoffice', 'vlc', 'obs', 'obsstudio', 'calibre', 'transmission'
    ]
  },
  {
    category: 'technology',
    weight: 0.82,
    keywords: [
      'python', 'javascript', 'typescript', 'rust', 'go', 'cplusplus', 'csharp',
      'java', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'dart', 'elixir',
      'haskell', 'lua', 'julia', 'clojure', 'erlang', 'perl', 'r', 'react',
      'vue', 'angular', 'svelte', 'nextdotjs', 'nuxt', 'astro', 'remix',
      'express', 'fastapi', 'django', 'flask', 'spring', 'laravel', 'rails',
      'aspnet', 'tailwindcss', 'bootstrap', 'sass', 'html5', 'css3', 'jquery'
    ]
  },
  {
    category: 'brands',
    weight: 0.78,
    keywords: [
      'apple', 'google', 'microsoft', 'amazon', 'meta', 'ibm', 'oracle', 'intel',
      'amd', 'nvidia', 'cisco', 'dell', 'hp', 'lenovo', 'sony', 'samsung',
      'tesla', 'bmw', 'mercedes', 'toyota', 'volkswagen', 'audi', 'ford',
      'nike', 'adidas', 'puma', 'gucci', 'zara', 'hm', 'ikea', 'target',
      'walmart', 'costco', 'starbucks', 'mcdonalds', 'cocacola', 'pepsi',
      'visa', 'mastercard', 'paypal', 'stripe', 'americanexpress', 'uber',
      'airbnb', 'booking', 'ebay', 'shopify', 'fedex', 'ups', 'dhl'
    ]
  }
];

/**
 * Classifies an identity using multi-source evidence
 *
 * @param {Object} input
 * @param {string} input.id - Canonical identity identifier (e.g. 'amazonwebservices')
 * @param {string} [input.title] - Human-readable title (e.g. 'Amazon Web Services')
 * @param {string[]} [input.aliases] - Alternate names/slugs
/**
 * Infer entity type from identifier, category, and tags
 * @param {string} id
 * @param {string} category
 * @param {string[]} tags
 * @returns {string}
 */
export function inferEntityType(id = '', category = '', tags = []) {
  const cleanId = (id || '').toLowerCase().trim();
  const cat = (category || '').toLowerCase().trim();
  const cleanTags = (tags || []).map(t => (t || '').toLowerCase().trim());

  if (
    cleanTags.includes('framework') ||
    cleanTags.includes('library') ||
    ['react', 'vue', 'angular', 'svelte', 'nextdotjs', 'nuxt', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'fastapi', 'tailwind', 'tailwindcss', 'bootstrap', 'jquery', 'pandas', 'numpy', 'pytorch', 'tensorflow', 'scikit-learn'].includes(cleanId)
  ) {
    return 'framework';
  }
  if (
    cleanTags.includes('language') ||
    cleanTags.includes('programming-language') ||
    cleanTags.includes('programming') ||
    ['python', 'rust', 'c', 'cplusplus', 'csharp', 'java', 'typescript', 'javascript', 'go', 'golang', 'ruby', 'php', 'swift', 'kotlin', 'dart', 'scala', 'elixir', 'haskell', 'lua', 'perl', 'r', 'julia', 'solidity'].includes(cleanId)
  ) {
    return 'programming-language';
  }
  if (cat === 'databases' || cleanTags.includes('database') || cleanTags.includes('db') || cleanId.includes('sql') || cleanId.includes('db') || ['mongodb', 'redis', 'postgres', 'postgresql', 'mysql', 'sqlite', 'cassandra', 'neo4j', 'couchdb', 'mariadb', 'supabase', 'cockroachdb', 'clickhouse'].includes(cleanId)) {
    return 'database';
  }
  if (cat === 'web3' || cleanTags.includes('blockchain') || cleanTags.includes('cryptocurrency') || ['bitcoin', 'ethereum', 'solana', 'binance', 'polygon', 'cardano', 'avalanche', 'polkadot', 'chainlink', 'uniswap'].includes(cleanId)) {
    return 'protocol';
  }
  if (['github', 'gitlab', 'aws', 'amazonwebservices', 'googlecloud', 'microsoftazure', 'azure', 'vercel', 'netlify', 'cloudflare', 'digitalocean', 'heroku', 'npm', 'pypi', 'dockerhub'].includes(cleanId)) {
    return 'platform';
  }
  if (['docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'webpack', 'vite', 'esbuild', 'babel', 'git', 'postman', 'insomnia', 'eslint', 'prettier', 'vitest', 'jest'].includes(cleanId)) {
    return 'tool';
  }
  if (cat === 'cloud' || cat === 'infrastructure') {
    return 'platform';
  }
  if (cat === 'apps' || ['slack', 'discord', 'telegram', 'whatsapp', 'signal', 'spotify', 'zoom', 'notion', 'figma', 'skype', 'teams', 'obsidian', 'trello', 'asana', 'airtable'].includes(cleanId)) {
    return 'app';
  }
  if (cat === 'brands' || ['apple', 'google', 'microsoft', 'amazon', 'meta', 'tesla', 'nvidia', 'intel', 'amd', 'samsung', 'sony', 'adobe', 'ibm', 'oracle', 'salesforce', 'cisco', 'dell', 'hp', 'lenovo', 'nike', 'adidas', 'visa', 'mastercard', 'paypal', 'stripe', 'uber', 'airbnb'].includes(cleanId)) {
    return 'company';
  }
  if (cat === 'developer-tools') {
    return 'tool';
  }
  if (cat === 'social' || cat === 'communication') {
    return 'service';
  }
  if (cat === 'ai') {
    return 'technology';
  }
  if (cat === 'gaming') {
    return 'game';
  }
  return 'technology';
}

/**
 * Classifies an identity using multi-source evidence
 *
 * @param {Object} input
 * @param {string} input.id - Canonical identity identifier (e.g. 'amazonwebservices')
 * @param {string} [input.title] - Human-readable title (e.g. 'Amazon Web Services')
 * @param {string[]} [input.aliases] - Alternate names/slugs
 * @param {string[]} [input.deviconTags] - Tags directly provided upstream by Devicon
 * @param {Object} [input.collections] - Collections configuration from collections.json
 * @returns {{ primaryCategory: string, categories: string[], categorySource: 'curated' | 'derived' | 'source' | 'fallback', categoryConfidence: number, categoryEvidence: string[], entityType: string }}
 */
export function classifyIdentity({ id, title = '', aliases = [], deviconTags = [], collections = {} }) {
  const cleanId = (id || '').toLowerCase().trim();
  const cleanTitle = (title || '').toLowerCase().trim();
  const allAliases = (aliases || []).map(a => a.toLowerCase().trim());

  // Category -> { confidences: number[], sources: string[], evidences: string[] }
  const candidateCategories = new Map();
  const allEvidenceList = [];

  function addCategoryEvidence(category, confidence, source, evidence) {
    if (!candidateCategories.has(category)) {
      candidateCategories.set(category, {
        confidences: [],
        sources: [],
        evidences: []
      });
    }
    const entry = candidateCategories.get(category);
    entry.confidences.push(confidence);
    if (!entry.sources.includes(source)) {
      entry.sources.push(source);
    }
    if (!entry.evidences.includes(evidence)) {
      entry.evidences.push(evidence);
    }
    if (!allEvidenceList.includes(evidence)) {
      allEvidenceList.push(evidence);
    }
  }

  // 1. Check Curated Collections (Highest Confidence)
  if (collections.categories) {
    for (const [catName, list] of Object.entries(collections.categories)) {
      if (Array.isArray(list) && (list.includes(cleanId) || allAliases.some(a => list.includes(a)))) {
        const canonicalCat = CURATED_CATEGORY_MAP[catName] || 'uncategorized';
        const ev = `Curated catalog category hint: ${catName}`;
        addCategoryEvidence(canonicalCat, 0.98, 'curated', ev);
      }
    }
  }

  // 2. Check Source Tags (Devicon tags, etc.)
  if (Array.isArray(deviconTags) && deviconTags.length > 0) {
    for (const rawTag of deviconTags) {
      const tag = rawTag.toLowerCase().trim();
      if (tag === 'framework' || tag === 'library') {
        const ev = `Devicon upstream tag: ${tag} -> technology/developer-tools`;
        addCategoryEvidence('technology', 0.96, 'source', ev);
        addCategoryEvidence('developer-tools', 0.90, 'source', ev);
      } else if (tag === 'language' || tag === 'programming-language') {
        const ev = `Devicon upstream tag: ${tag} -> technology/developer-tools`;
        addCategoryEvidence('technology', 0.96, 'source', ev);
        addCategoryEvidence('developer-tools', 0.90, 'source', ev);
      } else if (tag === 'database' || tag === 'db') {
        const ev = `Devicon upstream tag: ${tag} -> databases`;
        addCategoryEvidence('databases', 0.96, 'source', ev);
        addCategoryEvidence('technology', 0.85, 'source', ev);
      } else if (tag === 'cloud') {
        const ev = `Devicon upstream tag: ${tag} -> cloud`;
        addCategoryEvidence('cloud', 0.95, 'source', ev);
        addCategoryEvidence('infrastructure', 0.88, 'source', ev);
      } else if (tag === 'devops' || tag === 'tool') {
        const ev = `Devicon upstream tag: ${tag} -> developer-tools`;
        addCategoryEvidence('developer-tools', 0.95, 'source', ev);
        addCategoryEvidence('infrastructure', 0.85, 'source', ev);
      } else if (tag === 'design') {
        const ev = `Devicon upstream tag: ${tag} -> design`;
        addCategoryEvidence('design', 0.95, 'source', ev);
      }
    }
  }

  // 3. Check Semantic Heuristics & Keywords
  for (const rule of SEMANTIC_PATTERNS) {
    const matched = rule.keywords.some(kw => {
      // Word boundary match or exact substring match
      if (cleanId === kw || allAliases.includes(kw)) return true;
      if (cleanId.includes(kw)) {
        // Prevent false positives for very short keywords
        if (kw.length <= 2) return cleanId === kw;
        return true;
      }
      if (cleanTitle.toLowerCase().includes(kw)) {
        if (kw.length <= 2) return false;
        return true;
      }
      return false;
    });

    if (matched) {
      const ev = `Semantic keyword match: ${rule.category}`;
      addCategoryEvidence(rule.category, rule.weight, 'derived', ev);
    }
  }

  // If no candidates found yet, check generic suffix/prefix heuristics
  if (candidateCategories.size === 0) {
    if (cleanId.endsWith('db') || cleanId.endsWith('sql')) {
      const ev = 'Affix heuristic: ends with db/sql';
      addCategoryEvidence('databases', 0.75, 'derived', ev);
    } else if (cleanId.endsWith('js') || cleanId.endsWith('ts') || cleanId.endsWith('py')) {
      const ev = 'Affix heuristic: language file extension';
      addCategoryEvidence('technology', 0.75, 'derived', ev);
      addCategoryEvidence('developer-tools', 0.70, 'derived', ev);
    } else if (cleanId.startsWith('apache') || cleanId.startsWith('gnu') || cleanId.startsWith('linux')) {
      const ev = 'Prefix heuristic: open-source foundation';
      addCategoryEvidence('infrastructure', 0.75, 'derived', ev);
      addCategoryEvidence('technology', 0.70, 'derived', ev);
    }
  }

  // 4. Fallback Handling: Low Confidence / Unclassified
  if (candidateCategories.size === 0) {
    const hasAlphaNumeric = /[a-z0-9]/.test(cleanId);
    if (hasAlphaNumeric && cleanId.length >= 3) {
      return {
        primaryCategory: 'needs-review',
        categories: ['needs-review'],
        categorySource: 'fallback',
        categoryConfidence: 0.40,
        categoryEvidence: ['Low confidence score (no known signals matched); flagged for review'],
        entityType: inferEntityType(cleanId, 'needs-review', deviconTags)
      };
    } else {
      return {
        primaryCategory: 'uncategorized',
        categories: ['uncategorized'],
        categorySource: 'fallback',
        categoryConfidence: 0.10,
        categoryEvidence: ['Insufficient classification evidence (< 0.20 confidence)'],
        entityType: inferEntityType(cleanId, 'uncategorized', deviconTags)
      };
    }
  }

  // Calculate accumulated confidence and determine highest source priority for each category
  const SOURCE_PRIORITY = { curated: 4, source: 3, derived: 2, fallback: 1 };
  const evaluatedCategories = [];

  for (const [cat, data] of candidateCategories.entries()) {
    const maxConf = Math.max(...data.confidences);
    // Accumulate multiple evidence signals to boost confidence
    const boost = data.confidences.length > 1 ? Math.min(0.04, (data.confidences.length - 1) * 0.02) : 0;
    const finalConfidence = Math.min(0.99, maxConf + boost);
    const sortedSources = [...data.sources].sort((a, b) => (SOURCE_PRIORITY[b] || 0) - (SOURCE_PRIORITY[a] || 0));
    const primarySource = sortedSources[0] || 'derived';

    evaluatedCategories.push({
      category: cat,
      confidence: finalConfidence,
      source: primarySource,
      evidences: data.evidences
    });
  }

  // Sort candidates by confidence descending
  evaluatedCategories.sort((a, b) => b.confidence - a.confidence);

  const top = evaluatedCategories[0];
  const topCategory = top.category;
  const topConfidence = top.confidence;
  const topSource = top.source;

  // Include all categories with confidence >= 0.65 or within 0.15 of top
  const activeCategories = evaluatedCategories
    .filter(item => item.confidence >= 0.65 || (topConfidence - item.confidence <= 0.15))
    .map(item => item.category);

  // Collect all distinct evidences across active categories, prioritizing top category
  const activeEvidences = Array.from(new Set([
    ...top.evidences,
    ...evaluatedCategories.filter(item => activeCategories.includes(item.category)).flatMap(item => item.evidences)
  ]));

  return {
    primaryCategory: topCategory,
    categories: activeCategories.length > 0 ? activeCategories : [topCategory],
    categorySource: topSource,
    categoryConfidence: Number(topConfidence.toFixed(2)),
    categoryEvidence: activeEvidences.length > 0 ? activeEvidences : allEvidenceList,
    entityType: inferEntityType(cleanId, topCategory, deviconTags)
  };
}
