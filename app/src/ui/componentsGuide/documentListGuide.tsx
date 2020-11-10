import React from "react";
import { DocumentList } from "../components";
import { IGuide } from "@framework/types";

const documents = [
  { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1", fileSize: 3, dateCreated: new Date(), owner: "owner1@ownder.com", uploadedBy: "Bubbles" },
  { link: "https://www.amazon.co.uk/", fileName: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf", id: "2", fileSize: 3, dateCreated: new Date(), owner: "owner2@ownder.com", uploadedBy: "Blossom" },
  { link: "https://www.bbc.co.uk/", fileName: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf", id: "3", fileSize: 3, dateCreated: new Date(), owner: "owner3@ownder.com", uploadedBy: "Buttercup" },
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
