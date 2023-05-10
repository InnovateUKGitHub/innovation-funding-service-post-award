import type { Meta, StoryObj } from "@storybook/react";

import { Currency } from "./currency";

const meta: Meta<typeof Currency> = {
  title: "IFSPA Renderer/Currency",
  tags: ["ifspa/renderer"],
  component: Currency,
};

export default meta;

type Story = StoryObj<typeof Currency>;

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
