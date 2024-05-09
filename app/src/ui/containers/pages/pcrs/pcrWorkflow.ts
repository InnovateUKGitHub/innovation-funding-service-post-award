import { timeExtensionItemWorkflow } from "@ui/containers/pages/pcrs/timeExtension/timeExtensionWorkflow";
import { IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import { getAddPartnerWorkflow, AddPartnerWorkflowItem } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { financialVirementWorkflow } from "./financialVirements/workflow";
import { suspendProjectWorkflow } from "./suspendProject/suspendProjectWorkflow";
import { scopeChangeWorkflow } from "./scopeChange/scopeChangeWorkflow";
import { LoanDrawdownChangeWorkflow } from "./loanDrawdownChange/LoanDrawdownChangeWorkflow";
import { loanExtensionItemWorkflow } from "./loanDrawdownExtension/loanDrawdownExtensionWorkflow";
import { PCRStepType, PCRItemType } from "@framework/constants/pcrConstants";
import { accountNameChangeWorkflow } from "./renamePartner/renamePartnerWorkflow";
import { removePartnerWorkflow } from "./removePartner/removePartnerWorkflow";
import { approveNewSubcontractorWorkflow } from "./approveNewSubcontractor/approveNewSubcontractorWorkflow";
import { upliftWorkflow } from "./uplift/upliftWorkflow";

export type IPCRWorkflow = IWorkflow<PCRStepType>;

export type WorkflowPcrType = { type: PCRItemType };

export class PcrWorkflow extends WorkflowBase<PCRStepType> {
  public constructor(definition: IPCRWorkflow, stepNumber: number | undefined) {
    super(definition, stepNumber);
  }

  private static getWorkflowType(pcrItem: WorkflowPcrType, step: number | undefined) {
    switch (pcrItem.type) {
      case PCRItemType.AccountNameChange:
        return new PcrWorkflow(accountNameChangeWorkflow, step);
      case PCRItemType.ScopeChange:
        return new PcrWorkflow(scopeChangeWorkflow, step);
      case PCRItemType.TimeExtension:
        return new PcrWorkflow(timeExtensionItemWorkflow, step);
      case PCRItemType.LoanDrawdownChange:
        return new PcrWorkflow(LoanDrawdownChangeWorkflow, step);
      case PCRItemType.LoanDrawdownExtension:
        return new PcrWorkflow(loanExtensionItemWorkflow, step);
      case PCRItemType.ProjectSuspension:
        return new PcrWorkflow(suspendProjectWorkflow, step);
      case PCRItemType.MultiplePartnerFinancialVirement:
        return new PcrWorkflow(financialVirementWorkflow, step);
      case PCRItemType.PartnerWithdrawal:
        return new PcrWorkflow(removePartnerWorkflow, step);
      case PCRItemType.PartnerAddition:
        return new PcrWorkflow(getAddPartnerWorkflow(pcrItem as AddPartnerWorkflowItem, step), step);
      case PCRItemType.ApproveNewSubcontractor:
        return new PcrWorkflow(approveNewSubcontractorWorkflow, step);
      case PCRItemType.Uplift:
        return new PcrWorkflow(upliftWorkflow, step);
      default:
        return null;
    }
  }

  public static getWorkflow(pcrItem: WorkflowPcrType | undefined, step: number | undefined) {
    if (!pcrItem) {
      return null;
    }
    return this.getWorkflowType(pcrItem, step);
  }
}
