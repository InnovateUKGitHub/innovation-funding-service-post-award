import React from "react";
import { DocumentDescription } from "@framework/types";
import { DropdownOption } from "@ui/components";
import { useEnumDocuments } from "./allowed-documents.hook";

interface EnumDocumentsProps {
  documentsToCheck: any[];
  children: (docum: DropdownOption[]) => React.ReactElement;
}

export function EnumDocuments({ documentsToCheck, children }: EnumDocumentsProps) {
  const documents = useEnumDocuments(DocumentDescription, documentsToCheck);

  return children(documents);
}
