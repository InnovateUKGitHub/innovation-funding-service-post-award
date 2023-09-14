import React from "react";
import { EditorStatus } from "@ui/redux/constants/enums";
import { timeExtensionItemWorkflow } from "@ui/containers/pages/pcrs/timeExtension/timeExtensionWorkflow";
import { IStepProps, ISummaryProps, IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import { PCRWorkflowValidator } from "@ui/validation/validators/pcrWorkflowValidator";
import { getAddPartnerWorkflow, AddPartnerWorkflowItem } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { periodLengthChangeWorkflow } from "@ui/containers/pages/pcrs/periodLengthChange/periodLengthChangeWorkflow";
import { BaseProps } from "../../containerBase";
import { financialVirementWorkflow } from "./financialVirements/workflow";
import { suspendProjectWorkflow } from "./suspendProject/workflow";
import { scopeChangeWorkflow } from "./scopeChange/scopeChangeWorkflow";
import { LoanDrawdownChangeWorkflow } from "./loanDrawdownChange/LoanDrawdownChangeWorkflow";
import { loanExtensionItemWorkflow } from "./loanDrawdownExtension/loanDrawdownExtensionWorkflow";
import { PCRStepId, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { IRoutes } from "@ui/routing/routeConfig";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { accountNameChangeWorkflow } from "./nameChange/accountNameChangeWorkflow";
import { removePartnerWorkflow } from "./removePartner/removePartnerWorkflow";

export interface PcrStepProps<TDto, TVal> extends IStepProps {
  project: ProjectDto;
  pcr: PCRDto;
  pcrItem: TDto;
  pcrItemType: PCRItemTypeDto;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  validator: TVal;
  status: EditorStatus;
  onChange: (dto: TDto) => void;
  onSave: (skipToSummary: boolean) => void;
  getRequiredToCompleteMessage: (additionalMessage?: string) => React.ReactNode;
  routes: IRoutes;
  mode: "prepare" | "review" | "view";
}

export interface PcrSummaryProps<TDto, TVal, TStepNames> extends ISummaryProps, BaseProps {
  projectId: ProjectId;
  pcr: PCRDto;
  pcrItem: TDto;
  project: ProjectDto;
  validator: TVal;
  mode: "prepare" | "review" | "view";
  onSave: () => void;
  getStepLink: (stepName: TStepNames) => ILinkInfo;
  getEditLink: (stepName: TStepNames, validation: Result | null) => React.ReactNode;
  getViewLink: (stepName: TStepNames) => React.ReactNode;
}

export type IPCRWorkflow<T, TVal extends Results<AnyObject> | null> = IWorkflow<
  PCRStepId,
  PcrStepProps<T, TVal>,
  PcrSummaryProps<T, TVal, PCRStepId>,
  PCRWorkflowValidator
>;

export type WorkflowPcrType = AddPartnerWorkflowItem & { type: PCRItemType };

export class PcrWorkflow<T extends AnyObject, TVal extends Results<T> | null> extends WorkflowBase<
  PCRStepId,
  PcrStepProps<T, TVal>,
  PcrSummaryProps<T, TVal, PCRStepId>,
  PCRWorkflowValidator
> {
  public constructor(definition: IPCRWorkflow<T, TVal>, stepNumber: number | undefined) {
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
        return new PcrWorkflow(getAddPartnerWorkflow(pcrItem, step), step);
      case PCRItemType.PeriodLengthChange:
        return new PcrWorkflow(periodLengthChangeWorkflow, step);
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
