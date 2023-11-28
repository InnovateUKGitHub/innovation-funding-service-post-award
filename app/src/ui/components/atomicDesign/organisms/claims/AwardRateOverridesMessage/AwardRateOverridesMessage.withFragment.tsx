import { useFragment } from "react-relay";
import {
  AwardRateOverrideMessageProps,
  AwardRateOverridesMessage as AwardRateOverridesMessageComponent,
} from "./AwardRateOverridesMessage";
import {
  AwardRateOverridesMessageFragment$data,
  AwardRateOverridesMessageFragment$key,
} from "./__generated__/AwardRateOverridesMessageFragment.graphql";
import { awardRateOverridesMessageFragment } from "./AwardRateOverridesMessage.fragment";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";

export const AwardRateOverridesMessage = (
  props: Pick<AwardRateOverrideMessageProps, "currentPeriod" | "currentCostCategoryId">,
) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<AwardRateOverridesMessageFragment$key>(fragmentRef, "AwardRateOverridesMessageFragment")) {
    throw new Error("Award Rate Overrides Message is missing a AwardRateOverridesMessageFragment reference");
  }

  const fragment: AwardRateOverridesMessageFragment$data = useFragment(awardRateOverridesMessageFragment, fragmentRef);

  const claimOverrides = mapToClaimOverrides(fragment?.query?.AwardRateOverridesMessage_Profile?.edges ?? []);
  const { isNonFec } = mapToProjectDto(getFirstEdge(fragment?.query?.AwardRateOverridesMessage_Project?.edges).node, [
    "isNonFec",
  ]);

  return <AwardRateOverridesMessageComponent {...props} claimOverrides={claimOverrides} isNonFec={isNonFec} />;
};
