import type { Meta, StoryObj } from "@storybook/react";

import { FullDateTime } from "./date";

const meta: Meta<typeof FullDateTime> = {
  title: "IFSPA Renderer/Date & Time/Date + Time/Full Date Time",
  tags: ["ifspa/renderer"],
  component: FullDateTime,
};

export default meta;

type Story = StoryObj<typeof FullDateTime>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 25)),
  },
};
