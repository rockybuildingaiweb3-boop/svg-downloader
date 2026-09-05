/**
 * Canonical SVG Icon Registry (Auto-generated)
 * Total icons: 91
 */

export type IconName =
  | 'adobe'
  | 'amazon'
  | 'amazonwebservices'
  | 'amd'
  | 'angular'
  | 'anthropic'
  | 'apache'
  | 'apple'
  | 'astro'
  | 'bilibili'
  | 'bootstrap'
  | 'canva'
  | 'cloudflare'
  | 'cplusplus'
  | 'csharp'
  | 'css3'
  | 'dart'
  | 'deepseek'
  | 'discord'
  | 'docker'
  | 'figma'
  | 'firebase'
  | 'flutter'
  | 'git'
  | 'github'
  | 'gitlab'
  | 'go'
  | 'google'
  | 'googlecloud'
  | 'html5'
  | 'huggingface'
  | 'ibm'
  | 'instagram'
  | 'intel'
  | 'java'
  | 'javascript'
  | 'jira'
  | 'kotlin'
  | 'kubernetes'
  | 'linear'
  | 'linkedin'
  | 'linux'
  | 'meta'
  | 'microsoft'
  | 'microsoftazure'
  | 'mistralai'
  | 'mongodb'
  | 'mysql'
  | 'netflix'
  | 'nextdotjs'
  | 'nginx'
  | 'nodedotjs'
  | 'notion'
  | 'nuxt'
  | 'nvidia'
  | 'openai'
  | 'oracle'
  | 'php'
  | 'postgresql'
  | 'postman'
  | 'python'
  | 'react'
  | 'redis'
  | 'remix'
  | 'ruby'
  | 'rust'
  | 'salesforce'
  | 'samsung'
  | 'sass'
  | 'slack'
  | 'sony'
  | 'spotify'
  | 'sqlite'
  | 'supabase'
  | 'svelte'
  | 'swift'
  | 'tailwindcss'
  | 'telegram'
  | 'tesla'
  | 'tiktok'
  | 'trello'
  | 'typescript'
  | 'ubuntu'
  | 'vercel'
  | 'visualstudiocode'
  | 'vite'
  | 'vuedotjs'
  | 'webpack'
  | 'wechat'
  | 'x'
  | 'youtube';

export interface AlternativeSource {
  source: string;
  sourceId: string;
  sourceVersion: string;
  variants?: string[];
}

export interface IconRecord {
  id: IconName;
  title: string;
  canonicalName: string;
  source: 'simple-icons' | 'devicon' | 'official' | 'wikimedia';
  sourceId: string;
  sourceVersion: string;
  variant: string;
  variants?: Record<string, string>;
  file: string;
  rawSha256: string;
  derivedSha256?: string;
  license?: string;
  sourceUrl?: string;
  brandColor?: string;
  category?: string;
  verified: boolean;
  alternativeSources?: AlternativeSource[];
}

export const ICON_NAMES: IconName[] = [
  "adobe",
  "amazon",
  "amazonwebservices",
  "amd",
  "angular",
  "anthropic",
  "apache",
  "apple",
  "astro",
  "bilibili",
  "bootstrap",
  "canva",
  "cloudflare",
  "cplusplus",
  "csharp",
  "css3",
  "dart",
  "deepseek",
  "discord",
  "docker",
  "figma",
  "firebase",
  "flutter",
  "git",
  "github",
  "gitlab",
  "go",
  "google",
  "googlecloud",
  "html5",
  "huggingface",
  "ibm",
  "instagram",
  "intel",
  "java",
  "javascript",
  "jira",
  "kotlin",
  "kubernetes",
  "linear",
  "linkedin",
  "linux",
  "meta",
  "microsoft",
  "microsoftazure",
  "mistralai",
  "mongodb",
  "mysql",
  "netflix",
  "nextdotjs",
  "nginx",
  "nodedotjs",
  "notion",
  "nuxt",
  "nvidia",
  "openai",
  "oracle",
  "php",
  "postgresql",
  "postman",
  "python",
  "react",
  "redis",
  "remix",
  "ruby",
  "rust",
  "salesforce",
  "samsung",
  "sass",
  "slack",
  "sony",
  "spotify",
  "sqlite",
  "supabase",
  "svelte",
  "swift",
  "tailwindcss",
  "telegram",
  "tesla",
  "tiktok",
  "trello",
  "typescript",
  "ubuntu",
  "vercel",
  "visualstudiocode",
  "vite",
  "vuedotjs",
  "webpack",
  "wechat",
  "x",
  "youtube"
];

export const ICONS: Record<IconName, IconRecord> = {
  "adobe": {
    "id": "adobe",
    "title": "Adobe",
    "canonicalName": "adobe",
    "source": "wikimedia",
    "sourceId": "Adobe_Corporate_Logo.svg",
    "sourceVersion": "official",
    "variant": "official",
    "variants": {
      "official": "adobe.svg"
    },
    "file": "adobe.svg",
    "rawSha256": "0cdb65cc22e0ed0ab3c5d6599c75ca1b7c5ba99f9c8e6748b6b5c5aeecc8b3e9",
    "license": "Public Domain / Trademark of Adobe Inc.",
    "sourceUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
    "brandColor": "#FF0000",
    "category": "bigtech",
    "verified": true
  },
  "amazon": {
    "id": "amazon",
    "title": "Amazon",
    "canonicalName": "amazon",
    "source": "wikimedia",
    "sourceId": "Amazon_logo.svg",
    "sourceVersion": "official",
    "variant": "official",
    "variants": {
      "official": "amazon.svg"
    },
    "file": "amazon.svg",
    "rawSha256": "f08742f2f49aa82c917be2e98a67d54dd4054386964248b93b45c58c25595117",
    "license": "Public Domain / Trademark of Amazon.com, Inc.",
    "sourceUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "brandColor": "#FF9900",
    "category": "bigtech",
    "verified": true
  },
  "amazonwebservices": {
    "id": "amazonwebservices",
    "title": "Amazonwebservices",
    "canonicalName": "amazonwebservices",
    "source": "devicon",
    "sourceId": "amazonwebservices",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original-wordmark": "amazonwebservices-original-wordmark.svg",
      "plain-wordmark": "amazonwebservices-plain-wordmark.svg",
      "line-wordmark": "amazonwebservices-line-wordmark.svg",
      "original": "amazonwebservices-original.svg",
      "plain": "amazonwebservices-plain.svg",
      "line": "amazonwebservices-line.svg"
    },
    "file": "amazonwebservices.svg",
    "rawSha256": "5b4d8371d79a5c0d3a27ea4e929f772e68d47f7d267496bf9211d5f60fcf8084",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#f90",
    "category": "cloud",
    "verified": true
  },
  "amd": {
    "id": "amd",
    "title": "AMD",
    "canonicalName": "amd",
    "source": "simple-icons",
    "sourceId": "amd",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "amd.svg"
    },
    "file": "amd.svg",
    "rawSha256": "c4c2f985dc1427aa7a54e3f80ef5ca35dba911bbed184a0dc6def148c1dfa420",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.amd.com",
    "brandColor": "#ED1C24",
    "category": "bigtech",
    "verified": true
  },
  "angular": {
    "id": "angular",
    "title": "Angular",
    "canonicalName": "angular",
    "source": "simple-icons",
    "sourceId": "angular",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "angular.svg"
    },
    "file": "angular.svg",
    "rawSha256": "385c7d047cc4d48d8359003b57ce4df7d1271b6d9e7840c128628ac582c90456",
    "license": "CC-BY-4.0: ",
    "sourceUrl": "https://angular.dev/press-kit",
    "brandColor": "#0F0F11",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "angular",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "anthropic": {
    "id": "anthropic",
    "title": "Anthropic",
    "canonicalName": "anthropic",
    "source": "simple-icons",
    "sourceId": "anthropic",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "anthropic.svg"
    },
    "file": "anthropic.svg",
    "rawSha256": "1cc599f6ebce2016dc388cf84e54a52c6b13487655c7e243554d654c7bce1882",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.anthropic.com",
    "brandColor": "#191919",
    "category": "ai",
    "verified": true
  },
  "apache": {
    "id": "apache",
    "title": "Apache",
    "canonicalName": "apache",
    "source": "simple-icons",
    "sourceId": "apache",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "apache.svg"
    },
    "file": "apache.svg",
    "rawSha256": "b6f98b799dbc23a0b3e3cf60a9508bcf11c58cbb8830762e942ff995adce93fc",
    "license": "Apache-2.0: ",
    "sourceUrl": "https://www.apache.org/foundation/press/kit",
    "brandColor": "#D22128",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "apache",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark",
          "line",
          "line-wordmark"
        ]
      }
    ]
  },
  "apple": {
    "id": "apple",
    "title": "Apple",
    "canonicalName": "apple",
    "source": "simple-icons",
    "sourceId": "apple",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "apple.svg"
    },
    "file": "apple.svg",
    "rawSha256": "2a1509dccd25e6d2bc7a11a8e52941077e1a48555e192ce638699b9f083c2a7c",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.apple.com",
    "brandColor": "#000000",
    "category": "bigtech",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "apple",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "astro": {
    "id": "astro",
    "title": "Astro",
    "canonicalName": "astro",
    "source": "simple-icons",
    "sourceId": "astro",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "astro.svg"
    },
    "file": "astro.svg",
    "rawSha256": "fe8e943b26bf966824341377875056270af186e500bdf4732c803b51c0b4f674",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://astro.build/press",
    "brandColor": "#BC52EE",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "astro",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "bilibili": {
    "id": "bilibili",
    "title": "Bilibili",
    "canonicalName": "bilibili",
    "source": "simple-icons",
    "sourceId": "bilibili",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "bilibili.svg"
    },
    "file": "bilibili.svg",
    "rawSha256": "0b31005ccf765a9d37be2c42f1d36e44572ccadb088250626d9905ae5d4f3d21",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.bilibili.com",
    "brandColor": "#00A1D6",
    "category": "social",
    "verified": true
  },
  "bootstrap": {
    "id": "bootstrap",
    "title": "Bootstrap",
    "canonicalName": "bootstrap",
    "source": "simple-icons",
    "sourceId": "bootstrap",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "bootstrap.svg"
    },
    "file": "bootstrap.svg",
    "rawSha256": "6a86e8f3f371e6d24b52e5280b164198fb3e56f6b5a28ddb7780dc1eaa812d07",
    "license": "MIT: ",
    "sourceUrl": "https://getbootstrap.com/docs/5.3/about/brand",
    "brandColor": "#7952B3",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "bootstrap",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "canva": {
    "id": "canva",
    "title": "Canva",
    "canonicalName": "canva",
    "source": "devicon",
    "sourceId": "canva",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "canva-original.svg",
      "plain": "canva-plain.svg"
    },
    "file": "canva.svg",
    "rawSha256": "4f5d2a561b4f8171d417a9c512e5679a405105a2f2590555b2e4ff4f6871a8fc",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#00C4CC",
    "category": "tools",
    "verified": true
  },
  "cloudflare": {
    "id": "cloudflare",
    "title": "Cloudflare",
    "canonicalName": "cloudflare",
    "source": "simple-icons",
    "sourceId": "cloudflare",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "cloudflare.svg"
    },
    "file": "cloudflare.svg",
    "rawSha256": "408096d99907fd99e0863cb5d73f77a72537c6a85fd8d5e2704178a83a891f08",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.cloudflare.com/logo/",
    "brandColor": "#F38020",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "cloudflare",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "cplusplus": {
    "id": "cplusplus",
    "title": "C++",
    "canonicalName": "cplusplus",
    "source": "simple-icons",
    "sourceId": "cplusplus",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "cplusplus.svg"
    },
    "file": "cplusplus.svg",
    "rawSha256": "adf33f5026f3f70d54f1068cb5d1a790c37b2105cbe728edd170251759d13f18",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/isocpp/logos/tree/64ef037049f87ac74875dbe72695e59118b52186",
    "brandColor": "#00599C",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "cplusplus",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain",
          "line",
          "plain-wordmark",
          "line-wordmark"
        ]
      }
    ]
  },
  "csharp": {
    "id": "csharp",
    "title": "Csharp",
    "canonicalName": "csharp",
    "source": "devicon",
    "sourceId": "csharp",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "csharp-original.svg",
      "plain": "csharp-plain.svg",
      "line": "csharp-line.svg",
      "plain-wordmark": "csharp-plain-wordmark.svg",
      "line-wordmark": "csharp-line-wordmark.svg"
    },
    "file": "csharp.svg",
    "rawSha256": "7093478d0888e22a224b6fa832da6c9ffd14c433de8bd14aab0c1cb50925f3ee",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#68217a",
    "category": "languages",
    "verified": true
  },
  "css3": {
    "id": "css3",
    "title": "Css3",
    "canonicalName": "css3",
    "source": "devicon",
    "sourceId": "css3",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "css3-original.svg",
      "original-wordmark": "css3-original-wordmark.svg",
      "plain": "css3-plain.svg",
      "plain-wordmark": "css3-plain-wordmark.svg"
    },
    "file": "css3.svg",
    "rawSha256": "36b7d94b657d571d3f94042acbf6a4c86a5301a222f83f4b4583ad2acf6e297d",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#3d8fc6",
    "category": "frontend",
    "verified": true
  },
  "dart": {
    "id": "dart",
    "title": "Dart",
    "canonicalName": "dart",
    "source": "simple-icons",
    "sourceId": "dart",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "dart.svg"
    },
    "file": "dart.svg",
    "rawSha256": "e02868488ff4ac8e8b22440c6b021e6539f9df21271e0ffb8a7bf92ada0126bb",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/dart-lang/site-shared/tree/18458ff440afd3d06f04e5cb871c4c5eda29c9d5/src/_assets/image/dart/logo",
    "brandColor": "#0175C2",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "dart",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "deepseek": {
    "id": "deepseek",
    "title": "DeepSeek",
    "canonicalName": "deepseek",
    "source": "simple-icons",
    "sourceId": "deepseek",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "deepseek.svg"
    },
    "file": "deepseek.svg",
    "rawSha256": "7a55a0a7391d116eba7d32807d6838478f9209f6034612941e74fbb14934e2ef",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.deepseek.com",
    "brandColor": "#5786FE",
    "category": "ai",
    "verified": true
  },
  "discord": {
    "id": "discord",
    "title": "Discord",
    "canonicalName": "discord",
    "source": "simple-icons",
    "sourceId": "discord",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "discord.svg"
    },
    "file": "discord.svg",
    "rawSha256": "1d364b72c9eaf1fe37d17ca88cd8fb541308dc0f3b09e2ab3b824f380b3493d5",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://discord.com/branding",
    "brandColor": "#5865F2",
    "category": "social",
    "verified": true
  },
  "docker": {
    "id": "docker",
    "title": "Docker",
    "canonicalName": "docker",
    "source": "simple-icons",
    "sourceId": "docker",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "docker.svg"
    },
    "file": "docker.svg",
    "rawSha256": "65571291c261ef869c31540a38f3ca0f0ee3bb73f179c172211c8860f19a6359",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.docker.com/company/newsroom/media-resources",
    "brandColor": "#2496ED",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "docker",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "figma": {
    "id": "figma",
    "title": "Figma",
    "canonicalName": "figma",
    "source": "simple-icons",
    "sourceId": "figma",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "figma.svg"
    },
    "file": "figma.svg",
    "rawSha256": "2f86fca501dfed321a62f28743f29d9dd738dac91668eac5260ab746d1ef8840",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.figma.com/using-the-figma-brand/",
    "brandColor": "#F24E1E",
    "category": "tools",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "figma",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "firebase": {
    "id": "firebase",
    "title": "Firebase",
    "canonicalName": "firebase",
    "source": "simple-icons",
    "sourceId": "firebase",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "firebase.svg"
    },
    "file": "firebase.svg",
    "rawSha256": "3f46d84a41479d7789cc36b82c2b6852e6bbbfd30ebee5b7a3aef7d49758295a",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://firebase.google.com/brand-guidelines",
    "brandColor": "#DD2C00",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "firebase",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark",
          "line",
          "line-wordmark"
        ]
      }
    ]
  },
  "flutter": {
    "id": "flutter",
    "title": "Flutter",
    "canonicalName": "flutter",
    "source": "simple-icons",
    "sourceId": "flutter",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "flutter.svg"
    },
    "file": "flutter.svg",
    "rawSha256": "3f268e6fd52e538478ec299cef53cfd85a1c3454b5eb4c7997dd2e21e6b7d741",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://flutter.dev/brand",
    "brandColor": "#02569B",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "flutter",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "git": {
    "id": "git",
    "title": "Git",
    "canonicalName": "git",
    "source": "simple-icons",
    "sourceId": "git",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "git.svg"
    },
    "file": "git.svg",
    "rawSha256": "95724d436215d483de82288610c3c144854138f49945424697fcdf8be66e17d6",
    "license": "CC-BY-3.0: ",
    "sourceUrl": "https://git-scm.com/community/logos",
    "brandColor": "#F03C2E",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "git",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "github": {
    "id": "github",
    "title": "GitHub",
    "canonicalName": "github",
    "source": "simple-icons",
    "sourceId": "github",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "github.svg"
    },
    "file": "github.svg",
    "rawSha256": "3bf8cceead820aec50d4ee825a3fd02c5a1cd6665cc9cf4cbf3d9c8861a204bb",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/logos",
    "brandColor": "#181717",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "github",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain"
        ]
      }
    ]
  },
  "gitlab": {
    "id": "gitlab",
    "title": "GitLab",
    "canonicalName": "gitlab",
    "source": "simple-icons",
    "sourceId": "gitlab",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "gitlab.svg"
    },
    "file": "gitlab.svg",
    "rawSha256": "c7c39058bd1b6f9f40334383bd5136bb8c5ba5e6a24200f2d1f18365e2526e28",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://about.gitlab.com/press/press-kit/",
    "brandColor": "#FC6D26",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "gitlab",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "go": {
    "id": "go",
    "title": "Go",
    "canonicalName": "go",
    "source": "simple-icons",
    "sourceId": "go",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "go.svg"
    },
    "file": "go.svg",
    "rawSha256": "36a745fe15584bf138d02ae6abcbdd155bc1cd4f4976634ad34861b2059db559",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://blog.golang.org/go-brand",
    "brandColor": "#00ADD8",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "go",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "line",
          "plain-wordmark"
        ]
      }
    ]
  },
  "google": {
    "id": "google",
    "title": "Google",
    "canonicalName": "google",
    "source": "simple-icons",
    "sourceId": "google",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "google.svg"
    },
    "file": "google.svg",
    "rawSha256": "d8cf9fb2d5e234e03254f1d6400d8cc8160c309b010d031a64f37084b5a21d01",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://partnermarketinghub.withgoogle.com",
    "brandColor": "#4285F4",
    "category": "bigtech",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "google",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "googlecloud": {
    "id": "googlecloud",
    "title": "Google Cloud",
    "canonicalName": "googlecloud",
    "source": "simple-icons",
    "sourceId": "googlecloud",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "googlecloud.svg"
    },
    "file": "googlecloud.svg",
    "rawSha256": "534a0359c2784e152f5c88ce64a56976036d7336c7831775c995977fd3432713",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://cloud.google.com",
    "brandColor": "#4285F4",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "googlecloud",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "html5": {
    "id": "html5",
    "title": "HTML5",
    "canonicalName": "html5",
    "source": "simple-icons",
    "sourceId": "html5",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "html5.svg"
    },
    "file": "html5.svg",
    "rawSha256": "dfd65fdd7e4f997c6b163e48793de5ad18c4c99e191807a61752ea702f123d1d",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.w3.org/html/logo/",
    "brandColor": "#E34F26",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "html5",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "huggingface": {
    "id": "huggingface",
    "title": "Hugging Face",
    "canonicalName": "huggingface",
    "source": "simple-icons",
    "sourceId": "huggingface",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "huggingface.svg"
    },
    "file": "huggingface.svg",
    "rawSha256": "aa81744034eecf4ac6b3fb7108dd71223965c7af3c534932391314563b150109",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://huggingface.co/brand",
    "brandColor": "#FFD21E",
    "category": "ai",
    "verified": true
  },
  "ibm": {
    "id": "ibm",
    "title": "IBM",
    "canonicalName": "ibm",
    "source": "wikimedia",
    "sourceId": "IBM_logo.svg",
    "sourceVersion": "official",
    "variant": "official",
    "variants": {
      "official": "ibm.svg"
    },
    "file": "ibm.svg",
    "rawSha256": "fa0533173efb901776eaaf288a55547457482336809552bb965bcbc44cecd51b",
    "license": "Public Domain / Trademark of IBM Corp.",
    "sourceUrl": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    "brandColor": "#052FAD",
    "category": "bigtech",
    "verified": true
  },
  "instagram": {
    "id": "instagram",
    "title": "Instagram",
    "canonicalName": "instagram",
    "source": "simple-icons",
    "sourceId": "instagram",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "instagram.svg"
    },
    "file": "instagram.svg",
    "rawSha256": "f53af2d1fc5292ba1433b5c1faf50005ce6a997fa302d1816989929f379a59dc",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://about.meta.com/brand/resources/instagram",
    "brandColor": "#FF0069",
    "category": "social",
    "verified": true
  },
  "intel": {
    "id": "intel",
    "title": "Intel",
    "canonicalName": "intel",
    "source": "simple-icons",
    "sourceId": "intel",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "intel.svg"
    },
    "file": "intel.svg",
    "rawSha256": "25d0d4387af0999eb5dc79b165ecfd7b972ff43047406da533f3207ac92c0a57",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.intel.com/content/www/us/en/newsroom/resources/press-kits-intel-overview.html",
    "brandColor": "#0071C5",
    "category": "bigtech",
    "verified": true
  },
  "java": {
    "id": "java",
    "title": "Java",
    "canonicalName": "java",
    "source": "devicon",
    "sourceId": "java",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "java-original.svg",
      "original-wordmark": "java-original-wordmark.svg",
      "plain": "java-plain.svg",
      "plain-wordmark": "java-plain-wordmark.svg"
    },
    "file": "java.svg",
    "rawSha256": "7582e518a9c02425f97155e5a3bd39d1a3a7d421b78caf9c8df7443dad3edc5d",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#EA2D2E",
    "category": "languages",
    "verified": true
  },
  "javascript": {
    "id": "javascript",
    "title": "JavaScript",
    "canonicalName": "javascript",
    "source": "simple-icons",
    "sourceId": "javascript",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "javascript.svg"
    },
    "file": "javascript.svg",
    "rawSha256": "c9be35a7a861ebe80ae4ee706d05004b99ee59fc63db69da6dcc10776718434b",
    "license": "MIT: ",
    "sourceUrl": "https://github.com/voodootikigod/logo.js/blob/1544bdeed6d618a6cfe4f0650d04ab8d9cfa76d9/js.svg",
    "brandColor": "#F7DF1E",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "javascript",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "jira": {
    "id": "jira",
    "title": "Jira",
    "canonicalName": "jira",
    "source": "simple-icons",
    "sourceId": "jira",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "jira.svg"
    },
    "file": "jira.svg",
    "rawSha256": "68f8703698538ee7863bf69b72bf9f0d78a72d218e7eb7e0617237ae43ae5ade",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://atlassian.design/resources/logo-library",
    "brandColor": "#0052CC",
    "category": "tools",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "jira",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "kotlin": {
    "id": "kotlin",
    "title": "Kotlin",
    "canonicalName": "kotlin",
    "source": "simple-icons",
    "sourceId": "kotlin",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "kotlin.svg"
    },
    "file": "kotlin.svg",
    "rawSha256": "909d1ba63b4bea5843be4579fa68a398c310c3d4748e8e6ba9ea295403984b3b",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.jetbrains.com/company/brand/logos/",
    "brandColor": "#7F52FF",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "kotlin",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "kubernetes": {
    "id": "kubernetes",
    "title": "Kubernetes",
    "canonicalName": "kubernetes",
    "source": "simple-icons",
    "sourceId": "kubernetes",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "kubernetes.svg"
    },
    "file": "kubernetes.svg",
    "rawSha256": "ceee2f4e87fa1533600672190c156194039f744fa9b5da10e83f002178e84b47",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/kubernetes/kubernetes/tree/cac53883f4714452f3084a22e4be20d042a9df33/logo",
    "brandColor": "#326CE5",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "kubernetes",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark",
          "line",
          "line-wordmark"
        ]
      }
    ]
  },
  "linear": {
    "id": "linear",
    "title": "Linear",
    "canonicalName": "linear",
    "source": "simple-icons",
    "sourceId": "linear",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "linear.svg"
    },
    "file": "linear.svg",
    "rawSha256": "90b91b61090f4f9c94f9cb24769642278f03e8eedcfe5680738cf3a186bfc00f",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://linear.app",
    "brandColor": "#5E6AD2",
    "category": "tools",
    "verified": true
  },
  "linkedin": {
    "id": "linkedin",
    "title": "Linkedin",
    "canonicalName": "linkedin",
    "source": "devicon",
    "sourceId": "linkedin",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "linkedin-original.svg",
      "original-wordmark": "linkedin-original-wordmark.svg",
      "plain": "linkedin-plain.svg",
      "plain-wordmark": "linkedin-plain-wordmark.svg"
    },
    "file": "linkedin.svg",
    "rawSha256": "71d3e25ef4e06ac34f385476cff2cef2757179af665cda086711d211d85610c0",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#0076b2",
    "category": "social",
    "verified": true
  },
  "linux": {
    "id": "linux",
    "title": "Linux",
    "canonicalName": "linux",
    "source": "simple-icons",
    "sourceId": "linux",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "linux.svg"
    },
    "file": "linux.svg",
    "rawSha256": "7e55f2779ae11a83c9dad2d0414a65d8ca7867d0716ce58bfe41ed299ae1447f",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.linuxfoundation.org/the-linux-mark/",
    "brandColor": "#FCC624",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "linux",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "meta": {
    "id": "meta",
    "title": "Meta",
    "canonicalName": "meta",
    "source": "simple-icons",
    "sourceId": "meta",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "meta.svg"
    },
    "file": "meta.svg",
    "rawSha256": "e3e9db62f59dc477e5917687349b8aa9685b841d40300c1afad60ad85075cd2e",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.meta.com",
    "brandColor": "#0467DF",
    "category": "bigtech",
    "verified": true
  },
  "microsoft": {
    "id": "microsoft",
    "title": "Microsoft",
    "canonicalName": "microsoft",
    "source": "wikimedia",
    "sourceId": "Microsoft_logo.svg",
    "sourceVersion": "official",
    "variant": "official",
    "variants": {
      "official": "microsoft.svg"
    },
    "file": "microsoft.svg",
    "rawSha256": "3d41251f93127b4b42c2f69fa423d204946cf9c307d786ea36b8d9bef4179282",
    "license": "Public Domain / Trademark of Microsoft Corp.",
    "sourceUrl": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "brandColor": "#00A4EF",
    "category": "bigtech",
    "verified": true
  },
  "microsoftazure": {
    "id": "microsoftazure",
    "title": "Azure",
    "canonicalName": "microsoftazure",
    "source": "devicon",
    "sourceId": "azure",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "microsoftazure-original.svg",
      "original-wordmark": "microsoftazure-original-wordmark.svg",
      "plain": "microsoftazure-plain.svg",
      "plain-wordmark": "microsoftazure-plain-wordmark.svg"
    },
    "file": "microsoftazure.svg",
    "rawSha256": "fa2a85e26005c923bc7715b12d1bb5525faf53cca9f1055a20980bae570beed2",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#0089D6",
    "category": "cloud",
    "verified": true
  },
  "mistralai": {
    "id": "mistralai",
    "title": "Mistral AI",
    "canonicalName": "mistralai",
    "source": "simple-icons",
    "sourceId": "mistralai",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "mistralai.svg"
    },
    "file": "mistralai.svg",
    "rawSha256": "88f00cf2e82e4d36bb4fdd0e913df200c6e7d6162ec627cc58cfdd6a4eb17d18",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://chat.mistral.ai",
    "brandColor": "#FA520F",
    "category": "ai",
    "verified": true
  },
  "mongodb": {
    "id": "mongodb",
    "title": "MongoDB",
    "canonicalName": "mongodb",
    "source": "simple-icons",
    "sourceId": "mongodb",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "mongodb.svg"
    },
    "file": "mongodb.svg",
    "rawSha256": "6698757ee85997e8167b2eacaff8395d6987954185488f2e90b88ef387fec6c7",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.mongodb.com/pressroom",
    "brandColor": "#47A248",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "mongodb",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "mysql": {
    "id": "mysql",
    "title": "MySQL",
    "canonicalName": "mysql",
    "source": "simple-icons",
    "sourceId": "mysql",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "mysql.svg"
    },
    "file": "mysql.svg",
    "rawSha256": "67c144cc3e44ad14062a3f20ebe29c5e7eeb2c2c9c0f43cf48d87fe6291a8b2d",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.mysql.com/about/legal/logos.html",
    "brandColor": "#4479A1",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "mysql",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain-wordmark",
          "plain"
        ]
      }
    ]
  },
  "netflix": {
    "id": "netflix",
    "title": "Netflix",
    "canonicalName": "netflix",
    "source": "simple-icons",
    "sourceId": "netflix",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "netflix.svg"
    },
    "file": "netflix.svg",
    "rawSha256": "67dbc495988bd5667a09ed4f56e14db4070a44c7a74e297b146c229f70fd6f6e",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://brand.netflix.com/en/assets/logos",
    "brandColor": "#E50914",
    "category": "bigtech",
    "verified": true
  },
  "nextdotjs": {
    "id": "nextdotjs",
    "title": "Next.js",
    "canonicalName": "nextdotjs",
    "source": "simple-icons",
    "sourceId": "nextdotjs",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "nextdotjs.svg"
    },
    "file": "nextdotjs.svg",
    "rawSha256": "593e14da3ddb65be4c8fa6a178f2f48a01a8bd39ea384f679cd7182b520da502",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://vercel.com/design/brands#next-js",
    "brandColor": "#000000",
    "category": "frontend",
    "verified": true
  },
  "nginx": {
    "id": "nginx",
    "title": "NGINX",
    "canonicalName": "nginx",
    "source": "simple-icons",
    "sourceId": "nginx",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "nginx.svg"
    },
    "file": "nginx.svg",
    "rawSha256": "236d53b2b746706df75e2a01668cb84e6f3fc7c8923a9ce824f8534db007a438",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.nginx.com/press/",
    "brandColor": "#009639",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "nginx",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "nodedotjs": {
    "id": "nodedotjs",
    "title": "Node.js",
    "canonicalName": "nodedotjs",
    "source": "simple-icons",
    "sourceId": "nodedotjs",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "nodedotjs.svg"
    },
    "file": "nodedotjs.svg",
    "rawSha256": "021851b758cde7d3e04819c3ac02047d0ff281c712e8387afa0c76a6dac6db6c",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://nodejs.org/en/about/branding",
    "brandColor": "#5FA04E",
    "category": "languages",
    "verified": true
  },
  "notion": {
    "id": "notion",
    "title": "Notion",
    "canonicalName": "notion",
    "source": "simple-icons",
    "sourceId": "notion",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "notion.svg"
    },
    "file": "notion.svg",
    "rawSha256": "b17d2a2b592a06252efef522d5205f0c7a958f748d40df1011ed081417e42f85",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.notion.so",
    "brandColor": "#000000",
    "category": "tools",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "notion",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain",
          "line"
        ]
      }
    ]
  },
  "nuxt": {
    "id": "nuxt",
    "title": "Nuxt",
    "canonicalName": "nuxt",
    "source": "simple-icons",
    "sourceId": "nuxt",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "nuxt.svg"
    },
    "file": "nuxt.svg",
    "rawSha256": "7058584a5afd4eb2a71938f0401d02ab0f4b993919471c4f2ce588a9cc854e50",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://nuxt.com/design-kit",
    "brandColor": "#00DC82",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "nuxt",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain-wordmark",
          "plain"
        ]
      }
    ]
  },
  "nvidia": {
    "id": "nvidia",
    "title": "NVIDIA",
    "canonicalName": "nvidia",
    "source": "simple-icons",
    "sourceId": "nvidia",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "nvidia.svg"
    },
    "file": "nvidia.svg",
    "rawSha256": "b0e4cfc12712c840d4d630c9a717200fbd09aeeadbd3faeac13bda2e2ed050b0",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.nvidia.com/en-us",
    "brandColor": "#76B900",
    "category": "bigtech",
    "verified": true
  },
  "openai": {
    "id": "openai",
    "title": "OpenAI",
    "canonicalName": "openai",
    "source": "wikimedia",
    "sourceId": "OpenAI_Logo.svg",
    "sourceVersion": "official",
    "variant": "official",
    "variants": {
      "official": "openai.svg"
    },
    "file": "openai.svg",
    "rawSha256": "d83507d6d96b346f50ee4485088ae23880a0658bb83a978f4a9c3d8c89bf72f0",
    "license": "Public Domain / Trademark of OpenAI, Inc.",
    "sourceUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    "brandColor": "#10A37F",
    "category": "ai",
    "verified": true
  },
  "oracle": {
    "id": "oracle",
    "title": "Oracle",
    "canonicalName": "oracle",
    "source": "devicon",
    "sourceId": "oracle",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "oracle-original.svg",
      "plain": "oracle-plain.svg"
    },
    "file": "oracle.svg",
    "rawSha256": "6afd3872d2ecb9a619fc10048b6a18bc3b948dfd7c97d1a694af26c6a7153cbf",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#EA1B22",
    "category": "bigtech",
    "verified": true
  },
  "php": {
    "id": "php",
    "title": "PHP",
    "canonicalName": "php",
    "source": "simple-icons",
    "sourceId": "php",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "php.svg"
    },
    "file": "php.svg",
    "rawSha256": "cd1beaa0dde7e765b5d2cbae786c1f6db967f72073eb7b9f9bbc63da55b9d0f6",
    "license": "CC-BY-SA-4.0: ",
    "sourceUrl": "https://php.net/download-logos.php",
    "brandColor": "#777BB4",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "php",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "postgresql": {
    "id": "postgresql",
    "title": "PostgreSQL",
    "canonicalName": "postgresql",
    "source": "simple-icons",
    "sourceId": "postgresql",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "postgresql.svg"
    },
    "file": "postgresql.svg",
    "rawSha256": "c8ccadbd88c9312c2ad3734c4861b31d3485ce179ee91d64793143f83cfa745c",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://wiki.postgresql.org/wiki/Logo",
    "brandColor": "#4169E1",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "postgresql",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "postman": {
    "id": "postman",
    "title": "Postman",
    "canonicalName": "postman",
    "source": "simple-icons",
    "sourceId": "postman",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "postman.svg"
    },
    "file": "postman.svg",
    "rawSha256": "ffa713180d8a0dc42d69fb219fda548293b25438288b6abc5ccb4e381463778f",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.getpostman.com/resources/media-assets/",
    "brandColor": "#FF6C37",
    "category": "tools",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "postman",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "python": {
    "id": "python",
    "title": "Python",
    "canonicalName": "python",
    "source": "simple-icons",
    "sourceId": "python",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "python.svg"
    },
    "file": "python.svg",
    "rawSha256": "ad9468e1c4903f73ae7eebfbe980f0f727a10db695be3d914e7d8bd25356a862",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.python.org/community/logos/",
    "brandColor": "#3776AB",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "python",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "react": {
    "id": "react",
    "title": "React",
    "canonicalName": "react",
    "source": "simple-icons",
    "sourceId": "react",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "react.svg"
    },
    "file": "react.svg",
    "rawSha256": "ab9136a1a4a8be72ac6743e1bdd1912d878bd68d57787ea7a6c6838e3b23c01c",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/facebook/create-react-app/blob/282c03f9525fdf8061ffa1ec50dce89296d916bd/test/fixtures/relative-paths/src/logo.svg",
    "brandColor": "#61DAFB",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "react",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "redis": {
    "id": "redis",
    "title": "Redis",
    "canonicalName": "redis",
    "source": "simple-icons",
    "sourceId": "redis",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "redis.svg"
    },
    "file": "redis.svg",
    "rawSha256": "428b86deb14c8bdacdcdf75987fe454f367bcd078a7e4ae3f84de29aa5bdf136",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://redis.io/brand-guidelines",
    "brandColor": "#FF4438",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "redis",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "remix": {
    "id": "remix",
    "title": "Remix",
    "canonicalName": "remix",
    "source": "simple-icons",
    "sourceId": "remix",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "remix.svg"
    },
    "file": "remix.svg",
    "rawSha256": "ab1174e86a6cfa3eaa6f1d6b43421032743c9046715cfc386f96b3f73238e319",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://drive.google.com/drive/u/0/folders/1pbHnJqg8Y1ATs0Oi8gARH7wccJGv4I2c",
    "brandColor": "#000000",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "remix",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "line",
          "line-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "ruby": {
    "id": "ruby",
    "title": "Ruby",
    "canonicalName": "ruby",
    "source": "simple-icons",
    "sourceId": "ruby",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "ruby.svg"
    },
    "file": "ruby.svg",
    "rawSha256": "956992a81b988b916efdd6f7a78b9f19fe352b5c04f2019af2ce1a89e390ac9d",
    "license": "CC-BY-SA-2.5: ",
    "sourceUrl": "https://www.ruby-lang.org/en/about/logo/",
    "brandColor": "#CC342D",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "ruby",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "rust": {
    "id": "rust",
    "title": "Rust",
    "canonicalName": "rust",
    "source": "simple-icons",
    "sourceId": "rust",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "rust.svg"
    },
    "file": "rust.svg",
    "rawSha256": "95a291d8887610d103704adcc5c5f2cbfa4c80a96f8e72b00531d5691beb67a8",
    "license": "CC-BY-SA-4.0: ",
    "sourceUrl": "https://www.rust-lang.org",
    "brandColor": "#000000",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "rust",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "line",
          "plain"
        ]
      }
    ]
  },
  "salesforce": {
    "id": "salesforce",
    "title": "Salesforce",
    "canonicalName": "salesforce",
    "source": "devicon",
    "sourceId": "salesforce",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "salesforce-original.svg",
      "plain": "salesforce-plain.svg"
    },
    "file": "salesforce.svg",
    "rawSha256": "bf8de61a70a6967bf12b2f37aeb57a86893e930a0d1ffe86e35a5a3b3fd4f2f4",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#00a1e0",
    "category": "bigtech",
    "verified": true
  },
  "samsung": {
    "id": "samsung",
    "title": "Samsung",
    "canonicalName": "samsung",
    "source": "simple-icons",
    "sourceId": "samsung",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "samsung.svg"
    },
    "file": "samsung.svg",
    "rawSha256": "4a241ca8ebab6e71883b172acb9fb454efa69f308e4f2c31ec80668aeb6627d9",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.samsung.com/us/about-us/brand-identity/logo/",
    "brandColor": "#1428A0",
    "category": "bigtech",
    "verified": true
  },
  "sass": {
    "id": "sass",
    "title": "Sass",
    "canonicalName": "sass",
    "source": "simple-icons",
    "sourceId": "sass",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "sass.svg"
    },
    "file": "sass.svg",
    "rawSha256": "0859123cfea9b1d4aa60714ebf5c758be760e2efa1b3944085fb105feeece9db",
    "license": "CC-BY-NC-SA-3.0: ",
    "sourceUrl": "https://sass-lang.com/styleguide/brand",
    "brandColor": "#CC6699",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "sass",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "slack": {
    "id": "slack",
    "title": "Slack",
    "canonicalName": "slack",
    "source": "devicon",
    "sourceId": "slack",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "slack-original.svg",
      "original-wordmark": "slack-original-wordmark.svg",
      "plain": "slack-plain.svg",
      "plain-wordmark": "slack-plain-wordmark.svg"
    },
    "file": "slack.svg",
    "rawSha256": "5d06c866631d0022e779d83c3b8d9cf36e3afd2bae406d75b6702219483b9165",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#2D333A",
    "category": "social",
    "verified": true
  },
  "sony": {
    "id": "sony",
    "title": "Sony",
    "canonicalName": "sony",
    "source": "simple-icons",
    "sourceId": "sony",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "sony.svg"
    },
    "file": "sony.svg",
    "rawSha256": "d012ec936e65a255f7b7b49a7e99c5aa7ab919fbc1487d8e09af82031c0e7090",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.sony.com",
    "brandColor": "#FFFFFF",
    "category": "bigtech",
    "verified": true
  },
  "spotify": {
    "id": "spotify",
    "title": "Spotify",
    "canonicalName": "spotify",
    "source": "simple-icons",
    "sourceId": "spotify",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "spotify.svg"
    },
    "file": "spotify.svg",
    "rawSha256": "b9ec9bec7769c35643981586d6ea0d675aaf3871b32f8a291bcac7a87fff0bc1",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://developer.spotify.com/documentation/general/design-and-branding/#using-our-logo",
    "brandColor": "#1ED760",
    "category": "social",
    "verified": true
  },
  "sqlite": {
    "id": "sqlite",
    "title": "SQLite",
    "canonicalName": "sqlite",
    "source": "simple-icons",
    "sourceId": "sqlite",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "sqlite.svg"
    },
    "file": "sqlite.svg",
    "rawSha256": "71d4153bc9661dfe6b92dad70f737ec2b6c7c839311e502b4ca66fe664fe12b6",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/sqlite/sqlite/blob/43e862723ec680542ca6f608f9963c0993dd7324/art/sqlite370.eps",
    "brandColor": "#003B57",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "sqlite",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "supabase": {
    "id": "supabase",
    "title": "Supabase",
    "canonicalName": "supabase",
    "source": "simple-icons",
    "sourceId": "supabase",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "supabase.svg"
    },
    "file": "supabase.svg",
    "rawSha256": "61bf16d93be418f723ae1e137e57afdad4f185352fbc6dea9482af1e0a89ccf7",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/supabase/supabase/blob/4031a7549f5d46da7bc79c01d56be4177dc7c114/packages/common/assets/images/supabase-logo-wordmark--light.svg",
    "brandColor": "#3FCF8E",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "supabase",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "svelte": {
    "id": "svelte",
    "title": "Svelte",
    "canonicalName": "svelte",
    "source": "simple-icons",
    "sourceId": "svelte",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "svelte.svg"
    },
    "file": "svelte.svg",
    "rawSha256": "a38cef0f4fc36bc63519ce34d24a91022f19ec6998ea402c5e155c7479a46f4c",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/sveltejs/branding/blob/c4dfca6743572087a6aef0e109ffe3d95596e86a/svelte-logo.svg",
    "brandColor": "#FF3E00",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "svelte",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "swift": {
    "id": "swift",
    "title": "Swift",
    "canonicalName": "swift",
    "source": "simple-icons",
    "sourceId": "swift",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "swift.svg"
    },
    "file": "swift.svg",
    "rawSha256": "b3d5f49cc459b7a3417db134ec70052c30305c3799d0f854796544c52c18a4bc",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://developer.apple.com/swift/resources/",
    "brandColor": "#F05138",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "swift",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "tailwindcss": {
    "id": "tailwindcss",
    "title": "Tailwind CSS",
    "canonicalName": "tailwindcss",
    "source": "simple-icons",
    "sourceId": "tailwindcss",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "tailwindcss.svg"
    },
    "file": "tailwindcss.svg",
    "rawSha256": "5d4ede3c95da824f543c6eefbe7c78b45ecce6796f6633de196dd712a7841140",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://tailwindcss.com/brand",
    "brandColor": "#06B6D4",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "tailwindcss",
        "sourceVersion": "2.17.0",
        "variants": [
          "original-wordmark",
          "original",
          "plain-wordmark",
          "plain"
        ]
      }
    ]
  },
  "telegram": {
    "id": "telegram",
    "title": "Telegram",
    "canonicalName": "telegram",
    "source": "simple-icons",
    "sourceId": "telegram",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "telegram.svg"
    },
    "file": "telegram.svg",
    "rawSha256": "147fd8f8923e7e5f463fe98c0eb9913bead6b2ae59935728cda141002ec8a7c9",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://telegram.org/tour/screenshots",
    "brandColor": "#26A5E4",
    "category": "social",
    "verified": true
  },
  "tesla": {
    "id": "tesla",
    "title": "Tesla",
    "canonicalName": "tesla",
    "source": "simple-icons",
    "sourceId": "tesla",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "tesla.svg"
    },
    "file": "tesla.svg",
    "rawSha256": "4b94d9eaf23849d6feec7a9c819e3699a35cbb76045ba7d482d17cbcc97414a5",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.tesla.com/tesla-gallery",
    "brandColor": "#CC0000",
    "category": "bigtech",
    "verified": true
  },
  "tiktok": {
    "id": "tiktok",
    "title": "TikTok",
    "canonicalName": "tiktok",
    "source": "simple-icons",
    "sourceId": "tiktok",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "tiktok.svg"
    },
    "file": "tiktok.svg",
    "rawSha256": "6f54ac8d325faacea8935bdc44cbed60206a6b408641799e5fea1cba7c1a0af7",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://tiktok.com",
    "brandColor": "#000000",
    "category": "social",
    "verified": true
  },
  "trello": {
    "id": "trello",
    "title": "Trello",
    "canonicalName": "trello",
    "source": "simple-icons",
    "sourceId": "trello",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "trello.svg"
    },
    "file": "trello.svg",
    "rawSha256": "d1069cc5fc0174978356b5deb34c732dda5812875ea79d90d4a834169db55f04",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://atlassian.design/resources/logo-library",
    "brandColor": "#0052CC",
    "category": "tools",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "trello",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark",
          "line",
          "line-wordmark"
        ]
      }
    ]
  },
  "typescript": {
    "id": "typescript",
    "title": "TypeScript",
    "canonicalName": "typescript",
    "source": "simple-icons",
    "sourceId": "typescript",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "typescript.svg"
    },
    "file": "typescript.svg",
    "rawSha256": "7f023e8d1e767370306ec9437d2de5d5af97491d6208dd7799a3808a7c10a36a",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.typescriptlang.org/branding",
    "brandColor": "#3178C6",
    "category": "languages",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "typescript",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "ubuntu": {
    "id": "ubuntu",
    "title": "Ubuntu",
    "canonicalName": "ubuntu",
    "source": "simple-icons",
    "sourceId": "ubuntu",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "ubuntu.svg"
    },
    "file": "ubuntu.svg",
    "rawSha256": "b0aca674c881a07bb60b26afbcee07093ae419e29ee38e376f938817fa66ae03",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://design.ubuntu.com/resources",
    "brandColor": "#E95420",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "ubuntu",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "vercel": {
    "id": "vercel",
    "title": "Vercel",
    "canonicalName": "vercel",
    "source": "simple-icons",
    "sourceId": "vercel",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "vercel.svg"
    },
    "file": "vercel.svg",
    "rawSha256": "57f1e4135486c566e9878fddd259f7f6bf8ec43f31e7e6e38a36d9e814a1c0e0",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://vercel.com/geist/brands",
    "brandColor": "#000000",
    "category": "cloud",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "vercel",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "line",
          "line-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "visualstudiocode": {
    "id": "visualstudiocode",
    "title": "Vscode",
    "canonicalName": "visualstudiocode",
    "source": "devicon",
    "sourceId": "vscode",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "visualstudiocode-original.svg",
      "original-wordmark": "visualstudiocode-original-wordmark.svg",
      "plain": "visualstudiocode-plain.svg",
      "plain-wordmark": "visualstudiocode-plain-wordmark.svg"
    },
    "file": "visualstudiocode.svg",
    "rawSha256": "2515a8788efac98fa9094a47dedb929900fe48bc58f055c77a8c07da0e0a0adc",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#3C99D4",
    "category": "tools",
    "verified": true
  },
  "vite": {
    "id": "vite",
    "title": "Vite",
    "canonicalName": "vite",
    "source": "simple-icons",
    "sourceId": "vite",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "vite.svg"
    },
    "file": "vite.svg",
    "rawSha256": "642bb261d6476ddf326b8ed7757543b3443a93a77fef1e434021fc201defa21c",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://github.com/voidzero-dev/community-design-resources/blob/55902097229cf01cf2a4ceb376f992f5cf306756/brand-assets/vite/vite-icon-color-bracketless.svg",
    "brandColor": "#9135FF",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "vite",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "vuedotjs": {
    "id": "vuedotjs",
    "title": "Vue.js",
    "canonicalName": "vuedotjs",
    "source": "simple-icons",
    "sourceId": "vuedotjs",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "vuedotjs.svg"
    },
    "file": "vuedotjs.svg",
    "rawSha256": "2a57b59bd3ff2880f971f7f6cce2378d20bdfb1a54150a0a7ca9fd2fe1bfa781",
    "license": "CC-BY-NC-SA-4.0: ",
    "sourceUrl": "https://github.com/vuejs/art/blob/a1c78b74569b70a25300925b4eacfefcc143b8f6/logo.svg",
    "brandColor": "#4FC08D",
    "category": "frontend",
    "verified": true
  },
  "webpack": {
    "id": "webpack",
    "title": "Webpack",
    "canonicalName": "webpack",
    "source": "simple-icons",
    "sourceId": "webpack",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "webpack.svg"
    },
    "file": "webpack.svg",
    "rawSha256": "008cdbfc39bf3658a8d69d941361917023e93b45e7a87769009dee4e4b014b16",
    "license": "custom: https://js.foundation/about/governance/trademark-policy",
    "sourceUrl": "https://webpack.js.org/branding",
    "brandColor": "#8DD6F9",
    "category": "frontend",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "webpack",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ]
      }
    ]
  },
  "wechat": {
    "id": "wechat",
    "title": "WeChat",
    "canonicalName": "wechat",
    "source": "simple-icons",
    "sourceId": "wechat",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "wechat.svg"
    },
    "file": "wechat.svg",
    "rawSha256": "74b48b3d315337ce79cb644933b5f975e19996f564fcc4138ed67d45674c43ca",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://wechat.design/tool/brand",
    "brandColor": "#07C160",
    "category": "social",
    "verified": true
  },
  "x": {
    "id": "x",
    "title": "X",
    "canonicalName": "x",
    "source": "simple-icons",
    "sourceId": "x",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "x.svg"
    },
    "file": "x.svg",
    "rawSha256": "693e68863eceb8dc9f72e2acd386ab9c20a10858dab2c076212f7084cb7a32fe",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://x.com",
    "brandColor": "#000000",
    "category": "social",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "twitter",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ]
      }
    ]
  },
  "youtube": {
    "id": "youtube",
    "title": "YouTube",
    "canonicalName": "youtube",
    "source": "simple-icons",
    "sourceId": "youtube",
    "sourceVersion": "16.29.0",
    "variant": "default",
    "variants": {
      "default": "youtube.svg"
    },
    "file": "youtube.svg",
    "rawSha256": "5038808acbbc4e6edda16cbeb1cc6dec80e4e4ee4e227e039c41229fa222aa8c",
    "license": "Simple Icons (CC0 1.0 Universal)",
    "sourceUrl": "https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-colors",
    "brandColor": "#FF0000",
    "category": "social",
    "verified": true
  }
};
