import { Button } from "@ui/components/atoms/Button/Button";
import { FullDate } from "@ui/components/atoms/Date";
import { LineBreakList } from "@ui/components/atoms/LineBreakList/lineBreakList";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { useRoutes } from "@ui/context/routesProvider";
import { useContent } from "@ui/hooks/content.hook";
import { ReactNode } from "react";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
import { useGetPcrStatusMetadata } from "../utils/useGetPcrStatusMetadata";
import { useProjectChangeRequestSubmittedForReviewQuery } from "./ProjectChangeRequestSubmittedForReview.logic";
import { skipToItemItems } from "@framework/constants/pcrConstants";

export interface ProjectChangeRequestSubmittedForReviewBaseParams {
  projectId: ProjectId;
  pcrId: PcrId;
  title: string;
  children?: ReactNode;
}

const ProjectChangeRequestSubmittedForReviewBase = ({
  projectId,
  pcrId,
  title,
  children,
}: ProjectChangeRequestSubmittedForReviewBaseParams) => {
  const routes = useRoutes();
  const { getPcrItemContent } = useGetPcrItemMetadata();
  const { getPcrStatusName } = useGetPcrStatusMetadata();
  const { getContent } = useContent();
  const { pcr, fragmentRef } = useProjectChangeRequestSubmittedForReviewQuery({ projectId, pcrId });

  const reviewPcrRoute = routes.pcrDetails.getLink({ projectId, pcrId });
  const reviewPcrItemRoute = routes.pcrViewItem.getLink({ projectId, pcrId, itemId: pcr.items[0].id });
  const skipToItem = pcr.items.some(x => skipToItemItems.includes(x.type));
  const pcrsRoute = routes.pcrsDashboard.getLink({ projectId });

  return (
    <Page
      heading={title}
      backLink={<BackLink route={pcrsRoute}>{getContent(x => x.pages.pcrSubmittedForReview.backLink)}</BackLink>}
      fragmentRef={fragmentRef}
    >
      {children}

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
        <Link route={skipToItem ? reviewPcrItemRoute : reviewPcrRoute}>
          {getContent(x => x.pages.pcrSubmittedForReview.reviewLink)}
        </Link>
      </P>
      <Link route={pcrsRoute}>
        <Button styling="Primary">{getContent(x => x.pages.pcrSubmittedForReview.backButton)}</Button>
      </Link>
    </Page>
  );
};

export { ProjectChangeRequestSubmittedForReviewBase };
