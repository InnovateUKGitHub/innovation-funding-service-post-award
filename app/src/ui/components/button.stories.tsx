import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./styledButton";

const meta: Meta<typeof Button> = {
  title: "GOV.UK Components/Button",
  component: Button,
  argTypes: {
    styling: {
      defaultValue: "Primary",
      description: "The apperance of the button",
    },
    disabled: {
      defaultValue: false,
      description: "Whether the button is disabled",
      type: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  tags: ["govuk/component"],
  args: {
    styling: "Primary",
    children: "Return to Desktop",
  },
};

export const PrimaryButton: Story = {
  tags: ["govuk/component"],
  args: {
    styling: "Primary",
    children: "A primary button",
  },
};

export const DisabledButton: Story = {
  tags: ["govuk/component"],
  args: {
    styling: "Primary",
    disabled: true,
    children: "A disabled button",
  },
};

export const SecondaryButton: Story = {
  tags: ["govuk/component"],
  args: {
    styling: "Secondary",
    children: "A secondary button",
  },
};

export const WarningButton: Story = {
  tags: ["govuk/component"],
  args: {
    styling: "Warning",
    children: "A warning button",
  },
};

export const LinkButton: Story = {
  tags: ["ifspa/component"],
  args: {
    styling: "Link",
    children: "A link button",
  },
};
