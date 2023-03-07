import { PCRItemDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";

/**
 * Convert a Salesforce PCR name to an internationalised PCR name.
 *
 * @param value The Salesforce name of the PCR type
 */
export const usePcrItemName = () => {
  const { getContent } = useContent();

  return {
    getPcrItemName: (value?: string, pcr?: PCRItemDto): string => {
      let label = "";

      switch (value) {
        case "Account Name Change":
          label += getContent(x => x.pcrTypes.accountNameChange);
          break;
        case "Add a partner":
          label += getContent(x => x.pcrTypes.addAPartner);
          break;
        case "Between Partner Financial Virement":
          label += getContent(x => x.pcrTypes.betweenPartnerFinancialVirement);
          break;
        case "Change a partner's name":
          label += getContent(x => x.pcrTypes.changeAPartnersName);
          break;
        case "Change Loans Duration":
          label += getContent(x => x.pcrTypes.changeLoansDuration);
          break;
        case "Change period length":
          label += getContent(x => x.pcrTypes.changePeriodLength);
          break;
        case "Change project duration":
          label += getContent(x => x.pcrTypes.changeProjectDuration);
          break;
        case "Change project scope":
          label += getContent(x => x.pcrTypes.changeProjectScope);
          break;
        case "End the project early":
          label += getContent(x => x.pcrTypes.endTheProjectEarly);
          break;
        case "Financial Virement":
          label += getContent(x => x.pcrTypes.financialVirement);
          break;
        case "Loan Drawdown Change":
          label += getContent(x => x.pcrTypes.loanDrawdownChange);
          break;
        case "Multiple Partner Financial Virement":
          label += getContent(x => x.pcrTypes.multiplePartnerFinancialVirement);
          break;
        case "Partner Addition":
          label += getContent(x => x.pcrTypes.partnerAddition);
          break;
        case "Partner Withdrawal":
          label += getContent(x => x.pcrTypes.partnerWithdrawl);
          break;
        case "Project Suspension":
          label += getContent(x => x.pcrTypes.projectSuspension);
          break;
        case "Project Termination":
          label += getContent(x => x.pcrTypes.projectTermination);
          break;
        case "Put project on hold":
          label += getContent(x => x.pcrTypes.putProjectOnHold);
          break;
        case "Reallocate one partner's project costs":
          label += getContent(x => x.pcrTypes.reallocateOnePartnersProjectCost);
          break;
        case "Reallocate several partners' project cost":
          label += getContent(x => x.pcrTypes.reallocateSeveralPartnersProjectCost);
          break;
        case "Remove a partner":
          label += getContent(x => x.pcrTypes.removeAPartner);
          break;
        case "Request Header":
          label += getContent(x => x.pcrTypes.requestHeader);
          break;
        case "Scope Change":
          label += getContent(x => x.pcrTypes.scopeChange);
          break;
        case "Single Partner Financial Virement":
          label += getContent(x => x.pcrTypes.singlePartnerFinancialVirement);
          break;
        case "Time Extension":
          label += getContent(x => x.pcrTypes.timeExtension);
          break;
        default:
          label += getContent(x => x.pcrTypes.unknown);
          break;
      }

      if (pcr) {
        if ("organisationName" in pcr && pcr.organisationName) {
          label += ` (${pcr.organisationName})`;
        } else if ("accountName" in pcr && pcr.accountName) {
          label += ` (${pcr.accountName})`;
        } else if ("partnerNameSnapshot" in pcr && pcr.partnerNameSnapshot) {
          label += ` (${pcr.partnerNameSnapshot})`;
        }
      }

      return label;
    },
  } as const;
};
