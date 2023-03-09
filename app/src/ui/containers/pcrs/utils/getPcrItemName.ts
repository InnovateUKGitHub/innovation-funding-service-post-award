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
    getPcrItemContent: (value?: string, pcr?: PCRItemDto) => {
      let name: string;

      switch (value) {
        case "Account Name Change":
          name = getContent(x => x.pcrTypes.accountNameChange);
          break;
        case "Add a partner":
          name = getContent(x => x.pcrTypes.addAPartner);
          break;
        case "Between Partner Financial Virement":
          name = getContent(x => x.pcrTypes.betweenPartnerFinancialVirement);
          break;
        case "Change a partner's name":
          name = getContent(x => x.pcrTypes.changeAPartnersName);
          break;
        case "Change Loans Duration":
          name = getContent(x => x.pcrTypes.changeLoansDuration);
          break;
        case "Change period length":
          name = getContent(x => x.pcrTypes.changePeriodLength);
          break;
        case "Change project duration":
          name = getContent(x => x.pcrTypes.changeProjectDuration);
          break;
        case "Change project scope":
          name = getContent(x => x.pcrTypes.changeProjectScope);
          break;
        case "End the project early":
          name = getContent(x => x.pcrTypes.endTheProjectEarly);
          break;
        case "Financial Virement":
          name = getContent(x => x.pcrTypes.financialVirement);
          break;
        case "Loan Drawdown Change":
          name = getContent(x => x.pcrTypes.loanDrawdownChange);
          break;
        case "Multiple Partner Financial Virement":
          name = getContent(x => x.pcrTypes.multiplePartnerFinancialVirement);
          break;
        case "Partner Addition":
          name = getContent(x => x.pcrTypes.partnerAddition);
          break;
        case "Partner Withdrawal":
          name = getContent(x => x.pcrTypes.partnerWithdrawl);
          break;
        case "Project Suspension":
          name = getContent(x => x.pcrTypes.projectSuspension);
          break;
        case "Project Termination":
          name = getContent(x => x.pcrTypes.projectTermination);
          break;
        case "Put project on hold":
          name = getContent(x => x.pcrTypes.putProjectOnHold);
          break;
        case "Reallocate project costs":
        case "Reallocate one partner's project costs":
          name = getContent(x => x.pcrTypes.reallocateOnePartnersProjectCost);
          break;
        case "Reallocate several partners' project cost":
          name = getContent(x => x.pcrTypes.reallocateSeveralPartnersProjectCost);
          break;
        case "Remove a partner":
          name = getContent(x => x.pcrTypes.removeAPartner);
          break;
        case "Request Header":
          name = getContent(x => x.pcrTypes.requestHeader);
          break;
        case "Scope Change":
          name = getContent(x => x.pcrTypes.scopeChange);
          break;
        case "Single Partner Financial Virement":
          name = getContent(x => x.pcrTypes.singlePartnerFinancialVirement);
          break;
        case "Time Extension":
          name = getContent(x => x.pcrTypes.timeExtension);
          break;
        default:
          name = getContent(x => x.pcrTypes.unknown);
          break;
      }

      let label = name;

      if (pcr) {
        if ("organisationName" in pcr && pcr.organisationName) {
          label += ` (${pcr.organisationName})`;
        } else if ("accountName" in pcr && pcr.accountName) {
          label += ` (${pcr.accountName})`;
        } else if ("partnerNameSnapshot" in pcr && pcr.partnerNameSnapshot) {
          label += ` (${pcr.partnerNameSnapshot})`;
        }
      }

      return {
        name,
        label,
      };
    },
  } as const;
};
