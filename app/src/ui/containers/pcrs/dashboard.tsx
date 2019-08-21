import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { range } from "@shared/range";
import { DateTime } from "luxon";
import { PCRItemType, PCRItemStatus } from "@framework/entities";

interface PCRDto {
  requestNumber: number;
  items:{
    type: PCRItemType;
    typeName: string;
  }[],
  started: Date;
  lastUpdated: Date;
  status: PCRItemStatus;
  statusName: string;
}

interface Params {
  projectId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcrs: Pending<PCRDto[]>;
}

interface Callbacks {
}

class PCRsDashboardComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({project: this.props.project, pcrs: this.props.pcrs});

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcrs)} />;
  }

  private renderContents(project: ProjectDto, pcrs: PCRDto[]) {
    const active = pcrs.filter(x => x.statusName !== "Approved");
    const archived = pcrs.filter(x => x.statusName === "Approved");

    return (
      <ACC.Page
        backLink={<ACC.Projects.ProjectBackLink project={project} />}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section>
          {this.renderTable(active, "pcrs-active")}
        </ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Past requests">
            {this.renderTable(archived, "pcrs-archived")}
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Page>
    );
  }

  private renderTable(pcrs: PCRDto[], qa: string) {
    const PCRTable = ACC.TypedTable<PCRDto>();

    return (
      <PCRTable.Table data={pcrs} qa={qa}>
        <PCRTable.Custom qa="number" header="Request number" value={x => x.requestNumber}/>
        <PCRTable.Custom qa="types" header="Types" value={x => this.renderTypes(x.items)}/>
        <PCRTable.ShortDate qa="started" header="Started" value={x => x.started}/>
        <PCRTable.String qa="stauts" header="Status" value={x => x.statusName}/>
        <PCRTable.ShortDate qa="lastUpdated" header="Last updated" value={x => x.lastUpdated}/>
      </PCRTable.Table>
    );
  }

  renderTypes(items: { type: PCRItemType; typeName: string; }[]): React.ReactNode {
    return items.map(x => x.typeName).reduce<React.ReactNode[]>((a, b, index) => {
      if(index> 0){
        a.push(<br/>);
      }
      a.push(b);
      return a;
    },[])
  }

}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRsDashboardComponent);
const fakeItemTypes = ["Scope", "Duration", "Cost", "Partner"];
const fakeStatus = ["Approved", "Draft", "Submitted to MO", "Queried", "Submitted to IUK"];
const fakePcrs = range(10).map<PCRDto>((x,i) => ({
  requestNumber:x,
  items: range((x % fakeItemTypes.length) + 1).map(y => ({typeName:fakeItemTypes[y % (fakeItemTypes.length - 1)], type:  PCRItemType.Unknown})),
  started: DateTime.local().minus({months: 1}).plus({days:x}).toJSDate(),
  lastUpdated: DateTime.local().minus({months: 1}).plus({days:x + 15}).toJSDate(),
  statusName: fakeStatus[i % 5],
  status: PCRItemStatus.Unknown,
})).reverse();

export const PCRsDashboard = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcrs: Pending.done(fakePcrs)
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
    Actions.loadProject(params.projectId)
  ],
  getTitle: () => ({
    htmlTitle: "Project change requests",
    displayTitle: "Project change requests"
  }),
  container: PCRsDashboard,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
