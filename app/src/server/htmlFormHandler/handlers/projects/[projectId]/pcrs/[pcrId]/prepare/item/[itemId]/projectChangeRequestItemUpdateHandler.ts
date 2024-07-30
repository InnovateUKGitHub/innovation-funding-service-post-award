import { CostCategoryType } from "@framework/constants/enums";
import {
  PCRItemStatus,
  PCRItemType,
  PCROrganisationType,
  PCRParticipantSize,
  PCRStepType,
  getPCROrganisationType,
} from "@framework/constants/pcrConstants";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRDto,
  PCRItemDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForLoanDrawdownExtensionDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
  PCRItemForPartnerAdditionDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForTimeExtensionDto,
} from "@framework/dtos/pcrDtos";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { parseNumber } from "@framework/util/numberHelper";
import { GetUnfilteredCostCategoriesQuery } from "@server/features/claims/getCostCategoriesQuery";
import { GetFinancialLoanVirementQuery } from "@server/features/financialVirements/getFinancialLoanVirementQuery";
import { UpdateFinancialLoanVirementCommand } from "@server/features/financialVirements/updateFinancialLoanVirementCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { BadRequestError } from "@shared/appError";
import { AddPartnerStepNames } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { PcrWorkflow, WorkflowPcrType } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { removePartnerStepNames } from "@ui/containers/pages/pcrs/removePartner/removePartnerWorkflow";
import { accountNameChangeStepNames } from "@ui/containers/pages/pcrs/renamePartner/renamePartnerWorkflow";
import { SuspendProjectSteps } from "@ui/containers/pages/pcrs/suspendProject/suspendProjectWorkflow";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { DateTime } from "luxon";

export class ProjectChangeRequestItemUpdateHandler extends StandardFormHandlerBase<
  ProjectChangeRequestPrepareItemParams,
  PCRDto
> {
  constructor() {
    super(PCRPrepareItemRoute, ["default", "saveAndReturnToSummary", "changeLoanEdit"]);
  }

  protected async getDto(
    context: IContext,
    params: ProjectChangeRequestPrepareItemParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId);

    if (!item) throw new BadRequestError();

    item.status =
      body.itemStatus === "marked-as-complete" || body.itemStatus === "true"
        ? PCRItemStatus.Complete
        : PCRItemStatus.Incomplete;

    const workflow = PcrWorkflow.getWorkflow(item as WorkflowPcrType, params.step);
    const stepName = workflow?.getCurrentStepName();

    switch (item.type) {
      case PCRItemType.TimeExtension:
        await this.updateTimeExtension(item, body);
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
      case PCRItemType.PartnerAddition: {
        const projectDto = await context.runQuery(new GetByIdQuery(params.projectId));
        const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());

        this.updatePartnerAddition(projectDto, costCategories, item, body, stepName as AddPartnerStepNames);
        break;
      }
      case PCRItemType.MultiplePartnerFinancialVirement:
        this.updateMultiplePartnerFinancialVirement(item, body, stepName);
        break;
      case PCRItemType.LoanDrawdownExtension:
        this.updateLoanExtension(item, body, stepName);
        break;

      case PCRItemType.ScopeChange:
      case PCRItemType.ApproveNewSubcontractor:
        // It should not be possible for this handler to handle these
        // PCRs because it is dealt with in a separate form handler.

        throw new Error("Incorrect form handler used for this PCR type");
    }

    return dto;
  }

  private updateProjectSuspension(
    item: PCRItemForProjectSuspensionDto,
    body: IFormBody,
    stepName: SuspendProjectSteps,
  ) {
    if (stepName === PCRStepType.details) {
      if (body.suspensionStartDate_month || body.suspensionStartDate_year) {
        const suspensionStartDate = DateTime.fromFormat(
          `${body.suspensionStartDate_month}/${body.suspensionStartDate_year}`,
          "M/yyyy",
        )
          .startOf("month")
          .startOf("day");
        item.suspensionStartDate = suspensionStartDate.toJSDate();
      } else {
        item.suspensionStartDate = null;
      }
      if (body.suspensionEndDate_month || body.suspensionEndDate_year) {
        const suspensionEndDate = DateTime.fromFormat(
          `${body.suspensionEndDate_month}/${body.suspensionEndDate_year}`,
          "M/yyyy",
        )
          .endOf("month")
          .startOf("day");
        item.suspensionEndDate = suspensionEndDate.toJSDate();
      } else {
        item.suspensionEndDate = null;
      }
    }
  }

  private async updateTimeExtension(item: PCRItemForTimeExtensionDto, body: IFormBody) {
    if (body.timeExtension) {
      item.offsetMonths = Number(body.timeExtension);
    }
  }

  /**
   * @description An entrypoint to validate summary pages before pcr command is invoked.
   */
  private async validateSummary(
    context: IContext,
    params: ProjectChangeRequestPrepareItemParams,
    dto: PCRItemDto | undefined,
  ): Promise<void> {
    // Note: Bail if no payload or not ready for submission
    if (!dto || dto.status === PCRItemStatus.Incomplete) return;

    if (dto.type === PCRItemType.LoanDrawdownChange) {
      const loanVirements = await context.runQuery(new GetFinancialLoanVirementQuery(params.projectId, dto.id));
      await context.runCommand(new UpdateFinancialLoanVirementCommand(params.projectId, dto.id, loanVirements, true));
    }
  }

  protected async run(
    context: IContext,
    params: ProjectChangeRequestPrepareItemParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    const pcrItem = dto.items.find(x => x.id === params.itemId);
    const workflow = PcrWorkflow.getWorkflow(pcrItem as WorkflowPcrType, params.step);

    const isPcrSummary: boolean = workflow?.isOnSummary() === true;

    if (isPcrSummary) await this.validateSummary(context, params, pcrItem);

    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcrStepType: workflow?.getCurrentStepName(),
        pcr: dto,
      }),
    );

    if (!workflow || isPcrSummary) {
      return ProjectChangeRequestPrepareRoute.getLink(params);
    }

    if (button.name === "saveAndReturnToSummary") {
      return PCRPrepareItemRoute.getLink({
        projectId: params.projectId,
        pcrId: params.pcrId,
        itemId: params.itemId,
      });
    }

    const step = workflow.getNextStepInfo();

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: step?.stepNumber,
    });
  }

  private updateNameChange(
    item: PCRItemForAccountNameChangeDto,
    body: IFormBody,
    stepName: accountNameChangeStepNames | null,
  ) {
    if (stepName === PCRStepType.partnerNameStep) {
      item.partnerId = body.partnerId;
      item.accountName = body.accountName;
    }
  }

  private updateMultiplePartnerFinancialVirement(
    item: PCRItemForMultiplePartnerFinancialVirementDto,
    body: IFormBody,
    stepName: string | null | undefined,
  ) {
    // At the moment there are no "steps" in the FV workflow but checking here in case one is added so we don't clear out the grantMovingOverFinancialYear value
    if (!stepName) {
      item.grantMovingOverFinancialYear = Number(body.grantMovingOverFinancialYear);
    }
  }

  private updatePartnerWithdrawal(
    item: PCRItemForPartnerWithdrawalDto,
    body: IFormBody,
    stepName: removePartnerStepNames | null,
  ) {
    if (stepName === PCRStepType.removalPeriodStep) {
      item.removalPeriod = Number(body.removalPeriod);
      item.partnerId = body.partnerId;
    }
  }

  private updatePartnerAddition(
    project: ProjectDto,
    costCategories: CostCategoryDto[],
    item: PCRItemForPartnerAdditionDto,
    body: IFormBody,
    stepName: AddPartnerStepNames | null,
  ) {
    if (stepName === PCRStepType.roleAndOrganisationStep) {
      item.projectRole = parseInt(body.projectRole, 10);
      item.partnerType = parseInt(body.partnerType, 10);
      const organisationType = getPCROrganisationType(item.partnerType);
      if (organisationType === PCROrganisationType.Academic) {
        item.participantSize = PCRParticipantSize.Academic;
      }
      item.isProjectRoleAndPartnerTypeRequired = true;
      item.isCommercialWork =
        body.isCommercialWork === "true" ? true : body.isCommercialWork === "false" ? false : null;
    }
    if (stepName === PCRStepType.academicOrganisationStep) {
      item.organisationName = body.organisationName;
    }
    if (stepName === PCRStepType.organisationDetailsStep) {
      item.participantSize = parseInt(body.participantSize, 10);
      item.numberOfEmployees = parseInt(body.numberOfEmployees, 10);
    }
    if (stepName === PCRStepType.financeDetailsStep) {
      item.financialYearEndDate =
        body.financialYearEndDate_month && body.financialYearEndDate_year
          ? DateTime.fromFormat(`${body.financialYearEndDate_month}/${body.financialYearEndDate_year}`, "M/yyyy")
              .endOf("month")
              .startOf("day")
              .toJSDate()
          : null;
      item.financialYearEndTurnover = Number(body.financialYearEndTurnover);
    }
    if (stepName === PCRStepType.projectLocationStep) {
      item.projectLocation = parseInt(body.projectLocation, 10);
      item.projectCity = body.projectCity;
      item.projectPostcode = body.projectPostcode;
    }
    if (stepName === PCRStepType.financeContactStep) {
      item.contact1ProjectRole = parseInt(body.contact1ProjectRole, 10);
      item.contact1Forename = body.contact1Forename;
      item.contact1Surname = body.contact1Surname;
      item.contact1Phone = body.contact1Phone;
      item.contact1Email = body.contact1Email;
    }
    if (stepName === PCRStepType.projectManagerDetailsStep) {
      item.contact2ProjectRole = parseInt(body.contact2ProjectRole, 10);
      item.contact2Forename = body.contact2Forename;
      item.contact2Surname = body.contact2Surname;
      item.contact2Phone = body.contact2Phone;
      item.contact2Email = body.contact2Email;
    }
    if (stepName === PCRStepType.awardRateStep) {
      item.awardRate = parseNumber(body.awardRate);
    }
    if (stepName === PCRStepType.academicCostsStep) {
      item.tsbReference = body.tsbReference;

      const relevantCostCategories = costCategories.filter(
        x => x.organisationType === PCROrganisationType.Academic && x.competitionType === project.competitionType,
      );

      relevantCostCategories.forEach(costCategory => {
        const cost = item.spendProfile.costs.find(
          x => x.costCategoryId === costCategory.id,
        ) as PCRSpendProfileAcademicCostDto;
        const value = parseFloat(body[`value_${costCategory.id}`]) || 0;
        if (cost) {
          cost.value = value;
        } else {
          item.spendProfile.costs.push({
            id: "" as CostId,
            costCategory: CostCategoryType.Academic,
            costCategoryId: costCategory.id,
            description: costCategory.description,
            value,
          });
        }
      });
    }
    if (stepName === PCRStepType.otherFundingStep) {
      item.hasOtherFunding = body.hasOtherFunding === "true" ? true : body.hasOtherFunding === "false" ? false : null;
    }
    if (stepName === PCRStepType.otherFundingSourcesStep) {
      const otherFundingCostCategory = costCategories.find(
        x => x.type === CostCategoryType.Other_Public_Sector_Funding,
      );
      const itemsLength = parseNumber(body.itemsLength);
      item.spendProfile.funds = item.spendProfile.funds.filter(
        x => x.costCategory !== CostCategoryType.Other_Public_Sector_Funding,
      );
      if (itemsLength !== null && otherFundingCostCategory) {
        for (let i = 0; i < itemsLength; ++i) {
          const [id, month, year, description, value] = ["id", "date_month", "date_year", "description", "value"].map(
            k => body[`item_${i}_${k}`],
          );
          if (description || month || year || value) {
            item.spendProfile.funds.push({
              id: (id || "") as CostId,
              costCategory: CostCategoryType.Other_Public_Sector_Funding,
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

  private updateLoanExtension(item: PCRItemForLoanDrawdownExtensionDto, body: IFormBody, stepName: string | undefined) {
    if (stepName === PCRStepType.loanExtension) {
      item.availabilityPeriodChange = Number(body.availabilityPeriodChange);
      item.extensionPeriodChange = Number(body.extensionPeriodChange);
      item.repaymentPeriodChange = Number(body.repaymentPeriodChange);
    }
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareItemParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
      pcrStepId: params.itemId,
    });
  }
}
