import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ChangeRemainingGrantDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { errorMap } from "@ui/pages/pcrs/timeExtension/timeExtension.zod";
import {
  changeRemainingGrantSchema,
  ChangeRemainingGrantSchemaType,
} from "@ui/pages/pcrs/reallocateCosts/edit/partner/changeRemainingGrant.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { parseCurrency } from "@framework/util/numberHelper";
import { getNewFundingLevel } from "@ui/pages/pcrs/reallocateCosts/edit/partner/changeRemainingGrant.logic";

export class UpdatePcrChangeRemainingGrantCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ChangeRemainingGrantSchemaType,
  ChangeRemainingGrantDto
> {
  public readonly runnableName: string = "UpdatePcrChangeRemainingGrantCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrReallocateCostsChangeRemainingGrant;
  protected readonly dto: ChangeRemainingGrantDto;

  constructor({
    projectId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrItemId: PcrItemId;
    pcr: ChangeRemainingGrantDto;
    form: FormTypes.PcrReallocateCostsChangeRemainingGrant;
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
    return { schema: changeRemainingGrantSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      partners: this.dto.partners.map(x => ({
        newRemainingCosts: x.newRemainingCosts,
        newRemainingGrant: x.newRemainingGrant,
        newFundingLevel: x.newFundingLevel,
        originalFundingLevel: x.originalFundingLevel,
        originalRemainingCosts: x.originalRemainingCosts,
        originalRemainingGrant: x.originalRemainingGrant,
        partnerId: x.partnerId,
        virementParticipantId: x.virementParticipantId,
        currentNewRemainingGrant: x.currentNewRemainingGrant,
      })),
      originalRemainingGrant: this.dto.originalRemainingGrant,
      newRemainingGrant: this.dto.newRemainingGrant,
      newRemainingCosts: this.dto.newRemainingCosts,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ChangeRemainingGrantSchemaType>,
  ): Promise<boolean> {
    const updates = validatedData.partners
      .filter(x => parseCurrency(x.newRemainingGrant) !== x.currentNewRemainingGrant)
      .map(x => ({
        Id: x.virementParticipantId,
        Acc_NewAwardRate__c: getNewFundingLevel(
          x.newRemainingCosts,
          parseCurrency(x.newRemainingGrant),
          x.originalFundingLevel,
        ),
        Acc_NewRemainingGrant__c: parseCurrency(x.newRemainingGrant),
      }));

    if (updates.length) {
      await context.repositories.financialVirements.updateVirements(updates);
    }

    return true;
  }
}
