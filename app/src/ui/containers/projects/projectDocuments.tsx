import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectOverviewPage } from "../../components";
import { PartnerDto, ProjectDto, ProjectRole } from "../../../types/dtos";
import { Pending } from "../../../shared/pending";
import * as ACC from "../../components";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";
import { IEditorStore } from "../../redux";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";

const bytesInMegabyte = 1048576;

export interface ProjectDocumentPageParams {
  projectId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator>>;
}

interface CombinedData {
  project: ProjectDto;
  partners: PartnerDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>;
}

interface Callbacks {
  validate: (projectId: string, dto: DocumentUploadDto) => void;
  uploadFile: (projectId: string, dto: DocumentUploadDto) => void;
}

class ProjectDocumentsComponent extends ContainerBase<ProjectDocumentPageParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partners: this.props.partners,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private renderContents({project, partners, documents, editor}: CombinedData) {
    const ProjectDocumentsTable = ACC.TypedTable<DocumentSummaryDto>();
    const UploadForm = ACC.TypedForm<{file: File | null}>();

    return (
      <ProjectOverviewPage
        selectedTab={ProjectDocumentsRoute.routeName}
        project={project}
        partners={partners}
        validator={editor.validator}
      >
        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            data={editor.data}
            onChange={dto => this.props.validate(project.id, dto)}
            onSubmit={() => this.props.uploadFile(project.id, editor.data)}
            qa="projectDocumentUpload"
          >
            <UploadForm.Fieldset heading="Upload">
              <UploadForm.FileUpload
                label="Upload documents"
                name="attachment"
                labelHidden={true}
                value={data => data.file}
                update={(dto, file) => dto.file = file}
                validation={editor.validator.file}
              />
            </UploadForm.Fieldset>
            <UploadForm.Submit styling="Secondary">Upload</UploadForm.Submit>
          </UploadForm.Form>
        </ACC.Section>
        <ProjectDocumentsTable.Table data={documents} qa="project-documents">
          <ProjectDocumentsTable.Custom  header="File name" qa="fileName" value={x => this.renderDocumentName(x)}/>
          <ProjectDocumentsTable.ShortDate header="Date uploaded" qa="dateUploaded" value={x => x.dateCreated}/>
          <ProjectDocumentsTable.Custom header="File size" qa="fileSize" value={x => this.renderFileSize(x.fileSize)}/>
          <ProjectDocumentsTable.Email header="Uploaded by" qa="uploadedBy" value={x => x.owner}/>
        </ProjectDocumentsTable.Table>
      </ProjectOverviewPage>
    );
  }

  renderDocumentName(document: DocumentSummaryDto) {
    return <a target={"_blank"} href={document.link}>{document.fileName}</a>;
  }

  renderFileSize(fileSize: number) {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    const valToRender = new Intl.NumberFormat("en-GB", options).format(fileSize/bytesInMegabyte);
    return <span>{valToRender}MB</span>;
  }
}

const container = ReduxContainer.for<ProjectDocumentPageParams, Data, Callbacks>(ProjectDocumentsComponent);

const ProjectDocuments = container.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
    documents: Selectors.getProjectDocuments(props.projectId).getPending(state),
    editor: Selectors.getProjectDocumentEditor(props.projectId).get(state),
  }),
  withCallbacks: (dispatch) => ({
    validate: (projectId, dto) => dispatch(Actions.updateProjectDocumentEditor(projectId, dto)),
    uploadFile: (projectId, dto) => dispatch(Actions.uploadProjectDocument(projectId, dto, () => dispatch(Actions.loadProjectDocuments(projectId))))
  })
});

export const ProjectDocumentsRoute = container.route({
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocuments,
  getParams: (route) => ({ projectId: route.params.projectId }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadProjectDocuments(params.projectId),
  ],
  accessControl: (auth, { projectId }) => auth.for(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
