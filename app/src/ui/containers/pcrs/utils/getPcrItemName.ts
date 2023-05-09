import { PCRItemDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";

/**
 * Convert a Salesforce PCR name to an internationalized PCR name.
 */
export const usePcrItemName = () => {
  const { getContent } = useContent();

  return {
    getPcrItemContent: (value?: string, pcr?: PCRItemDto) => {
      let name: string;
      let description: string | undefined = undefined;

      switch (value) {
        case "Account Name Change":
          name = getContent(x => x.pcrTypes.accountNameChange);
          description = getContent(x => x.pages.pcrModifyOptions.changePartnersNameMessage);
          break;
        case "Add a partner":
          name = getContent(x => x.pcrTypes.addAPartner);
          description = getContent(x => x.pages.pcrModifyOptions.addPartnerMessage);
          break;
        case "Between Partner Financial Virement":
          name = getContent(x => x.pcrTypes.betweenPartnerFinancialVirement);
          description = getContent(x => x.pages.pcrModifyOptions.reallocateCostsMessage);
          break;
        case "Change a partner's name":
          name = getContent(x => x.pcrTypes.changeAPartnersName);
          description = getContent(x => x.pages.pcrModifyOptions.changePartnersNameMessage);
          break;
        case "Change Loans Duration":
          name = getContent(x => x.pcrTypes.changeLoansDuration);
          description = getContent(x => x.pages.pcrModifyOptions.changeDurationMessage);
          break;
        case "Change period length":
          name = getContent(x => x.pcrTypes.changePeriodLength);
          break;
        case "Change project duration":
          name = getContent(x => x.pcrTypes.changeProjectDuration);
          description = getContent(x => x.pages.pcrModifyOptions.changeDurationMessage);
          break;
        case "Change project scope":
          name = getContent(x => x.pcrTypes.changeProjectScope);
          description = getContent(x => x.pages.pcrModifyOptions.changeScopeMessage);
          break;
        case "End the project early":
          name = getContent(x => x.pcrTypes.endTheProjectEarly);
          description = getContent(x => x.pages.pcrModifyOptions.endProjectEarlyMessage);
          break;
        case "Financial Virement":
          name = getContent(x => x.pcrTypes.financialVirement);
          description = getContent(x => x.pages.pcrModifyOptions.reallocateCostsMessage);
          break;
        case "Loan Drawdown Change":
          name = getContent(x => x.pcrTypes.loanDrawdownChange);
          description = getContent(x => x.pages.pcrModifyOptions.loanDrawdownChangeMessage);
          break;
        case "Multiple Partner Financial Virement":
          name = getContent(x => x.pcrTypes.multiplePartnerFinancialVirement);
          description = getContent(x => x.pages.pcrModifyOptions.reallocateCostsMessage);
          break;
        case "Partner Addition":
          name = getContent(x => x.pcrTypes.partnerAddition);
          description = getContent(x => x.pages.pcrModifyOptions.addPartnerMessage);
          break;
        case "Partner Withdrawal":
          name = getContent(x => x.pcrTypes.partnerWithdrawal);
          description = getContent(x => x.pages.pcrModifyOptions.removePartnerMessage);
          break;
        case "Project Suspension":
          name = getContent(x => x.pcrTypes.projectSuspension);
          description = getContent(x => x.pages.pcrModifyOptions.putProjectOnHoldMessage);
          break;
        case "Project Termination":
          name = getContent(x => x.pcrTypes.projectTermination);
          description = getContent(x => x.pages.pcrModifyOptions.endProjectEarlyMessage);
          break;
        case "Put project on hold":
          name = getContent(x => x.pcrTypes.putProjectOnHold);
          description = getContent(x => x.pages.pcrModifyOptions.putProjectOnHoldMessage);
          break;
        case "Reallocate project costs":
        case "Reallocate one partner's project costs":
          name = getContent(x => x.pcrTypes.reallocateOnePartnersProjectCost);
          description = getContent(x => x.pages.pcrModifyOptions.reallocateCostsMessage);
          break;
        case "Reallocate several partners' project cost":
          name = getContent(x => x.pcrTypes.reallocateSeveralPartnersProjectCost);
          description = getContent(x => x.pages.pcrModifyOptions.reallocateCostsMessage);
          break;
        case "Remove a partner":
          name = getContent(x => x.pcrTypes.removeAPartner);
          description = getContent(x => x.pages.pcrModifyOptions.removePartnerMessage);
          break;
        case "Request Header":
          name = getContent(x => x.pcrTypes.requestHeader);
          break;
        case "Scope Change":
          name = getContent(x => x.pcrTypes.scopeChange);
          description = getContent(x => x.pages.pcrModifyOptions.changeScopeMessage);
          break;
        case "Single Partner Financial Virement":
          name = getContent(x => x.pcrTypes.singlePartnerFinancialVirement);
          description = getContent(x => x.pages.pcrModifyOptions.reallocateCostsMessage);
          break;
        case "Time Extension":
          name = getContent(x => x.pcrTypes.timeExtension);
          description = getContent(x => x.pages.pcrModifyOptions.changeDurationMessage);
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
        description,
      };
    },
  } as const;
};
