import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectCostSubcontractingDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  errorMap,
  subcontractingSchema,
  SubcontractingSchemaType,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { parseCurrency } from "@framework/util/numberHelper";

export class UpdatePcrAddPartnerProjectCostSubcontractingCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  SubcontractingSchemaType,
  PcrAddPartnerProjectCostSubcontractingDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectCostSubcontractingCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectCostSubcontracting;
  protected readonly dto: PcrAddPartnerProjectCostSubcontractingDto;

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
    pcr: PcrAddPartnerProjectCostSubcontractingDto;
    form: FormTypes.PcrAddPartnerProjectCostSubcontracting;
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
    return { schema: subcontractingSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      subcontractorName: this.dto.subcontractorName,
      subcontractorCountry: this.dto.subcontractorCountry,
      subcontractorRoleAndDescription: this.dto.subcontractorRoleAndDescription,
      subcontractorCost: this.dto.subcontractorCost,
      form: this.form,
      costCategoryId: this.dto.costCategoryId,
      costCategoryType: this.dto.costCategoryType,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<SubcontractingSchemaType>,
  ): Promise<boolean> {
    const payload = {
      Acc_CostCategoryID__c: validatedData.costCategoryId,
      Acc_Country__c: validatedData.subcontractorCountry,
      Acc_RoleAndDescription__c: validatedData.subcontractorRoleAndDescription,
      Acc_ProjectChangeRequest__c: this.pcrItemId,
      Acc_ItemDescription__c: validatedData.subcontractorName,
      Acc_TotalCost__c: parseCurrency(validatedData.subcontractorCost),
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
