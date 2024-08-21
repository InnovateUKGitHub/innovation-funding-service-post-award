import { SalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import {
  pcrItemTypes,
  getPcrItemsSingleInstanceInAnyPcrViolations,
  getPcrItemsSingleInstanceInThisPcrViolations,
  getPcrItemsTooManyViolations,
  PCRItemHiddenReason,
  PCRItemType,
  exclusiveItems,
} from "@framework/constants/pcrConstants";
import { PCRItemSummaryDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { useContent } from "@ui/hooks/content.hook";
import { PcrCreateSchemaType, PcrUpdateTypesSchemaType } from "@ui/zod/pcrValidator.zod";
import { UseFormSetValue } from "react-hook-form";
import { z } from "zod";

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

const usePcrItemExclusivity = (
  pcrs: ReturnType<typeof usePcrItemsForThisCompetition>,
  selectedTypes: (string | PCRItemType)[],
  setValue: UseFormSetValue<z.output<PcrCreateSchemaType | PcrUpdateTypesSchemaType>>,
) => {
  /**
   * N.B. Seems like React Hook Form treats all checkbox values as string
   * Must coerce back and forth :(
   */
  const exclusiveType = exclusiveItems.find(x => selectedTypes.map(Number).includes(x));
  // Deselect everything else if an exclusive type has been selected
  if (exclusiveType && selectedTypes.length > 1) {
    setValue("types", [String(exclusiveType) as unknown as PCRItemType]);
  }

  return pcrs.map(pcrItem => {
    return {
      ...pcrItem,
      disabled: !!exclusiveType && pcrItem.type !== exclusiveType,
    };
  });
};

export { usePcrItemsForThisCompetition, usePcrItemExclusivity };
