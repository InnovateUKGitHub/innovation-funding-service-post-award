import type { Meta, StoryObj } from "@storybook/react";

import { Info } from "./Details";

const meta: Meta<typeof Info> = {
  title: "GOV.UK Components/Details",
  component: Info,
};

export default meta;

type Story = StoryObj<typeof Info>;

export const Primary: Story = {
  args: {
    summary: "Help with nationality",
    children: `We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.`,
  },
};
