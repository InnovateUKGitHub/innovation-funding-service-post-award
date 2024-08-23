import type { Meta, StoryObj } from "@storybook/react";

import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "GOV.UK Components/Footer",
  component: Footer,
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Primary: Story = {};