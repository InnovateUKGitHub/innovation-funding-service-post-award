import { useContent } from "@ui/hooks/content.hook";

const useGrantMessage = ({
  hasAvailableGrant,
  hasMatchingGrant,
  originalRemainingGrant,
  grantDifference: newGrantDifference,
}: {
  hasMatchingGrant: boolean;
  hasAvailableGrant: boolean;
  originalRemainingGrant: number;
  grantDifference: number;
}): string | undefined => {
  const { getContent } = useContent();

  // Note: bail out if there is no difference
  if (hasMatchingGrant) return undefined;

  if (hasAvailableGrant) {
    return getContent(x => x.pages.reallocateCostsSummary.availableGrantMessage({ difference: newGrantDifference }));
  }

  return getContent(x =>
    x.pages.reallocateCostsSummary.unavailableGrantMessage({
      difference: newGrantDifference,
      total: originalRemainingGrant,
    }),
  );
};

export { useGrantMessage };
