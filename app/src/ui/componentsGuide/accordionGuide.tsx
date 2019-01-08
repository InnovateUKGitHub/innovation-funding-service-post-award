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
      example:`
      <Accordion>
        <AccordionItem title=\"Section 1\">
            <DocumentList documents={documents} qa=\"documentList\"/>
        </AccordionItem>
      </Accordion>`,
      render: () => (
        <Accordion>
          <AccordionItem title="Section 1">
            <DocumentList documents={documents} qa="documentList"/>
          </AccordionItem>
        </Accordion>
      )
    },
    {
      name: "Multiple accordions",
      comments: "Renders multiple accordions items",
      example:`
      <Accordion>
        <AccordionItem title=\"Section 1\">
            <DocumentList documents={documents} qa=\"documentList\"/>
        </AccordionItem>
        <AccordionItem title=\"Section 2\">
            <ProjectMember member={{name: \"Ms A Bloggs\", email: \"a.bloggs@tem\", role: \"Team lead\"}} qa=\"teamMember\"/>
        </AccordionItem>
      </Accordion>`,
      render: () => (
        <Accordion>
          <AccordionItem title="Section 1">
            <DocumentList documents={documents} qa="documentList"/>
          </AccordionItem>
          <AccordionItem title="Section 2">
            <ProjectMember member={{name: "Ms A Bloggs", email: "a.bloggs@test.com", roleName: "Team lead"}} qa="teamMember"/>
          </AccordionItem>
        </Accordion>
      )
    },
  ]
};
