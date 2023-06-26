import type { Meta, StoryObj } from "@storybook/react";

import { Legend } from "./Legend";

const meta: Meta<typeof Legend> = {
  title: "React Hook Form/Legend",
  component: Legend,
};

export default meta;

type Story = StoryObj<typeof Legend>;

export const StandardLabel: Story = {
  args: {
    children: "A Legendary Legend",
    isSubQuestion: false,
  },
};
