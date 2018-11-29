import React from "react";
import {Accordion} from "../components/accordion";
import {DocumentList} from "../components";

const documents = [
  { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1" },
  { link: "https://www.amazon.co.uk/", fileName: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf", id: "2" },
  { link: "https://www.bbc.co.uk/", fileName: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf", id: "3" },
];

export const accordionGuide: IGuide = {
  name: "Accordion component",
  options: [
    {
      name: "Single accordion",
      comments: "Renders an accordion component, which is to be placed in an accordion container",
      example: "<Accordion title=\"Section 1\" content={<DocumentList documents={documents} qa=\"documentList\"/>}/>",
      render: () => <Accordion title="Section 1" content={<DocumentList documents={documents} qa="documentList"/>}/>
    }
  ]
};
