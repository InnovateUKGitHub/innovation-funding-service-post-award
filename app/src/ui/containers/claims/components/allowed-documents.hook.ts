import { DocumentDescription, getDocumentDescriptionContentSelector } from "@framework/constants";
import { getAllEnumValues } from "@shared/enumHelper";
import { DropdownOption } from "@ui/components";
import { useContent } from "@ui/hooks";

export function useEnumDocuments(
  enumDocuments: object,
  documentsToCheck: Readonly<DocumentDescription[]>,
): DropdownOption[] {
  const { getContent } = useContent();
  const getRawDocs: number[] = getAllEnumValues(enumDocuments);

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
