import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ApproveNewSubcontractorDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { parseCurrency } from "@framework/util/numberHelper";
import {
  approveNewSubcontractorErrorMap,
  approveNewSubcontractorSchema,
  ApproveNewSubcontractorSchemaType,
} from "@ui/pages/pcrs/approveNewSubcontractor/ApproveNewSubcontractor.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrApproveNewSubcontractorCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ApproveNewSubcontractorSchemaType,
  ApproveNewSubcontractorDto
> {
  public readonly runnableName: string = "UpdatePcrApproveNewSubcontractorCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrApproveNewSubcontractorStep | FormTypes.PcrApproveNewSubcontractorSummary;
  protected readonly dto: ApproveNewSubcontractorDto;

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
    pcr: ApproveNewSubcontractorDto;
    form: FormTypes.PcrApproveNewSubcontractorStep | FormTypes.PcrApproveNewSubcontractorSummary;
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
    return { schema: approveNewSubcontractorSchema, errorMap: approveNewSubcontractorErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      subcontractorName: this.dto.subcontractorName,
      subcontractorRegistrationNumber: this.dto.subcontractorRegistrationNumber,
      subcontractorRelationship: !!this.dto.subcontractorRelationship,
      subcontractorRelationshipJustification: !!this.dto.subcontractorRelationship
        ? this.dto.subcontractorRelationshipJustification
        : "",
      subcontractorLocation: this.dto.subcontractorLocation,
      subcontractorDescription: this.dto.subcontractorDescription,
      subcontractorJustification: this.dto.subcontractorJustification,
      subcontractorCost: this.dto.subcontractorCost ?? null,
      markedAsComplete: !!this.dto.markedAsComplete,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ApproveNewSubcontractorSchemaType>,
  ): Promise<boolean> {
    if (this.form === FormTypes.PcrApproveNewSubcontractorStep) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrItemId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
        New_company_subcontractor_name__c: validatedData.subcontractorName,
        Company_registration_number__c: validatedData.subcontractorRegistrationNumber,
        // N.B. Field is REQUIRED on Salesforce - Cannot have a unset state :(
        Relationship_between_partners__c: validatedData.subcontractorRelationship ?? false,
        Relationship_justification__c: validatedData.subcontractorRelationshipJustification,
        Country_where_work_will_be_carried_out__c: validatedData.subcontractorLocation,
        Role_in_the_project__c: validatedData.subcontractorDescription,
        Cost_of_work__c: parseCurrency(validatedData.subcontractorCost),
        Justification__c: validatedData.subcontractorJustification,
      });
    } else {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrItemId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(
          validatedData.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
        ),
      });
    }

    return true;
  }
}
