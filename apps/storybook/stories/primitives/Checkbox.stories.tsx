import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { CheckboxProps } from '@repo/design-system';
import { Checkbox, Space } from '@repo/design-system';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  args: {
    children: 'Accept terms',
    onChange: fn(),
  },
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Single: Story = {};

export const Disabled: Story = {
  render: (args) => (
    <Space direction="vertical">
      <Checkbox {...args} disabled>
        Disabled unchecked
      </Checkbox>
      <Checkbox {...args} disabled defaultChecked>
        Disabled checked
      </Checkbox>
    </Space>
  ),
};

export const Group: Story = {
  render: () => (
    <Checkbox.Group
      options={options}
      defaultValue={['apple']}
      onChange={fn()}
      aria-label="Fruit selection"
    />
  ),
};

export const Indeterminate: Story = {
  render: () => {
    const Demo = () => {
      const all = options.map((o) => o.value);
      const [checked, setChecked] = useState<string[]>(['apple']);
      const checkAll = checked.length === all.length;
      const indeterminate = checked.length > 0 && checked.length < all.length;
      const onCheckAll: CheckboxProps['onChange'] = (e) =>
        setChecked(e.target.checked ? all : []);
      return (
        <Space direction="vertical">
          <Checkbox
            indeterminate={indeterminate}
            checked={checkAll}
            onChange={onCheckAll}
          >
            Check all
          </Checkbox>
          <Checkbox.Group
            options={options}
            value={checked}
            onChange={(vals) => setChecked(vals as string[])}
            aria-label="Fruit selection"
          />
        </Space>
      );
    };
    return <Demo />;
  },
};

export const ToggleInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: /accept terms/i });
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalled();
    await expect(checkbox).toBeChecked();
  },
};
