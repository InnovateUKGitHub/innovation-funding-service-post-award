import type { Meta, StoryObj } from "@storybook/react";

import { Markdown } from "./markdown";

const meta: Meta<typeof Markdown> = {
  title: "IFSPA Renderer/Markdown",
  tags: ["ifspa/renderer"],
  component: Markdown,
  argTypes: {
    value: {
      defaultValue: "The _quick brown fox_ jumps over **the lazy** __dog__.",
      description: "The Markdown/HTML content to render.",
    },
    trusted: {
      defaultValue: false,
      description:
        "Whether to perform a whitelist on allowed HTML tags. Only trust if passing in non-user generated content.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Markdown>;

export const Primary: Story = {
  args: {
    value: "The quick brown fox\njumps over the lazy dog.",
    trusted: false,
  },
};

export const Trusted: Story = {
  args: {
    value: `
# Markdown

A button should appear because it is trusted.  

<button>This button is trusted!</button>
    `,
    trusted: true,
  },
};

export const Untrusted: Story = {
  args: {
    value: `
# Markdown

A button should not appear because it is not trusted.  
Instead, the text content of the button should show.

<button>This button is trusted!</button>
`,
    trusted: false,
  },
};
