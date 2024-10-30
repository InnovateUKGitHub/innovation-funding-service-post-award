import type { Meta, StoryObj } from "@storybook/react";

import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "React Hook Form/TextInput",
  component: TextInput,
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const StandardTextInput: Story = {
  args: {
    placeholder: "write something",
  },
};

export const PrefixTextInput: Story = {
  args: {
    placeholder: "write something",
    prefix: "£",
  },
};

export const SuffixTextInput: Story = {
  args: {
    placeholder: "write something",
    suffix: "moonbeams",
  },
};
