import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tag, Space } from '@repo/design-system';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  TwitterOutlined,
} from '@ant-design/icons';

const { CheckableTag } = Tag;

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  args: {
    children: 'Tag',
  },
  argTypes: {
    color: { control: 'text' },
    bordered: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

// These stories intentionally showcase antd's decorative preset/custom tag
// palette, which is not guaranteed to meet WCAG AA contrast. Turn off the axe
// color-contrast rule for them rather than doctoring antd's own colors.
const showcaseColors = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const Default: Story = {};

export const PresetColors: Story = {
  parameters: showcaseColors,
  render: () => (
    <Space wrap>
      {[
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
      ].map((color) => (
        <Tag key={color} color={color}>
          {color}
        </Tag>
      ))}
    </Space>
  ),
};

export const CustomColors: Story = {
  parameters: showcaseColors,
  render: () => (
    <Space wrap>
      <Tag color="#f50">#f50</Tag>
      <Tag color="#2db7f5">#2db7f5</Tag>
      <Tag color="#87d068">#87d068</Tag>
      <Tag color="#108ee9">#108ee9</Tag>
    </Space>
  ),
};

export const Closable: Story = {
  render: () => (
    <Space wrap>
      <Tag closable>Closable</Tag>
      <Tag closable color="blue">
        Closable blue
      </Tag>
      <Tag closable color="error">
        Closable error
      </Tag>
    </Space>
  ),
};

export const WithIcons: Story = {
  parameters: showcaseColors,
  render: () => (
    <Space wrap>
      <Tag icon={<TwitterOutlined />} color="#55acee">
        Twitter
      </Tag>
      <Tag icon={<CheckCircleOutlined />} color="success">
        Success
      </Tag>
      <Tag icon={<SyncOutlined spin />} color="processing">
        Processing
      </Tag>
    </Space>
  ),
};

export const StatusColors: Story = {
  parameters: showcaseColors,
  render: () => (
    <Space wrap>
      <Tag icon={<CheckCircleOutlined />} color="success">
        success
      </Tag>
      <Tag icon={<SyncOutlined spin />} color="processing">
        processing
      </Tag>
      <Tag icon={<CloseCircleOutlined />} color="error">
        error
      </Tag>
      <Tag icon={<ClockCircleOutlined />} color="warning">
        warning
      </Tag>
      <Tag color="default">default</Tag>
    </Space>
  ),
};

const tagOptions = ['Design', 'Engineering', 'Product'];

export const Checkable: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['Design']);
    const toggle = (tag: string, checked: boolean) => {
      setSelected((prev) => (checked ? [...prev, tag] : prev.filter((t) => t !== tag)));
    };
    return (
      <Space wrap>
        {tagOptions.map((tag) => (
          <CheckableTag
            key={tag}
            checked={selected.includes(tag)}
            onChange={(checked) => toggle(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
      </Space>
    );
  },
};
