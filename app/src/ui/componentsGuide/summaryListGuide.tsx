import React from "react";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";

export const summaryListGuide: IGuide = {
  name: "Summary list",
  options: [
    {
      name: "Single, with action",
      comments: "Renders information in a summary list, with action",
      example: `
        <SummaryList>
          <SummaryListItem label="Name" content="Sarah Philips" action={<a href="#Name">Change</a>} />
        </SummaryList>`,
      render: () => (
        <SummaryList>
          <SummaryListItem label="Name" content="Sarah Philips" action={<a href="#Name">Change</a>} />
        </SummaryList>
      )
    },
    {
      name: "Single, with no action",
      comments: "Renders information in a summary list, with no action",
      example: `
        <SummaryList>
          <SummaryListItem label="Date of birth" content="5 January 1978" />
        </SummaryList>`,
      render: () => (
        <SummaryList>
          <SummaryListItem label="Date of birth" content="5 January 1978" />
        </SummaryList>
      )
    },
    {
      name: "Single, with no action, no borders",
      comments: "Renders information in a summary list, with no action or borders",
      example: `
        <SummaryList noBorders={true}>
          <SummaryListItem label="Contact details" content="07700 900457"/>
        </SummaryList>`,
      render: () => (
        <SummaryList noBorders={true}>
          <SummaryListItem label="Contact details" content="07700 900457" />
        </SummaryList>
      )
    },
    {
      name: "Multiple, with actions",
      comments: "Renders multiple sets of information in a summary list",
      example: `
        <SummaryList>
          <SummaryListItem label="Name" content="Sarah Philips" action={<a href="#ChangeName">Change name</a>} />
          <SummaryListItem label="Date of birth" content="5 January 1978" action={<a href="#ChangeBirth">Change date of birth</a>} />
          <SummaryListItem label="Contact information" content="72 Guild Street" action={<a href="#ChangeContact">Change contact information</a>} />
        </SummaryList>`,
      render: () => (
        <SummaryList>
          <SummaryListItem label="Name" content="Sarah Philips" action={<a href="#ChangeName">Change name</a>} />
          <SummaryListItem label="Date of birth" content="5 January 1978" action={<a href="#ChangeBirth">Change date of birth</a>} />
          <SummaryListItem label="Contact information" content="72 Guild Street" action={<a href="#ChangeContact">Change contact information</a>} />
        </SummaryList>
      )
    }
  ]
};
