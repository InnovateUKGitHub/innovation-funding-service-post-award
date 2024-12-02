import { PartnerStatus, PostcodeTaskStatus } from "@framework/constants/partner";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { InActiveProjectError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { isEmpty } from "lodash";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  postcodeErrorMap,
  postcodeSchema,
  PostcodeSchema,
} from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { z } from "zod";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { projectSetupPostcodeCommandQuery, ProjectSetupPostcodeCommandData } from "./ProjectSetupPostcodeCommandQuery";

type ProjectSetupPostcodeDto = Pick<PartnerDto, "id" | "projectId" | "postcode" | "postcodeStatus" | "partnerStatus">;

export class ProjectSetupPostcodeCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  PostcodeSchema,
  ProjectSetupPostcodeDto
> {
  public readonly runnableName: string = "ProjectSetupPostcodeCommand";

  protected dto: ProjectSetupPostcodeDto;

  private form: FormTypes.ProjectSetupPostcode;

  constructor(partner: ProjectSetupPostcodeDto, form: FormTypes.ProjectSetupPostcode) {
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
    return { schema: postcodeSchema, errorMap: postcodeErrorMap };
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

  protected async mapToZod(): Promise<z.input<PostcodeSchema>> {
    return {
      form: this.form,
      postcodeStatus: this.dto.postcodeStatus ?? PostcodeTaskStatus.Unknown,
      partnerStatus: this.dto.partnerStatus ?? PartnerStatus.Unknown,
      isSetup: this.form === FormTypes.ProjectSetupPostcode,
      postcode: this.dto.postcode,
    };
  }

  protected async runRepositoryCommands(context: IContext) {
    const savedPartnerData = await this.getSavedPartnerData(context);
    try {
      const isProjectActive = savedPartnerData?.project?.isActive;
      if (!isProjectActive) {
        return Promise.reject(new InActiveProjectError());
      }

      await context.repositories.partners.update({
        Id: this.dto.id,
        Acc_Postcode__c: this.dto.postcode?.toUpperCase() ?? undefined,
      });

      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
