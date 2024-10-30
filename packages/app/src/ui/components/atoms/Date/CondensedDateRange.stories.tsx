import type { Meta, StoryObj } from "@storybook/react";

import { CondensedDateRange } from "./date";

const meta: Meta<typeof CondensedDateRange> = {
  title: "IFSPA Renderer/Date & Time/Range/Condensed Date Range",
  tags: ["ifspa/renderer"],
  component: CondensedDateRange,
};

export default meta;

type Story = StoryObj<typeof CondensedDateRange>;

export const Primary: Story = {
  args: {
    start: new Date(Date.UTC(2023, 4, 1)),
    end: new Date(Date.UTC(2023, 6, 2)),
  },
};
export const SameYear: Story = {
  args: {
    start: new Date(Date.UTC(1995, 5, 1)),
    end: new Date(Date.UTC(1995, 7, 2)),
  },
};
export const DifferentYears: Story = {
  args: {
    start: new Date(Date.UTC(1942, 5, 1)),
    end: new Date(Date.UTC(1944, 7, 2)),
  },
};
