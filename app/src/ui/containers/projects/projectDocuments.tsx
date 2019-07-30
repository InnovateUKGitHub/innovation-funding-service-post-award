import React from "react";
import { ContainerBaseWithState, ContainerProps, ReduxContainer } from "../containerBase";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "../../../shared/pending";
import * as ACC from "../../components";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";
import { IEditorStore } from "../../redux";
import { MultipleDocumentUpdloadDtoValidator } from "../../validators/documentUploadValidator";
import { getFileSize } from "@framework/util";

export interface ProjectDocumentPageParams {
  projectId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  maxFileSize: number;
  isClient: boolean;
  features: IFeatureFlags;
}

interface CombinedData {
  project: ProjectDto;
  partners: PartnerDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
}

interface Callbacks {
  clearMessage: () => void;
  validate: (projectId: string, dto: MultipleDocumentUploadDto) => void;
  uploadFile: (projectId: string, dto: MultipleDocumentUploadDto) => void;
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

  private onFileChange(projectId: string, dto: MultipleDocumentUploadDto) {
    this.props.clearMessage();
    this.props.validate(projectId, dto);
  }

  private renderContents({ project, partners, documents, editor }: CombinedData) {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project} />}
        backLink={<ACC.Projects.ProjectBackLink project={project} />}
        validator={editor.validator}
        error={editor.error}
        messages={this.props.messages}
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
              <ACC.Info summary="What should I include?">
                <p>You can upload and store any documents relevant for this project. Any documents added to the project by Innovate UK will also be visible here.</p>
                <p>There is no restriction on the type of file you can upload.</p>
                <p>Each document must be:</p>
                <ul>
                  <li>less than {getFileSize(this.props.maxFileSize)} in file size</li>
                  <li>given a unique file name that describes its contents</li>
                </ul>
              </ACC.Info>
              <UploadForm.MulipleFileUpload
                label="Upload documents"
                name="attachment"
                labelHidden={true}
                value={data => data.files}
                update={(dto, files) => dto.files = files || []}
                validation={editor.validator.files}
              />
            </UploadForm.Fieldset>
            <UploadForm.Submit styling="Secondary">Upload</UploadForm.Submit>
          </UploadForm.Form>
        </ACC.Section>
        {this.renderDocumentsSection(documents)}
      </ACC.Page>
    );
  }

  private renderDocumentName(document: DocumentSummaryDto) {
    return <a target={"_blank"} href={document.link}>{document.fileName}</a>;
  }

  private renderDocumentsSection(documents: DocumentSummaryDto[]) {
    const filterText = this.state.filterBoxText;
    const documentsToDisplay = filterText
      ? documents.filter(document => {
        const regex = new RegExp(filterText, "gi");
        return regex.test(document.fileName);
      })
      : documents;

    if (documents.length === 0) {
      return <ACC.Renderers.SimpleString qa={"noDocuments"}>No documents uploaded.</ACC.Renderers.SimpleString>;
    }

    if (documentsToDisplay.length === 0) {
      return (
        <React.Fragment>
          {this.renderDocumentsFilter()}
          <ACC.Renderers.SimpleString qa={"noDocuments"}>No documents match.</ACC.Renderers.SimpleString>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {this.renderDocumentsFilter()}
        {this.renderDocumentsTable(documentsToDisplay)}
      </React.Fragment>
    );
  }

  private renderDocumentsFilter() {
    if (!this.props.isClient || !this.props.features.documentFiltering) {
      return null;
    }
    const FilterForm = ACC.TypedForm<{ filterBoxText: string | null }>();

    return (
      // tslint:disable-next-line:no-empty
      <FilterForm.Form data={this.state} onSubmit={() => {}} onChange={x => this.setState(x)} qa="document-search-form">
        <FilterForm.String name="document-filter" labelHidden={true} value={x => x.filterBoxText} update={(x, v) => x.filterBoxText = v} placeholder="Search documents" />
      </FilterForm.Form>
    );
  }

  private renderDocumentsTable(documentsToDisplay: DocumentSummaryDto[]) {
    const ProjectDocumentsTable = ACC.TypedTable<DocumentSummaryDto>();
    return (
      <ProjectDocumentsTable.Table data={documentsToDisplay} qa="project-documents">
        <ProjectDocumentsTable.Custom header="File name" qa="fileName" value={x => this.renderDocumentName(x)} />
        <ProjectDocumentsTable.ShortDate header="Date uploaded" qa="dateUploaded" value={x => x.dateCreated} />
        <ProjectDocumentsTable.Custom header="File size" qa="fileSize" classSuffix="numeric" value={x => getFileSize(x.fileSize)} />
      </ProjectDocumentsTable.Table>
    );
  }
}

const container = ReduxContainer.for<ProjectDocumentPageParams, Data, Callbacks>(ProjectDocumentsComponent);

const ProjectDocuments = container.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
    documents: Selectors.getProjectDocuments(props.projectId).getPending(state),
    editor: Selectors.getProjectDocumentEditor(props.projectId, state.config).get(state),
    maxFileSize: Selectors.getMaxFileSize(state),
    isClient: state.isClient,
    features: state.config.features
  }),
  withCallbacks: (dispatch) => ({
    clearMessage: () => dispatch(Actions.removeMessages()),
    validate: (projectId, dto) => dispatch(Actions.updateProjectDocumentEditor(projectId, dto)),
    uploadFile: (projectId, dto) => {
      const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
      dispatch(Actions.uploadProjectDocument(projectId, dto, () => dispatch(Actions.loadProjectDocuments(projectId)), successMessage));
    }
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
    displayTitle: "Project documents"
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
