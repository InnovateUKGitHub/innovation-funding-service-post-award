import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components/index";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/index";
import * as Selectors from "../../redux/selectors/index";
import { ProjectDto, ProjectRole } from "../../../types/dtos";
import { AllClaimsDashboardRoute} from "../claims";

interface Data {
  projectDetails: Pending<ProjectDto>;
}

interface Params {
  projectId: string;
  periodId: number;
}

interface Callbacks {
}

class PrepareMonitoringReportComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({projectDetails: this.props.projectDetails});
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.projectDetails)} />;
  }

  private renderContents(project: ProjectDto) {
    return(
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={AllClaimsDashboardRoute.getLink({ projectId: project.id})}>Back to project</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="Monitoring report" project={project} />
      </ACC.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(PrepareMonitoringReportComponent);

const PrepareMonitoringReport = containerDefinition.connect({
  withData: (state, props) => ({
    projectDetails: Selectors.getProject(props.projectId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const PrepareMonitoringReportRoute = containerDefinition.route({
  routeName: "prepareMonitoringReport",
  routePath: "/projects/:projectId/monitoring-reports/:periodId/prepare",
  getParams: (r) => ({ projectId: r.params.projectId, partnerId: r.params.partnerId, periodId: r.params.periodId }),
  accessControl: (auth, { projectId }) => auth.for(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
  ],
  container: PrepareMonitoringReport
});
