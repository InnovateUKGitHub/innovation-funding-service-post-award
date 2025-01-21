import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerJesStepDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { jesStepSchema, JesStepSchema } from "@ui/pages/pcrs/addPartner/steps/schemas/jesStep.zod";

export class UpdatePcrAddPartnerJesStepCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  JesStepSchema,
  PcrAddPartnerJesStepDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerJesStepCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerJesFormStep;
  protected readonly dto: PcrAddPartnerJesStepDto;

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
    pcr: PcrAddPartnerJesStepDto;
    form: FormTypes.PcrAddPartnerJesFormStep;
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
    return { schema: jesStepSchema, errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
    };
  }

  protected async runRepositoryCommands(): Promise<boolean> {
    return true;
  }
}
