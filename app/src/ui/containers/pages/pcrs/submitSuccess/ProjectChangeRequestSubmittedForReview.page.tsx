import { ProjectRole } from "@framework/constants/project";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useRoutes } from "@ui/redux/routesProvider";
import { useProjectChangeRequestSubmittedForReviewQuery } from "./ProjectChangeRequestSubmittedForReview.logic";
import { FullDate } from "@ui/components/atomicDesign/atoms/Date";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { useContent } from "@ui/hooks/content.hook";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { useGetPcrStatusMetadata } from "../utils/useGetPcrStatusMetadata";

export interface ProjectChangeRequestSubmittedForReviewParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const ProjectChangeRequestSubmittedForReviewPage = ({
  projectId,
  pcrId,
}: BaseProps & ProjectChangeRequestSubmittedForReviewParams) => {
  const routes = useRoutes();
  const { getPcrItemContent } = useGetPcrItemMetadata();
  const { getPcrStatusName } = useGetPcrStatusMetadata();
  const { getContent } = useContent();
  const { project, pcr } = useProjectChangeRequestSubmittedForReviewQuery({ projectId, pcrId });

  const pcrsRoute = routes.pcrsDashboard.getLink({ projectId });
  const reviewPcrRoute = routes.pcrDetails.getLink({ projectId, pcrId });

  return (
    <Page
      pageTitle={
        <Title
          title={project.title}
          projectNumber={project.projectNumber}
          heading={getContent(x => x.pages.pcrSubmittedForReview.title)}
        />
      }
      isActive={project.isActive}
      backLink={<BackLink route={pcrsRoute}>{getContent(x => x.pages.pcrSubmittedForReview.backLink)}</BackLink>}
    >
      <ValidationMessage
        message={getContent(x => x.pages.pcrSubmittedForReview.submittedMessage)}
        subMessage={getContent(x => x.pages.pcrSubmittedForReview.submittedSubmessage)}
        messageType="success"
      />

      <SummaryList>
        <SummaryListItem label={getContent(x => x.pcrLabels.requestNumber)} content={pcr.requestNumber} />
        <SummaryListItem
          label={getContent(x => x.pcrLabels.requestType)}
          content={
            <LineBreakList
              items={pcr.items.map(x => (
                <span key={x.id}>{getPcrItemContent(x.type).label}</span>
              ))}
            />
          }
        />
        <SummaryListItem
          label={getContent(x => x.pcrLabels.requestStarted)}
          content={<FullDate value={pcr.started} />}
        />
        <SummaryListItem label={getContent(x => x.pcrLabels.requestStatus)} content={getPcrStatusName(pcr.status)} />
        <SummaryListItem
          label={getContent(x => x.pcrLabels.requestLastUpdated)}
          content={<FullDate value={pcr.lastUpdated} />}
        />
      </SummaryList>

      <P>
        <Link route={reviewPcrRoute}>{getContent(x => x.pages.pcrSubmittedForReview.reviewLink)}</Link>
      </P>
      <Link route={pcrsRoute}>
        <Button styling="Primary">{getContent(x => x.pages.pcrSubmittedForReview.backButton)}</Button>
      </Link>
    </Page>
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
