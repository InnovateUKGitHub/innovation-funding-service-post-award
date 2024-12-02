import { BankDetailsTaskStatus, SpendProfileStatus } from "@framework/constants/partner";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { InActiveProjectError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { isEmpty } from "lodash";
import { FormTypes } from "@ui/zod/FormTypes";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { z } from "zod";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { projectSetupPostcodeCommandQuery, ProjectSetupPostcodeCommandData } from "./ProjectSetupPostcodeCommandQuery";
import {
  projectSetupErrorMap,
  ProjectSetupSchema,
  projectSetupSchema,
} from "@ui/pages/projects/setup/projectSetup.zod";

type ProjectSetupDto = Pick<
  PartnerDto,
  "id" | "projectId" | "postcode" | "bankDetailsTaskStatus" | "spendProfileStatus"
>;

export class ProjectSetupCommand extends ZodAuthorisedAsyncCommandBase<boolean, ProjectSetupSchema, ProjectSetupDto> {
  public readonly runnableName: string = "ProjectSetupPostcodeCommand";

  protected dto: ProjectSetupDto;

  private form: FormTypes.ProjectSetup;

  constructor(partner: ProjectSetupDto, form: FormTypes.ProjectSetup) {
    super();
    this.dto = partner;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.dto.projectId, this.dto.id)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema() {
    return { schema: projectSetupSchema, errorMap: projectSetupErrorMap };
  }

  private async getSavedPartnerData(context: IContext) {
    const { data, errors } = await context.runGraphqlQuery<ProjectSetupPostcodeCommandData>({
      document: projectSetupPostcodeCommandQuery,
      variables: { projectId: this.dto.projectId, partnerId: this.dto.id },
    });

    if (!isEmpty(errors)) {
      throw new Error("failed to fetch some data");
    } else {
      return {
        project: mapToProjectDto(data.uiapi.query.Acc_Project__c.edges[0].node, ["isActive"]),
        partner: mapToPartnerDto(
          data.uiapi.query.Acc_ProjectParticipant__c.edges[0].node,
          ["accountId", "name", "postcodeStatus", "postcode"],
          {},
        ),
      };
    }
  }

  protected async mapToZod(): Promise<z.input<ProjectSetupSchema>> {
    return {
      form: this.form,
      postcode: this.dto.postcode ?? "",
      bankDetailsTaskStatus: this.dto.bankDetailsTaskStatus ?? BankDetailsTaskStatus.Unknown,
      spendProfileStatus: this.dto.spendProfileStatus ?? SpendProfileStatus.Unknown,
    };
  }

  protected async runRepositoryCommands(context: IContext) {
    const savedPartnerData = await this.getSavedPartnerData(context);
    try {
      const isProjectActive = savedPartnerData?.project?.isActive;
      if (!isProjectActive) {
        return Promise.reject(new InActiveProjectError());
      }

      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
