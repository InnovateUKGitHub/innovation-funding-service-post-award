import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { UpdatePartnerProjectSetupDto } from "@server/apis/partners";
import {
  projectSetupErrorMap,
  projectSetupSchema,
  ProjectSetupSchema,
} from "@ui/pages/projects/setup/projectSetup.zod";
import { IContext } from "@framework/types/IContext";
import { options } from "@framework/mappers/partnerStatus";

export class UpdatePartnerProjectSetupCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ProjectSetupSchema,
  UpdatePartnerProjectSetupDto
> {
  protected readonly projectId: ProjectId;
  protected readonly partnerId: PartnerId;
  public readonly runnableName: string = "UpdatePartnerProjectSetupCommand";

  protected dto: UpdatePartnerProjectSetupDto;

  private savedPartner: PartnerDto | null = null;

  constructor(projectId: ProjectId, partnerId: PartnerId, partner: UpdatePartnerProjectSetupDto) {
    super();
    this.dto = partner;
    this.projectId = projectId;
    this.partnerId = partnerId;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.projectId, this.partnerId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema() {
    return {
      schema: projectSetupSchema,
      errorMap: projectSetupErrorMap,
    };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      postcode: this.dto.postcode,
      bankDetailsTaskStatus: this.dto.bankDetailsTaskStatus,
      spendProfileStatus: this.dto.spendProfileStatus,
    };
  }

  protected async runRepositoryCommands(context: IContext) {
    await context.repositories.partners.update({
      Id: this.partnerId,
      Acc_ParticipantStatus__c: options.active,
    });
    return true;
  }
}
