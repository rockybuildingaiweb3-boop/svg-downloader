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
 * @param {string[]} [input.deviconTags] - Tags directly provided upstream by Devicon
 * @param {Object} [input.collections] - Collections configuration from collections.json
 * @returns {{ primaryCategory: string, categories: string[], categorySource: 'curated' | 'derived' | 'source' | 'fallback', categoryConfidence: number }}
 */
export function classifyIdentity({ id, title = '', aliases = [], deviconTags = [], collections = {} }) {
  const cleanId = (id || '').toLowerCase().trim();
  const cleanTitle = (title || '').toLowerCase().trim();
  const allAliases = (aliases || []).map(a => a.toLowerCase().trim());
  const searchHaystack = [cleanId, cleanTitle, ...allAliases].join(' ');

  const candidateCategories = new Map(); // category -> { confidence, source }

  // 1. Check Curated Collections (Highest Confidence)
  if (collections.categories) {
    for (const [catName, list] of Object.entries(collections.categories)) {
      if (Array.isArray(list) && (list.includes(cleanId) || allAliases.some(a => list.includes(a)))) {
        const canonicalCat = CURATED_CATEGORY_MAP[catName] || 'brands';
        candidateCategories.set(canonicalCat, { confidence: 0.98, source: 'curated' });
      }
    }
  }

  if (collections.mainstream && collections.mainstream.includes(cleanId)) {
    if (!candidateCategories.has('technology') && !candidateCategories.has('brands')) {
      candidateCategories.set('technology', { confidence: 0.92, source: 'curated' });
    }
  }

  // 2. Check Source Tags (Devicon tags, etc.)
  if (Array.isArray(deviconTags) && deviconTags.length > 0) {
    for (const rawTag of deviconTags) {
      const tag = rawTag.toLowerCase().trim();
      if (tag === 'framework' || tag === 'library') {
        candidateCategories.set('technology', { confidence: 0.95, source: 'source' });
        candidateCategories.set('developer-tools', { confidence: 0.88, source: 'source' });
      } else if (tag === 'language' || tag === 'programming-language') {
        candidateCategories.set('technology', { confidence: 0.96, source: 'source' });
        candidateCategories.set('developer-tools', { confidence: 0.90, source: 'source' });
      } else if (tag === 'database' || tag === 'db') {
        candidateCategories.set('databases', { confidence: 0.96, source: 'source' });
        candidateCategories.set('technology', { confidence: 0.85, source: 'source' });
      } else if (tag === 'cloud') {
        candidateCategories.set('cloud', { confidence: 0.95, source: 'source' });
        candidateCategories.set('infrastructure', { confidence: 0.88, source: 'source' });
      } else if (tag === 'devops' || tag === 'tool') {
        candidateCategories.set('developer-tools', { confidence: 0.95, source: 'source' });
        candidateCategories.set('infrastructure', { confidence: 0.85, source: 'source' });
      } else if (tag === 'design') {
        candidateCategories.set('design', { confidence: 0.95, source: 'source' });
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
      const existing = candidateCategories.get(rule.category);
      if (!existing || existing.confidence < rule.weight) {
        candidateCategories.set(rule.category, { confidence: rule.weight, source: 'derived' });
      }
    }
  }

  // If no candidates found yet, check generic suffix/prefix heuristics
  if (candidateCategories.size === 0) {
    if (cleanId.endsWith('db') || cleanId.endsWith('sql')) {
      candidateCategories.set('databases', { confidence: 0.75, source: 'derived' });
    } else if (cleanId.endsWith('js') || cleanId.endsWith('ts') || cleanId.endsWith('py')) {
      candidateCategories.set('technology', { confidence: 0.75, source: 'derived' });
      candidateCategories.set('developer-tools', { confidence: 0.70, source: 'derived' });
    } else if (cleanId.startsWith('apache') || cleanId.startsWith('gnu') || cleanId.startsWith('linux')) {
      candidateCategories.set('infrastructure', { confidence: 0.75, source: 'derived' });
      candidateCategories.set('technology', { confidence: 0.70, source: 'derived' });
    }
  }

  // 4. Fallback Handling: Low Confidence / Unclassified
  if (candidateCategories.size === 0) {
    // Determine whether weak evidence suggests needs-review or uncategorized
    const hasAlphaNumeric = /[a-z0-9]/.test(cleanId);
    if (hasAlphaNumeric && cleanId.length >= 3) {
      return {
        primaryCategory: 'needs-review',
        categories: ['needs-review'],
        categorySource: 'fallback',
        categoryConfidence: 0.40
      };
    } else {
      return {
        primaryCategory: 'uncategorized',
        categories: ['uncategorized'],
        categorySource: 'fallback',
        categoryConfidence: 0.10
      };
    }
  }

  // Sort candidates by confidence descending
  const sorted = Array.from(candidateCategories.entries())
    .sort((a, b) => b[1].confidence - a[1].confidence);

  const topCategory = sorted[0][0];
  const topConfidence = sorted[0][1].confidence;
  const topSource = sorted[0][1].source;

  // Include all categories with confidence >= 0.65 or within 0.15 of top
  const activeCategories = sorted
    .filter(([_, data]) => data.confidence >= 0.65 || (topConfidence - data.confidence <= 0.15))
    .map(([cat]) => cat);

  return {
    primaryCategory: topCategory,
    categories: activeCategories.length > 0 ? activeCategories : [topCategory],
    categorySource: topSource,
    categoryConfidence: Number(topConfidence.toFixed(2))
  };
}
