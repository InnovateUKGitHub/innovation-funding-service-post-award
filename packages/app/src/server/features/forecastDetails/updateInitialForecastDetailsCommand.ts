import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { PartnerSpendProfileStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { PartnerStatus, SpendProfileStatus } from "@framework/constants/partner";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforcePartner } from "@server/repositories/partnersRepository";
import { ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";
import { GetAllGOLForecastedCostCategoriesQuery } from "../claims/GetAllGOLForecastedCostCategoriesQuery";
import { InActiveProjectError, BadRequestError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { GetByIdQuery as GetProjectByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetAllClaimDetailsByPartnerIdQuery } from "@server/features/claimDetails/GetAllClaimDetailsByPartnerIdQuery";
import { GetAllClaimsByPartnerIdQuery } from "@server/features/claims/GetAllClaimsByPartnerIdQuery";
import { GetAllForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllForecastsForPartnerQuery";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { parseCurrency } from "@framework/util/numberHelper";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";

type ForecastDto = Pick<ForecastDetailsDTO, "id" | "value">[];

export class UpdateInitialForecastDetailsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ForecastTableSchemaType,
  ForecastDto
> {
  public readonly runnableName: string = "UpdateInitialForecastDetailsCommand";
  private readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  private readonly isSubmitting: boolean;
  protected readonly dto: ForecastDto;

  private existingDtos: {
    project: ProjectDto;
    claimDetails: ClaimDetailsSummaryDto[];
    claims: ClaimDto[];
    golCosts: GOLCostDto[];
    forecasts: ForecastDetailsDTO[];
    partner: PartnerDto;
  } | null = null;

  constructor(
    projectId: ProjectId,
    partnerId: PartnerId,
    forecasts: Pick<ForecastDetailsDTO, "id" | "value">[],
    isSubmitting: boolean,
  ) {
    super();
    this.dto = forecasts;
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.isSubmitting = isSubmitting;
  }

  async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact);
  }

  private async getExistingDtos(context: IContext) {
    if (this.existingDtos) {
      return this.existingDtos;
    }
    const projectPromise = context.runQuery(new GetProjectByIdQuery(this.projectId as ProjectId));
    const partnerPromise = context.runQuery(new GetPartnerByIdQuery(this.partnerId as PartnerId));
    const claimDetailsPromise = context.runQuery(new GetAllClaimDetailsByPartnerIdQuery(this.partnerId as PartnerId));
    const claimTotalProjectPeriodsPromise = context.runQuery(
      new GetAllClaimsByPartnerIdQuery(this.partnerId as PartnerId),
    );
    const profileTotalCostCategoriesPromise = context.runQuery(
      new GetAllGOLForecastedCostCategoriesQuery(this.partnerId as PartnerId),
    );
    const profileDetailsPromise = context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId as PartnerId));

    const dtos = await Promise.all([
      projectPromise,
      claimDetailsPromise,
      claimTotalProjectPeriodsPromise,
      profileTotalCostCategoriesPromise,
      profileDetailsPromise,
      partnerPromise,
    ]);

    this.existingDtos = {
      project: dtos[0],
      claimDetails: dtos[1],
      claims: dtos[2],
      golCosts: dtos[3],
      forecasts: dtos[4],
      partner: dtos[5],
    };
    return this.existingDtos;
  }

  protected async getZodSchema(context: IContext) {
    const {
      project,
      partner,
      claimDetails,
      claims: claimTotalProjectPeriods,
      golCosts: profileTotalCostCategories,
      forecasts: profileDetails,
    } = await this.getExistingDtos(context);

    return getForecastTableValidation({
      project,
      partner,
      claimDetails,
      claimTotalProjectPeriods,
      profileTotalCostCategories,
      profileDetails,
    });
  }

  protected async mapToZod(): Promise<z.input<ForecastTableSchemaType>> {
    const profile = Object.fromEntries(this.dto.map(x => [x.id, String(x.value)]));
    return {
      form: FormTypes.ProjectSetupForecast,
      projectId: this.projectId,
      partnerId: this.partnerId,
      profile,
      submit: this.isSubmitting,
    };
  }

  protected async runRepositoryCommands(context: IContext, validatedData: z.output<ForecastTableSchemaType>) {
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }
    const { forecasts: profileDetails, partner } = await this.getExistingDtos(context);

    if (partner.partnerStatus !== PartnerStatus.Pending) {
      throw new BadRequestError("Cannot update partner initial forecast");
    }

    const forecasts = Object.entries(validatedData.profile).map(([id, value]) => {
      return {
        id,
        value: parseCurrency(value),
      };
    });

    const preparedForecasts = await this.prepareForecasts(context, profileDetails, forecasts);

    await this.updateProfileDetails(context, preparedForecasts, profileDetails, this.isSubmitting);
    await this.updatePartner(context, partner, this.isSubmitting);

    return true;
  }

  private async prepareForecasts(
    context: IContext,
    existingDtos: ForecastDetailsDTO[],
    newDtos: Pick<ForecastDetailsDTO, "id" | "value">[],
  ): Promise<ForecastDetailsDTO[]> {
    const returnDtos: ForecastDetailsDTO[] = [];

    for (const newDto of newDtos) {
      const existingDto = existingDtos.find(x => x.id === newDto.id);

      returnDtos.push({
        ...existingDto,
        ...newDto,
      } as ForecastDetailsDTO);
    }

    return await this.ignoreCalculatedCostCategories(context, returnDtos);
  }

  private async ignoreCalculatedCostCategories(context: IContext, dtos: ForecastDetailsDTO[]) {
    // check to see if there are any calculated cost categories
    const calculatedCostCategoryIds = await context
      .runQuery(new GetUnfilteredCostCategoriesQuery())
      .then(costCategories => costCategories.filter(x => x.isCalculated).map(x => x.id));

    return dtos.filter(forecast => calculatedCostCategoryIds.indexOf(forecast.costCategoryId) === -1);
  }

  private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
    const existingItem = existing.find(x => x.id === item.id);

    // TODO: Check this logic
    return !existingItem || item.value !== existingItem.value;
  }

  private async updateProfileDetails(
    context: IContext,
    forecasts: ForecastDetailsDTO[],
    existing: ForecastDetailsDTO[],
    isSubmitting: boolean,
  ): Promise<boolean> {
    // TODO: Reduce iteration count in this Loop (consider for-loop/reduce)
    const updates: Updatable<ISalesforceProfileDetails>[] = isSubmitting
      ? forecasts.map<Updatable<ISalesforceProfileDetails>>(x => ({
          Id: x.id,
          Acc_InitialForecastCost__c: x.value,
          Acc_LatestForecastCost__c: x.value,
        }))
      : forecasts
          .filter(x => this.hasChanged(x, existing))
          .map<Updatable<ISalesforceProfileDetails>>(x => ({
            Id: x.id,
            Acc_InitialForecastCost__c: x.value,
          }));

    if (!updates.length) return true;

    return context.repositories.profileDetails.update(updates);
  }

  private async updatePartner(context: IContext, partnerDto: PartnerDto, isSubmitting: boolean): Promise<void> {
    const updatedStatus = SpendProfileStatus[isSubmitting ? "Complete" : "Incomplete"];
    const updatedSpendProfile = new PartnerSpendProfileStatusMapper().mapToSalesforce(updatedStatus);

    const updatedPartner: Updatable<ISalesforcePartner> = {
      Id: partnerDto.id,
      Acc_SpendProfileCompleted__c: updatedSpendProfile,
    };

    // Note: Update the partner spend profile - This state is used as part of a workflow
    await context.repositories.partners.update(updatedPartner);
  }
}
