import { DocumentDescription, getDocumentDescriptionContentSelector } from "@framework/constants/documentDescription";
import { DropdownListOption } from "@ui/components/bjss/inputs/dropdownList";
import { useContent } from "./content.hook";

export const useValidDocumentDropdownOptions = (documents: DocumentDescription[]) => {
  const { getContent } = useContent();

  const documentDropdownOptions: DropdownListOption[] = [
    {
      id: "none",
      value: "",
      displayName: getContent(x => x.documentLabels.descriptionPlaceholder),
      qa: "document-description-null",
    },
    ...documents.map(x => ({
      id: String(x),
      value: x,
      displayName: getContent(getDocumentDescriptionContentSelector(x)),
      qa: `document-description-${x}`,
    })),
  ];

  return documentDropdownOptions;
};
