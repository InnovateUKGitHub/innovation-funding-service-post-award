import React from "react";
import {Accordion} from "../components/accordion";
import {DocumentList, ProjectMember} from "../components";
import {AccordionItem} from "../components/accordionItem";

const documents = [
  { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1" },
  { link: "https://www.amazon.co.uk/", fileName: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf", id: "2" },
  { link: "https://www.bbc.co.uk/", fileName: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf", id: "3" },
];

export const accordionGuide: IGuide = {
  name: "Accordion",
  options: [
    {
      name: "Single accordion",
      comments: "Renders a single accordion item",
      example:
      "<Accordion>\n" +
      "\t<AccordionItem title=\"Section 1\" content={<DocumentList documents={documents} qa=\"documentList\"/>}/>\n" +
      "</Accordion>",
      render: () => (
        <Accordion>
          <AccordionItem title="Section 1" content={<DocumentList documents={documents} qa="documentList"/>}/>
        </Accordion>
      )
    },
    {
      name: "Multiple accordions",
      comments: "Renders multiple accordions items",
      example:
      "<Accordion>\n" +
      "\t<AccordionItem title=\"Section 1\" content={<DocumentList documents={documents} qa=\"documentList\"/>}/>\n" +
      "\t<AccordionItem title=\"Section 2\" content={<ProjectMember member={{name: \"Ms A Bloggs\", email: \"a.bloggs@test.com\", role: \"Team lead\"}} qa=\"teamMember\"/>}/>\n" +
      "</Accordion>",
      render: () => (
        <Accordion>
          <AccordionItem title="Section 1" content={<DocumentList documents={documents} qa="documentList"/>}/>
          <AccordionItem title="Section 2" content={<ProjectMember member={{name: "Ms A Bloggs", email: "a.bloggs@test.com", role: "Team lead"}} qa="teamMember"/>}/>
        </Accordion>
      )
    },
  ]
};
