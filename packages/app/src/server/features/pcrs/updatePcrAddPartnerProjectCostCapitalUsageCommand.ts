import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectCostCapitalUsageDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  errorMap,
  capitalUsageSchema,
  CapitalUsageSchemaType,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { PcrSpendProfileCapitalUsageTypeMapper } from "@framework/mappers/spendProfileTypeMapper";

export class UpdatePcrAddPartnerProjectCostCapitalUsageCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  CapitalUsageSchemaType,
  PcrAddPartnerProjectCostCapitalUsageDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectCostCapitalUsageCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectCostCapitalUsage;
  protected readonly dto: PcrAddPartnerProjectCostCapitalUsageDto;

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
    pcr: PcrAddPartnerProjectCostCapitalUsageDto;
    form: FormTypes.PcrAddPartnerProjectCostCapitalUsage;
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
    return { schema: capitalUsageSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      form: this.form,
      capitalUsageDescription: this.dto.capitalUsageDescription,
      depreciationPeriod: this.dto.depreciationPeriod,
      itemType: this.dto.itemType,
      netPresentValue: this.dto.netPresentValue,
      residualValue: this.dto.residualValue,
      utilisation: this.dto.utilisation,
      costCategoryId: this.dto.costCategoryId,
      costCategoryType: this.dto.costCategoryType,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<CapitalUsageSchemaType>,
  ): Promise<boolean> {
    const netCost = roundCurrency(
      (parseCurrency(validatedData.netPresentValue) - parseCurrency(validatedData.residualValue)) *
        (Number(validatedData.utilisation) / 100),
    );

    const payload = {
      Acc_CostCategoryID__c: validatedData.costCategoryId,
      Acc_ProjectChangeRequest__c: this.pcrItemId,
      Acc_ItemDescription__c: validatedData.capitalUsageDescription,
      Acc_NewOrExisting__c: new PcrSpendProfileCapitalUsageTypeMapper().mapToSalesforcePcrSpendProfileCapitalUsageType(
        validatedData.itemType,
      ),
      Acc_DepreciationPeriod__c: validatedData.depreciationPeriod,
      Acc_NetPresentValue__c: parseCurrency(validatedData.netPresentValue),
      Acc_ResidualValue__c: parseCurrency(validatedData.residualValue),
      Acc_Utilisation__c: validatedData.utilisation,
      Acc_TotalCost__c: netCost,
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
