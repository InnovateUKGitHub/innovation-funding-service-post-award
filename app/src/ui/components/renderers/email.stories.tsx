import type { Meta, StoryObj } from "@storybook/react";

import { Email } from "./email";

const meta: Meta<typeof Email> = {
  title: "IFSPA Renderer/Email",
  tags: ["ifspa/renderer"],
  component: Email,
};

export default meta;

type Story = StoryObj<typeof Email>;

export const Primary: Story = {
  args: {
    children: "nicole.hedges@iuk.ukri.org",
  },
};
export const VeryLongAddress: Story = {
  name: "Very long E-Mail Address",
  args: {
    children:
      "thequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydog@iuk.ukri.org",
  },
};
