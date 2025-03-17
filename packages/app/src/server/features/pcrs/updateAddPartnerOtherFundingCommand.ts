import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerOtherFundingDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { otherFundingSchema, OtherFundingSchemaType } from "@ui/pages/pcrs/addPartner/steps/schemas/otherFunding.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerOtherFundingCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  OtherFundingSchemaType,
  PcrAddPartnerOtherFundingDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerOtherFundingCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerOtherFundingStep;
  protected readonly dto: PcrAddPartnerOtherFundingDto;

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
    pcr: PcrAddPartnerOtherFundingDto;
    form: FormTypes.PcrAddPartnerOtherFundingStep;
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
    return { schema: otherFundingSchema, errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
      hasOtherFunding: this.dto.hasOtherFunding ?? "false",
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<OtherFundingSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_OtherFunding__c: validatedData.hasOtherFunding === "true",
    });

    return true;
  }
}
