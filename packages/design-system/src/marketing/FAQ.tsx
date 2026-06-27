import { Collapse, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { Section } from './Section';

const { Title } = Typography;

export interface FAQItem {
  question: ReactNode;
  answer: ReactNode;
}

export interface FAQProps {
  heading?: ReactNode;
  items: FAQItem[];
}

/** Frequently-asked-questions accordion. */
export function FAQ({ heading = 'Perguntas frequentes', items }: FAQProps) {
  const { token } = theme.useToken();
  return (
    <Section maxWidth={800}>
      {heading && (
        <Title level={2} style={{ textAlign: 'center', marginBottom: token.marginXL }}>
          {heading}
        </Title>
      )}
      <Collapse
        accordion
        bordered={false}
        items={items.map((item, i) => ({
          key: String(i),
          label: item.question,
          children: item.answer,
        }))}
      />
    </Section>
  );
}
