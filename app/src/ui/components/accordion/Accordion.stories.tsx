import type { Meta, StoryObj } from "@storybook/react";
import { SimpleString } from "../renderers/simpleString";
import { Accordion } from "./Accordion";
import { AccordionItem } from "./AccordionItem";

const meta: Meta<typeof Accordion> = {
  title: "GOV.UK Components/Accordion",
  component: Accordion,
  tags: ["govuk/experimental"],
  argTypes: {
    qa: {
      description: "Automated testing reference",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Primary: Story = {
  tags: ["govuk/component"],
  render: () => (
    <Accordion>
      <AccordionItem qa="writing-well-for-web" title="Writing well for the web">
        <SimpleString>This is the content for Writing well for the web.</SimpleString>
      </AccordionItem>
      <AccordionItem qa="writing-well-for-specialists" title="Writing well for specialists">
        <SimpleString>This is the content for Writing well for specialists.</SimpleString>
      </AccordionItem>
      <AccordionItem qa="know-your-audience" title="Know your audience">
        <SimpleString>This is the content for Know your audience.</SimpleString>
      </AccordionItem>
      <AccordionItem qa="how-people-read" title="How people read">
        <SimpleString>This is the content for How people read.</SimpleString>
      </AccordionItem>
    </Accordion>
  ),
};

export const SingleAccordion: Story = {
  name: "Single accordion",
  render: () => (
    <Accordion>
      <AccordionItem qa="item-1" title="Test item">
        <SimpleString>Hello world!</SimpleString>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultipleAccordions: Story = {
  name: "Multiple accordions",
  render: () => (
    <Accordion>
      <AccordionItem qa="item-1" title="Test item">
        <SimpleString>Hello world!</SimpleString>
      </AccordionItem>
      <AccordionItem qa="item-2" title="Test item 2">
        <SimpleString>Hello world!</SimpleString>
      </AccordionItem>
    </Accordion>
  ),
};
