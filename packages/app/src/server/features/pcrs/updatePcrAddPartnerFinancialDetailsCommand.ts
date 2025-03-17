import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerFinancialDetailsDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { Clock } from "@framework/util/clock";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  FinanceDetailsSchemaType,
  getFinanceDetailsSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/financialDetails.zod";
import { combineDate } from "@ui/components/atoms/Date";
import { parseCurrency } from "@framework/util/numberHelper";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

const clock = new Clock();

export class UpdatePcrAddPartnerFinancialDetailsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  FinanceDetailsSchemaType,
  PcrAddPartnerFinancialDetailsDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerFinancialDetailsCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerFinancialDetailsStep;
  protected readonly dto: PcrAddPartnerFinancialDetailsDto;

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
    pcr: PcrAddPartnerFinancialDetailsDto;
    form: FormTypes.PcrAddPartnerFinancialDetailsStep;
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
    return { schema: getFinanceDetailsSchema(!!this.dto.markedAsComplete), errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      markedAsComplete: !!this.dto.markedAsComplete,
      button_submit: this.dto.button_submit,
      financialYearEndTurnover: this.dto.financialYearEndTurnover ?? null,
      financialYearEndDate_month: this.dto.financialYearEndDate_month ?? "",
      financialYearEndDate_year: this.dto.financialYearEndDate_year ?? "",
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<FinanceDetailsSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_TurnoverYearEnd__c: clock.formatOptionalSalesforceDate(
        combineDate(validatedData.financialYearEndDate_month, validatedData.financialYearEndDate_year, false),
      ),
      Acc_Turnover__c: parseCurrency(validatedData.financialYearEndTurnover),
    });

    return true;
  }
}
