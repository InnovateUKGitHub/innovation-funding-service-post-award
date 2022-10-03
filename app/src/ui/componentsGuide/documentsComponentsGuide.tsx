import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { DocumentSummaryDto, IGuide } from "@framework/types";
import { Button, DocumentEdit, DocumentView } from "@ui/components";

const initialDocs: DocumentSummaryDto[] = [
  {
    link: "#",
    fileName: "document-6.docx",
    id: uuidv4(),
    description: 110,
    fileSize: 20635049,
    dateCreated: new Date(2021, 10, 26),
    uploadedBy: "Elton John",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: true,
  },
  {
    link: "#",
    fileName: "document-5.docx",
    id: uuidv4(),
    description: 110,
    fileSize: 20635049,
    dateCreated: new Date(1990, 5, 6),
    uploadedBy: "Mike Tyson",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: true,
  },
  {
    link: "#",
    fileName: "document-4.docx",
    id: uuidv4(),
    description: 140,
    fileSize: 20635049,
    dateCreated: new Date(2021, 8, 26),
    uploadedBy: "Donald Duck",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: true,
  },
  {
    link: "#",
    fileName: "document-3.docx",
    id: uuidv4(),
    description: 140,
    fileSize: 10635049,
    dateCreated: new Date(2020, 3, 22),
    uploadedBy: "John Lemon",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: true,
  },
  {
    link: "#",
    fileName: "document-2.docx",
    id: uuidv4(),
    description: 130,
    fileSize: 18635049,
    dateCreated: new Date(2021, 9, 3),
    uploadedBy: "Fred Mango",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: true,
  },
  {
    link: "#",
    fileName: "document-1.docx",
    id: uuidv4(),
    description: null,
    fileSize: 12635049,
    dateCreated: new Date(2021, 10, 8),
    uploadedBy: "Bonny Banana",
    uploadedByPartnerName: "Hedge's Hedges Ltd",
    isOwner: true,
  },
];

function DemoDocsWithDelete() {
  const [undeletedDocs, setDocs] = useState<DocumentSummaryDto[]>(initialDocs);

  return (
    <>
      <Button
        styling="Warning"
        disabled={undeletedDocs.length === initialDocs.length}
        onClick={() => setDocs(initialDocs)}
      >
        Reset demo
      </Button>

      <DocumentEdit
        qa="document-list-with-delete"
        documents={undeletedDocs}
        onRemove={deleteDoc => setDocs(x => x.filter(y => y.id !== deleteDoc.id))}
      />
    </>
  );
}

export const documentComponents: IGuide = {
  name: "Document Components",
  options: [
    {
      name: "View only",
      comments: "Used to view documents.",
      example: '<DocumentView qa="document-list-with-delete" documents={docs} />',
      render: () => <DocumentView qa="document-list-with-delete" documents={initialDocs} />,
    },
    {
      name: "With delete",
      comments: "Used to view and delete documents.",
      example:
        '<DocumentTableWithDelete documents={documents} fileName="Supporting documents" qa="document-list" onRemove="(documentToDelete) => ..."/>',
      render: DemoDocsWithDelete,
    },
  ],
};
