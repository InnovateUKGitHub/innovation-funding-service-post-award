import { SalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import {
  pcrItemTypes,
  getPcrItemsSingleInstanceInAnyPcrViolations,
  getPcrItemsSingleInstanceInThisPcrViolations,
  getPcrItemsTooManyViolations,
  PCRItemHiddenReason,
  PCRItemType,
} from "@framework/constants/pcrConstants";
import { PCRItemSummaryDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { useContent } from "@ui/hooks/content.hook";

const usePcrItemsForThisCompetition = (
  competitionType: SalesforceCompetitionTypes,
  allPcrs: (Pick<PCRSummaryDto, "status" | "id"> & { items: Pick<PCRItemSummaryDto, "type">[] })[],
  pcrId: PcrId | undefined,
  numberOfPartners: number,
) => {
  const { getContent } = useContent();
  const { features } = useClientConfig();

  const items = pcrItemTypes
    .filter(x => !(x.ignoredCompetitions.includes(competitionType) || x.deprecated))
    .filter(
      x =>
        x.type !== PCRItemType.ApproveNewSubcontractor ||
        (x.type === PCRItemType.ApproveNewSubcontractor && features.approveNewSubcontractor),
    );

  const anyOtherPcrViolations = getPcrItemsSingleInstanceInAnyPcrViolations(allPcrs);
  const thisPcrViolations = getPcrItemsSingleInstanceInThisPcrViolations(allPcrs.find(x => x.id === pcrId));
  const tooManyViolations = getPcrItemsTooManyViolations(
    numberOfPartners,
    allPcrs.find(x => x.id === pcrId),
  );

  return items.map(pcrItem => {
    let hiddenReason = PCRItemHiddenReason.None;

    if (thisPcrViolations.includes(pcrItem.type)) {
      hiddenReason = PCRItemHiddenReason.ThisPcrAlreadyHasThisType;
    } else if (anyOtherPcrViolations.includes(pcrItem.type)) {
      hiddenReason = PCRItemHiddenReason.AnotherPcrAlreadyHasThisType;
    } else if (tooManyViolations.includes(pcrItem.type)) {
      hiddenReason = PCRItemHiddenReason.NotEnoughPartnersToActionThisType;
    }

    return {
      item: pcrItem,
      displayName: (pcrItem.i18nName ? getContent(pcrItem.i18nName) : pcrItem.displayName) ?? pcrItem.typeName,
      type: pcrItem.type,
      hidden: hiddenReason !== PCRItemHiddenReason.None,
      hiddenReason,
    };
  });
};

export { usePcrItemsForThisCompetition };
