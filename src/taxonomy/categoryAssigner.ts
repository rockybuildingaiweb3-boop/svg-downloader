import { StandardCategoryId, CATEGORY_IDS } from './taxonomy';

export interface IdentityCategoryInput {
  id: string;
  title?: string;
  aliases?: string[];
  tags?: string[];
  sourceProvider?: string;
  sourceCollection?: string;
  sourceCategory?: string;
  deviconTags?: string[];
  curatedHint?: string;
}

export interface CategoryAssignment {
  primaryCategory: StandardCategoryId;
  categories: StandardCategoryId[];
  categorySource: 'source' | 'curated' | 'derived' | 'fallback';
  categoryConfidence: number;
  categoryEvidence: string[];
}

interface CategoryCandidate {
  confidence: number;
  source: 'source' | 'curated' | 'derived' | 'fallback';
  evidence: string;
}

// Explicit classification rules for canonical technology ecosystems
const EXPLICIT_RULES: Record<string, { primary: StandardCategoryId; categories: StandardCategoryId[]; evidence: string }> = {
  aws: {
    primary: 'cloud',
    categories: ['cloud', 'infrastructure', 'developer-tools'],
    evidence: 'Explicit semantic classification: AWS Cloud & Infrastructure Ecosystem',
  },
  amazonwebservices: {
    primary: 'cloud',
    categories: ['cloud', 'infrastructure', 'developer-tools'],
    evidence: 'Explicit semantic classification: AWS Cloud & Infrastructure Ecosystem',
  },
  googlecloud: {
    primary: 'cloud',
    categories: ['cloud', 'infrastructure', 'developer-tools'],
    evidence: 'Explicit semantic classification: Google Cloud Platform',
  },
  microsoftazure: {
    primary: 'cloud',
    categories: ['cloud', 'infrastructure', 'developer-tools'],
    evidence: 'Explicit semantic classification: Microsoft Azure Cloud Platform',
  },
  docker: {
    primary: 'infrastructure',
    categories: ['infrastructure', 'developer-tools', 'technology'],
    evidence: 'Explicit semantic classification: Docker Containerization Platform',
  },
  kubernetes: {
    primary: 'infrastructure',
    categories: ['infrastructure', 'cloud', 'developer-tools'],
    evidence: 'Explicit semantic classification: Kubernetes Container Orchestration',
  },
  react: {
    primary: 'developer-tools',
    categories: ['developer-tools', 'technology'],
    evidence: 'Explicit semantic classification: React Frontend Framework',
  },
  vuedotjs: {
    primary: 'developer-tools',
    categories: ['developer-tools', 'technology'],
    evidence: 'Explicit semantic classification: Vue.js Frontend Framework',
  },
  nextdotjs: {
    primary: 'developer-tools',
    categories: ['developer-tools', 'technology'],
    evidence: 'Explicit semantic classification: Next.js React Framework',
  },
  postgresql: {
    primary: 'databases',
    categories: ['databases', 'technology', 'developer-tools'],
    evidence: 'Explicit semantic classification: PostgreSQL Relational Database',
  },
  mongodb: {
    primary: 'databases',
    categories: ['databases', 'technology', 'developer-tools'],
    evidence: 'Explicit semantic classification: MongoDB Document Database',
  },
  github: {
    primary: 'developer-tools',
    categories: ['developer-tools', 'social', 'brands'],
    evidence: 'Explicit semantic classification: GitHub Developer Platform',
  },
  openai: {
    primary: 'ai',
    categories: ['ai', 'developer-tools', 'brands'],
    evidence: 'Explicit semantic classification: OpenAI Artificial Intelligence',
  },
  anthropic: {
    primary: 'ai',
    categories: ['ai', 'developer-tools', 'brands'],
    evidence: 'Explicit semantic classification: Anthropic Claude AI Ecosystem',
  },
  ethereum: {
    primary: 'web3',
    categories: ['web3', 'technology'],
    evidence: 'Explicit semantic classification: Ethereum Blockchain Platform',
  },
  bitcoin: {
    primary: 'web3',
    categories: ['web3', 'technology'],
    evidence: 'Explicit semantic classification: Bitcoin Decentralized Network',
  },
};

// Semantic pattern rules with confidence weights
const SEMANTIC_PATTERNS: Array<{
  category: StandardCategoryId;
  weight: number;
  keywords: string[];
}> = [
  {
    category: 'ai',
    weight: 0.92,
    keywords: [
      'openai', 'anthropic', 'claude', 'deepseek', 'mistral', 'huggingface', 'cohere',
      'midjourney', 'stability', 'langchain', 'ollama', 'pytorch', 'tensorflow', 'scikit',
      'keras', 'pandas', 'numpy', 'jupyter', 'gemini', 'copilot', 'perplexity', 'chatgpt',
      'artificialintelligence', 'machinelearning', 'neural', 'llm', 'generative', 'runway',
      'groq', 'elevenlabs', 'sora', 'replicate', 'cursor', 'v0'
    ],
  },
  {
    category: 'web3',
    weight: 0.92,
    keywords: [
      'crypto', 'bitcoin', 'ethereum', 'solana', 'binance', 'polygon', 'web3', 'nft',
      'metamask', 'uniswap', 'coinbase', 'chainlink', 'cardano', 'tether', 'avalanche',
      'polkadot', 'near', 'arbitrum', 'optimism', 'monero', 'dogecoin', 'ripple', 'xrp',
      'ledger', 'trezor', 'opensea', 'phantom', 'trustwallet', 'solidity', 'ipfs',
      'blockchain', 'decentralized', 'pancakeswap', 'aave', 'makerdao', 'sushiswap'
    ],
  },
  {
    category: 'cloud',
    weight: 0.90,
    keywords: [
      'amazonwebservices', 'aws', 'googlecloud', 'gcp', 'microsoftazure', 'azure',
      'cloudflare', 'digitalocean', 'heroku', 'vercel', 'netlify', 'linode', 'openstack',
      'ovh', 'scaleway', 'serverless', 'flyio', 'render', 'supabase', 'firebase',
      'backblaze', 'fastly', 'akamai', 'hetzner', 'vultr', 'upcloud', 'cloud'
    ],
  },
  {
    category: 'databases',
    weight: 0.90,
    keywords: [
      'database', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite',
      'mariadb', 'couchdb', 'cassandra', 'neo4j', 'elasticsearch', 'dynamodb',
      'cockroachdb', 'clickhouse', 'influxdb', 'prisma', 'drizzle', 'supabase',
      'faunadb', 'planetscale', 'timescaledb', 'rethinkdb', 'realm', 'arangodb',
      'memcached', 'surrealdb', 'scylladb', 'meilisearch', 'typesense'
    ],
  },
  {
    category: 'infrastructure',
    weight: 0.88,
    keywords: [
      'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'gitlab',
      'circleci', 'argocd', 'prometheus', 'grafana', 'datadog', 'nginx', 'apache',
      'caddy', 'traefik', 'envoy', 'consul', 'vault', 'vagrant', 'nomad', 'puppet',
      'chef', 'helm', 'sentry', 'splunk', 'newrelic', 'opentelemetry', 'server'
    ],
  },
  {
    category: 'developer-tools',
    weight: 0.86,
    keywords: [
      'typescript', 'javascript', 'python', 'rust', 'golang', 'cplusplus', 'java',
      'ruby', 'php', 'swift', 'kotlin', 'dart', 'scala', 'elixir', 'clojure',
      'vscode', 'vim', 'neovim', 'sublime', 'intellij', 'webstorm', 'pycharm',
      'git', 'github', 'npm', 'yarn', 'pnpm', 'vite', 'webpack', 'esbuild',
      'babel', 'eslint', 'prettier', 'jest', 'vitest', 'playwright', 'cypress',
      'postman', 'insomnia', 'swagger', 'graphql', 'grpc', 'storybook', 'tailwind',
      'framework', 'compiler', 'debugger', 'sdk', 'api'
    ],
  },
  {
    category: 'security',
    weight: 0.88,
    keywords: [
      'security', 'auth0', 'okta', '1password', 'bitwarden', 'lastpass', 'crowdstrike',
      'paloaltonetworks', 'fortinet', 'snort', 'wireshark', 'kalilinux', 'tor',
      'nordvpn', 'expressvpn', 'proton', 'letsencrypt', 'ssl', 'yubico', 'keycloak'
    ],
  },
  {
    category: 'design',
    weight: 0.88,
    keywords: [
      'figma', 'sketch', 'adobexd', 'framer', 'invision', 'canva', 'blender',
      'photoshop', 'illustrator', 'aftereffects', 'indesign', 'premierepro',
      'lightroom', 'behance', 'dribbble', 'dribble', 'unsplash', 'artstation'
    ],
  },
  {
    category: 'productivity',
    weight: 0.86,
    keywords: [
      'notion', 'linear', 'jira', 'confluence', 'trello', 'asana', 'airtable',
      'monday', 'clickup', 'basecamp', 'obsidian', 'evernote', 'todoist',
      'coda', 'miro', 'lucidchart', 'zoom', 'loom', 'calendly'
    ],
  },
  {
    category: 'communication',
    weight: 0.86,
    keywords: [
      'slack', 'discord', 'telegram', 'signal', 'whatsapp', 'wechat', 'matrix',
      'element', 'teams', 'mattermost', 'zulip', 'twist'
    ],
  },
  {
    category: 'social',
    weight: 0.86,
    keywords: [
      'twitter', 'x', 'facebook', 'instagram', 'linkedin', 'reddit', 'tiktok',
      'youtube', 'twitch', 'mastodon', 'bluesky', 'threads', 'pinterest',
      'snapchat', 'tumblr', 'medium', 'substack'
    ],
  },
  {
    category: 'gaming',
    weight: 0.88,
    keywords: [
      'steam', 'epicgames', 'playstation', 'xbox', 'nintendo', 'unity', 'unrealengine',
      'godot', 'roblox', 'riotgames', 'blizzard', 'ea', 'ubisoft', 'valve'
    ],
  },
  {
    category: 'media',
    weight: 0.85,
    keywords: [
      'spotify', 'applemusic', 'soundcloud', 'netflix', 'hulu', 'disneyplus',
      'primevideo', 'vimeo', 'plex', 'deezer', 'tidal'
    ],
  },
];

/**
 * Assigns one or more standard categories to an identity with confidence and auditable evidence.
 */
export function assignCategories(input: IdentityCategoryInput): CategoryAssignment {
  const cleanId = (input.id || '').toLowerCase().trim();
  const cleanTitle = (input.title || '').toLowerCase().trim();
  const allAliases = (input.aliases || []).map(a => a.toLowerCase().trim());
  const evidenceList: string[] = [];

  // 1. Check Explicit Semantic Rules (Highest Confidence: 0.99)
  if (EXPLICIT_RULES[cleanId]) {
    const rule = EXPLICIT_RULES[cleanId];
    return {
      primaryCategory: rule.primary,
      categories: rule.categories,
      categorySource: 'curated',
      categoryConfidence: 0.99,
      categoryEvidence: [rule.evidence],
    };
  }

  for (const alias of allAliases) {
    if (EXPLICIT_RULES[alias]) {
      const rule = EXPLICIT_RULES[alias];
      return {
        primaryCategory: rule.primary,
        categories: rule.categories,
        categorySource: 'curated',
        categoryConfidence: 0.98,
        categoryEvidence: [`${rule.evidence} (matched alias: ${alias})`],
      };
    }
  }

  const candidates = new Map<StandardCategoryId, CategoryCandidate>();

  // 2. Curated Hint (Confidence: 0.95)
  if (input.curatedHint) {
    const hint = input.curatedHint.toLowerCase().trim() as StandardCategoryId;
    if (CATEGORY_IDS.includes(hint) && hint !== 'all' && hint !== 'uncategorized' && hint !== 'needs-review') {
      candidates.set(hint, {
        confidence: 0.95,
        source: 'curated',
        evidence: `Curated catalog hint: ${hint}`,
      });
      evidenceList.push(`Curated catalog hint: ${hint}`);
    }
  }

  // 3. Upstream Source Tags (Devicon / Simple Icons / Source metadata: 0.92 - 0.96)
  if (input.deviconTags && input.deviconTags.length > 0) {
    for (const rawTag of input.deviconTags) {
      const tag = rawTag.toLowerCase().trim();
      if (tag === 'framework' || tag === 'library') {
        candidates.set('technology', { confidence: 0.96, source: 'source', evidence: `Devicon tag: ${tag} -> technology` });
        candidates.set('developer-tools', { confidence: 0.90, source: 'source', evidence: `Devicon tag: ${tag} -> developer-tools` });
        evidenceList.push(`Devicon tag: ${tag}`);
      } else if (tag === 'language' || tag === 'programming-language') {
        candidates.set('technology', { confidence: 0.96, source: 'source', evidence: `Devicon tag: ${tag} -> technology` });
        candidates.set('developer-tools', { confidence: 0.92, source: 'source', evidence: `Devicon tag: ${tag} -> developer-tools` });
        evidenceList.push(`Devicon tag: ${tag}`);
      } else if (tag === 'database' || tag === 'db') {
        candidates.set('databases', { confidence: 0.96, source: 'source', evidence: `Devicon tag: ${tag} -> databases` });
        candidates.set('technology', { confidence: 0.85, source: 'source', evidence: `Devicon tag: ${tag} -> technology` });
        evidenceList.push(`Devicon tag: ${tag}`);
      } else if (tag === 'cloud') {
        candidates.set('cloud', { confidence: 0.96, source: 'source', evidence: `Devicon tag: ${tag} -> cloud` });
        candidates.set('infrastructure', { confidence: 0.88, source: 'source', evidence: `Devicon tag: ${tag} -> infrastructure` });
        evidenceList.push(`Devicon tag: ${tag}`);
      } else if (tag === 'devops' || tag === 'tool') {
        candidates.set('developer-tools', { confidence: 0.95, source: 'source', evidence: `Devicon tag: ${tag} -> developer-tools` });
        candidates.set('infrastructure', { confidence: 0.88, source: 'source', evidence: `Devicon tag: ${tag} -> infrastructure` });
        evidenceList.push(`Devicon tag: ${tag}`);
      } else if (tag === 'design') {
        candidates.set('design', { confidence: 0.95, source: 'source', evidence: `Devicon tag: ${tag} -> design` });
        evidenceList.push(`Devicon tag: ${tag}`);
      }
    }
  }

  // 4. Semantic Keyword Matching (Confidence: 0.85 - 0.92)
  for (const rule of SEMANTIC_PATTERNS) {
    const matchedKw = rule.keywords.find(kw => {
      if (cleanId === kw || allAliases.includes(kw)) return true;
      if (cleanId.includes(kw)) {
        return kw.length > 2 || cleanId === kw;
      }
      if (cleanTitle.includes(kw)) {
        return kw.length > 2;
      }
      return false;
    });

    if (matchedKw) {
      const existing = candidates.get(rule.category);
      const evidence = `Keyword match: "${matchedKw}" in identity/title -> ${rule.category}`;
      if (!existing || existing.confidence < rule.weight) {
        candidates.set(rule.category, {
          confidence: rule.weight,
          source: 'derived',
          evidence,
        });
        evidenceList.push(evidence);
      }
    }
  }

  // 5. Structural Affix Heuristics
  if (candidates.size === 0) {
    if (cleanId.endsWith('db') || cleanId.endsWith('sql')) {
      const ev = `Affix heuristic: ends with "db"/"sql" -> databases`;
      candidates.set('databases', { confidence: 0.75, source: 'derived', evidence: ev });
      evidenceList.push(ev);
    } else if (cleanId.endsWith('js') || cleanId.endsWith('ts') || cleanId.endsWith('py')) {
      const ev = `Affix heuristic: programming file extension -> technology`;
      candidates.set('technology', { confidence: 0.75, source: 'derived', evidence: ev });
      candidates.set('developer-tools', { confidence: 0.70, source: 'derived', evidence: ev });
      evidenceList.push(ev);
    } else if (cleanId.startsWith('apache') || cleanId.startsWith('gnu') || cleanId.startsWith('linux')) {
      const ev = `Prefix heuristic: open-source foundation -> infrastructure`;
      candidates.set('infrastructure', { confidence: 0.75, source: 'derived', evidence: ev });
      candidates.set('technology', { confidence: 0.70, source: 'derived', evidence: ev });
      evidenceList.push(ev);
    }
  }

  // 6. Fallback Handling
  if (candidates.size === 0) {
    const hasAlphaNumeric = /[a-z0-9]/.test(cleanId);
    if (hasAlphaNumeric && cleanId.length >= 3) {
      return {
        primaryCategory: 'needs-review',
        categories: ['needs-review'],
        categorySource: 'fallback',
        categoryConfidence: 0.40,
        categoryEvidence: ['Low confidence score (no known signals matched); flagged for review'],
      };
    } else {
      return {
        primaryCategory: 'uncategorized',
        categories: ['uncategorized'],
        categorySource: 'fallback',
        categoryConfidence: 0.10,
        categoryEvidence: ['Insufficient classification evidence (< 0.20 confidence)'],
      };
    }
  }

  // Sort candidates by confidence descending
  const sorted = Array.from(candidates.entries())
    .sort((a, b) => b[1].confidence - a[1].confidence);

  const topCategory = sorted[0][0];
  const topConfidence = sorted[0][1].confidence;
  const topSource = sorted[0][1].source;

  // Multi-category inclusion: include categories >= 0.65 confidence or within 0.15 of top
  const activeCategories = sorted
    .filter(([_, data]) => data.confidence >= 0.65 || (topConfidence - data.confidence <= 0.15))
    .map(([cat]) => cat);

  return {
    primaryCategory: topCategory,
    categories: activeCategories.length > 0 ? activeCategories : [topCategory],
    categorySource: topSource,
    categoryConfidence: Number(topConfidence.toFixed(2)),
    categoryEvidence: evidenceList.length > 0 ? evidenceList : [sorted[0][1].evidence],
  };
}
