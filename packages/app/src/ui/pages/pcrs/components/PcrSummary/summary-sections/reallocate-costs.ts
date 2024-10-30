import { PcrSummaryMultiplePartnerFinancialVirement, SummaryLogicProps } from "../pcr-summary.interface";

/**
 * Gets the Partner Summary Data
 */
export function partnerSummaryData(data: SummaryLogicProps): PcrSummaryMultiplePartnerFinancialVirement {
  const projectCostsOfPartners = findPartnersWithVirements(data);
  const hasAvailablePartners = !!projectCostsOfPartners.length;

  const initialTotals = { totalOriginalGrant: 0, totalNewGrant: 0 };

  const grantTotals = projectCostsOfPartners.reduce<typeof initialTotals>((totals, x) => {
    const totalOriginalGrant = totals.totalOriginalGrant + x.partnerVirement.originalRemainingGrant;
    const totalNewGrant = totals.totalNewGrant + x.partnerVirement.newRemainingGrant;

    return { totalOriginalGrant, totalNewGrant };
  }, initialTotals);

  const newGrantDifference: number = grantTotals.totalNewGrant - grantTotals.totalOriginalGrant;

  // Note: Grant must not exceed original value
  const hasAvailableGrant: boolean = newGrantDifference < 0;
  const hasMatchingGrant: boolean = newGrantDifference === 0;
  const isValidGrantTotal: boolean = hasAvailableGrant || hasMatchingGrant;

  return {
    isSummaryValid: isValidGrantTotal && hasAvailablePartners,
    data: {
      ...grantTotals,
      hasAvailableGrant,
      hasMatchingGrant,
      newGrantDifference,
      projectCostsOfPartners,
    },
  };
}

type IPartnerMatchingVirements = PcrSummaryMultiplePartnerFinancialVirement["data"]["projectCostsOfPartners"];

/**
 * Finds partners with virements
 */
function findPartnersWithVirements({ partners, virement }: SummaryLogicProps) {
  return partners.reduce<IPartnerMatchingVirements>((tableRows, partner) => {
    const partnerVirement = virement.partners.find(x => x.partnerId === partner.id);

    // Note: Remove partners with no virement
    if (!partnerVirement) return tableRows;

    return [
      ...tableRows,
      {
        partner,
        partnerVirement,
      },
    ];
  }, []);
}
