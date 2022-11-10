import React from "react";

import { DocumentDescription } from "@framework/types";
import { DropdownOption } from "@ui/components";
import { useEnumDocuments } from "./allowed-documents.hook";

interface EnumDocumentsProps {
  documentsToCheck: Readonly<DocumentDescription[]>;
  children: (documents: DropdownOption[]) => React.ReactElement;
}

/**
 * wrapper component to allow use of `useEnumDocuments` hook with class components
 */
export function EnumDocuments({ documentsToCheck, children }: EnumDocumentsProps) {
  const documents = useEnumDocuments(DocumentDescription, documentsToCheck);

  return children(documents);
}
