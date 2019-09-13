import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { ProjectChangeRequestPrepareRoute } from "./prepare";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux";
import { PCRItemStatus } from "@framework/entities";
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
  onChange: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onSave: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onFilesChange: (pcrId: string, dto: MultipleDocumentUploadDto) => void;
  onFilesSave: (projectId: string, pcrId: string, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (projectId: string, pcrId: string, dto: DocumentSummaryDto) => void;
}

class PCRViewReasoningComponent extends ContainerBase<ProjectChangeRequestPrepareReasoningParams, Data, Callbacks> {
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

  private renderTypes(pcr: PCRDto): React.ReactNode {
    return pcr.items.map(x => x.typeName).reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
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
          <ACC.SummaryList qa="pcrDetails">
            <ACC.SummaryListItem label="Number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(pcr)} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onFilesSave(this.props.projectId, this.props.pcrId, documentsEditor.data)}
            onChange={(dto) => this.props.onFilesChange(this.props.pcrId, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset heading="Upload">
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
          {this.renderDocumentList(documents)}
        </ACC.Section>
        <ACC.Section>
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
                value={m => m.reasoningStatus === PCRItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.reasoningStatus = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
                validation={editor.validator.reasoningStatus}
              />
              <PCRForm.Submit>Save and return to request</PCRForm.Submit>
            </PCRForm.Fieldset>
          </PCRForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderDocumentList(documents: DocumentSummaryDto[]) {
    return documents.length > 0
      ? <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(this.props.projectId, this.props.pcrId, document)} documents={documents} qa="supporting-documents" />
      : <ACC.ValidationMessage messageType="info" message="No files uploaded" />;
  }

  private onChange(dto: PCRDto): void {
    this.props.onChange(this.props.projectId, this.props.pcrId, dto);
  }

  private onSave(dto: PCRDto): void {
    if (dto.reasoningStatus === PCRItemStatus.ToDo) {
      dto.reasoningStatus = PCRItemStatus.Incomplete;
    }
    this.props.onSave(this.props.projectId, this.props.pcrId, dto);
  }
}

const definition = ReduxContainer.for<ProjectChangeRequestPrepareReasoningParams, Data, Callbacks>(PCRViewReasoningComponent);

export const PCRPrepareReasoning = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state),
    files: Selectors.getProjectChangeRequestDocumentsOrItemDocuments(params.pcrId).getPending(state),
    filesEditor: Selectors.getProjectChangeRequestDocumentOrItemDocumentEditor(params.pcrId).get(state),
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(Actions.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId, pcrId }))))),
    onFilesChange: (pcrId, dto) => {
      dispatch(Actions.removeMessages());
      dispatch(Actions.updateProjectChangeRequestDocumentOrItemDocumentEditor(pcrId, dto, false));
    },
    onFilesSave: (projectId, pcrId, dto) => {
      const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
      dispatch(Actions.uploadProjectChangeRequestDocumentOrItemDocument(projectId, pcrId, dto, () => dispatch(Actions.loadProjectChangeRequestDocumentsOrItemDocuments(projectId, pcrId)), successMessage));
    },
    onFileDelete: (projectId, pcrId, dto) => {
      dispatch(Actions.deleteProjectChangeRequestDocumentOrItemDocument(projectId, pcrId, dto, () => {
        dispatch(Actions.messageSuccess("Your document has been removed."));
        dispatch(Actions.loadProjectChangeRequestDocumentsOrItemDocuments(projectId, pcrId));
      }));
    }
  })
});

export const ProjectChangeRequestPrepareReasoningRoute = definition.route({
  routeName: "projectChangeRequestPrepareReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadProjectChangeRequestDocumentsOrItemDocuments(params.projectId, params.pcrId)
  ],
  getTitle: () => ({
    htmlTitle: "Provide reasoning to Innovate UK",
    displayTitle: "Provide reasoning to Innovate UK"
  }),
  container: PCRPrepareReasoning,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
