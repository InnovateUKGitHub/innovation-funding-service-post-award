import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto } from "@framework/dtos";
import { PCRPrepareRoute } from "./prepare";
import { EditorStatus, IEditorStore, } from "@ui/redux";
import { PCRItemStatus } from "@framework/entities";
import { MultipleDocumentUpdloadDtoValidator, PCRDtoValidator } from "@ui/validators";

interface Params {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  files: Pending<DocumentSummaryDto[]>;
  filesEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

interface Callbacks {
  onChange: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onSave: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onFilesChange: (pcrId: string, itemId: string, dto: MultipleDocumentUploadDto) => void;
  onFilesSave: (projectId: string, pcrId: string, itemId: string, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (projectId: string, pcrId: string, itemId: string, dto: DocumentSummaryDto) => void;
}

class PCRPrepareItemComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      pcrItem: this.props.pcrItem,
      editor: this.props.editor,
      files: this.props.files,
      filesEditor: this.props.filesEditor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.editor, x.files, x.filesEditor)} />;
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

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documents: DocumentSummaryDto[], documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {
    const Form = ACC.TypedForm<PCRItemDto>();
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    const options: ACC.SelectOption[] = [
      { id: "true", value: "This is ready to submit" }
    ];

    const index = pcr.items.findIndex(x => x.id === pcrItem.id);

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error || documentsEditor.error}
        validator={[editor.validator, documentsEditor.validator]}
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
            onSubmit={() => this.props.onFilesSave(this.props.projectId, this.props.pcrId, this.props.itemId, documentsEditor.data)}
            onChange={(dto) => this.props.onFilesChange(this.props.pcrId, this.props.itemId, dto)}
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
            <UploadForm.Submit styling="Secondary">Upload</UploadForm.Submit>
          </UploadForm.Form>
        </ACC.Section>
        <ACC.Section title="Files uploaded">
          {this.renderDocumentList(documents)}
        </ACC.Section>

        <ACC.Section>
          <Form.Form
            data={editor.data.items[index]}
            isSaving={editor.status === EditorStatus.Saving}
            onChange={dto => this.onChange(editor.data, dto)}
            onSubmit={() => this.onSave(editor.data)}
          >
            <Form.Fieldset heading="Mark as complete">
              <Form.Checkboxes
                name="itemStatus"
                options={options}
                value={m => m.status === PCRItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
                validation={editor.validator.items.results[index].status}
              />
              <Form.Submit>Save and return to request</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>

      </ACC.Page>
    );
  }

  private renderDocumentList(documents: DocumentSummaryDto[]) {
    return documents.length > 0
      ? <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(this.props.projectId, this.props.pcrId, this.props.itemId, document)} documents={documents} qa="supporting-documents" />
      : <ACC.ValidationMessage messageType="info" message="No files uploaded" />;
  }

  private onChange(dto: PCRDto, itemDto: PCRItemDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange(this.props.projectId, this.props.pcrId, dto);
  }

  private onSave(dto: PCRDto): void {
    // if the status is todo and we are saving should change it to incomplete
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    if (dto.items[index].status === PCRItemStatus.ToDo) {
      dto.items[index].status = PCRItemStatus.Incomplete;
    }
    this.props.onSave(this.props.projectId, this.props.pcrId, dto);
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRPrepareItemComponent);

export const PCRPrepareItem = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    pcrItem: Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(state),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state),
    files: Selectors.getProjectChangeRequestDocumentsOrItemDocuments(params.itemId).getPending(state),
    filesEditor: Selectors.getProjectChangeRequestDocumentOrItemDocumentEditor(params.itemId).get(state),
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(Actions.navigateTo(PCRPrepareRoute.getLink({ projectId, pcrId }))))),
    onFilesChange: (pcrId, itemId, dto) => {
      dispatch(Actions.removeMessages());
      dispatch(Actions.updateProjectChangeRequestDocumentOrItemDocumentEditor(itemId, dto, false));
    },
    onFilesSave: (projectId, pcrId, itemId, dto) => {
      const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
      dispatch(Actions.uploadProjectChangeRequestDocumentOrItemDocument(projectId, itemId, dto, () => dispatch(Actions.loadProjectChangeRequestDocumentsOrItemDocuments(projectId, itemId)), successMessage));
    },
    onFileDelete: (projectId, pcrId, itemId, dto) => {
      dispatch(Actions.deleteProjectChangeRequestDocumentOrItemDocument(projectId, itemId, dto, () => {
        dispatch(Actions.messageSuccess("Your document has been removed."));
        dispatch(Actions.loadProjectChangeRequestDocumentsOrItemDocuments(projectId, itemId));
      }));
    }
  })
});

export const PCRPrepareItemRoute = definition.route({
  routeName: "pcrPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadProjectChangeRequestDocumentsOrItemDocuments(params.projectId, params.itemId),
    Actions.loadPcrTypes(),
  ],
  getTitle: (store, params) => {
    const typeName = Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(store).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
      displayTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
    };
  },
  container: PCRPrepareItem,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
