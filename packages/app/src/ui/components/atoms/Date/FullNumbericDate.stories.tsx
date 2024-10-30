import type { Meta, StoryObj } from "@storybook/react";

import { FullNumericDate } from "./date";

const meta: Meta<typeof FullNumericDate> = {
  title: "IFSPA Renderer/Date & Time/Date/Full Numberic Date",
  tags: ["ifspa/renderer"],
  component: FullNumericDate,
};

export default meta;

type Story = StoryObj<typeof FullNumericDate>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 25)),
  },
};
