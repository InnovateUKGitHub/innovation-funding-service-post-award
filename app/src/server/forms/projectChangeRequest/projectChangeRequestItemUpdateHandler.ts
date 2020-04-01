import { IContext, ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";
import { BadRequestError, Configuration } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
  ProjectChangeRequestPrepareRoute
} from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { DateTime } from "luxon";
import * as Dtos from "@framework/dtos";
import { PCRItemStatus, PCRItemType } from "@framework/constants";
import { accountNameChangeStepNames } from "@ui/containers/pcrs/nameChange/accountNameChangeWorkflow";
import { suspendProjectSteps } from "@ui/containers/pcrs/suspendProject/workflow";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { removePartnerStepNames } from "@ui/containers/pcrs/removePartner";
import { scopeChangeStepNames } from "@ui/containers/pcrs/scopeChange/scopeChangeWorkflow";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";

export class ProjectChangeRequestItemUpdateHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareItemParams, "pcr"> {
  constructor() {
    super(PCRPrepareItemRoute, ["default", "saveAndReturnToSummary"], "pcr");
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody): Promise<Dtos.PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId);

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;
    const workflow = PcrWorkflow.getWorkflow(item, params.step, Configuration.features);
    const stepName = workflow && workflow.getCurrentStepName();
    switch (item.type) {
      case PCRItemType.TimeExtension:
        this.updateTimeExtension(item, body);
        break;
      case PCRItemType.ScopeChange:
        this.updateScopeChange(item, body, stepName as scopeChangeStepNames);
        break;
      case PCRItemType.ProjectSuspension:
        this.updateProjectSuspension(item, body, stepName as suspendProjectSteps);
        break;
      case PCRItemType.AccountNameChange:
        this.updateNameChange(item, body, stepName as accountNameChangeStepNames);
        break;
      case PCRItemType.PartnerWithdrawal:
        this.updatePartnerWithdrawal(item, body, stepName as removePartnerStepNames);
        break;
      case PCRItemType.PartnerAddition:
        if (context.config.features.addPartnerWorkflow) {
          this.updatePartnerAddition(item, body, stepName as addPartnerStepNames);
        }
        // nothing to update as only files
        break;
      case PCRItemType.MultiplePartnerFinancialVirement:
        this.updateMultiplePartnerFinancialVirement(item, body, stepName);
        break;
      case PCRItemType.SinglePartnerFinancialVirement:
        // nothing to update as only files
        break;
    }

    return dto;
  }

  private updateProjectSuspension(item: Dtos.PCRItemForProjectSuspensionDto, body: IFormBody, stepName: suspendProjectSteps) {
    if (stepName === "details") {
      if (body.suspensionStartDate_month || body.suspensionStartDate_year) {
        const suspensionStartDate = DateTime.fromFormat(`${body.suspensionStartDate_month}/${body.suspensionStartDate_year}`, "M/yyyy").startOf("month").startOf("day");
        item.suspensionStartDate = suspensionStartDate.toJSDate();
      }
      else {
        item.suspensionStartDate = null;
      }
      if (body.suspensionEndDate_month || body.suspensionEndDate_year) {
        const suspensionEndDate = DateTime.fromFormat(`${body.suspensionEndDate_month}/${body.suspensionEndDate_year}`, "M/yyyy").endOf("month").startOf("day");
        item.suspensionEndDate = suspensionEndDate.toJSDate();
      }
      else {
        item.suspensionEndDate = null;
      }
    }
  }

  private updateScopeChange(item: Dtos.PCRItemForScopeChangeDto, body: IFormBody, stepName: scopeChangeStepNames) {
    if (stepName === "publicDescriptionStep") {
      item.publicDescription = body.description;
    }

    if (stepName === "projectSummaryStep") {
      item.projectSummary = body.summary;
    }
  }

  private updateTimeExtension(item: Dtos.PCRItemForTimeExtensionDto, body: IFormBody) {
    item.additionalMonths = body.timeExtension ? Number(body.timeExtension) : null;
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: Dtos.PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    const workflow = PcrWorkflow.getWorkflow(dto.items.find(x => x.id === params.itemId), params.step, Configuration.features);

    if (!workflow || workflow.isOnSummary()) {
      return ProjectChangeRequestPrepareRoute.getLink(params);
    }

    if (button.name === "saveAndReturnToSummary") {
      return PCRPrepareItemRoute.getLink({
        projectId: params.projectId,
        pcrId: params.pcrId,
        itemId: params.itemId
      });
    }

    const step = workflow.getNextStepInfo();

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: step && step.stepNumber,
    });
  }

  private updateNameChange(item: Dtos.PCRItemForAccountNameChangeDto, body: IFormBody, stepName: accountNameChangeStepNames | null) {
    if (stepName === "partnerNameStep") {
      item.partnerId = body.partnerId;
      item.accountName = body.accountName;
    }
  }

  private updateMultiplePartnerFinancialVirement(item: Dtos.PCRItemForMultiplePartnerFinancialVirementDto, body: IFormBody, stepName: string | null | undefined) {
    // At the moment there are no "steps" in the FV workflow but checking here in case one is added so we don't clear out the grantMovingOverFinancialYear value
    if (!stepName) {
      item.grantMovingOverFinancialYear = Number(body.grantMovingOverFinancialYear);
    }
  }

  private updatePartnerWithdrawal(item: Dtos.PCRItemForPartnerWithdrawalDto, body: IFormBody, stepName: removePartnerStepNames | null) {
    if (stepName === "withdrawalDateStep") {
      if (body.withdrawalDate_day || body.withdrawalDate_month || body.withdrawalDate_year) {
        const withdrawalDate = DateTime.fromFormat(`${body.withdrawalDate_day}/${body.withdrawalDate_month}/${body.withdrawalDate_year}`, "d/M/yyyy");
        item.withdrawalDate = withdrawalDate.toJSDate();
      }

      item.partnerId = body.partnerId;
    }
  }

  private updatePartnerAddition(item: Dtos.PCRItemForPartnerAdditionDto, body: IFormBody, stepName: addPartnerStepNames | null) {
    if (stepName === "roleAndOrganisationStep") {
      item.projectRole = parseInt(body.projectRole, 10);
      item.partnerType = parseInt(body.partnerType, 10);
      item.isProjectRoleAndPartnerTypeRequired = true;
    }
    if (stepName === "academicOrganisationStep") {
      item.organisationName = body.organisationName;
    }
    if (stepName === "organisationDetailsStep") {
      item.participantSize = parseInt(body.participantSize, 10);
      item.numberOfEmployees = parseInt(body.numberOfEmployees, 10);
    }
    if (stepName === "financeDetailsStep") {
      const financialYearEndDate = body.financialYearEndDate_month && body.financialYearEndDate_year
        ? DateTime.fromFormat(`${body.financialYearEndDate_month}/${body.financialYearEndDate_year}`, "M/yyyy")
          .endOf("month")
          .startOf("day")
          .toJSDate()
        : null;
      item.financialYearEndDate = financialYearEndDate;
      item.financialYearEndTurnover = Number(body.financialYearEndTurnover);
    }
    if (stepName === "projectLocationStep") {
      item.projectCity = body.projectCity;
      item.projectPostcode = body.projectPostcode;
    }
    if (stepName === "financeContactStep") {
      item.contact1ProjectRole = parseInt(body.contact1ProjectRole, 10);
      item.contact1Forename = body.contact1Forename;
      item.contact1Surname = body.contact1Surname;
      item.contact1Phone = body.contact1Phone;
      item.contact1Email = body.contact1Email;
    }
    if (stepName === "projectManagerDetailsStep") {
      item.contact2ProjectRole = parseInt(body.contact2ProjectRole, 10);
      item.contact2Forename = body.contact2Forename;
      item.contact2Surname = body.contact2Surname;
      item.contact2Phone = body.contact2Phone;
      item.contact2Email = body.contact2Email;
    }
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareItemParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: Dtos.PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, Configuration.features, dto);
  }
}
