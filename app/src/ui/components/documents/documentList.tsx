import { useState } from "react";
import { stringComparator } from "@framework/util/comparator";
import { ITypedTable, TableChild, TypedTable } from "@ui/components/table";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Content } from "@ui/components/content";
import { useContent } from "@ui/hooks";
import { noop } from "@ui/helpers/noop";
import { getFileSize } from "../../../framework/util/files";
import { TypedForm } from ".././form";
import { LinksList } from ".././linksList";
import { ValidationMessage } from "../validationMessage";
import { GovLink } from "../links";

interface Props {
  documents: DocumentSummaryDto[];
  qa: string;
}

const mapDocumentToLink = (document: DocumentSummaryDto, i: number) => ({
  url: document.link,
  text: document.fileName,
  qa: `document-${i}`,
});

export const DocumentList: React.FunctionComponent<Props> = ({ documents = [], qa }: Props) => {
  return (
    <div data-qa={qa}>
      <LinksList openNewWindow links={documents.map(mapDocumentToLink)} />
    </div>
  );
};

interface PropsWithRemove extends Props {
  onRemove: (d: DocumentSummaryDto) => void;
}

export function DocumentListWithDelete({ documents = [], qa, onRemove }: PropsWithRemove) {
  const Form = TypedForm<DocumentSummaryDto[]>();

  return (
    <div data-qa={qa}>
      <Form.Form data={documents}>
        {documents.map((dto, i) => (
          <div key={`document-${i}`} className="govuk-!-padding-bottom-4" data-qa={`row-document-${i}`}>
            <GovLink
              data-qa={`document-${i}`}
              className="govuk-!-font-size-19"
              href={dto.link}
              target="_blank"
              rel="noreferrer"
            >
              {dto.fileName}
            </GovLink>

            <Form.Button
              name="delete"
              styling="Link"
              className="govuk-!-font-size-19"
              style={{ marginLeft: "15px" }}
              onClick={() => onRemove(dto)}
              value={dto.id}
            >
              Remove
            </Form.Button>
          </div>
        ))}
      </Form.Form>
    </div>
  );
}

interface DocumentTableWithDeleteProps extends Props {
  onRemove: (d: DocumentSummaryDto) => void;
}

export function DocumentTableWithDelete({ documents = [], qa, onRemove }: DocumentTableWithDeleteProps) {
  const Form = TypedForm<DocumentSummaryDto[]>();

  return (
    <Form.Form data={documents}>
      <DocumentTable
        qa={qa}
        documents={documents}
        customContent={table => (
          <table.Custom
            qa="delete"
            value={x => (
              <Form.Button
                name="delete"
                styling="Link"
                className="govuk-!-font-size-19"
                style={{ marginLeft: "15px" }}
                onClick={() => onRemove(x)}
                value={x.id}
              >
                Remove
              </Form.Button>
            )}
          />
        )}
      />
    </Form.Form>
  );
}

interface DocumentTableProps extends Props {
  customContent?: (table: ITypedTable<DocumentSummaryDto>) => TableChild<DocumentSummaryDto>;
}

export function DocumentTable({ documents = [], qa, customContent }: DocumentTableProps) {
  const ProjectDocumentsTable = TypedTable<DocumentSummaryDto>();

  return (
    <ProjectDocumentsTable.Table data={documents} qa={qa}>
      <ProjectDocumentsTable.Custom
        sortByKey="fileName"
        header="File name"
        qa="fileName"
        value={x => (
          <GovLink target="_blank" rel="noreferrer" href={x.link}>
            {x.fileName}
          </GovLink>
        )}
      />

      <ProjectDocumentsTable.Custom
        header="Type"
        qa="fileType"
        value={x =>
          x.description ? (
            <Content value={c => c.components.documents.labels.documentDescriptionLabel(x.description!)} />
          ) : null
        }
      />

      <ProjectDocumentsTable.ShortDate
        sortByKey="dateCreated"
        header="Date uploaded"
        qa="dateUploaded"
        value={x => x.dateCreated}
      />

      <ProjectDocumentsTable.Custom
        sortByKey="fileSize"
        header="Size"
        qa="fileSize"
        classSuffix="numeric"
        value={x => getFileSize(x.fileSize)}
      />

      <ProjectDocumentsTable.String
        sortByKey="uploadedBy"
        header="Uploaded by"
        qa="uploadedBy"
        value={x => x.uploadedBy}
      />

      {customContent?.(ProjectDocumentsTable) || null}
    </ProjectDocumentsTable.Table>
  );
}

export interface DocumentViewProps {
  documents: DocumentSummaryDto[];
  validationMessage?: string;
}

export function DocumentView({ documents, validationMessage }: DocumentViewProps) {
  const { getContent } = useContent();
  const defaultMessage = validationMessage || getContent(x => x.components.documentView.fallbackValidationMessage);

  return documents.length ? (
    <DocumentTable documents={documents} qa="supporting-documents" />
  ) : (
    <ValidationMessage message={defaultMessage} messageType="info" />
  );
}

interface DocumentFilterProps {
  name: string;
  qa: string;
  onSearch: (filteredText: string) => void;
  intitialFilter?: string;
  placeholder?: string;
}

interface DocumentFilterState {
  // Note: TypedForm enforces an object shaped payload, so this can't a single primitive string :(
  filteredText: string;
}

export function DocumentFilter({
  name,
  qa,
  placeholder = "Search documents",
  intitialFilter,
  onSearch,
}: DocumentFilterProps) {
  const [filteredText, setFilteredText] = useState<string>(intitialFilter || "");

  const handleOnSearch = (newState: DocumentFilterState): void => {
    const newFilteredValue = newState.filteredText.trim();

    setFilteredText(newFilteredValue);
    onSearch(newFilteredValue);
  };

  const FilterForm = TypedForm<DocumentFilterState>();

  return (
    <FilterForm.Form qa={qa} data={{ filteredText }} onSubmit={noop} onChange={handleOnSearch}>
      <FilterForm.Search
        name={name}
        labelHidden
        placeholder={placeholder}
        value={x => x.filteredText}
        update={(x, v) => (x.filteredText = v || "")}
      />
    </FilterForm.Form>
  );
}
