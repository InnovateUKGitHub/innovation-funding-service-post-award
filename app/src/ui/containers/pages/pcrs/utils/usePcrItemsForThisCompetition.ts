import { SalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import {
  pcrItemTypes,
  getPcrItemsSingleInstanceInAnyPcrViolations,
  getPcrItemsSingleInstanceInThisPcrViolations,
  getPcrItemsTooManyViolations,
  PCRItemDisabledReason,
} from "@framework/constants/pcrConstants";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { useContent } from "@ui/hooks/content.hook";

const usePcrItemsForThisCompetition = (
  competitionType: SalesforceCompetitionTypes,
  allPcrs: Pick<PCRSummaryDto, "status" | "items" | "id">[],
  pcrId: PcrId | undefined,
  numberOfPartners: number,
) => {
  const { getContent } = useContent();

  const items = pcrItemTypes.filter(x => !(x.ignoredCompetitions.includes(competitionType) || x.deprecated));

  const anyOtherPcrViolations = getPcrItemsSingleInstanceInAnyPcrViolations(allPcrs);
  const thisPcrViolations = getPcrItemsSingleInstanceInThisPcrViolations(allPcrs.find(x => x.id === pcrId));
  const tooManyViolations = getPcrItemsTooManyViolations(
    numberOfPartners,
    allPcrs.find(x => x.id === pcrId),
  );

  return items.map(pcrItem => {
    let disabledReason = PCRItemDisabledReason.None;

    if (thisPcrViolations.includes(pcrItem.type)) {
      disabledReason = PCRItemDisabledReason.ThisPcrAlreadyHasThisType;
    } else if (anyOtherPcrViolations.includes(pcrItem.type)) {
      disabledReason = PCRItemDisabledReason.AnotherPcrAlreadyHasThisType;
    } else if (tooManyViolations.includes(pcrItem.type)) {
      disabledReason = PCRItemDisabledReason.NotEnoughPartnersToActionThisType;
    }

    return {
      item: pcrItem,
      displayName: (pcrItem.i18nName ? getContent(pcrItem.i18nName) : pcrItem.displayName) ?? pcrItem.typeName,
      type: pcrItem.type,
      disabled: disabledReason !== PCRItemDisabledReason.None,
      disabledReason,
    };
  });
};

export { usePcrItemsForThisCompetition };
