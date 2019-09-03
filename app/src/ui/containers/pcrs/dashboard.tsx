import React from "react";

import { Pending } from "@shared/pending";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectDto, ProjectRole } from "@framework/types";
import { range } from "@shared/range";
import { DateTime } from "luxon";
import { PCRItemType, PCRStatus } from "@framework/entities";
import { PCRDetailsRoute } from "./details";
import { PCRCreateRoute } from "./create";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";

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
    const archivedStatuses = [PCRStatus.Approved, PCRStatus.Withdrawn, ];
    const active = pcrs.filter(x => archivedStatuses.indexOf(x.status) === -1);
    const archived = pcrs.filter(x => archivedStatuses.indexOf(x.status) !== -1);

    return (
      <ACC.Page
        backLink={<ACC.Projects.ProjectBackLink project={project} />}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section>
          {this.renderTable(active, "pcrs-active")}
          <ACC.Link route={PCRCreateRoute.getLink({ projectId: this.props.projectId })} className="govuk-button">Start a new request</ACC.Link>
        </ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Past requests">
            {this.renderTable(archived, "pcrs-archived")}
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Page>
    );
  }

  private renderTable(pcrs: PCRSummaryDto[], qa: string) {
    const PCRTable = ACC.TypedTable<PCRSummaryDto>();

    return (
      <PCRTable.Table data={pcrs} qa={qa}>
        <PCRTable.Custom qa="number" header="Request number" value={x => x.requestNumber} />
        <PCRTable.Custom qa="types" header="Types" value={x => this.renderTypes(x.items)} />
        <PCRTable.ShortDate qa="started" header="Started" value={x => x.started} />
        <PCRTable.String qa="stauts" header="Status" value={x => x.statusName} />
        <PCRTable.ShortDate qa="lastUpdated" header="Last updated" value={x => x.lastUpdated} />
        <PCRTable.Link qa="actions" header="Actions" hideHeader={true} value={x => PCRDetailsRoute.getLink({ projectId: this.props.projectId, pcrId: x.id })} content="View" />
      </PCRTable.Table>
    );
  }

  renderTypes(items: { type: PCRItemType; typeName: string; }[]): React.ReactNode {
    return items.map(x => x.typeName).reduce<React.ReactNode[]>((a, b, index) => {
      if (index > 0) {
        a.push(<br />);
      }
      a.push(b);
      return a;
    }, []);
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
