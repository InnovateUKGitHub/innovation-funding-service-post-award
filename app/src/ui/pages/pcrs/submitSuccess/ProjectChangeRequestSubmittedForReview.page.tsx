import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Button } from "@ui/components/atoms/Button/Button";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useRoutes } from "@ui/context/routesProvider";
import { useProjectChangeRequestSubmittedForReviewQuery } from "./ProjectChangeRequestSubmittedForReview.logic";
import { FullDate } from "@ui/components/atoms/Date";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
import { LineBreakList } from "@ui/components/atoms/LineBreakList/lineBreakList";
import { useContent } from "@ui/hooks/content.hook";
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
  const { pcr, fragmentRef } = useProjectChangeRequestSubmittedForReviewQuery({ projectId, pcrId });

  const pcrsRoute = routes.pcrsDashboard.getLink({ projectId });
  const reviewPcrRoute = routes.pcrDetails.getLink({ projectId, pcrId });

  return (
    <Page
      heading={getContent(x => x.pages.pcrSubmittedForReview.title)}
      backLink={<BackLink route={pcrsRoute}>{getContent(x => x.pages.pcrSubmittedForReview.backLink)}</BackLink>}
      fragmentRef={fragmentRef}
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});
