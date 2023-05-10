import type { Meta, StoryObj } from "@storybook/react";

import { AccessibilityText } from "./accessibilityText";

const meta: Meta<typeof AccessibilityText> = {
  title: "IFSPA Renderer/Accessibility Text",
  tags: ["ifspa/renderer"],
  component: AccessibilityText,
};

export default meta;

type Story = StoryObj<typeof AccessibilityText>;

export const Primary: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
