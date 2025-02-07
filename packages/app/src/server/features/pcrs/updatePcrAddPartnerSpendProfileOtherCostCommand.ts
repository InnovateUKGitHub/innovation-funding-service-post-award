import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectCostOtherCostDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  otherCostsSchema,
  OtherCostsSchemaType,
  errorMap,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { parseCurrency } from "@framework/util/numberHelper";

export class UpdatePcrAddPartnerSpendProfileOtherCostCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  OtherCostsSchemaType,
  PcrAddPartnerProjectCostOtherCostDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerSpendProfileOtherCostCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerSpendProfileOtherCost;
  protected readonly dto: PcrAddPartnerProjectCostOtherCostDto;

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
    pcr: PcrAddPartnerProjectCostOtherCostDto;
    form: FormTypes.PcrAddPartnerSpendProfileOtherCost;
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
    return { schema: otherCostsSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      form: this.form,
      value: this.dto.value,
      otherCostDescription: this.dto.description,
      estimatedCost: this.dto.value,
      costCategoryType: this.dto.costCategoryType,
      costCategoryId: this.dto.costCategoryId,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<OtherCostsSchemaType>,
  ): Promise<boolean> {
    if (validatedData.id) {
      context.repositories.pcrSpendProfile.updateSingleItem({
        Id: validatedData.id,
        Acc_CostCategoryID__c: validatedData.costCategoryId,
        Acc_ProjectChangeRequest__c: this.pcrItemId,
        Acc_ItemDescription__c: validatedData.otherCostDescription,
        Acc_TotalCost__c: parseCurrency(validatedData.estimatedCost),
      });
    } else {
      context.repositories.pcrSpendProfile.insertSingleItem({
        Acc_CostCategoryID__c: validatedData.costCategoryId,
        Acc_ProjectChangeRequest__c: this.pcrItemId,
        Acc_ItemDescription__c: validatedData.otherCostDescription,
        Acc_TotalCost__c: parseCurrency(validatedData.estimatedCost),
      });
    }

    return true;
  }
}
