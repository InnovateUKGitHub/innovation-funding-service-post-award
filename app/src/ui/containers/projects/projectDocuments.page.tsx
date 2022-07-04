import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { useContent } from "@ui/hooks";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

import { DocumentSummaryDto, MultipleDocumentUploadDto, ProjectDto } from "@framework/dtos";
import { DocumentDescription, ProjectRole } from "@framework/types";
import { DropdownOption } from "@ui/components";
import { EnumDocuments } from "../claims/components";

export interface ProjectDocumentPageParams {
  projectId: string;
}

interface ProjectDocumentData {
  project: Pending<ProjectDto>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
}

interface CombinedData {
  project: ProjectDto;
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}

interface Callbacks {
  onChange: (save: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class ProjectDocumentsComponent extends ContainerBase<ProjectDocumentPageParams, ProjectDocumentData, Callbacks> {
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

        <ACC.Renderers.SimpleString>
          <ACC.Content value={x => x.projectDocuments.documentMessages.documentsIntroMessage.storingDocumentsMessage} />
        </ACC.Renderers.SimpleString>

        <ACC.Renderers.SimpleString>
          <ACC.Content value={x => x.projectDocuments.documentMessages.documentsIntroMessage.notForClaimsMessage} />
        </ACC.Renderers.SimpleString>

        <ACC.Section title={x => x.projectDocuments.documentMessages.uploadTitle}>
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

                  <UploadForm.MultipleFileUpload
                    label={x => x.projectDocuments.documentLabels.uploadInputLabel}
                    name="attachment"
                    labelHidden
                    value={data => data.files}
                    update={(dto, files) => (dto.files = files || [])}
                    validation={editor.validator.files}
                  />

                  <UploadForm.DropdownList
                    label={x => x.claimDocuments.descriptionLabel}
                    labelHidden={false}
                    hasEmptyOption
                    placeholder="-- No description --"
                    name="description"
                    validation={editor.validator.description}
                    options={docs}
                    value={selectedOption => this.filterDropdownList(selectedOption, docs)}
                    update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
                  />
                </UploadForm.Fieldset>

                <UploadForm.Submit styling="Secondary">
                  <ACC.Content value={x => x.projectDocuments.documentMessages.uploadDocumentsLabel} />
                </UploadForm.Submit>
              </UploadForm.Form>
            )}
          </EnumDocuments>

          <ACC.DocumentEdit
            qa="project-documents"
            onRemove={document => this.props.onDelete(editor.data, document)}
            documents={documents}
          />
        </ACC.Section>
      </ACC.Page>
    );
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
        stores.messages.clearMessages();
        const successMessage = getContent(x =>
          x.projectDocuments.documentMessages.documentDeleted(document),
        );
        stores.projectDocuments.deleteProjectDocument(props.projectId, dto, document, successMessage);
      }}
    />
  );
};

export const ProjectDocumentsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocumentsContainer,
  getParams: route => ({ projectId: route.params.projectId }),
  getTitle: ({ content }) => content.projectDocuments.title(),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
});