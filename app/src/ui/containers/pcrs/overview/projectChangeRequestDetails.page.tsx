import { Page, BackLink, Projects } from "@ui/components";
import { BaseProps, defineRoute } from "../../containerBase";
import { useContent } from "@ui/hooks";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks } from "./ProjectChangeRequestOverviewTasks";

import { usePCRDetailsQuery } from "./projectChangeRequestDetails.logic";
import { ProjectRole } from "@framework/types";

export interface ProjectChangeRequestDetailsParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const PCRDetailsPage = (props: BaseProps & ProjectChangeRequestDetailsParams) => {
  const { project, pcr, editableItemTypes, statusChanges } = usePCRDetailsQuery(props.projectId, props.pcrId);
  const { getContent } = useContent();
  return (
    <Page
      backLink={
        <BackLink route={props.routes.pcrsDashboard.getLink({ projectId: project.id })}>
          {getContent(x => x.pages.pcrOverview.backToPcrs)}
        </BackLink>
      }
      pageTitle={<Projects.Title title={project.title} projectNumber={project.projectNumber} />}
      projectStatus={project.status}
    >
      <ProjectChangeRequestOverviewSummary pcr={pcr} projectId={project.id} hideLink isGqlData />
      <ProjectChangeRequestOverviewTasks
        pcr={pcr}
        projectId={project.id}
        editableItemTypes={editableItemTypes}
        mode="details"
      />
      <ProjectChangeRequestOverviewLog statusChanges={statusChanges} />
    </Page>
  );
};

export const PCRDetailsRoute = defineRoute<ProjectChangeRequestDetailsParams>({
  allowRouteInActiveAccess: true,
  routeName: "pcrDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/details",
  container: PCRDetailsPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
