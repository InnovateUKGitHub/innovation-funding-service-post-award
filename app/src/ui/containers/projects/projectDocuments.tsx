import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectOverviewPage } from "../../components";
import { PartnerDto, ProjectDto, ProjectRole } from "../../../types/dtos";
import { Pending } from "../../../shared/pending";
import * as Acc from "../../components";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";

const bytesInMegabyte = 1048576;

interface Callbacks {}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
}

interface CombinedData {
  projectDetails: ProjectDto;
  partners: PartnerDto[];
  documents: DocumentSummaryDto[];
}

interface Params {
  projectId: string;
}

class ProjectDocumentsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {

    const combined = Pending.combine({
      projectDetails: this.props.projectDetails,
      partners: this.props.partners,
      documents: this.props.documents,
    });

    return <Acc.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private renderContents({projectDetails, partners, documents}: CombinedData) {
    return (
        <ProjectOverviewPage selectedTab={ProjectDocumentsRoute.routeName} project={projectDetails} partners={partners}>
            {this.renderTable(documents)}
        </ProjectOverviewPage>
    );
  }

  private renderTable(documents: DocumentSummaryDto[]) {
    const ProjectDocumentsTable = Acc.TypedTable<DocumentSummaryDto>();
    return (
      <ProjectDocumentsTable.Table
        qa="project-documents"
        data={documents}
      >
        <ProjectDocumentsTable.Custom  header="File name" qa="fileName" value={x => this.renderDocumentName(x)}/>
        <ProjectDocumentsTable.ShortDate header="Date uploaded" qa="dateUploaded" value={x => x.dateCreated}/>
        <ProjectDocumentsTable.Custom header="File size" qa="fileSize" value={x => this.renderFileSize(x.fileSize)}/>
        <ProjectDocumentsTable.Email header="Uploaded by" qa="uploadedBy" value={x => x.owner}/>
      </ProjectDocumentsTable.Table>
    );
  }

  renderDocumentName(document: DocumentSummaryDto) {
    return (
      <a target={"_blank"} href={document.link}>{document.fileName}</a>
    );
  }

  renderFileSize(fileSize: number) {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    const valToRender = new Intl.NumberFormat("en-GB", options).format(fileSize/bytesInMegabyte);
    return(
      <span>{valToRender}MB</span>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(ProjectDocumentsComponent);

export const ProjectDocuments = containerDefinition.connect({
  withData: (state, props) => ({
    projectDetails: Selectors.getProject(props.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
    documents: Selectors.getProjectDocuments(props.projectId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const ProjectDocumentsRoute = containerDefinition.route({
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/projectDocuments",
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadProjectDocuments(params.projectId),
],
  container: ProjectDocuments,
  accessControl: (auth, { projectId }) => auth.for(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
