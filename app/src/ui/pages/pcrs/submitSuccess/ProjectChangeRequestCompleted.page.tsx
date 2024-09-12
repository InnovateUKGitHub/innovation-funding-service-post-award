import { ProjectRole } from "@framework/constants/project";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { ProjectChangeRequestSubmittedForReviewBase } from "./ProjectChangeRequestSubmittedForReviewBase";
import { useContent } from "@ui/hooks/content.hook";

export interface ProjectChangeRequestCompletedParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const ProjectChangeRequestCompletedPage = ({ projectId, pcrId }: BaseProps & ProjectChangeRequestCompletedParams) => {
  const { getContent } = useContent();

  return (
    <ProjectChangeRequestSubmittedForReviewBase
      projectId={projectId}
      pcrId={pcrId}
      title={getContent(x => x.pages.pcrCompleted.title)}
    >
      <ValidationMessage message={getContent(x => x.pages.pcrCompleted.submittedMessage)} messageType="success" />
    </ProjectChangeRequestSubmittedForReviewBase>
  );
};

export const ProjectChangeRequestCompletedRoute = defineRoute<ProjectChangeRequestCompletedParams>({
  routeName: "projectChangeRequestCompleted",
  routePath: "/projects/:projectId/pcrs/:pcrId/completed",
  container: ProjectChangeRequestCompletedPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrCompleted.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
