import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectCostLabourDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { errorMap, LabourSchemaType, labourSchema } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { sumBy } from "lodash";

export class UpdatePcrAddPartnerProjectCostLabourCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  LabourSchemaType,
  PcrAddPartnerProjectCostLabourDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectCostLabourCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectCostLabour;
  protected readonly dto: PcrAddPartnerProjectCostLabourDto;

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
    pcr: PcrAddPartnerProjectCostLabourDto;
    form: FormTypes.PcrAddPartnerProjectCostLabour;
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
    return { schema: labourSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      form: this.form,
      labourDescription: this.dto.labourDescription,
      grossCostOfRole: this.dto.grossCostOfRole,
      daysSpentOnProject: this.dto.daysSpentOnProject,
      ratePerDay: this.dto.ratePerDay,
      costCategoryId: this.dto.costCategoryId,
      costCategoryType: this.dto.costCategoryType,
      overheadCostId: this.dto.overheadCostId,
      labourProfile: this.dto.labourProfile,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<LabourSchemaType>,
  ): Promise<boolean> {
    const totalCost = roundCurrency(parseCurrency(validatedData.ratePerDay) * validatedData.daysSpentOnProject);

    /**
     * need to recalculate overheads in the case that they have already been set to 20%
     * inferred by presence of a matching overhead cost id
     */
    const shouldUpdateOverheads = !!validatedData.overheadCostId;
    let newLabourTotal = 0;

    if (shouldUpdateOverheads) {
      if (validatedData.id) {
        newLabourTotal = sumBy(validatedData.labourProfile, x =>
          x.id === validatedData.id ? totalCost : (x.value ?? 0),
        );
      } else {
        newLabourTotal = sumBy(validatedData.labourProfile, x => x.value ?? 0) + totalCost;
      }

      await context.repositories.pcrSpendProfile.updateSingleItem({
        Id: validatedData.overheadCostId as CostId,
        Acc_TotalCost__c: roundCurrency(newLabourTotal * 0.2),
      });
    }

    const payload = {
      Acc_CostCategoryID__c: validatedData.costCategoryId,
      Acc_ProjectChangeRequest__c: this.pcrItemId,
      Acc_ItemDescription__c: validatedData.labourDescription,
      Acc_DaysSpentOnProject__c: validatedData.daysSpentOnProject,
      Acc_GrossCostOfRole__c: parseCurrency(validatedData.grossCostOfRole),
      Acc_Rate__c: parseCurrency(validatedData.ratePerDay),
      Acc_TotalCost__c: totalCost,
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
