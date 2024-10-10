import { BaseProps, defineRoute } from "../../../app/containerBase";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks } from "./ProjectChangeRequestOverviewTasks";
import { usePCRDetailsQuery } from "./projectChangeRequestDetails.logic";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { BackLink } from "@ui/components/atoms/Links/links";

import { useContent } from "@ui/hooks/content.hook";

export interface ProjectChangeRequestDetailsParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const PCRDetailsPage = (props: BaseProps & ProjectChangeRequestDetailsParams) => {
  const { pcr, editableItemTypes, statusChanges, fragmentRef } = usePCRDetailsQuery(props.projectId, props.pcrId);
  const { getContent } = useContent();
  return (
    <Page
      fragmentRef={fragmentRef}
      backLink={
        <BackLink route={props.routes.pcrsDashboard.getLink({ projectId: props.projectId })}>
          {getContent(x => x.pages.pcrOverview.backToPcrs)}
        </BackLink>
      }
    >
      <ProjectChangeRequestOverviewSummary pcr={pcr} projectId={props.projectId} hideAddTypesLink />
      <ProjectChangeRequestOverviewTasks
        pcr={pcr}
        projectId={props.projectId}
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
    auth
      .forProject(projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer),
});
