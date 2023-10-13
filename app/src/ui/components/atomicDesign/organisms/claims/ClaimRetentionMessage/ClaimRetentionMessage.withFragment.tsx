import { useFragment } from "react-relay";
import { ClaimRetentionMessage as ClaimRetentionMessageComponent } from "./ClaimRetentionMessage";
import {
  ClaimRetentionMessageFragment$data,
  ClaimRetentionMessageFragment$key,
} from "./__generated__/ClaimRetentionMessageFragment.graphql";
import { claimRetentionMessageFragment } from "./ClaimRetentionMessage.fragment";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToCostSummaryForPeriodDtoArray } from "@gql/dtoMapper/mapCostSummaryForPeriod";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";

export const ClaimRetentionMessage = ({ periodId }: { periodId: PeriodId }) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<ClaimRetentionMessageFragment$key>(fragmentRef, "ClaimRetentionMessageFragment")) {
    throw new Error("Claim Retention Message is missing a ClaimRetentionMessageFragment reference");
  }

  const fragment: ClaimRetentionMessageFragment$data = useFragment(claimRetentionMessageFragment, fragmentRef);

  const { node: partnerNode } = getFirstEdge(fragment?.query?.ClaimRetentionMessage_Partner?.edges);

  const partner = mapToPartnerDto(partnerNode, ["capLimitGrant", "totalParticipantCostsClaimed"], {});

  const claimDetails = mapToClaimDetailsDtoArray(
    fragment?.query?.ClaimRetentionMessage_ClaimDetails?.edges ?? [],
    ["costCategoryId", "periodId", "value"],
    {},
  );

  const costsSummaryForPeriod = mapToCostSummaryForPeriodDtoArray(
    fragment?.query?.ClaimRetentionMessage_CostCategory?.edges ?? [],
    ["costsClaimedThisPeriod"],
    {
      claimDetails,
      periodId,
    },
  );

  const data = {
    partner,
    claimDetails: costsSummaryForPeriod,
  };

  return <ClaimRetentionMessageComponent {...data} />;
};
