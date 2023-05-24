import type { Meta, StoryObj } from "@storybook/react";

import { P } from "./Typography";

const meta: Meta<typeof P> = {
  title: "React Hook Form/Typography",
  component: P,
};

export default meta;

type Story = StoryObj<typeof P>;

export const StandardP: Story = {
  args: {
    children: "A standard Paragraph",
  },
};

export const BoldP: Story = {
  args: {
    children: "A bold Paragraph",
    bold: true,
  },
};

export const MultilineP: Story = {
  args: {
    children:
      "Brühl received its town privileges in 1285. From 1567 on, the city\nof Brühl was the official residence of the Prince Bishops of\nCologne. In the 18th century the Prince Bishop Clemens August\nreplaced a former ruined castle and built the Augustusburg and\nFalkenlust palaces near the city center. Today, both are listed as\nUNESCO World Heritage Sites because of their outstanding\nrococo architecture. Until 1990 Augustusburg Palace was used\nby the federal government to receive foreign heads of states\nvisiting West Germany.",
    multiline: true,
  },
};
