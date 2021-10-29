import { IContext, ILinkInfo, PCRItemForPartnerAdditionDto, PCRParticipantSize, ProjectDto, ProjectRole } from "@framework/types";
import { BadRequestError, configuration } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { DateTime } from "luxon";
import * as Dtos from "@framework/dtos";
import { CostCategoryType, getPCROrganisationType, PCRItemStatus, PCRItemType, PCROrganisationType } from "@framework/constants";
import { accountNameChangeStepNames } from "@ui/containers/pcrs/nameChange/accountNameChangeWorkflow";
import { SuspendProjectSteps } from "@ui/containers/pcrs/suspendProject/workflow";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { removePartnerStepNames } from "@ui/containers/pcrs/removePartner";
import { scopeChangeStepNames } from "@ui/containers/pcrs/scopeChange/scopeChangeWorkflow";
import { AddPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { parseNumber } from "@framework/util";
import { GetUnfilteredCostCategoriesQuery } from "@server/features/claims";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { GetByIdQuery } from "@server/features/projects";

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

    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const projectDto = await context.runQuery(new GetByIdQuery(params.projectId));

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;
    const workflow = PcrWorkflow.getWorkflow(item, params.step);
    const stepName = workflow && workflow.getCurrentStepName();
    switch (item.type) {
      case PCRItemType.TimeExtension:
        this.updateTimeExtension(item, body);
        break;
      case PCRItemType.ScopeChange:
        this.updateScopeChange(item, body, stepName as scopeChangeStepNames);
        break;
      case PCRItemType.ProjectSuspension:
        this.updateProjectSuspension(item, body, stepName as SuspendProjectSteps);
        break;
      case PCRItemType.AccountNameChange:
        this.updateNameChange(item, body, stepName as accountNameChangeStepNames);
        break;
      case PCRItemType.PartnerWithdrawal:
        this.updatePartnerWithdrawal(item, body, stepName as removePartnerStepNames);
        break;
      case PCRItemType.PartnerAddition:
        this.updatePartnerAddition(projectDto, costCategories, item, body, stepName as AddPartnerStepNames);
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

  private updateProjectSuspension(item: Dtos.PCRItemForProjectSuspensionDto, body: IFormBody, stepName: SuspendProjectSteps) {
    if (stepName === "details") {
      if (body.suspensionStartDate_month || body.suspensionStartDate_year) {
        const suspensionStartDate = DateTime.fromFormat(`${body.suspensionStartDate_month}/${body.suspensionStartDate_year}`, "M/yyyy").startOf("month").startOf("day");
        item.suspensionStartDate = suspensionStartDate.toJSDate();
      } else {
        item.suspensionStartDate = null;
      }
      if (body.suspensionEndDate_month || body.suspensionEndDate_year) {
        const suspensionEndDate = DateTime.fromFormat(`${body.suspensionEndDate_month}/${body.suspensionEndDate_year}`, "M/yyyy").endOf("month").startOf("day");
        item.suspensionEndDate = suspensionEndDate.toJSDate();
      } else {
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
    item.offsetMonths = Number(body.timeExtension) ?? 0;
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: Dtos.PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    const workflow = PcrWorkflow.getWorkflow(dto.items.find(x => x.id === params.itemId), params.step);

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
    if (stepName === "removalPeriodStep") {
      item.removalPeriod = Number(body.removalPeriod);
      item.partnerId = body.partnerId;
    }
  }

  private updatePartnerAddition(project: ProjectDto, costCategories: CostCategoryDto[], item: PCRItemForPartnerAdditionDto, body: IFormBody, stepName: AddPartnerStepNames | null) {
    if (stepName === "roleAndOrganisationStep") {
      item.projectRole = parseInt(body.projectRole, 10);
      item.partnerType = parseInt(body.partnerType, 10);
      const organisationType = getPCROrganisationType(item.partnerType);
      if (organisationType === PCROrganisationType.Academic) {
        item.participantSize = PCRParticipantSize.Academic;
      }
      item.isProjectRoleAndPartnerTypeRequired = true;
      item.isCommercialWork = body.isCommercialWork === "true"
        ? true
        : body.isCommercialWork === "false"? false : null;
    }
    if (stepName === "academicOrganisationStep") {
      item.organisationName = body.organisationName;
    }
    if (stepName === "organisationDetailsStep") {
      item.participantSize = parseInt(body.participantSize, 10);
      item.numberOfEmployees = parseInt(body.numberOfEmployees, 10);
    }
    if (stepName === "financeDetailsStep") {
      item.financialYearEndDate = body.financialYearEndDate_month && body.financialYearEndDate_year
        ? DateTime.fromFormat(`${body.financialYearEndDate_month}/${body.financialYearEndDate_year}`, "M/yyyy")
          .endOf("month")
          .startOf("day")
          .toJSDate()
        : null;
      item.financialYearEndTurnover = Number(body.financialYearEndTurnover);
    }
    if (stepName === "projectLocationStep") {
      item.projectLocation = parseInt(body.projectLocation, 10);
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
    if (stepName === "awardRateStep") {
      item.awardRate = parseNumber(body.awardRate);
    }
    if (stepName === "academicCostsStep") {
      item.tsbReference = body.tsbReference;

      const relevantCostCategories = costCategories.filter(x =>
        x.organisationType === PCROrganisationType.Academic && x.competitionType === project.competitionType);

      relevantCostCategories.forEach(costCategory => {
        const cost = item.spendProfile.costs.find(x => x.costCategoryId === costCategory.id) as PCRSpendProfileAcademicCostDto;
        const value = parseFloat(body[`value_${costCategory.id}`]) || 0;
        if (cost) {
          cost.value = value;
        } else {
          item.spendProfile.costs.push({
            id: "",
            costCategory: CostCategoryType.Academic,
            costCategoryId: costCategory.id,
            description: costCategory.description,
            value,
          });
        }
      });
    }
    if (stepName === "otherFundingStep") {
      item.hasOtherFunding = body.hasOtherFunding === "true"
        ? true
        : body.hasOtherFunding === "false"? false : null;
    }
    if (stepName === "otherFundingSourcesStep") {
      const otherFundingCostCategory = costCategories.find(x => x.type === CostCategoryType.Other_Funding);
      const itemsLength = parseNumber(body.itemsLength);
      item.spendProfile.funds = item.spendProfile.funds.filter(x => x.costCategory !== CostCategoryType.Other_Funding);
      if (itemsLength !== null && otherFundingCostCategory) {
        for (let i = 0; i < itemsLength; ++i) {
          const [id, month, year, description, value] = ["id", "date_month", "date_year", "description", "value"].map(k => body[`item_${i}_${k}`]);
          if (description || month || year || value) {
            item.spendProfile.funds.push({
              id: id || "",
              costCategory: CostCategoryType.Other_Funding,
              costCategoryId: otherFundingCostCategory.id,
              description: description || "",
              value: parseFloat(value) || 0,
              dateSecured: DateTime.fromFormat(`${month}-${year}`, "M-yyyy").startOf("month").startOf("day").toJSDate(),
            });
          }
        }
      }
    }
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareItemParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: Dtos.PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, configuration.features, dto);
  }
}
