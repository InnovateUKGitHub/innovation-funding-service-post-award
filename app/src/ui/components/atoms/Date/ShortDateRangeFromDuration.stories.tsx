import type { Meta, StoryObj } from "@storybook/react";

import { ShortDateRangeFromDuration } from "./date";

const meta: Meta<typeof ShortDateRangeFromDuration> = {
  title: "IFSPA Renderer/Date & Time/Range/Short Date Range from Duration",
  tags: ["ifspa/renderer"],
  component: ShortDateRangeFromDuration,
};

export default meta;

type Story = StoryObj<typeof ShortDateRangeFromDuration>;

export const Primary: Story = {
  args: {
    startDate: new Date(Date.UTC(2023, 4, 1)),
    months: 2,
  },
};
export const SameYear: Story = {
  args: {
    startDate: new Date(Date.UTC(1995, 5, 1)),
    months: 2,
  },
};
export const SameMonth: Story = {
  args: {
    startDate: new Date(Date.UTC(1995, 5, 1)),
    months: 0,
  },
};
export const DifferentYears: Story = {
  args: {
    startDate: new Date(Date.UTC(1942, 5, 1)),
    months: 14,
  },
};
