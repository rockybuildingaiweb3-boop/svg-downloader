export interface ComparisonCase {
  id: string;
  iconId: string;
  title: string;
  aiFixture: string;
  aiLabel: string;
  officialFile: string;
  officialSource: string;
  description: string;
  geometricClaims: {
    feature: string;
    syntheticObservation: string;
    canonicalOfficialSpec: string;
  }[];
}

export const COMPARISON_CASES: ComparisonCase[] = [
  {
    id: 'openai',
    iconId: 'openai',
    title: 'OpenAI (Swirl Brandmark)',
    aiFixture: '/comparison/fixtures/openai-approximation.svg',
    aiLabel: 'Synthetic LLM/Diffusion Fixture (Illustrative Approximation)',
    officialFile: 'openai.svg',
    officialSource: 'Wikimedia Verified Archive / OpenAI Corporate Asset',
    description: 'OpenAI official vector features a mathematically rigorous 6-fold rotational symmetry topology with open intertwined spiral contours.',
    geometricClaims: [
      {
        feature: 'Rotational Symmetry',
        syntheticObservation: 'Generative models often output 5-point star polygons or uneven 7-facet shapes.',
        canonicalOfficialSpec: 'Strict 60° 6-fold rotational symmetry with identical sub-paths.'
      },
      {
        feature: 'Spiral Topology',
        syntheticObservation: 'Paths frequently cross over without interior whitespace channels or form solid silhouettes.',
        canonicalOfficialSpec: 'Continuous ribbon geometry with uniform 1.2px minimum gap clearance.'
      },
      {
        feature: 'Edge Sharpness at 16px',
        syntheticObservation: 'Wobbly control points cause blurry antialiasing artifacts at standard UI icon sizes.',
        canonicalOfficialSpec: 'Crisp bezier curve tangencies optimized for sub-pixel rasterization.'
      }
    ]
  },
  {
    id: 'react',
    iconId: 'react',
    title: 'React (Orbital Atom Nucleus)',
    aiFixture: '/comparison/fixtures/react-approximation.svg',
    aiLabel: 'Synthetic LLM/Diffusion Fixture (Illustrative Approximation)',
    officialFile: 'react.svg',
    officialSource: 'Devicon / Meta Open Source',
    description: 'React official vector mark consists of 3 precision ellipses precisely rotated at 60° increments around a centered atomic nucleus.',
    geometricClaims: [
      {
        feature: 'Orbital Inclination',
        syntheticObservation: 'AI frequently prompts concentric circular ripples instead of angled orbits.',
        canonicalOfficialSpec: 'Three identical ellipses rotated at precisely 0°, 60°, and 120°.'
      },
      {
        feature: 'Focal Ratio',
        syntheticObservation: 'Aspect ratio of semi-major to semi-minor axis fluctuates widely.',
        canonicalOfficialSpec: 'Strict 2.6:1 aspect ratio preserving uniform stroke thickness.'
      },
      {
        feature: 'Central Nucleus',
        syntheticObservation: 'Center circle is often offset or merged into overlapping orbit strokes.',
        canonicalOfficialSpec: 'Independent concentric disk element positioned at exact coordinate (12, 12).'
      }
    ]
  },
  {
    id: 'apple',
    iconId: 'apple',
    title: 'Apple (Monochrome Silhouette)',
    aiFixture: '/comparison/fixtures/apple-approximation.svg',
    aiLabel: 'Synthetic LLM/Diffusion Fixture (Illustrative Approximation)',
    officialFile: 'apple.svg',
    officialSource: 'Simple Icons (CC0) / Apple Inc. Trademark Guidelines',
    description: 'The Apple silhouette is defined by golden ratio arcs with continuous second-derivative curvature.',
    geometricClaims: [
      {
        feature: 'Leaf Inclination',
        syntheticObservation: 'Leaf is frequently drawn as a symmetrical teardrop or attached directly to the stem.',
        canonicalOfficialSpec: 'Floating asymmetrical leaf detached by exact offset, angled at 30°.'
      },
      {
        feature: 'Bite Mark Curvature',
        syntheticObservation: 'Bite radius is often an un-tangented circular cutout creating jagged seams.',
        canonicalOfficialSpec: 'Smooth G2-continuous bezier blend with no visible curvature discontinuity.'
      },
      {
        feature: 'Bottom Dimple',
        syntheticObservation: 'Base is rendered flat or with exaggerated double lobes.',
        canonicalOfficialSpec: 'Subtle concave valley mathematically balanced against the top indent.'
      }
    ]
  },
  {
    id: 'microsoft',
    iconId: 'microsoft',
    title: 'Microsoft (4-Color Corporate Squares)',
    aiFixture: '/comparison/fixtures/microsoft-approximation.svg',
    aiLabel: 'Synthetic LLM/Diffusion Fixture (Illustrative Approximation)',
    officialFile: 'microsoft.svg',
    officialSource: 'Official Corporate Archive / Wikimedia',
    description: 'Microsoft 4-square vector represents the company products (Windows, Office, Xbox, Surface) with exact coordinate tiles.',
    geometricClaims: [
      {
        feature: 'Corner Radius',
        syntheticObservation: 'AI often applies modern rounded corners (rx=2, rx=4) to the tiles.',
        canonicalOfficialSpec: 'Strictly zero corner radius (sharp 90° rectangular tiles).'
      },
      {
        feature: 'Grid Spacing',
        syntheticObservation: 'Spacing between horizontal and vertical channels is often uneven.',
        canonicalOfficialSpec: 'Exact 1-unit uniform channel spacing separating all 4 colored tiles.'
      },
      {
        feature: 'Color Codes',
        syntheticObservation: 'AI prompts arbitrary primary red/green/blue/yellow values.',
        canonicalOfficialSpec: 'Precise official pantone values: #F35325, #81BC06, #05A6F0, #FFBA08.'
      }
    ]
  },
  {
    id: 'amazon',
    iconId: 'amazon',
    title: 'Amazon (Smile Brandmark)',
    aiFixture: '/comparison/fixtures/amazon-approximation.svg',
    aiLabel: 'Synthetic LLM/Diffusion Fixture (Illustrative Approximation)',
    officialFile: 'amazon.svg',
    officialSource: 'Wikimedia Verified Archive / Amazon Brandmark',
    description: 'Amazon smile curve connects A to Z in the brand name with a characteristic dimple arrow.',
    geometricClaims: [
      {
        feature: 'Arrow Barb Orientation',
        syntheticObservation: 'Arrow head barb is often flipped or detached from the stroke path.',
        canonicalOfficialSpec: 'Barb tilts slightly upward with right-side anchor curve.'
      },
      {
        feature: 'Arc Thickness Profile',
        syntheticObservation: 'Smile curve is rendered with a uniform fixed stroke weight.',
        canonicalOfficialSpec: 'Tapered path varying in thickness from narrow left terminal to wider center.'
      },
      {
        feature: 'Brand Metadata Distinction',
        syntheticObservation: 'Naive scripts recolor the path to #FF9900 without preserving authentic dark mark.',
        canonicalOfficialSpec: 'Raw canonical path retains official #111827 fill while metadata registers #FF9900.'
      }
    ]
  }
];
