import React from "react";
import { Result, Results } from "@ui/validation";
import { PCRDto, PCRItemDto, PCRItemTypeDto, ProjectDto } from "@framework/dtos";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { ILinkInfo, PCRItemType } from "@framework/types";
import { accountNameChangeWorkflow } from "./nameChange";
import { scopeChangeWorkflow } from "./scopeChange/scopeChangeWorkflow";
import { standardItemWorkflow } from "./standardItem/workflow";
import { timeExtensionItemWorkflow } from "@ui/containers/pcrs/timeExtension/timeExtensionWorkflow";
import { suspendProjectWorkflow } from "./suspendProject/workflow";
import { financialVirementWorkflow } from "./financialVirements/workflow";
import { BaseProps } from "../containerBase";
import { IStepProps, ISummaryProps, IWorkflow, WorkflowBase } from "@framework/types/workflowBase";
import { removePartnerWorkflow } from "@ui/containers/pcrs/removePartner";
import { PCRWorkflowValidator } from "@ui/validators/pcrWorkflowValidator";
import { getAddPartnerWorkflow } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export interface PcrStepProps<TDto, TVal> extends IStepProps {
  project: ProjectDto;
  pcr: PCRDto;
  pcrItem: TDto;
  pcrItemType: PCRItemTypeDto;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  validator: TVal;
  status: EditorStatus;
  onChange: (dto: TDto) => void;
  onSave: (skipToSummary?: boolean) => void;
  getRequiredToCompleteMessage: (additionalMessage?: string) => React.ReactNode;
  isClient: boolean;
}

export interface PcrSummaryProps<TDto, TVal, TStepNames> extends ISummaryProps, BaseProps {
  projectId: string;
  pcr: PCRDto;
  pcrItem: TDto;
  project: ProjectDto;
  validator: TVal;
  mode: "prepare" | "review" | "view";
  onSave: () => void;
  getStepLink: (stepName: TStepNames) => ILinkInfo;
  getEditLink: (stepName: TStepNames, validation: Result | null) => React.ReactNode;
}

export type IPCRWorkflow<T, TVal extends Results<{}>> = IWorkflow<string, PcrStepProps<T, TVal>, PcrSummaryProps<T, TVal, string>, PCRWorkflowValidator>;

export class PcrWorkflow<T, TVal extends Results<T>> extends WorkflowBase<string, PcrStepProps<T, TVal>, PcrSummaryProps<T, TVal, string>, PCRWorkflowValidator> {
  public constructor(definition: IPCRWorkflow<T, TVal>, stepNumber: number | undefined) {
    super(definition, stepNumber);
  }

  private static getWorkflowType(pcrItem: PCRItemDto, step: number | undefined, features: IFeatureFlags) {
    switch (pcrItem.type) {
      case PCRItemType.AccountNameChange:
        return new PcrWorkflow(accountNameChangeWorkflow, step);
      case PCRItemType.ScopeChange:
        return new PcrWorkflow(scopeChangeWorkflow, step);
      case PCRItemType.TimeExtension:
        return new PcrWorkflow(timeExtensionItemWorkflow, step);
      case PCRItemType.ProjectSuspension:
        return new PcrWorkflow(suspendProjectWorkflow, step);
      case PCRItemType.MultiplePartnerFinancialVirement:
        return new PcrWorkflow(financialVirementWorkflow, step);
      case PCRItemType.PartnerWithdrawal:
        return new PcrWorkflow(removePartnerWorkflow, step);
      case PCRItemType.PartnerAddition:
        // If feature not turned on let it fall through to standard workflow
        if (features.addPartnerWorkflow) return new PcrWorkflow(getAddPartnerWorkflow(pcrItem, step), step);
      case PCRItemType.SinglePartnerFinancialVirement:
        return new PcrWorkflow(standardItemWorkflow, step);
      default:
        return null;
    }
  }

  public static getWorkflow(pcrItem: PCRItemDto | undefined, step: number | undefined, features: IFeatureFlags): PcrWorkflow<PCRItemDto, Results<PCRItemDto>> | null {
    if (!pcrItem) {
      return null;
    }
    return this.getWorkflowType(pcrItem, step, features) as PcrWorkflow<PCRItemDto, Results<PCRItemDto>>;
  }
}
