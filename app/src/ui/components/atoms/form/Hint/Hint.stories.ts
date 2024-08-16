import type { Meta, StoryObj } from "@storybook/react";

import { Hint } from "./Hint";

const meta: Meta<typeof Hint> = {
  title: "React Hook Form/Hint",
  component: Hint,
};

export default meta;

type Story = StoryObj<typeof Hint>;

export const StandardHint: Story = {
  args: {
    id: "hint-for-my-thing",
    children: "A Hint",
  },
};
