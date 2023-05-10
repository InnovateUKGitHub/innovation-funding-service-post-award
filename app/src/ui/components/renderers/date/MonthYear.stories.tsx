import type { Meta, StoryObj } from "@storybook/react";

import { MonthYear } from "./date";

const meta: Meta<typeof MonthYear> = {
  title: "IFSPA Renderer/Date & Time/Date/Month + Year",
  tags: ["ifspa/renderer"],
  component: MonthYear,
};

export default meta;

type Story = StoryObj<typeof MonthYear>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 25)),
  },
};
