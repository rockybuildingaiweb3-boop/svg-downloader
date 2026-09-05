/**
 * Canonical SVG Icon Registry (Auto-generated)
 * Total canonical identities: 91
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

export type IconSource = 'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos';
export type VerificationStatus = 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';

export interface AlternativeSource {
  source: IconSource;
  sourceId: string;
  sourceVersion: string;
  variants?: string[];
  license?: string;
  sourceUrl?: string;
}

export interface IconRecord {
  id: IconName;
  title: string;
  canonicalName: string;
  source: IconSource;
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
  xmlValid: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  renderable: boolean;
  verificationStatus: VerificationStatus;
  verified: boolean;
  alternativeSources?: AlternativeSource[];
  conflicts?: string[];
  notes?: string;
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "adobe",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      }
    ],
    "notes": "Official Adobe corporate red vector mark."
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "notes": "Official Amazon brandmark with smile arrow curve."
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "amd": {
    "id": "amd",
    "title": "Amd",
    "canonicalName": "amd",
    "source": "svg-logos",
    "sourceId": "amd",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "amd.svg"
    },
    "file": "amd.svg",
    "rawSha256": "f67e68e0d690b367701bd18ef16aa2be81e0d42e2938354fb574338e95d17832",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#ED1C24",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "amd",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.amd.com"
      }
    ]
  },
  "angular": {
    "id": "angular",
    "title": "Angular",
    "canonicalName": "angular",
    "source": "svg-logos",
    "sourceId": "angular",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "angular.svg"
    },
    "file": "angular.svg",
    "rawSha256": "6e1317b80992370e2a181053fe805e40a70dfd075abae81aae89f6a866c8a77c",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0F0F11",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "angular",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "CC-BY-4.0: ",
        "sourceUrl": "https://angular.dev/press-kit"
      }
    ]
  },
  "anthropic": {
    "id": "anthropic",
    "title": "Anthropic",
    "canonicalName": "anthropic",
    "source": "svg-logos",
    "sourceId": "anthropic",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "anthropic.svg"
    },
    "file": "anthropic.svg",
    "rawSha256": "3912a1df4c2742bfbcebe72df14bf421fc80a615c5655533afd785400f3a2cf6",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#191919",
    "category": "ai",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "anthropic",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.anthropic.com"
      }
    ]
  },
  "apache": {
    "id": "apache",
    "title": "Apache Http",
    "canonicalName": "apache",
    "source": "svg-logos",
    "sourceId": "apache-http",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "apache.svg"
    },
    "file": "apache.svg",
    "rawSha256": "3caad7617f87f8627d21c604486731a318d878ea3d15aae1cffcd93fba32bdcf",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#D22128",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "apache",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Apache-2.0: ",
        "sourceUrl": "https://www.apache.org/foundation/press/kit"
      }
    ]
  },
  "apple": {
    "id": "apple",
    "title": "Apple",
    "canonicalName": "apple",
    "source": "svg-logos",
    "sourceId": "apple",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "apple.svg"
    },
    "file": "apple.svg",
    "rawSha256": "42657d6b0079eb3641e5302927ef1a85401b9f908655e149c33537a885df1a56",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#000000",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "apple",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "apple",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.apple.com"
      }
    ]
  },
  "astro": {
    "id": "astro",
    "title": "Astro",
    "canonicalName": "astro",
    "source": "svg-logos",
    "sourceId": "astro",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "astro.svg"
    },
    "file": "astro.svg",
    "rawSha256": "d4cf8a4b0a5311e5bbe8c88dbd5a4bbaa3aacaaa3fbf6ef5b573524f855603ba",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#BC52EE",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "astro",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://astro.build/press"
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "bootstrap": {
    "id": "bootstrap",
    "title": "Bootstrap",
    "canonicalName": "bootstrap",
    "source": "svg-logos",
    "sourceId": "bootstrap",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "bootstrap.svg"
    },
    "file": "bootstrap.svg",
    "rawSha256": "b5427e820ef56a478b5a2aa6ffa4ec569c35ee6bd784d1a580cfb246d4eb51a0",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#7952B3",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "bootstrap",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "MIT: ",
        "sourceUrl": "https://getbootstrap.com/docs/5.3/about/brand"
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "cloudflare": {
    "id": "cloudflare",
    "title": "Cloudflare",
    "canonicalName": "cloudflare",
    "source": "svg-logos",
    "sourceId": "cloudflare",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "cloudflare.svg"
    },
    "file": "cloudflare.svg",
    "rawSha256": "6921884a47d3385692bf6bfd12dec8d3804343939fab235f53db627ee4a4b48e",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#F38020",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "cloudflare",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.cloudflare.com/logo/"
      }
    ]
  },
  "cplusplus": {
    "id": "cplusplus",
    "title": "C Plusplus",
    "canonicalName": "cplusplus",
    "source": "svg-logos",
    "sourceId": "c-plusplus",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "cplusplus.svg"
    },
    "file": "cplusplus.svg",
    "rawSha256": "280db6bbcfc4d4a42e6139e3febe7e200c80654ca31f143abf19700fb92dfa16",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#00599C",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "cplusplus",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/isocpp/logos/tree/64ef037049f87ac74875dbe72695e59118b52186"
      }
    ]
  },
  "csharp": {
    "id": "csharp",
    "title": "C Sharp",
    "canonicalName": "csharp",
    "source": "svg-logos",
    "sourceId": "c-sharp",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "csharp.svg"
    },
    "file": "csharp.svg",
    "rawSha256": "4221da3e1cff3a4612a7f0589aec2c65284870e9a155a63c3b6c7d095c441f00",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#68217a",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "csharp",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain",
          "line",
          "plain-wordmark",
          "line-wordmark"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
  },
  "css3": {
    "id": "css3",
    "title": "Css 3",
    "canonicalName": "css3",
    "source": "svg-logos",
    "sourceId": "css-3",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "css3.svg"
    },
    "file": "css3.svg",
    "rawSha256": "e7b7970e4f879bec60e9904e1004720c40c984fa8659b9bebd66987b0351f5b4",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#3d8fc6",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "css3",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
  },
  "dart": {
    "id": "dart",
    "title": "Dart",
    "canonicalName": "dart",
    "source": "svg-logos",
    "sourceId": "dart",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "dart.svg"
    },
    "file": "dart.svg",
    "rawSha256": "261b14dfa7f28c8c86a8ca75ad33efb3325d7fcc50140f192e7188ce859f85ba",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0175C2",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "dart",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/dart-lang/site-shared/tree/18458ff440afd3d06f04e5cb871c4c5eda29c9d5/src/_assets/image/dart/logo"
      }
    ]
  },
  "deepseek": {
    "id": "deepseek",
    "title": "Deepseek",
    "canonicalName": "deepseek",
    "source": "svg-logos",
    "sourceId": "deepseek",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "deepseek.svg"
    },
    "file": "deepseek.svg",
    "rawSha256": "ec8fb624ae1108e70815620541411a25c3266bc739f1299d96c731691ef56709",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#5786FE",
    "category": "ai",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "deepseek",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.deepseek.com"
      }
    ]
  },
  "discord": {
    "id": "discord",
    "title": "Discord",
    "canonicalName": "discord",
    "source": "svg-logos",
    "sourceId": "discord",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "discord.svg"
    },
    "file": "discord.svg",
    "rawSha256": "fb8958eb1507b5c3bcab9becdf2568fe97639894953eb007961e66aae1a6b280",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#5865F2",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "discord",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://discord.com/branding"
      }
    ]
  },
  "docker": {
    "id": "docker",
    "title": "Docker",
    "canonicalName": "docker",
    "source": "devicon",
    "sourceId": "docker",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "docker-original.svg",
      "original-wordmark": "docker-original-wordmark.svg",
      "plain": "docker-plain.svg",
      "plain-wordmark": "docker-plain-wordmark.svg"
    },
    "file": "docker.svg",
    "rawSha256": "3fd830ea69431ed7a0b8d068cd5b34ad3f00a1a78195d50f13ff56713f2462e1",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#019bc6",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "docker",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      },
      {
        "source": "simple-icons",
        "sourceId": "docker",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.docker.com/company/newsroom/media-resources"
      }
    ]
  },
  "figma": {
    "id": "figma",
    "title": "Figma",
    "canonicalName": "figma",
    "source": "svg-logos",
    "sourceId": "figma",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "figma.svg"
    },
    "file": "figma.svg",
    "rawSha256": "7e6f685cead83a2bfd79e68089045bcd307b5ae5223bd74783ca3f2518392c35",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#F24E1E",
    "category": "tools",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "figma",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "figma",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.figma.com/using-the-figma-brand/"
      }
    ]
  },
  "firebase": {
    "id": "firebase",
    "title": "Firebase",
    "canonicalName": "firebase",
    "source": "svg-logos",
    "sourceId": "firebase",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "firebase.svg"
    },
    "file": "firebase.svg",
    "rawSha256": "703484a0d1a2a096fd966837627233491a4a774fbdd397ecc00e3ce10050465e",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#DD2C00",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "firebase",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://firebase.google.com/brand-guidelines"
      }
    ]
  },
  "flutter": {
    "id": "flutter",
    "title": "Flutter",
    "canonicalName": "flutter",
    "source": "svg-logos",
    "sourceId": "flutter",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "flutter.svg"
    },
    "file": "flutter.svg",
    "rawSha256": "6604cd99ee81d56e9c522377b96fecf3fd08a2796277a876be9368d4dab44029",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#02569B",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "flutter",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "flutter",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://flutter.dev/brand"
      }
    ]
  },
  "git": {
    "id": "git",
    "title": "Git",
    "canonicalName": "git",
    "source": "svg-logos",
    "sourceId": "git",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "git.svg"
    },
    "file": "git.svg",
    "rawSha256": "68647af8e4fb3fd04a6be7645a8e3a39252ccc8952897e782cb23cf5fbe2ca4f",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#F03C2E",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "git",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "CC-BY-3.0: ",
        "sourceUrl": "https://git-scm.com/community/logos"
      }
    ]
  },
  "github": {
    "id": "github",
    "title": "Github",
    "canonicalName": "github",
    "source": "devicon",
    "sourceId": "github",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "github-original.svg",
      "original-wordmark": "github-original-wordmark.svg",
      "plain": "github-plain.svg"
    },
    "file": "github.svg",
    "rawSha256": "45262793de6292206a895ed63593cdb1eaed82074173f7f4b5bdb3e427ca805a",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#181616",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "github",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      },
      {
        "source": "simple-icons",
        "sourceId": "github",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/logos"
      }
    ]
  },
  "gitlab": {
    "id": "gitlab",
    "title": "Gitlab",
    "canonicalName": "gitlab",
    "source": "svg-logos",
    "sourceId": "gitlab",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "gitlab.svg"
    },
    "file": "gitlab.svg",
    "rawSha256": "71a2f02500c9d9dbc1b55c53c9309e705d68c74ae8e006f3e221c5a78fe88f05",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FC6D26",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "gitlab",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://about.gitlab.com/press/press-kit/"
      }
    ]
  },
  "go": {
    "id": "go",
    "title": "Go",
    "canonicalName": "go",
    "source": "svg-logos",
    "sourceId": "go",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "go.svg"
    },
    "file": "go.svg",
    "rawSha256": "4e6a923a654efb847722cbed3008c7bb50ce96891397199e6920b20fedff579e",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#00ADD8",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "go",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://blog.golang.org/go-brand"
      }
    ]
  },
  "google": {
    "id": "google",
    "title": "Google",
    "canonicalName": "google",
    "source": "svg-logos",
    "sourceId": "google",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "google.svg"
    },
    "file": "google.svg",
    "rawSha256": "6716a0a8ed70af30ff82dadb7055b3084077a422bacd3b9657cde17edc60cc54",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#4285F4",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "google",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://partnermarketinghub.withgoogle.com"
      }
    ]
  },
  "googlecloud": {
    "id": "googlecloud",
    "title": "Google Cloud",
    "canonicalName": "googlecloud",
    "source": "svg-logos",
    "sourceId": "google-cloud",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "googlecloud.svg"
    },
    "file": "googlecloud.svg",
    "rawSha256": "8dd0f717cb1ecfabcbbd54aba34191a4c6f5fb5c4ccfe92875538c0a1e9dc169",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#4285F4",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "googlecloud",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://cloud.google.com"
      }
    ]
  },
  "html5": {
    "id": "html5",
    "title": "Html 5",
    "canonicalName": "html5",
    "source": "svg-logos",
    "sourceId": "html-5",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "html5.svg"
    },
    "file": "html5.svg",
    "rawSha256": "5095ed47b8ad89dc019aaec1572b44c91a22e564fa6a58b88a21b241b9e0523c",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#E34F26",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "html5",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.w3.org/html/logo/"
      }
    ]
  },
  "huggingface": {
    "id": "huggingface",
    "title": "Hugging Face",
    "canonicalName": "huggingface",
    "source": "svg-logos",
    "sourceId": "hugging-face",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "huggingface.svg"
    },
    "file": "huggingface.svg",
    "rawSha256": "5bc37895d71a91c4b01f224026ca1b5ba746b8845324136fa69fb3f610191466",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FFD21E",
    "category": "ai",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "huggingface",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://huggingface.co/brand"
      }
    ]
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "ibm",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      }
    ],
    "notes": "Official IBM 8-bar corporate logotype."
  },
  "instagram": {
    "id": "instagram",
    "title": "Instagram",
    "canonicalName": "instagram",
    "source": "svg-logos",
    "sourceId": "instagram",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "instagram.svg"
    },
    "file": "instagram.svg",
    "rawSha256": "83ce9d6cf0ac918dc385a21cd55d50a82ab190366ede1cec5ead04588657f874",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FF0069",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "instagram",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://about.meta.com/brand/resources/instagram"
      }
    ]
  },
  "intel": {
    "id": "intel",
    "title": "Intel",
    "canonicalName": "intel",
    "source": "svg-logos",
    "sourceId": "intel",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "intel.svg"
    },
    "file": "intel.svg",
    "rawSha256": "3390af7fa705cd0c93e58cda5af9662f24f1e3822a80482612e3ee80a3cfb958",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0071C5",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "intel",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.intel.com/content/www/us/en/newsroom/resources/press-kits-intel-overview.html"
      }
    ]
  },
  "java": {
    "id": "java",
    "title": "Java",
    "canonicalName": "java",
    "source": "svg-logos",
    "sourceId": "java",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "java.svg"
    },
    "file": "java.svg",
    "rawSha256": "0ab8f0390d2c6cee00b5e12c8d750df05d80cb5574ac06b79090c791731f3cf4",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#EA2D2E",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "java",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
  },
  "javascript": {
    "id": "javascript",
    "title": "Javascript",
    "canonicalName": "javascript",
    "source": "svg-logos",
    "sourceId": "javascript",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "javascript.svg"
    },
    "file": "javascript.svg",
    "rawSha256": "bc6c2db5581e2f3e63a9b50c62a82d7f68a599e6047820144799df5785eaabb7",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#F7DF1E",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "javascript",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "javascript",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "MIT: ",
        "sourceUrl": "https://github.com/voodootikigod/logo.js/blob/1544bdeed6d618a6cfe4f0650d04ab8d9cfa76d9/js.svg"
      }
    ]
  },
  "jira": {
    "id": "jira",
    "title": "Jira",
    "canonicalName": "jira",
    "source": "svg-logos",
    "sourceId": "jira",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "jira.svg"
    },
    "file": "jira.svg",
    "rawSha256": "4ac5d1ba8982d82c7cbbe8e293ea407a98bf66b2a7d9f1971c1be413e3edd51f",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0052CC",
    "category": "tools",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "jira",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://atlassian.design/resources/logo-library"
      }
    ]
  },
  "kotlin": {
    "id": "kotlin",
    "title": "Kotlin",
    "canonicalName": "kotlin",
    "source": "svg-logos",
    "sourceId": "kotlin",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "kotlin.svg"
    },
    "file": "kotlin.svg",
    "rawSha256": "2a0270a04a020d1e2aaf54b91ee4a282ef603cedf02b656a123485e66a6bb665",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#7F52FF",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "kotlin",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.jetbrains.com/company/brand/logos/"
      }
    ]
  },
  "kubernetes": {
    "id": "kubernetes",
    "title": "Kubernetes",
    "canonicalName": "kubernetes",
    "source": "svg-logos",
    "sourceId": "kubernetes",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "kubernetes.svg"
    },
    "file": "kubernetes.svg",
    "rawSha256": "f76e2e39b7e4ceb0c222e200b6ebb56412cf583ed45ffe170562eaa8aaa19322",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#326CE5",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "kubernetes",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/kubernetes/kubernetes/tree/cac53883f4714452f3084a22e4be20d042a9df33/logo"
      }
    ]
  },
  "linear": {
    "id": "linear",
    "title": "Linear",
    "canonicalName": "linear",
    "source": "svg-logos",
    "sourceId": "linear",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "linear.svg"
    },
    "file": "linear.svg",
    "rawSha256": "214c65423333d9a93158016fed62330c5422e9369e5a0c079fd332e0738f92b9",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#5E6AD2",
    "category": "tools",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "linear",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://linear.app"
      }
    ]
  },
  "linkedin": {
    "id": "linkedin",
    "title": "Linkedin",
    "canonicalName": "linkedin",
    "source": "svg-logos",
    "sourceId": "linkedin",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "linkedin.svg"
    },
    "file": "linkedin.svg",
    "rawSha256": "11be87acc623d6f050356f616ca2fe21736309c8154e55ec2c8ab41068547986",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0076b2",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "linkedin",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "linux",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
  },
  "meta": {
    "id": "meta",
    "title": "Meta",
    "canonicalName": "meta",
    "source": "svg-logos",
    "sourceId": "meta",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "meta.svg"
    },
    "file": "meta.svg",
    "rawSha256": "880ab7b2d060732940175eb425f0910176230aed4d4066632a185ecc0386a4ce",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0467DF",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "meta",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.meta.com"
      }
    ]
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "microsoft",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      }
    ],
    "notes": "Official 4-color Microsoft square corporate emblem."
  },
  "microsoftazure": {
    "id": "microsoftazure",
    "title": "Microsoft Azure",
    "canonicalName": "microsoftazure",
    "source": "svg-logos",
    "sourceId": "microsoft-azure",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "microsoftazure.svg"
    },
    "file": "microsoftazure.svg",
    "rawSha256": "8e34b7f9cfc00ed4f91dbbcc078198c631526c5238e2df8855f7b72186b1f77c",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0089D6",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "azure",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
  },
  "mistralai": {
    "id": "mistralai",
    "title": "Mistral Ai",
    "canonicalName": "mistralai",
    "source": "svg-logos",
    "sourceId": "mistral-ai",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "mistralai.svg"
    },
    "file": "mistralai.svg",
    "rawSha256": "dbdd7e573223ed41087ae6fcbb73467387c2f36fcc0b53ddf706027dc279107c",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FA520F",
    "category": "ai",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "mistralai",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://chat.mistral.ai"
      }
    ]
  },
  "mongodb": {
    "id": "mongodb",
    "title": "Mongodb",
    "canonicalName": "mongodb",
    "source": "svg-logos",
    "sourceId": "mongodb",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "mongodb.svg"
    },
    "file": "mongodb.svg",
    "rawSha256": "2acd415d8a8fdedaa07c400debb5995e4098ab08edf3f603a2d84899b39be8fd",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#47A248",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "mongodb",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.mongodb.com/pressroom"
      }
    ]
  },
  "mysql": {
    "id": "mysql",
    "title": "Mysql",
    "canonicalName": "mysql",
    "source": "svg-logos",
    "sourceId": "mysql",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "mysql.svg"
    },
    "file": "mysql.svg",
    "rawSha256": "2e7e7d20620e86e559dcf4d1e02736b6d173f024705eff82bc46be4269abb9ad",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#4479A1",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "mysql",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.mysql.com/about/legal/logos.html"
      }
    ]
  },
  "netflix": {
    "id": "netflix",
    "title": "Netflix",
    "canonicalName": "netflix",
    "source": "svg-logos",
    "sourceId": "netflix",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "netflix.svg"
    },
    "file": "netflix.svg",
    "rawSha256": "dd6fac87e7f25f802d3db603eca80e6872e5b57fe2ea242679e27ebbe5981090",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#E50914",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "netflix",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://brand.netflix.com/en/assets/logos"
      }
    ]
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "nginx": {
    "id": "nginx",
    "title": "Nginx",
    "canonicalName": "nginx",
    "source": "svg-logos",
    "sourceId": "nginx",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "nginx.svg"
    },
    "file": "nginx.svg",
    "rawSha256": "90ea2392bbfcfbf0c9495facf5be1e6555b6c2a221894a21e1dfc13bbc4040d3",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#009639",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "nginx",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.nginx.com/press/"
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "notion": {
    "id": "notion",
    "title": "Notion",
    "canonicalName": "notion",
    "source": "svg-logos",
    "sourceId": "notion",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "notion.svg"
    },
    "file": "notion.svg",
    "rawSha256": "91f8d58e96c39985b3ce375e19fd43cfde5d7fef854e168a348781b96c7b5916",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#000000",
    "category": "tools",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "notion",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.notion.so"
      }
    ]
  },
  "nuxt": {
    "id": "nuxt",
    "title": "Nuxt",
    "canonicalName": "nuxt",
    "source": "svg-logos",
    "sourceId": "nuxt",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "nuxt.svg"
    },
    "file": "nuxt.svg",
    "rawSha256": "49c7259508b6cdcf96343cc2b65c5f03475a3dd9a23c5989777ae8dfbc1cda52",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#00DC82",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "nuxt",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://nuxt.com/design-kit"
      }
    ]
  },
  "nvidia": {
    "id": "nvidia",
    "title": "Nvidia",
    "canonicalName": "nvidia",
    "source": "svg-logos",
    "sourceId": "nvidia",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "nvidia.svg"
    },
    "file": "nvidia.svg",
    "rawSha256": "fa036bcca63345c0e54e0ed5d1aab9231b064ed970af0dbe785b4e1bb6966a11",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#76B900",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "nvidia",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.nvidia.com/en-us"
      }
    ]
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "openai",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      }
    ],
    "notes": "Official OpenAI swirl geometric mark."
  },
  "oracle": {
    "id": "oracle",
    "title": "Oracle",
    "canonicalName": "oracle",
    "source": "wikimedia",
    "sourceId": "Oracle_logo.svg",
    "sourceVersion": "official",
    "variant": "official",
    "variants": {
      "official": "oracle.svg"
    },
    "file": "oracle.svg",
    "rawSha256": "51b22d9e1e449c39df4f45474e6ec4632c0a8e83ddcd95106f246ebc4fa99d05",
    "license": "Public Domain / Trademark of Oracle Corporation",
    "sourceUrl": "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    "brandColor": "#F80000",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "oracle",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      },
      {
        "source": "devicon",
        "sourceId": "oracle",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ],
    "notes": "Official Oracle red brandmark vector."
  },
  "php": {
    "id": "php",
    "title": "Php",
    "canonicalName": "php",
    "source": "svg-logos",
    "sourceId": "php",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "php.svg"
    },
    "file": "php.svg",
    "rawSha256": "8b8752a80a47c3cd22a9fb870d14497bbb894f9e27b050e654f34ba212b2f50c",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#777BB4",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "php",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "php",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "CC-BY-SA-4.0: ",
        "sourceUrl": "https://php.net/download-logos.php"
      }
    ]
  },
  "postgresql": {
    "id": "postgresql",
    "title": "Postgresql",
    "canonicalName": "postgresql",
    "source": "svg-logos",
    "sourceId": "postgresql",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "postgresql.svg"
    },
    "file": "postgresql.svg",
    "rawSha256": "21ee759307121b4b0a7e345dcbb353ea6f78308310c6b226ab8bb98fa861d346",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#4169E1",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "postgresql",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://wiki.postgresql.org/wiki/Logo"
      }
    ]
  },
  "postman": {
    "id": "postman",
    "title": "Postman",
    "canonicalName": "postman",
    "source": "svg-logos",
    "sourceId": "postman",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "postman.svg"
    },
    "file": "postman.svg",
    "rawSha256": "ba5d2280570b659301fba0385a06c4a49ff78626eb10cc6c5efc9bb287d7ae23",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FF6C37",
    "category": "tools",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "postman",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.getpostman.com/resources/media-assets/"
      }
    ]
  },
  "python": {
    "id": "python",
    "title": "Python",
    "canonicalName": "python",
    "source": "svg-logos",
    "sourceId": "python",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "python.svg"
    },
    "file": "python.svg",
    "rawSha256": "8c775ba1cd274722d49c3db1abf6c07ccd339d87dac087a22b19da42f49570c9",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#3776AB",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "python",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.python.org/community/logos/"
      }
    ]
  },
  "react": {
    "id": "react",
    "title": "React",
    "canonicalName": "react",
    "source": "devicon",
    "sourceId": "react",
    "sourceVersion": "2.17.0",
    "variant": "original",
    "variants": {
      "original": "react-original.svg",
      "original-wordmark": "react-original-wordmark.svg",
      "plain": "react-plain.svg",
      "plain-wordmark": "react-plain-wordmark.svg"
    },
    "file": "react.svg",
    "rawSha256": "5825b649c8c04dec13ecf01d0182401bd0ec71789d2fa06224866d882cd1515f",
    "license": "Devicon (MIT License) with brand trademark guidelines",
    "sourceUrl": "https://devicon.dev/",
    "brandColor": "#61dafb",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "svg-logos",
        "sourceId": "react",
        "sourceVersion": "1.2.13",
        "variants": [
          "default"
        ],
        "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
        "sourceUrl": "https://github.com/gilbarbara/logos"
      },
      {
        "source": "simple-icons",
        "sourceId": "react",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/facebook/create-react-app/blob/282c03f9525fdf8061ffa1ec50dce89296d916bd/test/fixtures/relative-paths/src/logo.svg"
      }
    ]
  },
  "redis": {
    "id": "redis",
    "title": "Redis",
    "canonicalName": "redis",
    "source": "svg-logos",
    "sourceId": "redis",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "redis.svg"
    },
    "file": "redis.svg",
    "rawSha256": "d3e7abd53591d1996e3a1f718a5de4d9e8541009e0ba97cbc02424d16b855f24",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FF4438",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "redis",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://redis.io/brand-guidelines"
      }
    ]
  },
  "remix": {
    "id": "remix",
    "title": "Remix",
    "canonicalName": "remix",
    "source": "svg-logos",
    "sourceId": "remix",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "remix.svg"
    },
    "file": "remix.svg",
    "rawSha256": "f619b79dd5cb2a6599341e2789f9d43a0a9bfb7b189ac691905d7f4dcd617deb",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#000000",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "remix",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://drive.google.com/drive/u/0/folders/1pbHnJqg8Y1ATs0Oi8gARH7wccJGv4I2c"
      }
    ]
  },
  "ruby": {
    "id": "ruby",
    "title": "Ruby",
    "canonicalName": "ruby",
    "source": "svg-logos",
    "sourceId": "ruby",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "ruby.svg"
    },
    "file": "ruby.svg",
    "rawSha256": "6b36b7199985782f82a8e684d93c528ae55bd9bcf4cda9d6c07c8c18ab15f13d",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#CC342D",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "ruby",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "CC-BY-SA-2.5: ",
        "sourceUrl": "https://www.ruby-lang.org/en/about/logo/"
      }
    ]
  },
  "rust": {
    "id": "rust",
    "title": "Rust",
    "canonicalName": "rust",
    "source": "svg-logos",
    "sourceId": "rust",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "rust.svg"
    },
    "file": "rust.svg",
    "rawSha256": "5cf2561e5a5c39a0467dbb463c95f18d98a443576edb0c76b2b19cdf393c5a98",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#000000",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "rust",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "CC-BY-SA-4.0: ",
        "sourceUrl": "https://www.rust-lang.org"
      }
    ]
  },
  "salesforce": {
    "id": "salesforce",
    "title": "Salesforce",
    "canonicalName": "salesforce",
    "source": "svg-logos",
    "sourceId": "salesforce",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "salesforce.svg"
    },
    "file": "salesforce.svg",
    "rawSha256": "a05a039a0d83129f5d8c9afe0e474b3d218ad59f83a67be0d7ba409363c1269c",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#00a1e0",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "salesforce",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
  },
  "samsung": {
    "id": "samsung",
    "title": "Samsung",
    "canonicalName": "samsung",
    "source": "svg-logos",
    "sourceId": "samsung",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "samsung.svg"
    },
    "file": "samsung.svg",
    "rawSha256": "ff987768ab12d6728098a1ba900d12bd1f75799570480b376c89416dd50a8ace",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#1428A0",
    "category": "bigtech",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "samsung",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.samsung.com/us/about-us/brand-identity/logo/"
      }
    ]
  },
  "sass": {
    "id": "sass",
    "title": "Sass",
    "canonicalName": "sass",
    "source": "svg-logos",
    "sourceId": "sass",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "sass.svg"
    },
    "file": "sass.svg",
    "rawSha256": "2b617a977c2e54f9d42e32770d7e9bfca55dd2b352b786a2ccefef0a61d1a6d7",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#CC6699",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "sass",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "sass",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "CC-BY-NC-SA-3.0: ",
        "sourceUrl": "https://sass-lang.com/styleguide/brand"
      }
    ]
  },
  "slack": {
    "id": "slack",
    "title": "Slack",
    "canonicalName": "slack",
    "source": "svg-logos",
    "sourceId": "slack",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "slack.svg"
    },
    "file": "slack.svg",
    "rawSha256": "5ec4e28449a610a1d5d41eeb7fca6827c3842113f06586f78833983375bb96e7",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#2D333A",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "slack",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "spotify": {
    "id": "spotify",
    "title": "Spotify",
    "canonicalName": "spotify",
    "source": "svg-logos",
    "sourceId": "spotify",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "spotify.svg"
    },
    "file": "spotify.svg",
    "rawSha256": "9ff4ce1cdd0cca50b13f02d36633e2742d3bad545b1ad2bbe019755d5cf05466",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#1ED760",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "spotify",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://developer.spotify.com/documentation/general/design-and-branding/#using-our-logo"
      }
    ]
  },
  "sqlite": {
    "id": "sqlite",
    "title": "Sqlite",
    "canonicalName": "sqlite",
    "source": "svg-logos",
    "sourceId": "sqlite",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "sqlite.svg"
    },
    "file": "sqlite.svg",
    "rawSha256": "a7d0b26d845c327b9cd7bc58950a90f57ba765b95e70918bb63b714f3e2647af",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#003B57",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "sqlite",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/sqlite/sqlite/blob/43e862723ec680542ca6f608f9963c0993dd7324/art/sqlite370.eps"
      }
    ]
  },
  "supabase": {
    "id": "supabase",
    "title": "Supabase",
    "canonicalName": "supabase",
    "source": "svg-logos",
    "sourceId": "supabase",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "supabase.svg"
    },
    "file": "supabase.svg",
    "rawSha256": "28f11647afda29c6df53696aecb1364e305edee388f498e90d115701f03d6e0c",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#3FCF8E",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "supabase",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/supabase/supabase/blob/4031a7549f5d46da7bc79c01d56be4177dc7c114/packages/common/assets/images/supabase-logo-wordmark--light.svg"
      }
    ]
  },
  "svelte": {
    "id": "svelte",
    "title": "Svelte",
    "canonicalName": "svelte",
    "source": "svg-logos",
    "sourceId": "svelte",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "svelte.svg"
    },
    "file": "svelte.svg",
    "rawSha256": "b7d8d95aedf15a5f31e1effef8c722a549558557641a4f7ea872c26d18a2bbce",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FF3E00",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "svelte",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/sveltejs/branding/blob/c4dfca6743572087a6aef0e109ffe3d95596e86a/svelte-logo.svg"
      }
    ]
  },
  "swift": {
    "id": "swift",
    "title": "Swift",
    "canonicalName": "swift",
    "source": "svg-logos",
    "sourceId": "swift",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "swift.svg"
    },
    "file": "swift.svg",
    "rawSha256": "043348be34e00b790b197eae97701242fb70f68c29ce3011e5cf2e1bda09f4aa",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#F05138",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "swift",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://developer.apple.com/swift/resources/"
      }
    ]
  },
  "tailwindcss": {
    "id": "tailwindcss",
    "title": "Tailwindcss",
    "canonicalName": "tailwindcss",
    "source": "svg-logos",
    "sourceId": "tailwindcss",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "tailwindcss.svg"
    },
    "file": "tailwindcss.svg",
    "rawSha256": "e9eb82b89fcce349b5b0a8e5987cfe3aa38275482ec092430131d5b0083a99d8",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#06B6D4",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "tailwindcss",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://tailwindcss.com/brand"
      }
    ]
  },
  "telegram": {
    "id": "telegram",
    "title": "Telegram",
    "canonicalName": "telegram",
    "source": "svg-logos",
    "sourceId": "telegram",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "telegram.svg"
    },
    "file": "telegram.svg",
    "rawSha256": "a8b87d956a1a43782c8e6880d82a9cab09bee06e6586bf44ed7e693e94714212",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#26A5E4",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "telegram",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://telegram.org/tour/screenshots"
      }
    ]
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "tiktok": {
    "id": "tiktok",
    "title": "Tiktok",
    "canonicalName": "tiktok",
    "source": "svg-logos",
    "sourceId": "tiktok",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "tiktok.svg"
    },
    "file": "tiktok.svg",
    "rawSha256": "3194f81737ac94fd34a72620ddc4e2bcbec440c0a4b6f38d41fb5b59603b1222",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#000000",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "tiktok",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://tiktok.com"
      }
    ]
  },
  "trello": {
    "id": "trello",
    "title": "Trello",
    "canonicalName": "trello",
    "source": "svg-logos",
    "sourceId": "trello",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "trello.svg"
    },
    "file": "trello.svg",
    "rawSha256": "9685243ca3b6675eabfd627630dcfac622af36443da92fe802d840537613ee44",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#0052CC",
    "category": "tools",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "trello",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://atlassian.design/resources/logo-library"
      }
    ]
  },
  "typescript": {
    "id": "typescript",
    "title": "Typescript",
    "canonicalName": "typescript",
    "source": "svg-logos",
    "sourceId": "typescript",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "typescript.svg"
    },
    "file": "typescript.svg",
    "rawSha256": "0d5012916dca2d6ae221264520750b88f531de367cf1214bf9e1e148efc95de4",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#3178C6",
    "category": "languages",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "typescript",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "typescript",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.typescriptlang.org/branding"
      }
    ]
  },
  "ubuntu": {
    "id": "ubuntu",
    "title": "Ubuntu",
    "canonicalName": "ubuntu",
    "source": "svg-logos",
    "sourceId": "ubuntu",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "ubuntu.svg"
    },
    "file": "ubuntu.svg",
    "rawSha256": "170a1450bd6db337d507d055b23d1c2f317a7ce85b966e6be49fb045268e9eae",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#E95420",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "ubuntu",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://design.ubuntu.com/resources"
      }
    ]
  },
  "vercel": {
    "id": "vercel",
    "title": "Vercel",
    "canonicalName": "vercel",
    "source": "svg-logos",
    "sourceId": "vercel",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "vercel.svg"
    },
    "file": "vercel.svg",
    "rawSha256": "264f1074b9cc8f5464478db51016a89f1c1910f4c85c0274558438ff61b7e92d",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#000000",
    "category": "cloud",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "vercel",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://vercel.com/geist/brands"
      }
    ]
  },
  "visualstudiocode": {
    "id": "visualstudiocode",
    "title": "Visual Studio Code",
    "canonicalName": "visualstudiocode",
    "source": "svg-logos",
    "sourceId": "visual-studio-code",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "visualstudiocode.svg"
    },
    "file": "visualstudiocode.svg",
    "rawSha256": "a88ceea75536b26755262d7b030b5c69c11eeed5dd63ca452ef64c78f09b9653",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#3C99D4",
    "category": "tools",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "vscode",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "original-wordmark",
          "plain",
          "plain-wordmark"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      }
    ]
  },
  "vite": {
    "id": "vite",
    "title": "Vite",
    "canonicalName": "vite",
    "source": "svg-logos",
    "sourceId": "vite",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "vite.svg"
    },
    "file": "vite.svg",
    "rawSha256": "9997af486a5949177760a9bd936028d30b66d094496592125a8f66b6ae8d6113",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#9135FF",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "vite",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://github.com/voidzero-dev/community-design-resources/blob/55902097229cf01cf2a4ceb376f992f5cf306756/brand-assets/vite/vite-icon-color-bracketless.svg"
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "webpack": {
    "id": "webpack",
    "title": "Webpack",
    "canonicalName": "webpack",
    "source": "svg-logos",
    "sourceId": "webpack",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "webpack.svg"
    },
    "file": "webpack.svg",
    "rawSha256": "9001ef4a29ac47ec0fb03b6a10b8493eb7d2d0f2e8a64feef3b3983ea84dfdf5",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#8DD6F9",
    "category": "frontend",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
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
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "webpack",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "custom: https://js.foundation/about/governance/trademark-policy",
        "sourceUrl": "https://webpack.js.org/branding"
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
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true
  },
  "x": {
    "id": "x",
    "title": "X",
    "canonicalName": "x",
    "source": "svg-logos",
    "sourceId": "x",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "x.svg"
    },
    "file": "x.svg",
    "rawSha256": "7e77f0b6868c3458c9f6e8ba4a59ee577286476227831376e6e5aa8d6d56cdec",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#000000",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "devicon",
        "sourceId": "twitter",
        "sourceVersion": "2.17.0",
        "variants": [
          "original",
          "plain"
        ],
        "license": "Devicon (MIT License) with brand trademark guidelines",
        "sourceUrl": "https://devicon.dev/"
      },
      {
        "source": "simple-icons",
        "sourceId": "x",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://x.com"
      }
    ]
  },
  "youtube": {
    "id": "youtube",
    "title": "Youtube",
    "canonicalName": "youtube",
    "source": "svg-logos",
    "sourceId": "youtube",
    "sourceVersion": "1.2.13",
    "variant": "default",
    "variants": {
      "default": "youtube.svg"
    },
    "file": "youtube.svg",
    "rawSha256": "feff0ecc7b84ad39d19e5cd1c92ac7f282d526950f24a46f3c8d9cb25fd4548f",
    "license": "CC0 1.0 Universal / Gil Barbara SVG Logos Archive",
    "sourceUrl": "https://github.com/gilbarbara/logos",
    "brandColor": "#FF0000",
    "category": "social",
    "xmlValid": true,
    "sourceTrusted": true,
    "canonicalResolved": true,
    "integrityVerified": true,
    "renderable": true,
    "verificationStatus": "verified",
    "verified": true,
    "alternativeSources": [
      {
        "source": "simple-icons",
        "sourceId": "youtube",
        "sourceVersion": "16.29.0",
        "variants": [
          "default"
        ],
        "license": "Simple Icons (CC0 1.0 Universal)",
        "sourceUrl": "https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-colors"
      }
    ]
  }
};
