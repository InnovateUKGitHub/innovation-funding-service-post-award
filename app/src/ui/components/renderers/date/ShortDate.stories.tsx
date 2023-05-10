import type { Meta, StoryObj } from "@storybook/react";

import { ShortDate } from "./date";

const meta: Meta<typeof ShortDate> = {
  title: "IFSPA Renderer/Date & Time/Date/Short Date",
  tags: ["ifspa/renderer"],
  component: ShortDate,
};

export default meta;

type Story = StoryObj<typeof ShortDate>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 25)),
  },
};
