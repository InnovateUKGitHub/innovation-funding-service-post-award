import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectCostMaterialsDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  errorMap,
  MaterialsSchemaType,
  materialsSchema,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";

export class UpdatePcrAddPartnerProjectCostMaterialsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  MaterialsSchemaType,
  PcrAddPartnerProjectCostMaterialsDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectCostMaterialsCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectCostMaterials;
  protected readonly dto: PcrAddPartnerProjectCostMaterialsDto;

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
    pcr: PcrAddPartnerProjectCostMaterialsDto;
    form: FormTypes.PcrAddPartnerProjectCostMaterials;
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
    return { schema: materialsSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      form: this.form,
      materialsDescription: this.dto.materialsDescription,
      costPerItem: this.dto.costPerItem,
      quantityOfMaterialItems: this.dto.quantityOfMaterialItems,
      costCategoryId: this.dto.costCategoryId,
      costCategoryType: this.dto.costCategoryType,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<MaterialsSchemaType>,
  ): Promise<boolean> {
    const payload = {
      Acc_CostCategoryID__c: validatedData.costCategoryId,
      Acc_ProjectChangeRequest__c: this.pcrItemId,
      Acc_ItemDescription__c: validatedData.materialsDescription,
      Acc_CostPerItem__c: parseCurrency(validatedData.costPerItem),
      Acc_Quantity__c: validatedData.quantityOfMaterialItems,
      Acc_TotalCost__c: roundCurrency(parseCurrency(validatedData.costPerItem) * validatedData.quantityOfMaterialItems),
    };

    if (validatedData.id) {
      context.repositories.pcrSpendProfile.updateSingleItem({
        Id: validatedData.id,
        ...payload,
      });
    } else {
      context.repositories.pcrSpendProfile.insertSingleItem(payload);
    }

    return true;
  }
}
