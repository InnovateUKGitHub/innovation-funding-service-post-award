import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrRemovePartnerDto, RemovePartnerFormType } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { zodEmptySchema, ZodEmptySchema } from "@ui/zod/helperValidators/helperValidators.zod";
import {
  removePartnerErrorMap,
  removePartnerSchema,
  RemovePartnerSchema,
} from "@ui/pages/pcrs/removePartner/removePartner.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

export class UpdatePcrManageTeamMembersReplaceCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  RemovePartnerSchema | ZodEmptySchema,
  PcrRemovePartnerDto
> {
  public readonly runnableName: string = "UpdatePcrRemovePartnerCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: RemovePartnerFormType;
  protected readonly dto: PcrRemovePartnerDto;

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
    pcr: PcrRemovePartnerDto;
    form: RemovePartnerFormType;
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
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
    if (this.form === FormTypes.PcrRemovePartnerFilesStep) {
      return { schema: zodEmptySchema, errorMap: removePartnerErrorMap };
    }
    return { schema: removePartnerSchema, errorMap: removePartnerErrorMap };
  }

  protected async mapToZod() {
    if (this.form === FormTypes.PcrRemovePartnerFilesStep) {
      return {};
    }
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      removalPeriod: this.dto.removalPeriod,
      numberOfPeriods: this.dto.numberOfPeriods,
      partnerId: this.dto.partnerId,
      form: this.form,
      projectId: this.projectId,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<RemovePartnerSchema>,
  ): Promise<boolean> {
    if (this.form === FormTypes.PcrRemovePartnerFilesStep) {
      return true;
    }

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
      Acc_RemovalPeriod__c: validatedData.removalPeriod,
      Acc_Project_Participant__c: validatedData.partnerId,
    });

    return true;
  }
}
