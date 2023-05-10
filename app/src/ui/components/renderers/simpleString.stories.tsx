import type { Meta, StoryObj } from "@storybook/react";

import { SimpleString } from "./simpleString";

const meta: Meta<typeof SimpleString> = {
  title: "IFSPA Renderer/SimpleString",
  tags: ["ifspa/renderer"],
  component: SimpleString,
};

export default meta;

type Story = StoryObj<typeof SimpleString>;

export const Primary: Story = {
  args: {
    children: "The quick brown fox\njumps over the lazy dog.",
  },
};

export const Bold: Story = {
  args: {
    children: "Achtung! Das ist nicht numberwang!",
    bold: true,
  },
};

export const Multiline: Story = {
  args: {
    children: "This is a multiline story.\nThis means anytime there is an \\n character,\nthe actual text\nis wrapped.",
    multiline: true,
  },
};
