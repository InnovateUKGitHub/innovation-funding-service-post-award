import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ReallocateCostsDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { parseCurrency } from "@framework/util/numberHelper";
import {
  costCategoryLevelReallocateCostsEditErrorMap,
  CostCategoryLevelReallocateCostsEditSchemaType,
  costCategoryLevelReallocateCostsEditSchema,
} from "@ui/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelReallocateCostsEdit.zod";

export class UpdatePcrReallocateCostsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  CostCategoryLevelReallocateCostsEditSchemaType,
  ReallocateCostsDto
> {
  public readonly runnableName: string = "UpdatePcrReallocateCostsCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrReallocateCostsCostCategorySaveAndContinue;
  protected readonly dto: ReallocateCostsDto;

  constructor({
    projectId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrItemId: PcrItemId;
    pcr: ReallocateCostsDto;
    form: FormTypes.PcrReallocateCostsCostCategorySaveAndContinue;
  }) {
    super();
    this.projectId = projectId;
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
    return {
      schema: costCategoryLevelReallocateCostsEditSchema,
      errorMap: costCategoryLevelReallocateCostsEditErrorMap,
    };
  }

  protected async mapToZod() {
    console.log("this.dto", this.dto);
    return {
      financialVirements: this.dto.financialVirements,
      partnerId: this.dto.partnerId,
      form: this.form,
      virements: this.dto.virements,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<CostCategoryLevelReallocateCostsEditSchemaType>,
  ): Promise<boolean> {
    const updates = validatedData.virements
      .filter(x => parseCurrency(x.newEligibleCosts) !== parseCurrency(x.initialNewEligibleCosts))
      .map(x => ({
        Id: x.virementCostId,
        Acc_NewCosts__c: parseCurrency(x.newEligibleCosts),
      }));

    if (updates.length) {
      await context.repositories.financialVirements.updateVirements(updates);
    }

    return true;
  }
}
