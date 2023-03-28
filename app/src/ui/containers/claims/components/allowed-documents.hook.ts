import { DocumentDescription, getDocumentDescriptionContentSelector } from "@framework/constants";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { DropdownOption } from "@ui/components";
import { useContent } from "@ui/hooks";

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
