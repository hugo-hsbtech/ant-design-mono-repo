import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Form, Slider } from '@repo/design-system';

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: { style: { color: '#f50' }, label: '100°C' },
};

const meta: Meta<typeof Slider> = {
  title: 'Primitives/Slider',
  component: Slider,
  args: {
    defaultValue: 30,
    onChange: fn(),
    // The slider handle (role="slider") needs an accessible name for the axe gate.
    ariaLabelForHandle: 'Volume',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Volume">
        <Slider {...args} />
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Basic: Story = {};

// Range/marks/vertical use their own props (not the single-value `args`) to keep
// the single|range discriminated union unambiguous for TypeScript.
export const Range: Story = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Price range">
        <Slider
          range
          defaultValue={[20, 60]}
          ariaLabelForHandle={['Minimum price', 'Maximum price']}
        />
      </Form.Item>
    </Form>
  ),
};

export const WithMarks: Story = {
  // The 100°C mark uses a decorative orange (#f50) below AA contrast — intentional
  // demo of custom mark styling, so skip the contrast rule here.
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Temperature">
        <Slider marks={marks} defaultValue={37} ariaLabelForHandle="Temperature" />
      </Form.Item>
    </Form>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Form layout="vertical">
      <Form.Item label="Level">
        <div style={{ height: 240 }}>
          <Slider vertical defaultValue={40} ariaLabelForHandle="Level" />
        </div>
      </Form.Item>
    </Form>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Disabled">
        <Slider disabled defaultValue={30} ariaLabelForHandle="Disabled slider" />
      </Form.Item>
    </Form>
  ),
};
