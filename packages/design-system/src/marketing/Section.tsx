import { theme } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  /** Max content width in px. */
  maxWidth?: number;
  background?: CSSProperties['background'];
  id?: string;
}

/**
 * Marketing layout primitive: centered, padded content band with consistent
 * vertical rhythm from theme tokens. Shared by all marketing blocks so the
 * landing page and institutional site keep one identity.
 */
export function Section({ children, maxWidth = 1120, background, id }: SectionProps) {
  const { token } = theme.useToken();
  return (
    <section
      id={id}
      style={{
        background,
        paddingBlock: token.paddingLG * 3,
        paddingInline: token.paddingLG,
      }}
    >
      <div style={{ maxWidth, marginInline: 'auto' }}>{children}</div>
    </section>
  );
}
