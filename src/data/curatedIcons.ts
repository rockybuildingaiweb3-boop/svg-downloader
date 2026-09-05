import rawIcons from './curatedIcons.json';
import { IconCategory, IconItem } from '../types';

export const CURATED_ICONS: IconItem[] = rawIcons as IconItem[];

export const CATEGORIES: { id: IconCategory; label: string; count?: number }[] = [
  { id: 'all', label: '全部图标' },
  { id: 'bigtech', label: '科技大厂 (Big Tech)' },
  { id: 'ai', label: 'AI与大模型 (AI & LLMs)' },
  { id: 'frontend', label: '前端与框架 (Frontend)' },
  { id: 'languages', label: '语言与运行时 (Languages)' },
  { id: 'cloud', label: '云原生与数据库 (Cloud & DB)' },
  { id: 'tools', label: '设计与工具 (Tools)' },
  { id: 'social', label: '社交与媒体 (Social)' }
];
