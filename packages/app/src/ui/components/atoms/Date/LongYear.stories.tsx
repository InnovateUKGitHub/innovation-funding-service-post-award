import type { Meta, StoryObj } from "@storybook/react";

import { LongYear } from "./date";

const meta: Meta<typeof LongYear> = {
  title: "IFSPA Renderer/Date & Time/Date/Long Year",
  tags: ["ifspa/renderer"],
  component: LongYear,
};

export default meta;

type Story = StoryObj<typeof LongYear>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 4, 1)),
  },
};
