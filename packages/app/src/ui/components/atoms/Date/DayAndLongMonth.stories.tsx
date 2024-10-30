import type { Meta, StoryObj } from "@storybook/react";

import { DayAndLongMonth } from "./date";

const meta: Meta<typeof DayAndLongMonth> = {
  title: "IFSPA Renderer/Date & Time/Date/Day + Long Month",
  tags: ["ifspa/renderer"],
  component: DayAndLongMonth,
};

export default meta;

type Story = StoryObj<typeof DayAndLongMonth>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 1)),
  },
};
