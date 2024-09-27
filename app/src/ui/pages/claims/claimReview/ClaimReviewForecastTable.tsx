import { QueryOptions } from "@gql/hooks/useRefreshQuery";
import { AccordionItem } from "@ui/components/atoms/Accordion/AccordionItem";
import { NewForecastTableWithStandaloneMemo } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.standalone";
import { useReviewContent } from "./claimReview.logic";
import { ReviewClaimParams } from "./claimReview.page";

interface ClaimReviewForecastTableProps extends ReviewClaimParams {
  refreshedQueryOptions?: QueryOptions;
  isOpen?: boolean;
  onClick?: () => void;
}

const ClaimReviewForecastTable = ({
  projectId,
  partnerId,
  periodId,
  isOpen,
  onClick,
  refreshedQueryOptions,
}: ClaimReviewForecastTableProps) => {
  const content = useReviewContent();

  return (
    <AccordionItem qa="forecast-accordion" title={content.accordionTitleForecast} isOpen={isOpen} onClick={onClick}>
      <NewForecastTableWithStandaloneMemo
        projectId={projectId}
        partnerId={partnerId}
        periodId={periodId}
        queryOptions={refreshedQueryOptions}
        isProjectSetup={false}
        isOpen={isOpen}
      />
    </AccordionItem>
  );
};

export { ClaimReviewForecastTable };
