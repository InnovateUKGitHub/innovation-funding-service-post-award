import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "React Hook Form/Label",
  component: Label,
};

export default meta;

type Story = StoryObj<typeof Label>;

export const StandardLabel: Story = {
  args: {
    htmlFor: "fruit-input",
    children: "A Label",
  },
};
