import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { parseCurrency } from "@framework/util/numberHelper";
import { InitialForecastDto } from "@framework/dtos/forecastDetailsDto";
import {
  setupSpendProfileSchema,
  SetupSpendProfileSchemaType,
  errorMap,
} from "@ui/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.zod";
import { SpendProfileStatus } from "@framework/constants/partner";
import { PartnerSpendProfileStatusMapper } from "../partners/mapToPartnerDto";

export class UpdateInitialForecastCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  SetupSpendProfileSchemaType,
  InitialForecastDto
> {
  public readonly runnableName: string = "UpdateInitialForecastCommand";
  protected readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  protected readonly dto: InitialForecastDto;

  constructor(projectId: ProjectId, partnerId: PartnerId, dto: InitialForecastDto) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.dto = dto;
  }

  async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact);
  }
  protected async getZodSchema() {
    return { schema: setupSpendProfileSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      profile: this.dto.profile,
      submit: this.dto.submit,
      costCategoryProfiles: this.dto.costCategoryProfiles,
      initialProfile: this.dto.initialProfile,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<SetupSpendProfileSchemaType>,
  ): Promise<boolean> {
    const updatedStatus = SpendProfileStatus[validatedData.submit ? "Complete" : "Incomplete"];
    const updatedSpendProfile = new PartnerSpendProfileStatusMapper().mapToSalesforce(updatedStatus);

    const updatedPartner = {
      Id: this.partnerId,
      Acc_SpendProfileCompleted__c: updatedSpendProfile,
    };

    const updates = validatedData.submit
      ? Object.entries(validatedData.profile).map(([id, value]) => ({
          Id: id,
          Acc_InitialForecastCost__c: parseCurrency(value),
          Acc_LatestForecastCost__c: parseCurrency(value),
        }))
      : Object.entries(validatedData.profile)
          .filter(([id, value]) => validatedData.initialProfile[id] !== value)
          .map(([id, value]) => ({
            Id: id,
            Acc_InitialForecastCost__c: parseCurrency(value),
          }));

    await Promise.all([
      context.repositories.profileDetails.update(updates),
      context.repositories.partners.update(updatedPartner),
    ]);

    return true;
  }
}
