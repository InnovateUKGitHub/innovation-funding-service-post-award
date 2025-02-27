import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import {
  editClaimLineItemErrorMap,
  editClaimLineItemsSchema,
  EditClaimLineItemsSchemaType,
} from "@ui/pages/claims/claimLineItems/editClaimLineItems.zod";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { parseCurrency } from "@framework/util/numberHelper";
import { ClaimLineItemsDto } from "@framework/dtos/claimDetailsDto";

type ExistingItem = {
  id: ClaimId;
  description: string;
  value: string | null;
};

type NewItem = {
  id: null | undefined | "";
  description: string;
  value: string | null;
};

export class UpdateClaimLineItemsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  EditClaimLineItemsSchemaType,
  ClaimLineItemsDto
> {
  public readonly runnableName = "UpdateClaimLineItems";
  protected readonly form: FormTypes.ClaimLineItemSaveAndDocuments | FormTypes.ClaimLineItemSaveAndQuit;
  protected readonly dto: ClaimLineItemsDto;
  protected readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  private readonly periodId: PeriodId;
  private readonly costCategoryId: CostCategoryId;

  constructor(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: PeriodId,
    costCategoryId: CostCategoryId,
    claimDetails: ClaimLineItemsDto,
  ) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.periodId = periodId;
    this.costCategoryId = costCategoryId;
    this.dto = claimDetails;
    this.form = claimDetails.form;
  }

  async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema() {
    return {
      schema: editClaimLineItemsSchema,
      errorMap: editClaimLineItemErrorMap,
    };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      comments: this.dto.comments,
      lineItems: this.dto.lineItems,
      deletedClaimItems: this.dto.deletedClaimItems,
      initialLineItems: this.dto.initialLineItems,
      id: this.dto.id,
    };
  }

  private isExistingItem = (item: ExistingItem | NewItem): item is ExistingItem => !!item.id;

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<EditClaimLineItemsSchemaType>,
  ): Promise<boolean> {
    const updatedLineItems = validatedData.lineItems
      .filter(this.isExistingItem)
      .filter(x => {
        const matchedItem = validatedData.initialLineItems.find(y => y.id === x.id);
        return matchedItem?.description !== x.description || matchedItem?.value !== x.value;
      })
      .map(x => ({
        Id: x.id,
        Acc_LineItemDescription__c: x.description,
        Acc_LineItemCost__c: parseCurrency(x.value),
      }));

    const newLineItems = validatedData.lineItems
      .filter(x => !this.isExistingItem(x))
      .map(x => ({
        Acc_LineItemDescription__c: x.description,
        Acc_LineItemCost__c: parseCurrency(x.value),
        Acc_ProjectParticipant__c: this.partnerId,
        Acc_ProjectPeriodNumber__c: this.periodId,
        Acc_CostCategory__c: this.costCategoryId,
      }));

    await Promise.allSettled([
      !!validatedData.id
        ? context.repositories.claimDetails.update({
            Acc_ReasonForDifference__c: validatedData.comments,
            Id: validatedData.id,
          })
        : context.repositories.claimDetails.insert({
            Acc_ReasonForDifference__c: validatedData.comments,
            Acc_ProjectParticipant__r: {
              Id: this.partnerId,
              Acc_ProjectId__c: this.projectId,
            },
            Acc_ProjectPeriodNumber__c: this.periodId,
            Acc_CostCategory__c: this.costCategoryId,
            Acc_PeriodCostCategoryTotal__c: 0,
          }),
      context.repositories.claimLineItems.update(updatedLineItems),
      context.repositories.claimLineItems.insert(newLineItems),
      context.repositories.claimLineItems.delete(validatedData.deletedClaimItems),
    ]);

    return true;
  }
}
