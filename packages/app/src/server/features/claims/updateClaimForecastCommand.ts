import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { ClaimUpdateForecastDto } from "@framework/dtos/claimDto";
import { claimForecastSchema, errorMap, ClaimForecastSchemaType } from "@ui/pages/claims/forecast/ClaimForecast.zod";
import { parseCurrency } from "@framework/util/numberHelper";

export class UpdateClaimForecastCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ClaimForecastSchemaType,
  ClaimUpdateForecastDto
> {
  public readonly runnableName: string = "UpdateClaimForecastCommand";
  protected readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  private readonly periodId: PeriodId;
  protected readonly dto: ClaimUpdateForecastDto;

  constructor(projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId, dto: ClaimUpdateForecastDto) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.periodId = periodId;
    this.dto = dto;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: claimForecastSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      profile: this.dto.profile,
      submit: this.dto.submit,
      total: this.dto.total,
      totalGolCost: this.dto.totalGolCost,
      finalClaim: this.dto.finalClaim,
      initialProfile: this.dto.initialProfile,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ClaimForecastSchemaType>,
  ): Promise<boolean> {
    console.log("validatedData", validatedData);
    const updates = Object.entries(validatedData.profile)
      .filter(x => {
        return validatedData.initialProfile[x[0]] !== x[1];
      })
      .map(entry => ({
        Id: entry[0],
        Acc_LatestForecastCost__c: parseCurrency(entry[1]),
      }));

    console.log("updates", updates);
    await context.repositories.profileDetails.update(updates);

    return true;
  }

  //   private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
  //     const existingItem = existing.find(x => x.id === item.id);
  //     return !existingItem || item.value !== existingItem.value;
  //   }

  //   private async updateProfileDetails(
  //     context: IContext,
  //     forecasts: ForecastDetailsDTO[],
  //     existing: ForecastDetailsDTO[],
  //   ) {
  //     const updates = forecasts
  //       .filter(x => this.hasChanged(x, existing))
  //       .map<Updatable<ISalesforceProfileDetails>>(x => ({
  //         Id: x.id,
  //         Acc_LatestForecastCost__c: x.value,
  //       }));

  //     return context.repositories.profileDetails.update(updates);
  //   }

  //   private async updateClaim(context: IContext) {
  //     const query = new GetAllClaimsByPartnerIdQuery(this.partnerId);
  //     const claims = await context.runQuery(query);
  //     const claim = claims.find(x => !x.isApproved);

  //     if (!claim) {
  //       throw new BadRequestError("Unable to find current claim.");
  //     }

  //     claim.status = this.nextClaimStatus(claim);
  //     const updateClaimCommand = new UpdateClaimCommand(this.projectId, claim);
  //     await context.runCommand(updateClaimCommand);
  //   }

  //   private async updatePartner(context: IContext, partner: PartnerDto) {
  //     if (!partner.newForecastNeeded) {
  //       return;
  //     }
  //     const updatedPartner: Updatable<ISalesforcePartner> = {
  //       Id: partner.id,
  //       Acc_NewForecastNeeded__c: false,
  //     };

  //     await context.repositories.partners.update(updatedPartner);
  //   }

  //   private nextClaimStatus(claim: ClaimDto) {
  //     switch (claim.status) {
  //       case ClaimStatus.DRAFT:
  //         return ClaimStatus.SUBMITTED;
  //       case ClaimStatus.MO_QUERIED:
  //         return ClaimStatus.SUBMITTED;
  //       case ClaimStatus.INNOVATE_QUERIED:
  //         return ClaimStatus.AWAITING_IUK_APPROVAL;
  //     }

  //     throw new BadRequestError(`Claim in invalid status. Cannot get next claim status for claim in ${claim.status}`);
  //   }
}
