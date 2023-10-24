import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { ClaimPeriodDate as ClaimPeriodDateComponent } from "./claimPeriodDate";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import {
  ClaimPeriodDateFragment$data,
  ClaimPeriodDateFragment$key,
} from "./__generated__/ClaimPeriodDateFragment.graphql";
import { useFragment } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimPeriodDateFragment } from "./ClaimPeriodDate.fragment";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { head } from "lodash";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";

export const ClaimPeriodDate = () => {
  const fragmentRef = useFragmentContext();
  if (!isValidFragmentKey<ClaimPeriodDateFragment$key>(fragmentRef, "ClaimPeriodDateFragment")) {
    throw new Error("ClaimPeriodDate is missing a ClaimPeriodDateFragment reference");
  }

  const fragment: ClaimPeriodDateFragment$data = useFragment(claimPeriodDateFragment, fragmentRef);

  const { node: partnerNode } = getFirstEdge(fragment?.query?.ClaimPeriodDate_ProjectParticipant?.edges);

  const partner = mapToPartnerDto(partnerNode, ["isLead", "isWithdrawn", "name"], {});
  const claim = head(
    mapToClaimDtoArray(
      fragment?.query?.ClaimPeriodDate_Claims?.edges ?? [],
      ["periodEndDate", "periodId", "periodStartDate"],
      {},
    ),
  );

  if (!claim) throw new Error("There is no matching claim");

  return <ClaimPeriodDateComponent claim={claim} partner={partner} />;
};
