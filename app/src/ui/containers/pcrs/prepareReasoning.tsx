import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { ProjectChangeRequestPrepareRoute } from "./prepare";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { MultipleDocumentUpdloadDtoValidator, PCRDtoValidator } from "@ui/validators";

export interface ProjectChangeRequestPrepareReasoningParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  files: Pending<DocumentSummaryDto[]>;
  filesEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

interface Callbacks {
  onChange: (save: boolean, dto: PCRDto) => void;
  onFilesChange: (save: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class PCRPrepareReasoningComponent extends ContainerBase<ProjectChangeRequestPrepareReasoningParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editor: this.props.editor,
      files: this.props.files,
      filesEditor: this.props.filesEditor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor, x.files, x.filesEditor)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documents: DocumentSummaryDto[], documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {
    const PCRForm = ACC.TypedForm<PCRDto>();
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    const reasoningHint = <ACC.Renderers.SimpleString>You must explain each change. Be brief and write clearly.</ACC.Renderers.SimpleString>;

    const options: ACC.SelectOption[] = [
      { id: "true", value: "This is ready to submit" }
    ];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={ProjectChangeRequestPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={[editor.validator, documentsEditor.validator]}
        error={editor.error || documentsEditor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        <ACC.Section>
          <ACC.SummaryList qa="pcr-prepareReasoning">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.typeName)}/>} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>{pcr.guidance}</ACC.Renderers.SimpleString>
        </ACC.Section>

        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onFilesChange(true, documentsEditor.data)}
            onChange={(dto) => this.props.onFilesChange(false, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset heading="Supporting information">
              <ACC.Renderers.SimpleString>You can upload up to 10 files of any type, as long as their combined file size is less than 10MB.</ACC.Renderers.SimpleString>
              <UploadForm.MulipleFileUpload
                label="Upload documents"
                name="attachment"
                labelHidden={true}
                value={data => data.files}
                update={(dto, files) => dto.files = files || []}
                validation={documentsEditor.validator.files}
              />
            </UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile">Upload</UploadForm.Button>
          </UploadForm.Form>
        </ACC.Section>

        <ACC.Section title="Files uploaded">
          {this.renderDocumentList(documents, documentsEditor.data)}
        </ACC.Section>

        <ACC.Section qa="reasoning-save-and-return">
          <PCRForm.Form
            editor={editor}
            onChange={dto => this.onChange(dto)}
            onSubmit={() => this.onSave(editor.data)}
          >
            <PCRForm.MultilineString
              name="reasoningComments"
              label="Reason"
              labelHidden={true}
              hint={reasoningHint}
              qa="reason"
              value={m => m.reasoningComments}
              update={(m, v) => m.reasoningComments = v || ""}
              validation={editor.validator.reasoningComments}
            />
            <PCRForm.Fieldset heading="Mark as complete">
              <PCRForm.Checkboxes
                name="reasoningStatus"
                options={options}
                value={m => m.reasoningStatus === ProjectChangeRequestItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.reasoningStatus = (v && v.some(x => x.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
                validation={editor.validator.reasoningStatus}
              />
              <PCRForm.Submit>Save and return to request</PCRForm.Submit>
            </PCRForm.Fieldset>
          </PCRForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderDocumentList(documents: DocumentSummaryDto[], dto: MultipleDocumentUploadDto) {
    return documents.length > 0
      ? <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(dto, document)} documents={documents} qa="supporting-documents" />
      : <ACC.ValidationMessage messageType="info" message="No files uploaded" />;
  }

  private onChange(dto: PCRDto): void {
    this.props.onChange(false, dto);
  }

  private onSave(dto: PCRDto): void {
    if (dto.reasoningStatus === ProjectChangeRequestItemStatus.ToDo) {
      dto.reasoningStatus = ProjectChangeRequestItemStatus.Incomplete;
    }
    this.props.onChange(true, dto);
  }
}

const PCRPrepareReasoningContainer = (props: ProjectChangeRequestPrepareReasoningParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRPrepareReasoningComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
        files={stores.documents.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
        filesEditor={stores.documents.getPcrOrPcrItemDocumentsEditor(props.projectId, props.pcrId)}
        onChange={(save, dto) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(save, props.projectId, dto, undefined, ({ projectId, id }) => stores.navigation.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId, pcrId: id })));
        }}
        onFilesChange={(save, dto) => {
          stores.messages.clearMessages();
          const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
          stores.documents.updatePcrOrPcrItemDocumentsEditor(save, props.projectId, props.pcrId, dto, successMessage);
        }}
        onFileDelete={(dto, document) => {
          stores.messages.clearMessages();
          stores.documents.deletePcrOrPcrItemDocumentsEditor(props.projectId, props.pcrId, dto, document, "Your document has been removed.");
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareReasoningRoute = defineRoute({
  routeName: "projectChangeRequestPrepareReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning",
  container: PCRPrepareReasoningContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getTitle: () => ({
    htmlTitle: "Provide reasoning to Innovate UK",
    displayTitle: "Provide reasoning to Innovate UK"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
