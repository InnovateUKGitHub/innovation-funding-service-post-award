import { ILogger } from "@shared/logger";
import { sss } from "@server/util/salesforce-string-helpers";
import { NotFoundError } from "@shared/appError";
import { DateTime } from "luxon";
import {
  PcrContactRoleMapper,
  PcrParticipantSizeMapper,
  PcrPartnerTypeMapper,
  PCRProjectLocationMapper,
  PcrProjectRoleMapper,
  SalesforcePCRMapper,
} from "./mappers/projectChangeRequestMapper";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { PCRStatus, PCRItemStatus, PCRItemTypeName } from "@framework/constants/pcrConstants";
import {
  ProjectChangeRequestForCreateEntity,
  ProjectChangeRequestEntity,
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemForCreateEntity,
} from "@framework/entities/projectChangeRequest";
import { IPicklistEntry } from "@framework/types/IPicklistEntry";
import { configuration } from "@server/features/common/config";
import { TsforceConnection } from "@server/tsforce/TsforceConnection";

export interface IProjectChangeRequestRepository {
  createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreateEntity): Promise<PcrId>;
  updateProjectChangeRequest(pcr: ProjectChangeRequestEntity): Promise<void>;
  updateItems(pcr: ProjectChangeRequestEntity, items: ProjectChangeRequestItemEntity[]): Promise<void>;
  getAllByProjectId(projectId: ProjectId): Promise<ProjectChangeRequestEntity[]>;
  getById(projectId: ProjectId, id: string): Promise<ProjectChangeRequestEntity>;
  insertItems(headerId: string, items: ProjectChangeRequestItemForCreateEntity[]): Promise<void>;
  isExisting(projectId: ProjectId, projectChangeRequestId: string): Promise<boolean>;
  delete(pcr: ProjectChangeRequestEntity): Promise<void>;
  getPcrChangeStatuses(): Promise<IPicklistEntry[]>;
  getProjectRoles(): Promise<IPicklistEntry[]>;
  getPartnerTypes(): Promise<IPicklistEntry[]>;
  getParticipantSizes(): Promise<IPicklistEntry[]>;
  getProjectLocations(): Promise<IPicklistEntry[]>;
}

export interface ISalesforcePCR {
  Id: string;
  Acc_RequestHeader__c: string;
  Acc_RequestNumber__c: number;
  Acc_Status__c: string;
  StatusName: string;
  CreatedDate: string;
  LastModifiedDate: string;
  RecordTypeId: string;
  Acc_Reasoning__c: string;
  Acc_Project_Participant__c: string | null;
  Acc_Project__c: string;
  Acc_RequestHeader__r: {
    Acc_Project__r: {
      Acc_CompetitionId__r: {
        Acc_TypeofAid__c: string;
      };
    };
  };
  // careful there is a typo in the salesforce setup
  // will probably change to Acc_MarkedAsComplete__c in the future!!
  Acc_MarkedasComplete__c: string;
  Acc_NewOrganisationName__c: string | null;
  Acc_NewProjectSummary__c: string | null;
  Acc_NewPublicDescription__c: string | null;
  MarkedAsCompleteName: string;
  Acc_Comments__c: string;
  // careful there is a typo in the salesforce setup
  // will probably change to Acc_AdditionalNumberOfMonths__c in the future!!
  Acc_AdditionalNumberofMonths__c: number | null;
  Acc_NewProjectDuration__c: number | null;
  Acc_RemovalPeriod__c: number | null;
  Acc_ExistingProjectDuration__c: number | null;
  Acc_SuspensionStarts__c: string | null;
  Acc_SuspensionEnds__c: string | null;
  Acc_PublicDescriptionSnapshot__c: string | null;
  Acc_ProjectSummarySnapshot__c: string | null;
  Acc_ExistingPartnerName__c: string | null;
  Acc_Nickname__c: string | null;

  // Add partner
  Acc_ProjectRole__c: string | null;
  ProjectRoleLabel: string | null;
  Acc_ParticipantType__c: string | null;
  ParticipantTypeLabel: string | null;
  Acc_OrganisationName__c: string | null;
  Acc_RegisteredAddress__c: string | null;
  Acc_RegistrationNumber__c: string | null;
  Acc_ParticipantSize__c: string | null;
  ParticipantSizeLabel: string | null;
  Acc_Employees__c: number | null;
  Acc_TurnoverYearEnd__c: string | null;
  Acc_Turnover__c: number | null;
  Acc_Location__c: string | null;
  ProjectLocationLabel: string | null;
  Acc_ProjectCity__c: string | null;
  Acc_ProjectPostcode__c: string | null;
  Acc_Contact1ProjectRole__c: string | null;
  Contact1ProjectRoleLabel: string | null;
  Acc_Contact1Forename__c: string | null;
  Acc_Contact1Surname__c: string | null;
  Acc_Contact1Phone__c: string | null;
  Acc_Contact1EmailAddress__c: string | null;
  Acc_Contact2ProjectRole__c: string | null;
  Contact2ProjectRoleLabel: string | null;
  Acc_Contact2Forename__c: string | null;
  Acc_Contact2Surname__c: string | null;
  Acc_Contact2Phone__c: string | null;
  Acc_Contact2EmailAddress__c: string | null;
  Acc_AwardRate__c: number | null;
  Acc_OtherFunding__c: boolean | null;
  Acc_TotalOtherFunding__c: number | null;
  Acc_CommercialWork__c: boolean | null;
  Acc_TSBReference__c: string | null;

  // Virements related field
  Acc_GrantMovingOverFinancialYear__c: number | null;

  // Change loan request
  Loan_ProjectStartDate__c: string | null;

  Loan_Duration__c: string | null;
  // Acc_AdditionalNumberofMonths__c is used for setting value
  Loan_ExtensionPeriod__c: string | null;
  Loan_ExtensionPeriodChange__c: string | null;
  Loan_RepaymentPeriod__c: string | null;
  Loan_RepaymentPeriodChange__c: string | null;

  // Approve a new subcontractor
  New_company_subcontractor_name__c: string | null;
  Company_registration_number__c: string | null;
  Relationship_between_partners__c: boolean;
  Relationship_justification__c: string | null;
  Country_where_work_will_be_carried_out__c: string | null;
  Cost_of_work__c: number | null;
  // Description of work to be carried out by the subcontractor
  Role_in_the_project__c: string | null;
  Justification__c: string | null;
}

export const mapToPCRApiName = (status: PCRStatus): string => {
  switch (status) {
    // Current Values
    case PCRStatus.DraftWithProjectManager:
      return "Draft";
    case PCRStatus.SubmittedToMonitoringOfficer:
      return "Submitted to Monitoring Officer";
    case PCRStatus.QueriedByMonitoringOfficer:
      return "Queried by Monitoring Officer";
    case PCRStatus.SubmittedToInnovateUK:
      return "Submitted to Innovate UK";
    case PCRStatus.QueriedToProjectManager:
      return "Queried by Innovation Lead";
    case PCRStatus.Withdrawn:
      return "Withdrawn";
    case PCRStatus.Rejected:
      return "Rejected";
    case PCRStatus.AwaitingAmendmentLetter:
      return "Awaiting Amendment Letter";
    case PCRStatus.Approved:
      return "Approved";

    // Salesforce "Inactive Values"
    case PCRStatus.DeprecatedSubmittedToInnovationLead:
      return "Submitted to Innovation Lead";
    case PCRStatus.DeprecatedQueriedByInnovateUK:
      return "Queried by Innovate UK";
    case PCRStatus.DeprecatedInReviewWithProjectFinance:
      return "In Review with Project Finance";
    case PCRStatus.DeprecatedInExternalReview:
      return "In External Review";
    case PCRStatus.DeprecatedInReviewWithInnovateUK:
      return "In Review with Innovate UK";
    case PCRStatus.DeprecatedActioned:
      return "Actioned";
    default:
      return "";
  }
};

export const mapToPCRItemStatusLabel = (status?: PCRItemStatus): string => {
  switch (status) {
    case PCRItemStatus.ToDo:
      return "To Do";
    case PCRItemStatus.Incomplete:
      return "Incomplete";
    case PCRItemStatus.Complete:
      return "Complete";
    default:
      return "";
  }
};

/**
 * ProjectChangeRequests are stored in Acc_ProjectChangeRequest__c table
 *
 * The header record is stored with "Request Header" record type
 * Each item type are stored in the same table with different record types
 *
 * The mapper used will convert the list of all pcrs into a parent child relationship to support pcr item types
 *
 */
export class ProjectChangeRequestRepository
  extends SalesforceRepositoryBase<ISalesforcePCR>
  implements IProjectChangeRequestRepository
{
  constructor(
    private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>,
    getSalesforceConnection: () => TsforceConnection,
    logger: ILogger,
  ) {
    super(getSalesforceConnection, logger);
  }

  protected salesforceObjectName = "Acc_ProjectChangeRequest__c";
  private readonly recordType = "Request Header";

  protected salesforceFieldNames: string[] = [
    "Id",
    "Acc_RequestHeader__c",
    "Acc_RequestNumber__c",
    "Acc_Status__c",
    "toLabel(Acc_Status__c) StatusName",
    "CreatedDate",
    "LastModifiedDate",
    "RecordTypeId",
    "Acc_Project_Participant__c",
    "Acc_Project__c",
    "Acc_RequestHeader__r.Acc_Project__r.Acc_CompetitionId__r.Acc_TypeofAid__c",
    "Acc_NewOrganisationName__c",
    "Acc_NewProjectSummary__c",
    "Acc_NewPublicDescription__c",
    "Acc_Reasoning__c",
    "Acc_MarkedAsComplete__c",
    "Acc_AdditionalNumberofMonths__c",
    "Acc_NewProjectDuration__c",
    "Acc_ExistingProjectDuration__c",
    "Acc_RemovalPeriod__c",
    "toLabel(Acc_MarkedAsComplete__c) MarkedAsCompleteName",
    "Acc_Comments__c",
    "Acc_SuspensionStarts__c",
    "Acc_SuspensionEnds__c",
    "Acc_PublicDescriptionSnapshot__c",
    "Acc_ProjectSummarySnapshot__c",
    "Acc_ExistingPartnerName__c",
    "Acc_Nickname__c",
    "Acc_ProjectRole__c",
    "toLabel(Acc_ProjectRole__c) ProjectRoleLabel",
    "Acc_ParticipantType__c",
    "toLabel(Acc_ParticipantType__c) ParticipantTypeLabel",
    "Acc_OrganisationName__c",
    "Acc_RegisteredAddress__c",
    "Acc_RegistrationNumber__c",
    "Acc_ParticipantSize__c",
    "toLabel(Acc_ParticipantSize__c) ParticipantSizeLabel",
    "Acc_Employees__c",
    "Acc_TurnoverYearEnd__c",
    "Acc_Turnover__c",
    "Acc_Location__c",
    "toLabel(Acc_Location__c) ProjectLocationLabel",
    "Acc_ProjectCity__c",
    "Acc_projectPostcode__c",
    "Acc_Contact1ProjectRole__c",
    "toLabel(Acc_Contact1ProjectRole__c) Contact1ProjectRoleLabel",
    "Acc_Contact1Forename__c",
    "Acc_Contact1Surname__c",
    "Acc_Contact1Phone__c",
    "Acc_Contact1EmailAddress__c",
    "Acc_Contact2ProjectRole__c",
    "toLabel(Acc_Contact2ProjectRole__c) Contact2ProjectRoleLabel",
    "Acc_Contact2Forename__c",
    "Acc_Contact2Surname__c",
    "Acc_Contact2Phone__c",
    "Acc_Contact2EmailAddress__c",
    "Acc_AwardRate__c",
    "Acc_OtherFunding__c",
    "Acc_TotalOtherFunding__c",
    "Acc_CommercialWork__c",
    "Acc_TSBReference__c",
    "Acc_GrantMovingOverFinancialYear__c",
    "Loan_ProjectStartDate__c",
    "Loan_Duration__c",
    "Loan_ExtensionPeriod__c",
    "Loan_ExtensionPeriodChange__c",
    "Loan_RepaymentPeriod__c",
    "Loan_RepaymentPeriodChange__c",

    ...(configuration.features.approveNewSubcontractor
      ? [
          "New_company_subcontractor_name__c",
          "Company_registration_number__c",
          "Relationship_between_partners__c",
          "Relationship_justification__c",
          "Country_where_work_will_be_carried_out__c",
          "Role_in_the_project__c",
          "Cost_of_work__c",
          "Justification__c",
        ]
      : []),
  ];

  async getAllByProjectId(projectId: ProjectId): Promise<ProjectChangeRequestEntity[]> {
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const data = await super.where(
      `Acc_Project__c='${sss(projectId)}' OR Acc_RequestHeader__r.Acc_Project__c='${sss(projectId)}'`,
    );
    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    return mapper.map(data);
  }

  async getById(projectId: ProjectId, pcrId: string): Promise<ProjectChangeRequestEntity> {
    // Find all PCRs where the Project ID and ID match
    // or all PCRs where the header record's Project ID and ID match
    const data = await super.where(
      `(Acc_Project__c='${sss(projectId)}' AND Id = '${sss(pcrId)}') OR (Acc_RequestHeader__r.Acc_Project__c='${sss(
        projectId,
      )}' AND Acc_RequestHeader__c = '${sss(pcrId)}')`,
    );

    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);

    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    const mapped = mapper.map(data).pop();
    if (!mapped) {
      throw new NotFoundError();
    }
    return mapped;
  }

  async isExisting(projectId: ProjectId, pcrOrItemId: string): Promise<boolean> {
    const data = await super.filterOne(
      `(Acc_Project__c='${sss(projectId)}' AND Id = '${sss(
        pcrOrItemId,
      )}') OR (Acc_RequestHeader__r.Acc_Project__c='${sss(projectId)}' AND Acc_RequestHeader__c = '${sss(
        pcrOrItemId,
      )}')`,
    );

    return !!data;
  }

  async updateProjectChangeRequest(pcr: ProjectChangeRequestEntity) {
    await super.updateItem({
      Id: pcr.id,
      Acc_Comments__c: pcr.comments,
      Acc_MarkedasComplete__c: this.mapItemStatus(pcr.reasoningStatus),
      Acc_Reasoning__c: pcr.reasoning,
      Acc_Status__c: this.mapStatus(pcr.status),
    });
  }

  // TODO maybe put in base class
  private readonly toOptionalSFDate = (jsDate?: Date | null) =>
    jsDate && DateTime.fromJSDate(jsDate).toFormat("yyyy-MM-dd");

  async updateItems(pcr: ProjectChangeRequestEntity, items: ProjectChangeRequestItemEntity[]) {
    await super.updateAll(
      items.map(x => {
        const isDurationChange = x.shortName === PCRItemTypeName.TimeExtension;
        const additionalNumberOfMonths = isDurationChange ? x.offsetMonths : x.availabilityPeriodChange;

        return {
          Id: x.id,
          Acc_MarkedasComplete__c: this.mapItemStatus(x.status),
          Acc_NewProjectDuration__C: x.projectDuration,
          Acc_AdditionalNumberofMonths__c: additionalNumberOfMonths ?? 0,
          Acc_NewProjectSummary__c: x.projectSummary,
          Acc_NewPublicDescription__c: x.publicDescription,
          Acc_SuspensionStarts__c: this.toOptionalSFDate(x.suspensionStartDate),
          Acc_SuspensionEnds__c: this.toOptionalSFDate(x.suspensionEndDate),
          Acc_NewOrganisationName__c: x.accountName,
          Acc_RemovalPeriod__c: x.removalPeriod,
          Acc_Project_Participant__c: x.partnerId,
          Acc_ProjectRole__c: new PcrProjectRoleMapper().mapToSalesforcePCRProjectRole(x.projectRole),
          Acc_ParticipantType__c: new PcrPartnerTypeMapper().mapToSalesforcePCRPartnerType(x.partnerType),
          Acc_CommercialWork__c: x.isCommercialWork,
          Acc_OrganisationName__c: x.organisationName,
          Acc_RegisteredAddress__c: x.registeredAddress,
          Acc_RegistrationNumber__c: x.registrationNumber,
          Acc_ParticipantSize__c: new PcrParticipantSizeMapper().mapToSalesforcePCRParticipantSize(x.participantSize),
          Acc_Employees__c: x.numberOfEmployees,
          Acc_TurnoverYearEnd__c: this.toOptionalSFDate(x.financialYearEndDate),
          Acc_Turnover__c: x.financialYearEndTurnover,
          Acc_Location__c: new PCRProjectLocationMapper().mapToSalesforcePCRProjectLocation(x.projectLocation),
          Acc_ProjectCity__c: x.projectCity,
          Acc_ProjectPostcode__c: x.projectPostcode,
          Acc_Contact1ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(x.contact1ProjectRole),
          Acc_Contact1Forename__c: x.contact1Forename,
          Acc_Contact1Surname__c: x.contact1Surname,
          Acc_Contact1Phone__c: x.contact1Phone,
          Acc_Contact1EmailAddress__c: x.contact1Email,
          Acc_Contact2ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(x.contact2ProjectRole),
          Acc_Contact2Forename__c: x.contact2Forename,
          Acc_Contact2Surname__c: x.contact2Surname,
          Acc_Contact2Phone__c: x.contact2Phone,
          Acc_Contact2EmailAddress__c: x.contact2Email,
          Acc_AwardRate__c: x.awardRate,
          Acc_OtherFunding__c: x.hasOtherFunding,
          Acc_TotalOtherFunding__c: x.totalOtherFunding,
          Acc_TSBReference__c: x.tsbReference,
          Acc_GrantMovingOverFinancialYear__c: x.grantMovingOverFinancialYear,
          Loan_ExtensionPeriodChange__c: String(x.extensionPeriodChange),
          Loan_RepaymentPeriodChange__c: String(x.repaymentPeriodChange),
          New_company_subcontractor_name__c: x.subcontractorName,
          Company_registration_number__c: x.subcontractorRegistrationNumber,

          ...(configuration.features.approveNewSubcontractor
            ? {
                // N.B. Field is REQUIRED on Salesforce - Cannot have a unset state :(
                Relationship_between_partners__c: x.subcontractorRelationship ?? false,
                Relationship_justification__c: x.subcontractorRelationshipJustification,
                Country_where_work_will_be_carried_out__c: x.subcontractorLocation,
                Role_in_the_project__c: x.subcontractorDescription,
                Cost_of_work__c: x.subcontractorCost,
                Justification__c: x.subcontractorJustification,
              }
            : {}),
        };
      }),
    );
  }

  async createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreateEntity) {
    // private async getRecordTypeId(objectName: string, recordType: string): Promise<string> {
    //   const query = new GetRecordTypeQuery(objectName, recordType);
    //   return this.runQuery(query).then(x => x.id);
    // }
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);

    // Insert header
    const id = await super.insertItem({
      RecordTypeId: headerRecordTypeId,
      Acc_MarkedasComplete__c: this.mapItemStatus(projectChangeRequest.reasoningStatus),
      Acc_Status__c: this.mapStatus(projectChangeRequest.status),
      Acc_Project__c: projectChangeRequest.projectId,
    });
    // Insert sub-items
    await this.insertItems(id, projectChangeRequest.items);
    return id as PcrId;
  }

  async insertItems(headerId: string, items: ProjectChangeRequestItemForCreateEntity[]) {
    await super.insertAll(
      items.map(x => ({
        Acc_RequestHeader__c: headerId,
        RecordTypeId: x.recordTypeId,
        Acc_MarkedasComplete__c: this.mapItemStatus(x.status),
        Acc_Project__c: x.projectId,
      })),
    );
  }

  async delete(item: ProjectChangeRequestEntity) {
    return super.deleteAll([item.id, ...item.items.map(x => x.id)]);
  }

  getPcrChangeStatuses(): Promise<IPicklistEntry[]> {
    return super.getPicklist("Acc_Status__c");
  }

  getProjectRoles(): Promise<IPicklistEntry[]> {
    return super.getPicklist("Acc_ProjectRole__c");
  }

  async getPartnerTypes(): Promise<IPicklistEntry[]> {
    return super.getPicklist("Acc_ParticipantType__c");
  }

  getParticipantSizes(): Promise<IPicklistEntry[]> {
    return super.getPicklist("Acc_ParticipantSize__c");
  }

  getProjectLocations(): Promise<IPicklistEntry[]> {
    return super.getPicklist("Acc_Location__c");
  }

  private mapStatus(status: PCRStatus): string {
    return mapToPCRApiName(status);
  }

  private mapItemStatus(status?: PCRItemStatus): string {
    return mapToPCRItemStatusLabel(status);
  }
}
