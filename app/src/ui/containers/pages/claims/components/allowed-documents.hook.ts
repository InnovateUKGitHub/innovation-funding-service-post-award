import { DocumentDescription, getDocumentDescriptionContentSelector } from "@framework/constants/documentDescription";
import { getAllNumericalEnumValues } from "@shared/enumHelper";

import { useContent } from "@ui/hooks/content.hook";
import { ComponentProps } from "react";

type DropdownOption = ComponentProps<"option">;

/**
 * ### useEnumDocuments
 */
export function useEnumDocuments(documentsToCheck: Readonly<DocumentDescription[]>): DropdownOption[] {
  const { getContent } = useContent();

  const getRawDocs: number[] = getAllNumericalEnumValues(DocumentDescription);

  return getRawDocs.reduce<DropdownOption[]>((acc, doc) => {
    const isInvalidDocument = !documentsToCheck.includes(doc);

    if (isInvalidDocument) return acc;

    const id = doc.toString();
    const value = getContent(getDocumentDescriptionContentSelector(doc));

    return [
      ...acc,
      {
        id,
        value,
      },
    ];
  }, []);
}
