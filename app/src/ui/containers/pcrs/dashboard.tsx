import React from "react";

import { PCRItemType, PCRStatus } from "@framework/entities";
import { Pending } from "@shared/pending";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { PCRDetailsRoute } from "./details";
import { PCRCreateRoute } from "./create";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { PCRPrepareRoute } from "./prepare";
import { PCRDeleteRoute } from "./delete";

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
        backLink={<ACC.Projects.ProjectBackLink project={project} />}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Renderers.Messages messages={this.props.messages}/>
        <ACC.Section qa="pcr-table">
          {this.renderTable(project, active, "pcrs-active")}
          <ACC.Link route={PCRCreateRoute.getLink({ projectId: this.props.projectId })} className="govuk-button">Start a new request</ACC.Link>
        </ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Past requests">
            {this.renderTable(project, archived, "pcrs-archived")}
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Page>
    );
  }

  private renderTable(project: ProjectDto, pcrs: PCRSummaryDto[], qa: string) {
    const PCRTable = ACC.TypedTable<PCRSummaryDto>();

    return (
      <PCRTable.Table data={pcrs} qa={qa}>
        <PCRTable.Custom qa="number" header="Request number" value={x => x.requestNumber} />
        <PCRTable.Custom qa="types" header="Types" value={x => this.renderTypes(x.items)} />
        <PCRTable.ShortDate qa="started" header="Started" value={x => x.started} />
        <PCRTable.String qa="stauts" header="Status" value={x => x.statusName} />
        <PCRTable.ShortDate qa="lastUpdated" header="Last updated" value={x => x.lastUpdated} />
        <PCRTable.Custom qa="actions" header="Actions" hideHeader={true} value={x => this.renderLinks(project, x)} />
      </PCRTable.Table>
    );
  }

  private renderTypes(items: { type: PCRItemType; typeName: string; }[]): React.ReactNode {
    return items.map(x => x.typeName).reduce<React.ReactNode[]>((a, b, index) => {
      if (index > 0) {
        a.push(<br />);
      }
      a.push(b);
      return a;
    }, []);
  }

  private renderLinks(project: ProjectDto, pcr: PCRSummaryDto): React.ReactNode {
    const links: { route: ILinkInfo, text: string, qa: string; }[] = [];

    const prepareStatus = [PCRStatus.Draft, PCRStatus.QueriedByMonitoringOfficer, PCRStatus.QueriedByInnovateUK];

    if(prepareStatus.indexOf(pcr.status) >= 0 && project.roles & ProjectRole.ProjectManager) {
      links.push({route: PCRPrepareRoute.getLink({pcrId: pcr.id, projectId: pcr.projectId}), text: "Prepare", qa:"pcrPrepareLink"});
    }
    else {
      links.push({route: PCRDetailsRoute.getLink({pcrId: pcr.id, projectId: pcr.projectId}), text: "View", qa:"pcrViewLink"});
    }

    if(pcr.status === PCRStatus.Draft && project.roles & ProjectRole.ProjectManager) {
      links.push({route: PCRDeleteRoute.getLink({pcrId: pcr.id, projectId: pcr.projectId}), text: "Delete", qa:"pcrDeleteLink"});
    }

    return links.map((x,i) => <div key={i} data-qa={x.qa}><ACC.Link route={x.route}>{x.text}</ACC.Link></div>);
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRsDashboardComponent);

export const PCRsDashboard = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcrs: Selectors.getAllPcrs(params.projectId).getPending(state)
  }),
  withCallbacks: () => ({})
});

export const PCRsDashboardRoute = definition.route({
  routeName: "pcrsDashboard",
  routePath: "/projects/:projectId/pcrs/dashboard",
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcrs(params.projectId),
  ],
  getTitle: () => ({
    htmlTitle: "Project change requests",
    displayTitle: "Project change requests"
  }),
  container: PCRsDashboard,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
