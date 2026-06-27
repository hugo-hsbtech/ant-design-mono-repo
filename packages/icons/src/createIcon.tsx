import Icon from '@ant-design/icons';
import type { ComponentProps, ComponentType } from 'react';

export type IconProps = Omit<ComponentProps<typeof Icon>, 'component'>;

/**
 * Wrap a raw SVG component as an antd-compatible icon, so custom brand icons
 * behave exactly like `@ant-design/icons` (size, color, rotate inherit from
 * the antd icon context).
 */
export function createIcon(svg: ComponentType): ComponentType<IconProps> {
  const Wrapped = (props: IconProps) => <Icon component={svg} {...props} />;
  Wrapped.displayName = `BrandIcon(${svg.displayName || svg.name || 'Svg'})`;
  return Wrapped;
}
