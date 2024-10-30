import type { Meta, StoryObj } from "@storybook/react";

import { ShortMonth } from "./date";

const meta: Meta<typeof ShortMonth> = {
  title: "IFSPA Renderer/Date & Time/Date/Short Month",
  tags: ["ifspa/renderer"],
  component: ShortMonth,
};

export default meta;

type Story = StoryObj<typeof ShortMonth>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 1)),
  },
};
