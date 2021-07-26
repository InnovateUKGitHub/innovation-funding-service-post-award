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

interface Props {
  documents: DocumentSummaryDto[];
  qa: string;
}

const mapDocumentToLink = (document: DocumentSummaryDto, i: number) => ({
  url: document.link,
  text: document.fileName,
  qa: `document-${i}`,
});

export const DocumentList: React.FunctionComponent<Props> = ({ documents = [], qa}: Props) => {
  // @TODO: should server not do this?
  documents.sort((a,b) => stringComparator(a.fileName, b.fileName));
  return (
    <div data-qa={qa}>
      <LinksList openNewWindow links={documents.map(mapDocumentToLink)}/>
    </div>
  );
};

interface PropsWithRemove extends Props {
  onRemove: (d: DocumentSummaryDto) => void;
}

export const DocumentListWithDelete: React.FunctionComponent<PropsWithRemove> = ({ documents = [], qa, onRemove }: PropsWithRemove) => {
  // @TODO: should server not do this?
  documents.sort((a,b) => stringComparator(a.fileName, b.fileName));

  const Form = TypedForm<DocumentSummaryDto[]>();
  return (
    <div data-qa={qa}>
      <Form.Form data={documents}>
        {documents.map((dto, i) => (
          <div className="govuk-!-padding-bottom-4" key={`document-${i}`} data-qa={`row-document-${i}`}>
            <a target="_blank" rel="noreferrer" href={dto.link} className="govuk-link govuk-!-font-size-19" data-qa={`document-${i}`}>{dto.fileName}</a>
            <Form.Button
              name="delete"
              styling="Link"
              className="govuk-!-font-size-19"
              style={({ marginLeft: "15px" })}
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
};

const renderDocumentName = (document: DocumentSummaryDto) => {
  return <a target="_blank" rel="noreferrer" href={document.link} className="govuk-link">{document.fileName}</a>;
};

interface DocumentTableWithDeleteProps extends Props {
  hideRemove?: (d: DocumentSummaryDto) => boolean;
  onRemove: (d: DocumentSummaryDto) => void;
}

export const DocumentTableWithDelete: React.FunctionComponent<DocumentTableWithDeleteProps> = ({ documents = [], qa, hideRemove, onRemove }: DocumentTableWithDeleteProps) => {
  const Form = TypedForm<DocumentSummaryDto[]>();
  return (
    <Form.Form data={documents}>
      <DocumentTable
        qa={qa}
        documents={documents}
        customContent={table => (
          <table.Custom
            qa="delete"
            value={(x) => {
              if (hideRemove && hideRemove(x)) return null;
              return (
                <Form.Button name="delete" styling="Link" className="govuk-!-font-size-19" style={({ marginLeft: "15px" })} onClick={() => onRemove(x)} value={x.id}>
                  Remove
                </Form.Button>);
            }}
          />)}
      />
    </Form.Form>);
};

interface DocumentTableProps extends Props {
  customContent?: (table: ITypedTable<DocumentSummaryDto>) => TableChild<DocumentSummaryDto>;
}

export const DocumentTable: React.FunctionComponent<DocumentTableProps> = ({ documents = [], qa, customContent }: DocumentTableProps) => {
  documents.sort((a,b) => stringComparator(a.fileName, b.fileName));
  const ProjectDocumentsTable = TypedTable<DocumentSummaryDto>();
  return (
      <ProjectDocumentsTable.Table data={documents} qa={qa}>
        <ProjectDocumentsTable.Custom header="File name" qa="fileName" value={x => renderDocumentName(x)} />
        <ProjectDocumentsTable.Custom header="Type" qa="fileType" value={x => x.description ? <Content value={c => c.components.documents.labels.documentDescriptionLabel(x.description!)}/> : null} />
        <ProjectDocumentsTable.ShortDate header="Date uploaded" qa="dateUploaded" value={x => x.dateCreated} />
        <ProjectDocumentsTable.Custom header="Size" qa="fileSize" classSuffix="numeric" value={x => getFileSize(x.fileSize)} />
        <ProjectDocumentsTable.String header="Uploaded by" qa="uploadedBy" value={x => x.uploadedBy} />
        {customContent ? customContent(ProjectDocumentsTable) : null}
      </ProjectDocumentsTable.Table>
  );
};

export interface DocumentViewProps {
  documents: DocumentSummaryDto[];
  validationMessage?: string;
}

export const DocumentView = (props: DocumentViewProps) => {
  const { getContent } = useContent();
  const defaultMessage =
    props.validationMessage || getContent(x => x.components.documentView.fallbackValidationMessage);

  return props.documents.length ? (
    <DocumentTable documents={props.documents} qa="supporting-documents" />
  ) : (
    <ValidationMessage message={defaultMessage} messageType="info" />
  );
};

interface DocumentFilterProps {
  name: string;
  qa: string;
  onSearch: (filteredText: string) => void;
  intitialFilter?: string;
  placeholder?: string;
}

// Note: TypedForm enforces an object shaped payload, so this can't a single primitive string
interface DocumentFilterState {
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
