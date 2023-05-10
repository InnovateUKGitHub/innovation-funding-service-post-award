import type { Meta, StoryObj } from "@storybook/react";

import { Percentage } from "./percentage";

const meta: Meta<typeof Percentage> = {
  title: "IFSPA Renderer/Percentage",
  tags: ["ifspa/renderer"],
  component: Percentage,
};

export default meta;

type Story = StoryObj<typeof Percentage>;

export const Primary: Story = {
  args: {
    value: 124,
    fractionDigits: 2,
  },
};
export const RoundToZeroDecimalPlaces: Story = {
  args: {
    value: 124.91,
    fractionDigits: 0,
  },
};
export const WholeNumberWithCommas: Story = {
  args: {
    value: 4815162342,
    fractionDigits: 0,
  },
};
