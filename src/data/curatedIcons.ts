import { IconCategory, IconItem } from '../types';
import { CURATED_ICONS, CANONICAL_CATALOG, ICON_MAP } from './catalog';

export { CURATED_ICONS, CANONICAL_CATALOG, ICON_MAP };

export const CATEGORIES: { id: IconCategory; label: string; count?: number }[] = [
  { id: 'all', label: '全部图标' },
  { id: 'mainstream', label: '行业主流 (Mainstream)' },
  { id: 'brands', label: '全球品牌 (Brands)' },
  { id: 'technologies', label: '核心技术 (Technologies)' },
  { id: 'apps', label: '核心应用 (Apps)' },
  { id: 'cloud', label: '云原生 (Cloud)' },
  { id: 'databases', label: '数据库 (Databases)' },
  { id: 'developer-tools', label: '开发工具 (Dev Tools)' },
  { id: 'design', label: '设计工具 (Design)' },
  { id: 'social', label: '社交媒体 (Social)' },
  { id: 'gaming', label: '游戏娱乐 (Gaming)' },
  { id: 'web3', label: 'Web3与加密 (Crypto)' },
  { id: 'custom', label: '官方特例 (Official)' }
];
