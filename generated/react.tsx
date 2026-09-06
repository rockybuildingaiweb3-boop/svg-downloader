import React from 'react';
import { ICONS, type IconName } from './index';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  title?: string;
}

/**
 * Universal Zero-Dependency Canonical SVG Icon Component for React
 */
export function Icon({ name, size = 24, title, className, ...props }: IconProps) {
  const icon = ICONS[name];
  if (!icon) {
    console.warn(`[IconRegistry] Icon "${name}" not found in canonical registry`);
    return null;
  }

  const assetUrl = `/icons/${icon.file}`;

  return (
    <img
      src={assetUrl}
      alt={title || icon.title || name}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      decoding="async"
      {...(props as any)}
    />
  );
}

export default Icon;
