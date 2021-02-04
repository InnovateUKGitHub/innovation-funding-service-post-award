import React from "react";

import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { useContent } from "@ui/hooks";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "@ui/containers/containerBase";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";

import { DocumentDescriptionDto, DocumentSummaryDto, MultipleDocumentUploadDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { noop } from "@ui/helpers/noop";
import { DocumentDescription } from "@framework/types";
import { EnumDocuments } from "../claims/components";
import { DropdownOption } from "@ui/components";

export interface ProjectDocumentPageParams {
  projectId: string;
}

interface ProjectDocumentData {
  project: Pending<ProjectDto>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  isClient: boolean;
}

interface CombinedData {
  project: ProjectDto;
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
}

interface Callbacks {
  onChange: (save: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

interface ProjectDocumentState {
  documentFilter: string;
}

class ProjectDocumentsComponent extends ContainerBaseWithState<
  ProjectDocumentPageParams,
  ProjectDocumentData,
  Callbacks,
  ProjectDocumentState
> {
  constructor(props: ContainerProps<ProjectDocumentPageParams, ProjectDocumentData, Callbacks>) {
    super(props);
    this.state = {
      documentFilter: "",
    };
  }

  render() {
    const combined = Pending.combine({
      project: this.props.project,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private filterDropdownList(selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) {
    if (!documents.length || !selectedDocument.description) return undefined;

    const targetId = selectedDocument.description.toString();

    return documents.find(x => x.id === targetId);
  }

  private readonly allowedProjectDocuments: DocumentDescription[] = [
    DocumentDescription.ReviewMeeting,
    DocumentDescription.Plans,
    DocumentDescription.CollaborationAgreement,
    DocumentDescription.RiskRegister,
    DocumentDescription.AnnexThree,
    DocumentDescription.Presentation,
    DocumentDescription.Email,
    DocumentDescription.MeetingAgenda,
  ];

  private renderContents({ project, documents, editor }: CombinedData) {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title {...project} />}
        backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        validator={editor.validator}
        error={editor.error}
        project={project}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <>
          <ACC.Renderers.SimpleString>
            <ACC.Content
              value={x => x.projectDocuments.documentMessages.documentsIntroMessage.storingDocumentsMessage}
            />
          </ACC.Renderers.SimpleString>
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.projectDocuments.documentMessages.documentsIntroMessage.notForClaimsMessage} />
          </ACC.Renderers.SimpleString>
        </>
        <ACC.Section titleContent={x => x.projectDocuments.documentMessages.uploadTitle}>
          <EnumDocuments documentsToCheck={this.allowedProjectDocuments}>
            {docs => (
              <UploadForm.Form
                enctype="multipart"
                editor={editor}
                onChange={dto => this.props.onChange(false, dto)}
                onSubmit={() => this.props.onChange(true, editor.data)}
                qa="projectDocumentUpload"
              >
                <UploadForm.Fieldset>
                  <ACC.DocumentGuidance />

                  <UploadForm.MulipleFileUpload
                    labelContent={x => x.projectDocuments.documentLabels.uploadInputLabel}
                    name="attachment"
                    labelHidden={true}
                    value={data => data.files}
                    update={(dto, files) => (dto.files = files || [])}
                    validation={editor.validator.files}
                  />

                  <UploadForm.DropdownList
                    labelContent={x => x.claimDocuments.descriptionLabel}
                    labelHidden={false}
                    hasEmptyOption={true}
                    placeholder="-- No description --"
                    name="description"
                    validation={editor.validator.files}
                    options={docs}
                    value={selectedOption => this.filterDropdownList(selectedOption, docs)}
                    update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
                  />
                </UploadForm.Fieldset>

                <UploadForm.Submit styling="Secondary">
                  <ACC.Content value={x => x.projectDocuments.documentMessages.uploadDocumentsLabel} />
                </UploadForm.Submit>
                {this.renderDocumentsSection(documents, editor)}
              </UploadForm.Form>
            )}
          </EnumDocuments>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderDocumentsSection(
    documents: DocumentSummaryDto[],
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>,
  ) {
    const { isClient } = this.props;
    const documentFilterText = this.state.documentFilter;
    const hasTextToFilter = !!documentFilterText.length;

    const documentsToDisplay =
      isClient && hasTextToFilter
        ? documents.filter(document => new RegExp(documentFilterText, "gi").test(document.fileName))
        : documents;

    return (
      <>
        {isClient && this.renderDocumentsFilter(documents)}

        {!documentsToDisplay.length && !!documents.length ? (
          <ACC.Renderers.SimpleString qa={"noDocuments"}>
            <ACC.Content value={x => x.projectDocuments.noMatchingDocumentsMessage} />
          </ACC.Renderers.SimpleString>
        ) : (
          this.renderDocumentsTable(documentsEditor, documentsToDisplay)
        )}
      </>
    );
  }

  private renderDocumentsFilter(documents: DocumentSummaryDto[]) {
    if (documents.length === 0) {
      return (
        <ACC.ValidationMessage
          qa={"noDocuments"}
          message={<ACC.Content value={x => x.projectDocuments.documentMessages.noDocumentsUploaded} />}
          messageType="info"
        />
      );
    }

    const FilterForm = ACC.TypedForm<ProjectDocumentState>();

    const handleOnSearch = ({ documentFilter }: ProjectDocumentState) => {
      const filteredQuery = documentFilter ? documentFilter.trim() : "";
      const newValue = !!filteredQuery.length ? filteredQuery : "";

      this.setState({ documentFilter: newValue });
    };

    return (
      <>
        <ACC.Renderers.SimpleString>
          {<ACC.Content value={x => x.projectDocuments.documentMessages.newWindow} />}
        </ACC.Renderers.SimpleString>

        <FilterForm.Form data={this.state} onSubmit={noop} onChange={handleOnSearch} qa="document-search-form">
          <FilterForm.Search
            name="document-filter"
            labelHidden={true}
            value={x => x.documentFilter}
            update={(x, v) => (x.documentFilter = v || "")}
            // TODO
            placeholder={"Search documents"}
          />
        </FilterForm.Form>
      </>
    );
  }

  private renderDocumentsTable(
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>,
    documents: DocumentSummaryDto[],
  ) {
    return documents.length ? (
      <ACC.Section>
        <ACC.DocumentTableWithDelete
          onRemove={document => this.props.onDelete(documentsEditor.data, document)}
          documents={documents}
          qa="claim-supporting-documents"
        />
      </ACC.Section>
    ) : null;
  }
}

const ProjectDocumentsContainer = (props: ProjectDocumentPageParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  return (
    <ProjectDocumentsComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      documents={stores.projectDocuments.getProjectDocuments(props.projectId)}
      editor={stores.projectDocuments.getProjectDocumentEditor(props.projectId)}
      onChange={(saving, dto) => {
        stores.messages.clearMessages();
        const successMessage = getContent(x =>
          x.projectDocuments.documentMessages.getDocumentUploadedMessage(dto.files.length),
        );
        stores.projectDocuments.updateProjectDocumentsEditor(saving, props.projectId, dto, successMessage);
      }}
      onDelete={(dto, document) => {
        stores.projectDocuments.deleteProjectDocument(props.projectId, dto, document);
      }}
    />
  );
};

export const ProjectDocumentsRoute = defineRoute({
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocumentsContainer,
  getParams: (route) => ({ projectId: route.params.projectId }),
  getTitle: ({ content }) => content.projectDocuments.title(),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
