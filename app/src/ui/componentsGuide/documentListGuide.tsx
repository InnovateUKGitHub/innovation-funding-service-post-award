import React from "react";
import { DocumentList } from "../components";

const documents = [
  { link: "link1", title: "LABOUR_COSTS_Q3_2017-11-05.pdf" },
  { link: "link2", title: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf" },
  { link: "link3", title: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf" },
];

export const documentListGuide: IGuide = {
  name: "Document List",
  options: [
    {
      name: "Simple",
      comments: "Used inside a section to display a list of documents.",
      example: "<DocumentList documents={documents} title=\"Supporting documents\" qa=\"document-list\"/>",
      render: () => <DocumentList documents={documents} title="Supporting documents" qa="document-list"/>
    }
  ]
};
