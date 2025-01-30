import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerCompanyDetailsDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  getPcrAddPartnerCompaniesHouseStepSchema,
  PcrAddPartnerCompaniesHouseStepSchemaType,
} from "@ui/pages/pcrs/addPartner/steps/schemas/companiesHouse.zod";

export class UpdatePcrAddPartnerCompanyDetailsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  PcrAddPartnerCompaniesHouseStepSchemaType,
  PcrAddPartnerCompanyDetailsDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerCompanyDetailsCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form:
    | FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue
    | FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit;
  protected readonly dto: PcrAddPartnerCompanyDetailsDto;

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
    pcr: PcrAddPartnerCompanyDetailsDto;
    form:
      | FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue
      | FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit;
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
    return {
      schema: getPcrAddPartnerCompaniesHouseStepSchema(!!this.dto.markedAsComplete),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      organisationName: this.dto.organisationName,
      markedAsComplete: !!this.dto.markedAsComplete,
      registrationNumber: this.dto.registrationNumber,
      registeredAddress: this.dto.registeredAddress,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<PcrAddPartnerCompaniesHouseStepSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
      Acc_OrganisationName__c: validatedData.organisationName,
      Acc_RegistrationNumber__c: validatedData.registrationNumber,
      Acc_RegisteredAddress__c: validatedData.registeredAddress,
    });

    return true;
  }
}
