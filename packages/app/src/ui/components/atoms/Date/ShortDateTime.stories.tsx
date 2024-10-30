import type { Meta, StoryObj } from "@storybook/react";

import { ShortDateTime } from "./date";

const meta: Meta<typeof ShortDateTime> = {
  title: "IFSPA Renderer/Date & Time/Date + Time/Short Date Time",
  tags: ["ifspa/renderer"],
  component: ShortDateTime,
};

export default meta;

type Story = StoryObj<typeof ShortDateTime>;

export const Primary: Story = {
  args: {
    value: new Date(Date.UTC(2023, 11, 25)),
  },
};
