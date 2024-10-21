import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { ProjectChangeRequestSubmittedForReviewBase } from "./ProjectChangeRequestSubmittedForReviewBase";
import { useContent } from "@ui/hooks/content.hook";

export interface ProjectChangeRequestSubmittedForReviewParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const ProjectChangeRequestSubmittedForReviewPage = ({
  projectId,
  pcrId,
}: BaseProps & ProjectChangeRequestSubmittedForReviewParams) => {
  const { getContent } = useContent();

  return (
    <ProjectChangeRequestSubmittedForReviewBase
      projectId={projectId}
      pcrId={pcrId}
      title={getContent(x => x.pages.pcrSubmittedForReview.title)}
    >
      <ValidationMessage
        message={getContent(x => x.pages.pcrSubmittedForReview.submittedMessage)}
        subMessage={getContent(x => x.pages.pcrSubmittedForReview.submittedSubmessage)}
        messageType="success"
      />
    </ProjectChangeRequestSubmittedForReviewBase>
  );
};

export const ProjectChangeRequestSubmittedForReviewRoute = defineRoute<ProjectChangeRequestSubmittedForReviewParams>({
  routeName: "projectChangeRequestSubmittedForReview",
  routePath: "/projects/:projectId/pcrs/:pcrId/submitted-for-review",
  container: ProjectChangeRequestSubmittedForReviewPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSubmittedForReview.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});
