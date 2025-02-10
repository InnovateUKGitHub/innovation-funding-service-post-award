import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerSummaryDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import {
  addPartnerErrorMap,
  AddPartnerSchemaType,
  addPartnerSummarySchema,
} from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerSummaryCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  AddPartnerSchemaType,
  PcrAddPartnerSummaryDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerSummaryCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerSummary;
  protected readonly dto: PcrAddPartnerSummaryDto;

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
    pcr: PcrAddPartnerSummaryDto;
    form: FormTypes.PcrAddPartnerSummary;
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
    return { schema: addPartnerSummarySchema, errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      organisationName: this.dto.organisationName,
      registeredAddress: this.dto.registeredAddress,
      registrationNumber: this.dto.registrationNumber,
      participantSize: this.dto.participantSize,
      numberOfEmployees: this.dto.numberOfEmployees,
      financialYearEndDate: this.dto.financialYearEndDate,
      financialYearEndTurnover: this.dto.financialYearEndTurnover,
      projectLocation: this.dto.projectLocation,
      projectCity: this.dto.projectCity,
      projectPostcode: this.dto.projectPostcode,
      contact1Forename: this.dto.contact1Forename,
      contact1Surname: this.dto.contact1Surname,
      contact1Phone: this.dto.contact1Phone,
      contact1Email: this.dto.contact1Email,
      contact2Forename: this.dto.contact2Forename,
      contact2Phone: this.dto.contact2Phone,
      contact2Surname: this.dto.contact2Surname,
      contact2Email: this.dto.contact2Email,
      awardRate: this.dto.awardRate,
      partnerType: this.dto.partnerType,
      projectRole: this.dto.projectRole,
      isCommercialWork: this.dto.isCommercialWork,
      hasOtherFunding: this.dto.hasOtherFunding,
      organisationType: this.dto.organisationType,
      tsbReference: this.dto.tsbReference,
      markedAsComplete: this.dto.markedAsComplete,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<AddPartnerSchemaType>,
  ): Promise<boolean> {
    const status = validatedData.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(status),
    });

    return true;
  }
}
