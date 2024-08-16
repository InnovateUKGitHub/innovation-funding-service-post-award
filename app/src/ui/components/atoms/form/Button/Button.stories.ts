import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "React Hook Form/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const StandardButton: Story = {
  args: {
    name: "button_default",
    children: "Bocchi the Button!!",
  },
};
