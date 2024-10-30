import { DocumentDescription } from "@framework/constants/documentDescription";
import React, { ComponentProps } from "react";
import { useEnumDocuments } from "./allowed-documents.hook";

type DropdownOption = ComponentProps<"option">;
interface EnumDocumentsProps {
  documentsToCheck: Readonly<DocumentDescription[]>;
  children: (documents: DropdownOption[]) => React.ReactElement;
}

/**
 * wrapper component to allow use of `useEnumDocuments` hook with class components
 */
export function EnumDocuments({ documentsToCheck, children }: EnumDocumentsProps) {
  const documents = useEnumDocuments(documentsToCheck);
  return children(documents);
}
