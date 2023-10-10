import { BaseProps, defineRoute } from "../../../containerBase";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks } from "./ProjectChangeRequestOverviewTasks";
import { usePCRDetailsQuery } from "./projectChangeRequestDetails.logic";
import { ProjectRole } from "@framework/constants/project";
import { Page } from "@ui/components/bjss/Page/page";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { useContent } from "@ui/hooks/content.hook";
import { PCRPrintRoute } from "./projectChangeRequestPrint.page";

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
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
      projectStatus={project.status}
    >
      <ProjectChangeRequestOverviewSummary pcr={pcr} projectId={project.id} hideAddTypesLink />
      <ProjectChangeRequestOverviewTasks
        pcr={pcr}
        projectId={project.id}
        editableItemTypes={editableItemTypes}
        mode="details"
      />
      <ProjectChangeRequestOverviewLog statusChanges={statusChanges} />

      <Link
        className="govuk-body"
        route={PCRPrintRoute.getLink({ projectId: props.projectId, pcrId: props.pcrId, backMode: "details" })}
      >
        Access a printable version of this PCR
      </Link>
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
