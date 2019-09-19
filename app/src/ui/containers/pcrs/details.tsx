import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRViewItemRoute } from "./viewItem";
import { PCRViewReasoningRoute } from "./viewReasoning";
import { Task, TaskList, TaskListSection } from "@ui/components/taskList";
import { PCRDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
}

interface Callbacks {
}

class PCRDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr)} />;
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto) {
    const tabs = [{
      text: "Details",
      hash: "details",
      default: true,
      content: this.renderDetailsTab(projectChangeRequest),
      qa: "ProjectChangeRequestDetailsTab"
    }, {
      text: "Log",
      hash: "log",
      content: this.renderLogTab(),
      qa: "ProjectChangeRequestLogTab"
    }];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.HashTabs tabList={tabs} />
      </ACC.Page>
    );
  }

  private renderDetailsTab(projectChangeRequest: PCRDto ) {
    return (
      <React.Fragment>

        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr_details">
            <ACC.SummaryListItem label="Number" content={projectChangeRequest.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(projectChangeRequest)} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        <TaskList>
          {projectChangeRequest.items.map((x, i) => (
            <TaskListSection step={i + 1} title={x.typeName}>
              <Task
                name="View files"
                status={x.statusName}
                route={PCRViewItemRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: x.id })}
              />
            </TaskListSection>
          ))}
          <TaskListSection step={projectChangeRequest.items.length + 1} title={"View more details"}>
            <Task
              name="Reasoning for Innovate UK"
              status={projectChangeRequest.reasoningStatusName}
              route={PCRViewReasoningRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
            />
          </TaskListSection>
        </TaskList>

      </React.Fragment>
    );
  }

  private renderLogTab() {
    const fakeData: ProjectChangeRequestStatusChangeDto[] = [{
      id: "id_1",
      projectChangeRequest: "projectChangeRequest1",
      name: "Michael Myers",
      previousStatus: "Draft",
      newStatus: "Complete",
      createdDate: new Date()
    }];

    return (
      <ACC.Section title="Log">
        <ACC.Logs data={fakeData} qa="projectChangeRequestStatusChangeTable" />
      </ACC.Section>
    );
  }

  private renderTypes(pcr: PCRDto): React.ReactNode {
    return pcr.items.map(x => x.typeName).reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRDetailsComponent);

export const PCRDetails = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const PCRDetailsRoute = definition.route({
  routeName: "pcrDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/details",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
  ],
  getTitle: () => ({
    htmlTitle: "Project change request details",
    displayTitle: "Project change request details"
  }),
  container: PCRDetails,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
