import React from "react";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "../containerBase";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "../../../shared/pending";
import * as ACC from "../../components";
import { IEditorStore } from "../../redux";
import { MultipleDocumentUpdloadDtoValidator } from "../../validators/documentUploadValidator";
import { getFileSize } from "@framework/util";
import { StoresConsumer } from "@ui/redux";

export interface ProjectDocumentPageParams {
  projectId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  isClient: boolean;
}

interface CombinedData {
  project: ProjectDto;
  partners: PartnerDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
}

interface Callbacks {
  onChange: (save: boolean, dto: MultipleDocumentUploadDto) => void;
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

  private renderContents({ project, partners, documents, editor }: CombinedData) {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project} />}
        backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        validator={editor.validator}
        error={editor.error}
        project={project}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section title="Upload">
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            onChange={dto => this.props.onChange(false, dto)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="projectDocumentUpload"
          >
            <UploadForm.Fieldset>
              <ACC.DocumentGuidance
                additionalComments={"You can upload and store any documents relevant for this project. Any documents added to the project by Innovate UK will also be visible here."}
              />
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
    return <a target={"_blank"} href={document.link} className="govuk-link">{document.fileName}</a>;
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
      return <ACC.ValidationMessage qa={"noDocuments"} message="No documents uploaded." messageType="info" />;
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
    if (!this.props.isClient || !this.props.config.features.documentFiltering) {
      return null;
    }
    const FilterForm = ACC.TypedForm<{ filterBoxText: string | null }>();

    return (
      // tslint:disable-next-line:no-empty
      <FilterForm.Form data={this.state} onSubmit={() => { }} onChange={x => this.setState(x)} qa="document-search-form">
        <FilterForm.Search name="document-filter" labelHidden={true} value={x => x.filterBoxText} update={(x, v) => x.filterBoxText = v} placeholder="Search documents" />
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

const ProjectDocumentsContainer = (props: ProjectDocumentPageParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ProjectDocumentsComponent
        project={stores.projects.getById(props.projectId)}
        partners={stores.partners.getPartnersForProject(props.projectId)}
        documents={stores.projectDocuments.getProjectDocuments(props.projectId)}
        isClient={stores.config.isClient()}
        editor={stores.projectDocuments.getProjectDocumentEditor(props.projectId)}
        onChange={(saving, dto) => {
          stores.messages.clearMessages();
          const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
          stores.projectDocuments.updateProjectDocumentsEditor(saving, props.projectId, dto, successMessage);
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectDocumentsRoute = defineRoute({
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocumentsContainer,
  getParams: (route) => ({ projectId: route.params.projectId }),
  getTitle: () => ({
    htmlTitle: "Project documents - View project",
    displayTitle: "Project documents"
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
