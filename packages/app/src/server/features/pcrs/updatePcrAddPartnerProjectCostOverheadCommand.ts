import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectCostOverheadDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { errorMap, OverheadSchemaType, overheadSchema } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { parseCurrency } from "@framework/util/numberHelper";
import { PcrSpendProfileOverheadRateMapper } from "@framework/mappers/spendProfileOverheadMapper";

export class UpdatePcrAddPartnerProjectCostOverheadCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  OverheadSchemaType,
  PcrAddPartnerProjectCostOverheadDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectCostOverheadCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectCostOverhead;
  protected readonly dto: PcrAddPartnerProjectCostOverheadDto;

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
    pcr: PcrAddPartnerProjectCostOverheadDto;
    form: FormTypes.PcrAddPartnerProjectCostOverhead;
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
    this.pcrItemId = pcrItemId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRolePermissionBits.ProjectManager);
  }

  protected async getZodSchema() {
    return { schema: overheadSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      form: this.form,
      button_submit: this.dto.button_submit,
      overheadRate: this.dto.overheadRate,
      calculatedValue: this.dto.calculatedValue,
      costCategoryId: this.dto.costCategoryId,
      costCategoryType: this.dto.costCategoryType,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<OverheadSchemaType>,
  ): Promise<boolean> {
    const payload = {
      Acc_CostCategoryID__c: validatedData.costCategoryId,
      Acc_ProjectChangeRequest__c: this.pcrItemId,
      Acc_OverheadRate__c: new PcrSpendProfileOverheadRateMapper().mapToSalesforcePcrSpendProfileOverheadRateOption(
        validatedData.overheadRate,
      ),
      Acc_TotalCost__c: parseCurrency(validatedData.calculatedValue),
    };

    if (validatedData.id) {
      await context.repositories.pcrSpendProfile.updateSingleItem({
        Id: validatedData.id,
        ...payload,
      });
    } else {
      await context.repositories.pcrSpendProfile.insertSingleItem(payload);
    }

    return true;
  }
}
