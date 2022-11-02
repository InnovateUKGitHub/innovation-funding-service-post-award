import { v4 as uuidv4 } from "uuid";

import { IGuide } from "@framework/types";
import { DocumentList, DocumentListWithDelete } from "@ui/components";

const documents = [
  {
    link: "https://www.google.com/",
    fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf",
    id: uuidv4(),
    fileSize: 3,
    dateCreated: new Date(),
    owner: "owner1@ownder.com",
    uploadedBy: "Bubbles",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: false,
  },
  {
    link: "https://www.amazon.co.uk/",
    fileName: "PAYMENT_RECEIPT_PROJECT_MANAGER_Q3_2017-11-05.pdf",
    id: uuidv4(),
    fileSize: 3,
    dateCreated: new Date(),
    owner: "owner2@ownder.com",
    uploadedBy: "Blossom",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: false,
  },
  {
    link: "https://www.bbc.co.uk/",
    fileName: "PAYMENT_RECEIPT_ELECTRICIAN_Q3_2017-11-05.pdf",
    id: uuidv4(),
    fileSize: 3,
    dateCreated: new Date(),
    owner: "owner3@ownder.com",
    uploadedBy: "Buttercup",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: false,
  },
];

export const documentListGuide: IGuide = {
  name: "Document List",
  options: [
    {
      name: "Simple",
      comments: "Used inside a section to display a list of documents.",
      example: '<DocumentList documents={documents} fileName="Supporting documents" qa="document-list"/>',
      render: () => <DocumentList documents={documents} qa="document-list" />,
    },
    {
      name: "Document list with delete",
      comments: "Used inside a section to display a list of documents.",
      example: '<DocumentList documents={documents} fileName="Supporting documents" qa="document-list"/>',
      render: () => (
        <DocumentListWithDelete
          documents={documents}
          qa="document-list-with-delete"
          onRemove={docToDelete => alert(`Delete document '${docToDelete.fileName}'`)}
        />
      ),
    },
  ],
};
