import type { Meta, StoryObj } from "@storybook/react";

import { Months } from "./date";

const meta: Meta<typeof Months> = {
  title: "IFSPA Renderer/Date & Time/Length/Months",
  tags: ["ifspa/renderer"],
  component: Months,
};

export default meta;

type Story = StoryObj<typeof Months>;

export const Primary: Story = {
  args: {
    months: 11,
  },
};
