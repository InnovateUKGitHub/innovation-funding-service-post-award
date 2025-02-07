import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectCostTravelAndSubsistenceDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  errorMap,
  travelAndASubsistenceSchema,
  TravelAndSubsistenceSchemaType,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";

export class UpdatePcrAddPartnerProjectCostTravelAndSubsistenceCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  TravelAndSubsistenceSchemaType,
  PcrAddPartnerProjectCostTravelAndSubsistenceDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectCostTravelAndSubsistenceCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectCostTravelAndSubsistence;
  protected readonly dto: PcrAddPartnerProjectCostTravelAndSubsistenceDto;

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
    pcr: PcrAddPartnerProjectCostTravelAndSubsistenceDto;
    form: FormTypes.PcrAddPartnerProjectCostTravelAndSubsistence;
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
    return { schema: travelAndASubsistenceSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      descriptionOfCost: this.dto.descriptionOfCost,
      numberOfTimes: this.dto.numberOfTimes,
      costOfEach: this.dto.costOfEach,
      form: this.form,
      costCategoryId: this.dto.costCategoryId,
      costCategoryType: this.dto.costCategoryType,
      // this is just for providing a key to attach an error message
      totalCost: 0,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<TravelAndSubsistenceSchemaType>,
  ): Promise<boolean> {
    const payload = {
      Acc_CostCategoryID__c: validatedData.costCategoryId,
      Acc_ProjectChangeRequest__c: this.pcrItemId,
      Acc_ItemDescription__c: validatedData.descriptionOfCost,
      Acc_NumberOfTimes__c: validatedData.numberOfTimes,
      Acc_CostEach__c: parseCurrency(validatedData.costOfEach),
      Acc_TotalCost__c: roundCurrency(parseCurrency(validatedData.costOfEach) * validatedData.numberOfTimes),
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
