import { DocumentDescription, getDocumentDescriptionContentSelector } from "@framework/constants/documentDescription";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { DropdownOption } from "@ui/components/form";

import { useContent } from "@ui/hooks/content.hook";

/**
 * ### useEnumDocuments
 */
export function useEnumDocuments(
  enumDocuments: typeof DocumentDescription,
  documentsToCheck: Readonly<DocumentDescription[]>,
): DropdownOption[] {
  const { getContent } = useContent();
  const getRawDocs: number[] = getAllNumericalEnumValues(enumDocuments);

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
