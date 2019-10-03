import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, PCRStandardItemDto } from "@framework/dtos";
import { ProjectChangeRequestPrepareRoute } from "./prepare";
import { EditorStatus, IEditorStore, StoresConsumer, } from "@ui/redux";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { MultipleDocumentUpdloadDtoValidator, PCRDtoValidator, PCRStandardItemDtoValdiator } from "@ui/validators";

export interface ProjectChangeRequestPrepareItemParams {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRStandardItemDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  files: Pending<DocumentSummaryDto[]>;
  filesEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

interface Callbacks {
  onChange: (save: boolean, dto: PCRDto) => void;
  onFilesChange: (save: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class PCRPrepareItemComponent extends ContainerBase<ProjectChangeRequestPrepareItemParams, Data, Callbacks> {
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

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documents: DocumentSummaryDto[], documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {
    const Form = ACC.TypedForm<PCRStandardItemDto>();
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    const options: ACC.SelectOption[] = [
      { id: "true", value: "This is ready to submit." }
    ];

    const item = pcr.items.find(x => x.id === pcrItem.id) as PCRStandardItemDto;
    const validator = editor.validator.items.results.find(x => x.model.id === pcrItem.id) as PCRStandardItemDtoValdiator;
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={ProjectChangeRequestPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error || documentsEditor.error}
        validator={[editor.validator, documentsEditor.validator]}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>{pcrItem.guidance}</ACC.Renderers.SimpleString>
        </ACC.Section>

        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onFilesChange(true, documentsEditor.data)}
            onChange={(dto) => this.props.onFilesChange(false, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset heading="Upload">
              <ACC.Renderers.SimpleString>You can upload up to 10 files of any type, as long as their combined file size is less than 10MB.</ACC.Renderers.SimpleString>
              <UploadForm.MulipleFileUpload
                label="Upload files"
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
          {this.renderDocumentList(documents, documentsEditor)}
        </ACC.Section>

        <ACC.Section>
          <Form.Form
            data={item}
            isSaving={editor.status === EditorStatus.Saving}
            onChange={dto => this.onChange(editor.data, dto)}
            onSubmit={() => this.onSave(editor.data)}
            qa="itemStatus"
          >
            <Form.Fieldset heading="Mark as complete">
              <Form.Checkboxes
                name="itemStatus"
                options={options}
                value={m => m.status === ProjectChangeRequestItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
                validation={validator.status}
              />
              <Form.Submit>Save and return to request</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>

      </ACC.Page>
    );
  }

  private renderDocumentList(documents: DocumentSummaryDto[], documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {
    return documents.length > 0
      ? <ACC.DocumentListWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="supporting-documents" />
      : <ACC.ValidationMessage messageType="info" message="No files uploaded" />;
  }

  private onChange(dto: PCRDto, itemDto: PCRStandardItemDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange(false, dto);
  }

  private onSave(dto: PCRDto): void {
    // if the status is todo and we are saving should change it to incomplete
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    if (dto.items[index].status === ProjectChangeRequestItemStatus.ToDo) {
      dto.items[index].status = ProjectChangeRequestItemStatus.Incomplete;
    }
    this.props.onChange(true, dto);
  }
}

const PCRPrepareItemContainer = (props: ProjectChangeRequestPrepareItemParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PCRPrepareItemComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          pcrItem={stores.projectChangeRequests.getStandardItemById(props.projectId, props.pcrId, props.itemId)}
          editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
          files={stores.documents.pcrOrPcrItemDocuments(props.projectId, props.itemId)}
          filesEditor={stores.documents.getPcrOrPcrItemDocumentsEditor(props.projectId, props.itemId)}
          onChange={(save, dto) => {
            stores.messages.clearMessages();
            stores.projectChangeRequests.updatePcrEditor(save, props.projectId, dto, "Your document has been removed.", () => stores.navigation.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId: props.projectId, pcrId: props.pcrId })));
          }}
          onFilesChange={(save,dto) => {
            stores.messages.clearMessages();
            const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
            stores.documents.updatePcrOrPcrItemDocumentsEditor(save, props.projectId, props.itemId, dto, successMessage);
          }}
          onFileDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.documents.deletePcrOrPcrItemDocumentsEditor(props.projectId, props.itemId, dto, document, "Your document has been removed.");
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareItemRoute = defineRoute({
  routeName: "projectChangeRequestPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId",
  container: PCRPrepareItemContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getTitle: (store, params, stores) => {
    const typeName = stores.projectChangeRequests.getItemById(params.projectId, params.pcrId, params.itemId).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Upload files to ${typeName}` : "Upload files to project change request item",
      displayTitle: typeName ? `Upload files to ${typeName}` : "Upload files to project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
