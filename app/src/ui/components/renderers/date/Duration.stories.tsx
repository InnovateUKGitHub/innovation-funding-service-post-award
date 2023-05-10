import type { Meta, StoryObj } from "@storybook/react";

import { Duration } from "./date";

const meta: Meta<typeof Duration> = {
  title: "IFSPA Renderer/Date & Time/Length/Duration",
  tags: ["ifspa/renderer"],
  component: Duration,
};

export default meta;

type Story = StoryObj<typeof Duration>;

export const Primary: Story = {
  args: {
    startDate: new Date(Date.UTC(2023, 4, 1)),
    endDate: new Date(Date.UTC(2023, 6, 2)),
  },
};
export const SameYear: Story = {
  args: {
    startDate: new Date(Date.UTC(1995, 5, 1)),
    endDate: new Date(Date.UTC(1995, 7, 2)),
  },
};
export const DifferentYears: Story = {
  args: {
    startDate: new Date(Date.UTC(1942, 5, 1)),
    endDate: new Date(Date.UTC(1944, 7, 2)),
  },
};
