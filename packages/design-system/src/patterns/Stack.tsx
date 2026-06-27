import { Flex, type FlexProps } from 'antd';
import { forwardRef } from 'react';

export interface StackProps extends Omit<FlexProps, 'vertical'> {
  /** Layout direction. Defaults to vertical. */
  direction?: 'vertical' | 'horizontal';
}

/**
 * Thin, token-aware wrapper over antd `Flex`. Use `gap` with antd's size
 * tokens (`small | middle | large` or a number) instead of hardcoded spacing.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction = 'vertical', gap = 'middle', ...rest },
  ref,
) {
  return <Flex ref={ref} vertical={direction === 'vertical'} gap={gap} {...rest} />;
});
