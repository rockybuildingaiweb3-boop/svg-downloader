import { StandardCategoryId, CATEGORY_IDS, inferEntityType } from './taxonomy';
import { EntityType } from '../types';

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
  entityType?: EntityType;
}

interface CategoryCandidateAccumulator {
  confidences: number[];
  sources: Array<'source' | 'curated' | 'derived' | 'fallback'>;
  evidences: string[];
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

  const candidates = new Map<StandardCategoryId, CategoryCandidateAccumulator>();

  function addEvidence(
    category: StandardCategoryId,
    confidence: number,
    source: 'source' | 'curated' | 'derived' | 'fallback',
    evidence: string
  ) {
    let cand = candidates.get(category);
    if (!cand) {
      cand = { confidences: [], sources: [], evidences: [] };
      candidates.set(category, cand);
    }
    cand.confidences.push(confidence);
    if (!cand.sources.includes(source)) {
      cand.sources.push(source);
    }
    if (!cand.evidences.includes(evidence)) {
      cand.evidences.push(evidence);
    }
    if (!evidenceList.includes(evidence)) {
      evidenceList.push(evidence);
    }
  }

  // 2. Curated Hint (Confidence: 0.95)
  if (input.curatedHint) {
    const hint = input.curatedHint.toLowerCase().trim() as StandardCategoryId;
    if (CATEGORY_IDS.includes(hint) && hint !== 'all' && hint !== 'uncategorized' && hint !== 'needs-review') {
      addEvidence(hint, 0.95, 'curated', `Curated catalog hint: ${hint}`);
    }
  }

  // 3. Upstream Source Tags (Devicon / Simple Icons / Source metadata: 0.92 - 0.96)
  if (input.deviconTags && input.deviconTags.length > 0) {
    for (const rawTag of input.deviconTags) {
      const tag = rawTag.toLowerCase().trim();
      if (tag === 'framework' || tag === 'library') {
        addEvidence('technology', 0.96, 'source', `Devicon tag: ${tag} -> technology`);
        addEvidence('developer-tools', 0.90, 'source', `Devicon tag: ${tag} -> developer-tools`);
      } else if (tag === 'language' || tag === 'programming-language') {
        addEvidence('technology', 0.96, 'source', `Devicon tag: ${tag} -> technology`);
        addEvidence('developer-tools', 0.92, 'source', `Devicon tag: ${tag} -> developer-tools`);
      } else if (tag === 'database' || tag === 'db') {
        addEvidence('databases', 0.96, 'source', `Devicon tag: ${tag} -> databases`);
        addEvidence('technology', 0.85, 'source', `Devicon tag: ${tag} -> technology`);
      } else if (tag === 'cloud') {
        addEvidence('cloud', 0.96, 'source', `Devicon tag: ${tag} -> cloud`);
        addEvidence('infrastructure', 0.88, 'source', `Devicon tag: ${tag} -> infrastructure`);
      } else if (tag === 'devops' || tag === 'tool') {
        addEvidence('developer-tools', 0.95, 'source', `Devicon tag: ${tag} -> developer-tools`);
        addEvidence('infrastructure', 0.88, 'source', `Devicon tag: ${tag} -> infrastructure`);
      } else if (tag === 'design') {
        addEvidence('design', 0.95, 'source', `Devicon tag: ${tag} -> design`);
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
      const evidence = `Keyword match: "${matchedKw}" in identity/title -> ${rule.category}`;
      addEvidence(rule.category, rule.weight, 'derived', evidence);
    }
  }

  // 5. Structural Affix Heuristics
  if (candidates.size === 0) {
    if (cleanId.endsWith('db') || cleanId.endsWith('sql')) {
      addEvidence('databases', 0.75, 'derived', `Affix heuristic: ends with "db"/"sql" -> databases`);
    } else if (cleanId.endsWith('js') || cleanId.endsWith('ts') || cleanId.endsWith('py')) {
      addEvidence('technology', 0.75, 'derived', `Affix heuristic: programming file extension -> technology`);
      addEvidence('developer-tools', 0.70, 'derived', `Affix heuristic: programming file extension -> developer-tools`);
    } else if (cleanId.startsWith('apache') || cleanId.startsWith('gnu') || cleanId.startsWith('linux')) {
      addEvidence('infrastructure', 0.75, 'derived', `Prefix heuristic: open-source foundation -> infrastructure`);
      addEvidence('technology', 0.70, 'derived', `Prefix heuristic: open-source foundation -> technology`);
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
        entityType: inferEntityType({ id: cleanId, primaryCategory: 'needs-review', deviconTags: input.deviconTags }),
      };
    } else {
      return {
        primaryCategory: 'uncategorized',
        categories: ['uncategorized'],
        categorySource: 'fallback',
        categoryConfidence: 0.10,
        categoryEvidence: ['Insufficient classification evidence (< 0.20 confidence)'],
        entityType: inferEntityType({ id: cleanId, primaryCategory: 'uncategorized', deviconTags: input.deviconTags }),
      };
    }
  }

  // Calculate accumulated confidence and determine highest source priority for each category
  const SOURCE_PRIORITY: Record<string, number> = { curated: 4, source: 3, derived: 2, fallback: 1 };
  const evaluatedCategories: Array<{
    category: StandardCategoryId;
    confidence: number;
    source: 'source' | 'curated' | 'derived' | 'fallback';
    evidences: string[];
  }> = [];

  for (const [cat, data] of candidates.entries()) {
    const maxConf = Math.max(...data.confidences);
    const boost = data.confidences.length > 1 ? Math.min(0.04, (data.confidences.length - 1) * 0.02) : 0;
    const finalConfidence = Math.min(0.99, maxConf + boost);
    const sortedSources = [...data.sources].sort((a, b) => (SOURCE_PRIORITY[b] || 0) - (SOURCE_PRIORITY[a] || 0));
    const primarySource = sortedSources[0] || 'derived';

    evaluatedCategories.push({
      category: cat,
      confidence: finalConfidence,
      source: primarySource,
      evidences: data.evidences,
    });
  }

  // Sort candidates by confidence descending
  evaluatedCategories.sort((a, b) => b.confidence - a.confidence);

  const top = evaluatedCategories[0];
  const topCategory = top.category;
  const topConfidence = top.confidence;
  const topSource = top.source;

  // Multi-category inclusion: include categories >= 0.65 confidence or within 0.15 of top
  const activeCategories = evaluatedCategories
    .filter(item => item.confidence >= 0.65 || (topConfidence - item.confidence <= 0.15))
    .map(item => item.category);

  const activeEvidences = Array.from(new Set([
    ...top.evidences,
    ...evaluatedCategories.filter(item => activeCategories.includes(item.category)).flatMap(item => item.evidences)
  ]));

  return {
    primaryCategory: topCategory,
    categories: activeCategories.length > 0 ? activeCategories : [topCategory],
    categorySource: topSource,
    categoryConfidence: Number(topConfidence.toFixed(2)),
    categoryEvidence: activeEvidences.length > 0 ? activeEvidences : evidenceList,
    entityType: inferEntityType({ id: cleanId, primaryCategory: topCategory, deviconTags: input.deviconTags }),
  };
}
