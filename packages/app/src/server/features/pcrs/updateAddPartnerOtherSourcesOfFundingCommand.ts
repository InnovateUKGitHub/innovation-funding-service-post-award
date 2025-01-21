import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerOtherSourcesOfFundingDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  otherSourcesOfFundingSchema,
  OtherSourcesOfFundingSchemaType,
} from "@ui/pages/pcrs/addPartner/steps/schemas/otherSourcesOfFunding.zod";
import { parseCurrency } from "@framework/util/numberHelper";
import { combineDate } from "@ui/components/atoms/Date";

export class UpdatePcrAddPartnerOtherSourcesOfFundingCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  OtherSourcesOfFundingSchemaType,
  PcrAddPartnerOtherSourcesOfFundingDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerOtherSourcesOfFundingCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerOtherSourcesOfFundingStep;
  protected readonly dto: PcrAddPartnerOtherSourcesOfFundingDto;

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
    pcr: PcrAddPartnerOtherSourcesOfFundingDto;
    form: FormTypes.PcrAddPartnerOtherSourcesOfFundingStep;
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
    return { schema: otherSourcesOfFundingSchema, errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
      funds: this.dto.funds,
      deletedCostsOrFunds: this.dto.deletedCostsOrFunds,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<OtherSourcesOfFundingSchemaType>,
  ): Promise<boolean> {
    const newFundItems = validatedData.funds
      .filter(x => !x.costId)
      .map(x => ({
        ...x,
        value: parseCurrency(x.value),
        pcrItemId: this.pcrItemId,
        dateOtherFundingSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false)?.toISOString(),
      }));

    const updatedFundItems = validatedData.funds
      .filter(x => !!x.costId)
      .map(x => ({
        ...x,
        value: parseCurrency(x.value),
        pcrItemId: this.pcrItemId,
        dateOtherFundingSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false)?.toISOString(),
        id: x.costId,
      }));

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
    });

    await context.repositories.pcrSpendProfile.insertSpendProfiles(newFundItems);
    await context.repositories.pcrSpendProfile.updateSpendProfiles(updatedFundItems);
    await context.repositories.pcrSpendProfile.deleteSpendProfiles(validatedData.deletedCostsOrFunds);
    return true;
  }
}
