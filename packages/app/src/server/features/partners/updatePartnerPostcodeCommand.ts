import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import {
  postcodeErrorMap,
  postcodeSchema,
  PostcodeSchema,
} from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { z } from "zod";
import { UpdatePartnerPostcodeDto } from "@server/apis/partners";

export class UpdatePartnerPostcodeCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  PostcodeSchema,
  UpdatePartnerPostcodeDto
> {
  protected readonly projectId: ProjectId;
  protected readonly partnerId: PartnerId;
  public readonly runnableName: string = "UpdatePartnerPostcodeCommand";

  protected dto: UpdatePartnerPostcodeDto;

  constructor(projectId: ProjectId, partnerId: PartnerId, partner: UpdatePartnerPostcodeDto) {
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
    return { schema: postcodeSchema, errorMap: postcodeErrorMap };
  }

  protected async mapToZod(): Promise<z.input<PostcodeSchema>> {
    return {
      form: this.dto.form,
      postcodeStatus: this.dto.postcodeStatus,
      partnerStatus: this.dto.partnerStatus,
      isSetup: this.dto.isSetup,
      postcode: this.dto.postcode,
    };
  }

  protected async runRepositoryCommands(context: IContext, validatedData: z.output<PostcodeSchema>) {
    await context.repositories.partners.update({
      Id: this.partnerId,
      Acc_Postcode__c: validatedData.postcode,
    });

    return true;
  }
}
