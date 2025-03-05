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
}
