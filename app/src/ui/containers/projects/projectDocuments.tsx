import React from "react";
import { ContainerBaseWithState, ContainerProps, ReduxContainer } from "../containerBase";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "../../../shared/pending";
import * as ACC from "../../components";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";
import { IEditorStore } from "../../redux";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";
import { ProjectDashboardRoute } from "@ui/containers";

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
  clearMessage: () => void;
  validate: (projectId: string, dto: DocumentUploadDto) => void;
  uploadFile: (projectId: string, dto: DocumentUploadDto) => void;
}

interface State {
  filterBoxText: string | null;
}

class ProjectDocumentsComponent extends ContainerBaseWithState<ProjectDocumentPageParams, Data, Callbacks, State> {

  constructor(props: ContainerProps<ProjectDocumentPageParams, Data, Callbacks>) {
    super(props);
    this.state = {
      filterBoxText: null
    };
  }

  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partners: this.props.partners,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private onFileChange(projectId: string, dto: {file: File | null}) {
    this.props.clearMessage();
    this.props.validate(projectId, dto);
  }

  private renderContents({project, partners, documents, editor}: CombinedData) {
    const UploadForm = ACC.TypedForm<{file: File | null}>();

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project}/>}
        tabs={<ACC.Projects.ProjectNavigation project={project} currentRoute={ProjectDocumentsRoute.routeName} partners={partners}/>}
        validator={editor.validator}
        error={editor.error}
        messages={this.props.messages}
        backLink={<ACC.BackLink route={ProjectDashboardRoute.getLink({})}>Back to all projects</ACC.BackLink>}
        project={project}
      >
        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            onChange={dto => this.onFileChange(project.id, dto)}
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
        <ACC.Section>
          <ACC.Inputs.TextInput name={"filter-box-text"} onChange={x => this.setState({ filterBoxText: x})} placeholder="Search"/>
        </ACC.Section>
        {this.renderDocumentsTable(documents)}
      </ACC.Page>
    );
  }

  renderDocumentName(document: DocumentSummaryDto) {
    return <a target={"_blank"} href={document.link}>{document.fileName}</a>;
  }

  renderDocumentsTable(documents: DocumentSummaryDto[]) {
    const filterText = this.state.filterBoxText;
    const documentsToDisplay = filterText !== null
      ? documents.filter(document => new RegExp(filterText, "gi").test(document.fileName))
      : documents;

    if (documentsToDisplay.length === 0 && documents.length === 0) {
      return <ACC.Renderers.SimpleString qa={"noDocuments"}>No documents uploaded.</ACC.Renderers.SimpleString>;
    }
    if (documentsToDisplay.length === 0 && documents.length > 0) {
      return <ACC.Renderers.SimpleString qa={"noDocuments"}>No documents match.</ACC.Renderers.SimpleString>;
    }
    const ProjectDocumentsTable = ACC.TypedTable<DocumentSummaryDto>();

    return (
      <ProjectDocumentsTable.Table data={documentsToDisplay} qa="project-documents">
          <ProjectDocumentsTable.Custom  header="File name" qa="fileName" value={x => this.renderDocumentName(x)}/>
          <ProjectDocumentsTable.ShortDate header="Date uploaded" qa="dateUploaded" value={x => x.dateCreated}/>
          <ProjectDocumentsTable.Custom header="File size" qa="fileSize" value={x => this.renderFileSize(x.fileSize)}/>
          <ProjectDocumentsTable.Email header="Uploaded by" qa="uploadedBy" value={x => x.owner}/>
        </ProjectDocumentsTable.Table>
    );
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
    clearMessage: () => dispatch(Actions.removeMessages()),
    validate: (projectId, dto) => dispatch(Actions.updateProjectDocumentEditor(projectId, dto)),
    uploadFile: (projectId, dto) => dispatch(Actions.uploadProjectDocument(projectId, dto,
      () => dispatch(Actions.loadProjectDocuments(projectId)), "Your document has been uploaded."))
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
  getTitle: () => ({
    htmlTitle: "Project documents - View project",
    displayTitle: "View project"
  }),
  accessControl: (auth, { projectId }, features) => features.projectDocuments && auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
