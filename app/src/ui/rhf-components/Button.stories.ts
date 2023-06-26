import type { Meta, StoryObj } from "@storybook/react";

import { SubmitButton } from "./Button";

const meta: Meta<typeof SubmitButton> = {
  title: "React Hook Form/Submit Button",
  component: SubmitButton,
};

export default meta;

type Story = StoryObj<typeof SubmitButton>;

export const StandardSubmitButton: Story = {
  args: {
    name: "button_default",
    children: "Submit and return to summary",
  },
};
