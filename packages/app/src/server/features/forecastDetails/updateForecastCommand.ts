import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { parseCurrency } from "@framework/util/numberHelper";
import { forecastPageSchema, ForecastPageSchema, errorMap } from "@ui/pages/forecasts/forecastPage.zod";
import { ForecastUpdateDto } from "@framework/dtos/forecastDetailsDto";

export class UpdateForecastCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ForecastPageSchema,
  ForecastUpdateDto
> {
  public readonly runnableName: string = "UpdateForecastCommand";
  protected readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  protected readonly dto: ForecastUpdateDto;

  constructor(projectId: ProjectId, partnerId: PartnerId, dto: ForecastUpdateDto) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.dto = dto;
  }

  async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema() {
    return { schema: forecastPageSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      profile: this.dto.profile,
      total: this.dto.total,
      totalGolCost: this.dto.totalGolCost,
      finalClaim: this.dto.finalClaim,
      initialProfile: this.dto.initialProfile,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ForecastPageSchema>,
  ): Promise<boolean> {
    const updates = Object.entries(validatedData.profile)
      .filter(([id, value]) => {
        return parseCurrency(validatedData.initialProfile[id]) !== parseCurrency(value);
      })
      .map(([id, value]) => ({
        Id: id,
        Acc_LatestForecastCost__c: parseCurrency(value),
      }));

    await context.repositories.profileDetails.update(updates);

    return true;
  }
}
