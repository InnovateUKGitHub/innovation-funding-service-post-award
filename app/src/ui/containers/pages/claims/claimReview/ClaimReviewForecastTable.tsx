import { QueryOptions } from "@gql/hooks/useRefreshQuery";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { NewForecastTableWithStandaloneMemo } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.standalone";
import { useReviewContent } from "./claimReview.logic";
import { ReviewClaimParams } from "./claimReview.page";

interface ClaimReviewForecastTableProps extends ReviewClaimParams {
  refreshedQueryOptions: QueryOptions;
  isOpen?: boolean;
  onClick?: () => void;
}

const ClaimReviewForecastTable = ({
  projectId,
  partnerId,
  isOpen,
  onClick,
  refreshedQueryOptions,
}: ClaimReviewForecastTableProps) => {
  const content = useReviewContent();

  return (
    <AccordionItem qa="forecast-accordion" title={content.accordionTitleForecast} isOpen={isOpen} onClick={onClick}>
      <NewForecastTableWithStandaloneMemo
        projectId={projectId}
        projectParticipantId={partnerId}
        queryOptions={refreshedQueryOptions}
        isProjectSetup={false}
        isOpen={isOpen}
      />
    </AccordionItem>
  );
};

export { ClaimReviewForecastTable };
