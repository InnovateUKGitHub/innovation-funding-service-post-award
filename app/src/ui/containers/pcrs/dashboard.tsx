import React from "react";
import * as ACC from "../../components";
import { ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { Pending } from "@shared/pending";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { StoresConsumer } from "@ui/redux";
import { PCRStatus } from "@framework/constants";

interface Params {
  projectId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcrs: Pending<PCRSummaryDto[]>;
}

interface Callbacks {
}

class PCRsDashboardComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcrs: this.props.pcrs });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcrs)} />;
  }

  private renderContents(project: ProjectDto, pcrs: PCRSummaryDto[]) {
    const archivedStatuses = [PCRStatus.Approved, PCRStatus.Withdrawn, PCRStatus.Rejected, PCRStatus.Actioned];
    const active = pcrs.filter(x => archivedStatuses.indexOf(x.status) === -1);
    const archived = pcrs.filter(x => archivedStatuses.indexOf(x.status) !== -1);

    return (
      <ACC.Page
        backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section qa="pcr-table">
          {this.renderTable(project, active, "pcrs-active", "You have no ongoing requests.")}
          {this.renderStartANewRequestLink(project)}
        </ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Past requests">
            {this.renderTable(project, archived, "pcrs-archived", "You have no past requests.")}
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Page>
    );
  }

  private renderStartANewRequestLink(project: ProjectDto) {
    const isPm = !!(project.roles & ProjectRole.ProjectManager);

    if (!isPm) return null;

    return (
      <ACC.Link route={this.props.routes.pcrCreate.getLink({ projectId: this.props.projectId })} className="govuk-button">Create request</ACC.Link>
    );
  }

  private renderTable(project: ProjectDto, pcrs: PCRSummaryDto[], qa: string, message: string) {
    const PCRTable = ACC.TypedTable<PCRSummaryDto>();

    if (!pcrs.length) {
      return <ACC.Renderers.SimpleString children={message}/>;
    }

    return (
      <PCRTable.Table data={pcrs} qa={qa}>
        <PCRTable.Custom qa="number" header="Request number" value={x => x.requestNumber} />
        <PCRTable.Custom qa="types" header="Types" value={x => <ACC.Renderers.LineBreakList items={x.items.map(y => y.shortName)}/>} />
        <PCRTable.ShortDate qa="started" header="Started" value={x => x.started} />
        <PCRTable.String qa="stauts" header="Status" value={x => x.statusName} />
        <PCRTable.ShortDate qa="lastUpdated" header="Last updated" value={x => x.lastUpdated} />
        <PCRTable.Custom qa="actions" header="Actions" hideHeader={true} value={x => this.renderLinks(project, x)} />
      </PCRTable.Table>
    );
  }

  private renderLinks(project: ProjectDto, pcr: PCRSummaryDto): React.ReactNode {
    const links: { route: ILinkInfo, text: string, qa: string; }[] = [];

    const prepareStatus = [PCRStatus.Draft, PCRStatus.QueriedByMonitoringOfficer, PCRStatus.QueriedByInnovateUK];

    if(prepareStatus.indexOf(pcr.status) >= 0 && project.roles & ProjectRole.ProjectManager) {
      links.push({route: this.props.routes.pcrPrepare.getLink({pcrId: pcr.id, projectId: pcr.projectId}), text: "Edit", qa:"pcrPrepareLink"});
    }
    else if(pcr.status === PCRStatus.SubmittedToMonitoringOfficer && project.roles & ProjectRole.MonitoringOfficer) {
      links.push({route: this.props.routes.pcrReview.getLink({pcrId: pcr.id, projectId: pcr.projectId}), text: "Review", qa:"pcrReviewLink"});
    }
    else if((project.roles & ProjectRole.ProjectManager | project.roles & ProjectRole.MonitoringOfficer)) {
      links.push({route: this.props.routes.pcrDetails.getLink({pcrId: pcr.id, projectId: pcr.projectId}), text: "View", qa:"pcrViewLink"});
    }

    if(pcr.status === PCRStatus.Draft && project.roles & ProjectRole.ProjectManager) {
      links.push({route: this.props.routes.pcrDelete.getLink({pcrId: pcr.id, projectId: pcr.projectId}), text: "Delete", qa:"pcrDeleteLink"});
    }

    return links.map((x,i) => <div key={i} data-qa={x.qa}><ACC.Link route={x.route}>{x.text}</ACC.Link></div>);
  }
}

const PCRsDashboardContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PCRsDashboardComponent
          project={stores.projects.getById(props.projectId)}
          pcrs={ stores.projectChangeRequests.getAllForProject(props.projectId)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const PCRsDashboardRoute = defineRoute({
  routeName: "pcrsDashboard",
  routePath: "/projects/:projectId/pcrs/dashboard",
  container: PCRsDashboardContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getTitle: () => ({
    htmlTitle: "Project change requests",
    displayTitle: "Project change requests"
  }),
  accessControl: (auth, { projectId }, config) => auth.forProject(projectId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
