import React from 'react';
import type { IconName } from './index';

export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  basePath?: string;
}

/**
 * Universal Production React Icon Component
 * Loads authentic canonical raw SVG assets without bundle bloat
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = '',
  basePath = '/icons',
  style,
  alt,
  ...rest
}) => {
  return (
    <img
      src={`${basePath}/${name}.svg`}
      alt={alt || `${name} icon`}
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  );
};

export default Icon;
