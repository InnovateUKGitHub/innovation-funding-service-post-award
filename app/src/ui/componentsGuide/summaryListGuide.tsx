import React from "react";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { LineBreakList } from "@ui/components/renderers";
import { IGuide } from "@framework/types";

export const summaryListGuide: IGuide = {
  name: "Summary list",
  options: [
    {
      name: "Single, with action",
      comments: "Renders information in a summary list, with action",
      example: `
        <SummaryList>
          <SummaryListItem label="Name" content="Sarah Philips" action={<a href="#Name">Change</a>} qa="dob"/>
        </SummaryList>`,
      render: () => (
        <SummaryList qa="list-example">
          <SummaryListItem label="Name" content="Sarah Philips" action={<a href="#Name">Change</a>} qa="dob"/>
        </SummaryList>
      )
    },
    {
      name: "Single, with no action",
      comments: "Renders information in a summary list, with no action",
      example: `
        <SummaryList qa="list-example">
          <SummaryListItem label="Date of birth" content="5 January 1978" />
        </SummaryList>`,
      render: () => (
        <SummaryList qa="list-example">
          <SummaryListItem label="Date of birth" content="5 January 1978" qa="dob"/>
        </SummaryList>
      )
    },
    {
      name: "Single, with no action, no borders",
      comments: "Renders information in a summary list, with no action or borders",
      example: `
        <SummaryList noBorders={true} qa="list-example">
          <SummaryListItem label="Contact details" content="07700 900457" qa="contact"/>
        </SummaryList>`,
      render: () => (
        <SummaryList noBorders={true} qa="list-example">
          <SummaryListItem label="Contact details" content="07700 900457" qa="contact"/>
        </SummaryList>
      )
    },
    {
      name: "Single, with multiple lines of information",
      comments: "Renders list item with multiple lines of information",
      example: `
        <SummaryList qa="list-example">
          <SummaryListItem label="Contact details" content={<LineBreakList items={["Item 1", "Item 2", "Item 3"]}/>} qa="contact"/>
        </SummaryList>
      `,
      render: () => (
        <SummaryList qa="list-example">
          <SummaryListItem label="Contact details" content={<LineBreakList items={["Item 1", "Item 2", "Item 3"]}/>} qa="contact"/>
        </SummaryList>
      )
    },
    {
      name: "Multiple, with actions",
      comments: "Renders multiple sets of information in a summary list",
      example: `
        <SummaryList qa="list-example">
          <SummaryListItem label="Name" content="Sarah Philips" qa="name" action={<a href="#ChangeName">Change name</a>} />
          <SummaryListItem label="Date of birth" content="5 January 1978" qa="dob" action={<a href="#ChangeBirth">Change date of birth</a>} />
          <SummaryListItem label="Contact information" content="72 Guild Street" qa="contact" action={<a href="#ChangeContact">Change contact information</a>} />
        </SummaryList>`,
      render: () => (
        <SummaryList qa="list-example">
          <SummaryListItem label="Name" content="Sarah Philips" qa="name" action={<a href="#ChangeName">Change name</a>} />
          <SummaryListItem label="Date of birth" content="5 January 1978" qa="dob" action={<a href="#ChangeBirth">Change date of birth</a>} />
          <SummaryListItem label="Contact information" content="72 Guild Street" qa="contact" action={<a href="#ChangeContact">Change contact information</a>} />
        </SummaryList>
      )
    },
  ]
};
