import type { Meta, StoryObj } from "@storybook/react";

import { ValidationMessage } from "./ValidationMessage";
import { BrowserRouter } from "react-router-dom";

const meta: Meta<typeof ValidationMessage> = {
  title: "IUK Components/Message Box",
  component: ValidationMessage,
  decorators: [
    Story => {
      return (
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof ValidationMessage>;

export const Primary: Story = {
  args: {
    message: "The quick brown fox jumps over the lazy dog.",
    messageType: "info",
  },
};

export const Markdown: Story = {
  args: {
    message: "Please [ktp](https://ktp-uk.org) your way to victory\n\nPlease decide now.",
    messageType: "info",
    markdown: true,
  },
};

export const Info: Story = {
  args: {
    message: "The quick brown fox jumps over the lazy dog.",
    messageType: "info",
  },
};

export const Error: Story = {
  args: {
    message: "The quick brown fox jumps over the lazy dog.",
    messageType: "error",
  },
};

export const Success: Story = {
  args: {
    message: "The quick brown fox jumps over the lazy dog.",
    messageType: "success",
  },
};

export const Warning: Story = {
  args: {
    message: "The quick brown fox jumps over the lazy dog.",
    messageType: "warning",
  },
};

export const Alert: Story = {
  args: {
    message: "The quick brown fox jumps over the lazy dog.",
    messageType: "alert",
  },
};
