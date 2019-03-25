import React from "react";
import { DocumentList } from "../components";

const documents = [
  { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1", fileSize: 3, dateCreated: "2019-03-21T16:07:53.000+0000", owner: "owner1@ownder.com" },
  { link: "https://www.amazon.co.uk/", fileName: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf", id: "2", fileSize: 3, dateCreated: "2019-03-22T16:07:53.000+0000", owner: "owner2@ownder.com" },
  { link: "https://www.bbc.co.uk/", fileName: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf", id: "3", fileSize: 3, dateCreated: "2019-03-22T16:07:53.000+0000", owner: "owner3@ownder.com" },
];

export const documentListGuide: IGuide = {
  name: "Document List",
  options: [
    {
      name: "Simple",
      comments: "Used inside a section to display a list of documents.",
      example: "<DocumentList documents={documents} fileName=\"Supporting documents\" qa=\"document-list\"/>",
      render: () => <DocumentList documents={documents} qa="document-list"/>
    }
  ]
};
