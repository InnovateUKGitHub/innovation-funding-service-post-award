import type { Meta, StoryObj } from "@storybook/react";

import { FullDate } from "./date";

const meta: Meta<typeof FullDate> = {
  title: "IFSPA Renderer/Date & Time/Date/Full Date",
  tags: ["ifspa/renderer"],
  component: FullDate,
};

export default meta;

type Story = StoryObj<typeof FullDate>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 25)),
  },
};
