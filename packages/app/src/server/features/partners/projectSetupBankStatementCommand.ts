import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { InActiveProjectError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { isEmpty } from "lodash";
import { FormTypes } from "@ui/zod/FormTypes";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { z } from "zod";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import {
  BankStatementSchema,
  projectSetupBankStatementErrorMap,
  setupBankStatementSchema,
} from "@ui/pages/projects/setup/projectSetupBankStatement.zod";
import {
  ProjectSetupBankStatementCommandData,
  projectSetupBankStatementCommandQuery,
} from "./projectSetupBankStatementCommandQuery";
import { ProjectDtoGql } from "@framework/dtos/projectDto";

type ProjectSetupBankStatementDto = Pick<
  PartnerDto,
  "id" | "projectId" | "postcode" | "postcodeStatus" | "partnerStatus"
>;

export class ProjectSetupBankStatementCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  BankStatementSchema,
  ProjectSetupBankStatementDto
> {
  public readonly runnableName: string = "ProjectSetupPostcodeCommand";

  protected dto: ProjectSetupBankStatementDto;

  protected savedPartnerData: { project: Pick<ProjectDtoGql, "isActive">; hasUploadedBankStatement: boolean } | null =
    null;

  private form: FormTypes.ProjectSetupBankStatement;

  constructor(partner: ProjectSetupBankStatementDto, form: FormTypes.ProjectSetupBankStatement) {
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
    return { schema: setupBankStatementSchema, errorMap: projectSetupBankStatementErrorMap };
  }

  private async getSavedPartnerData(context: IContext) {
    const { data, errors } = await context.runGraphqlQuery<ProjectSetupBankStatementCommandData>({
      document: projectSetupBankStatementCommandQuery,
      variables: { projectId: this.dto.projectId, partnerId: this.dto.id },
    });

    if (!isEmpty(errors)) {
      throw new Error("failed to fetch some data");
    } else {
      return {
        project: mapToProjectDto(data.uiapi.query.Acc_Project__c.edges[0].node, ["isActive"]),
        hasUploadedBankStatement:
          data.uiapi.query.Acc_ProjectParticipant__c.edges[0].node.ContentDocumentLinks.totalCount > 0,
      };
    }
  }

  protected async mapToZod(context: IContext): Promise<z.input<BankStatementSchema>> {
    if (!this.savedPartnerData) {
      this.savedPartnerData = await this.getSavedPartnerData(context);
    }
    return {
      form: this.form,
      // refine statement will reject as invalid if falsy and valid if truthy. Since value is a boolean, this will reject if false
      hasUploadedBankStatement: this.savedPartnerData.hasUploadedBankStatement,
    };
  }

  protected async runRepositoryCommands(context: IContext) {
    if (!this.savedPartnerData) {
      this.savedPartnerData = await this.getSavedPartnerData(context);
    }
    try {
      const isProjectActive = this.savedPartnerData?.project?.isActive;
      if (!isProjectActive) {
        return Promise.reject(new InActiveProjectError());
      }

      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
