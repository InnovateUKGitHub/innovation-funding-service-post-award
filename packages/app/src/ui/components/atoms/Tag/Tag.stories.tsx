import type { Meta, StoryObj } from "@storybook/react";

import { Tag } from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "GOV.UK Components/Tag",
  component: Tag,
  argTypes: {
    type: {
      description: "The tint of the tag.",
    },
    children: {
      description: "The text to display",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Primary: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Active",
  },
};
export const Solid: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Active",
  },
};
export const Red: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Rejected",
    type: "red",
  },
};
export const Blue: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Pending",
    type: "blue",
  },
};
export const Green: Story = {
  tags: ["govuk/component"],
  args: {
    children: "New",
    type: "green",
  },
};
export const Yellow: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Delayed",
    type: "yellow",
  },
};
export const Grey: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Inactive",
    type: "grey",
  },
};
export const Turquoise: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Active",
    type: "turquoise",
  },
};
export const Purple: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Received",
    type: "purple",
  },
};
export const Pink: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Sent",
    type: "pink",
  },
};
export const Orange: Story = {
  tags: ["govuk/component"],
  args: {
    children: "Declined",
    type: "orange",
  },
};
