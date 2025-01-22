import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerFundingLevelDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { AwardRateSchemaType, getAwardRateSchema } from "@ui/pages/pcrs/addPartner/steps/schemas/awardRate.zod";

export class UpdatePcrAddPartnerFundingLevelCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  AwardRateSchemaType,
  PcrAddPartnerFundingLevelDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerFundingLevelCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerAwardRateStep;
  protected readonly dto: PcrAddPartnerFundingLevelDto;

  constructor({
    projectId,
    pcrId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrId: PcrId;
    pcrItemId: PcrItemId;
    pcr: PcrAddPartnerFundingLevelDto;
    form: FormTypes.PcrAddPartnerAwardRateStep;
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
    this.pcrItemId = pcrItemId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: getAwardRateSchema(!!this.dto.markedAsComplete), errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
      awardRate: this.dto.awardRate,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<AwardRateSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
      Acc_AwardRate__c: validatedData.awardRate,
    });

    return true;
  }
}
