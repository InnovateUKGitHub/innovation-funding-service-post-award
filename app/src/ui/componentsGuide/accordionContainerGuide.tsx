import React from "react";
import {AccordionContainer} from "../components/accordionContainer";
import {DocumentList, ProjectMember} from "../components";
import {Accordion} from "../components/accordion";

const documents = [
  { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1" },
  { link: "https://www.amazon.co.uk/", fileName: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf", id: "2" },
  { link: "https://www.bbc.co.uk/", fileName: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf", id: "3" },
];

export const accordionContainerGuide: IGuide = {
  name: "Accordion Container",
  options: [
    {
      name: "Single accordion",
      comments: "Renders a single accordion component in a container",
      example:
      "<AccordionContainer>\n" +
      "\t<Accordion title=\"Section 1\" content={<DocumentList documents={documents} qa=\"documentList\"/>}/>\n" +
      "</AccordionContainer>",
      render: () => (
        <AccordionContainer>
          <Accordion title="Section 1" content={<DocumentList documents={documents} qa="documentList"/>}/>
        </AccordionContainer>
      )
    },
    {
      name: "Multiple accordions",
      comments: "Renders multiple accordions in a container",
      example:
      "<AccordionContainer>\n" +
      "\t<Accordion title=\"Section 1\" content={<DocumentList documents={documents} qa=\"documentList\"/>}/>\n" +
      "\t<Accordion title=\"Section 2\" content={<ProjectMember member={{name: \"Ms A Bloggs\", email: \"a.bloggs@test.com\", role: \"Team lead\"}} qa=\"teamMember\"/>}/>\n" +
      "</AccordionContainer>",
      render: () => (
        <AccordionContainer>
          <Accordion title="Section 1" content={<DocumentList documents={documents} qa="documentList"/>}/>
          <Accordion title="Section 2" content={<ProjectMember member={{name: "Ms A Bloggs", email: "a.bloggs@test.com", role: "Team lead"}} qa="teamMember"/>}/>
        </AccordionContainer>
      )
    },
  ]
};
