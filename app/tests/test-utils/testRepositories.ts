import { ClaimStatus } from "@framework/constants/claimStatus";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { PermissionGroupIdentifier } from "@framework/constants/enums";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { PCRStatus } from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { LoanDto } from "@framework/dtos/loanDto";
import { CostCategory } from "@framework/entities/costCategory";
import { DocumentEntity } from "@framework/entities/document";
import { LoanFinancialVirement, PartnerFinancialVirement } from "@framework/entities/financialVirement";
import { LoanStatus } from "@framework/entities/loan-status";
import { Partner } from "@framework/entities/partner";
import { PcrSpendProfileEntity, PcrSpendProfileEntityForCreate } from "@framework/entities/pcrSpendProfile";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestForCreateEntity,
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemForCreateEntity,
  ProjectChangeRequestStatusChangeEntity,
} from "@framework/entities/projectChangeRequest";
import { RecordType } from "@framework/entities/recordType";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { DocumentFilter } from "@framework/types/DocumentFilter";
import { IRepositories } from "@framework/types/IContext";
import { IPicklistEntry } from "@framework/types/IPicklistEntry";
import { pcrParticipantSizePicklist } from "@server/features/pcrs/pcrParticipantSizePicklist";
import { pcrPartnerTypesPicklist } from "@server/features/pcrs/pcrPartnerTypesPicklist";
import { pcrProjectLocationPicklist } from "@server/features/pcrs/pcrProjectLocationPicklist";
import { pcrProjectRolesPicklist } from "@server/features/pcrs/pcrProjectRolesPicklist";
import { pcrSpendProfileCapitalUsageTypePicklist } from "@server/features/pcrs/pcrSpendProfileCapitalUsageTypesPicklist";
import { pcrSpendProfileOverheadRatePicklist } from "@server/features/pcrs/pcrSpendProfileOverheadsRateOptionsPicklist";
import { pcrStatusesPicklist } from "@server/features/pcrs/pcrStatusesPicklist";
import { IAccountsRepository, ISalesforceAccount } from "@server/repositories/accountsRepository";
import { IClaimDetailsRepository, ISalesforceClaimDetails } from "@server/repositories/claimDetailsRepository";
import { IClaimLineItemRepository, ISalesforceClaimLineItem } from "@server/repositories/claimLineItemRepository";
import {
  IClaimStatusChangeRepository,
  ISalesforceClaimStatusChange,
} from "@server/repositories/claimStatusChangeRepository";
import {
  IClaimTotalCostCategoryRepository,
  ISalesforceClaimTotalCostCategory,
} from "@server/repositories/claimTotalCostCategoryRepository";
import { IClaimRepository, ISalesforceClaim } from "@server/repositories/claimsRepository";
import { ICompaniesHouse } from "@server/repositories/companiesRepository";
import { ISalesforceDocument } from "@server/repositories/contentVersionRepository";
import { ICostCategoryRepository } from "@server/repositories/costCategoriesRepository";
import { IDocumentsRepository } from "@server/repositories/documentsRepository";
import { BadSalesforceQuery, FileTypeNotAllowedError } from "@server/repositories/errors";
import {
  IFinancialLoanVirementRepository,
  ISalesforceFinancialLoanVirement,
} from "@server/repositories/financialLoanVirementRepository";
import {
  IFinancialVirementRepository,
  ISalesforceFinancialVirement,
} from "@server/repositories/financialVirementRepository";
import { ISalesforceLoan } from "@server/repositories/loanRepository";
import { DocumentDescriptionMapper, SalesforceDocumentMapper } from "@server/repositories/mappers/documentMapper";
import { LoanMapper } from "@server/repositories/mappers/loanMapper";
import {
  IMonitoringReportHeaderRepository,
  ISalesforceMonitoringReportHeader,
} from "@server/repositories/monitoringReportHeaderRepository";
import {
  IMonitoringReportQuestionsRepository,
  ISalesforceMonitoringReportQuestions,
} from "@server/repositories/monitoringReportQuestionsRepository";
import {
  IMonitoringReportResponseRepository,
  ISalesforceMonitoringReportResponse,
} from "@server/repositories/monitoringReportResponseRepository";
import {
  IMonitoringReportStatusChangeRepository,
  ISalesforceMonitoringReportStatusChange,
} from "@server/repositories/monitoringReportStatusChangeRepository";
import { IPartnerRepository, ISalesforcePartner } from "@server/repositories/partnersRepository";
import { IPcrSpendProfileRepository } from "@server/repositories/pcrSpendProfileRepository";
import { IPermissionGroupRepository } from "@server/repositories/permissionGroupsRepository";
import { IProfileDetailsRepository, ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";
import {
  IProfileTotalPeriodRepository,
  ISalesforceProfileTotalPeriod,
} from "@server/repositories/profilePeriodTotalRepository";
import {
  IProfileTotalCostCategoryRepository,
  ISalesforceProfileTotalCostCategory,
} from "@server/repositories/profileTotalCostCategoryRepository";
import { IProjectChangeRequestRepository } from "@server/repositories/projectChangeRequestRepository";
import {
  ICreateProjectChangeRequestStatusChange,
  IProjectChangeRequestStatusChangeRepository,
} from "@server/repositories/projectChangeRequestStatusChangeRepository";
import { IProjectContactsRepository, ISalesforceProjectContact } from "@server/repositories/projectContactsRepository";
import { IProjectRepository, ISalesforceProject } from "@server/repositories/projectsRepository";
import { IRecordTypeRepository } from "@server/repositories/recordTypeRepository";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { BadRequestError } from "@shared/appError";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { PicklistEntry } from "jsforce";
import { Stream } from "stream";
import { TestFileWrapper } from "./testData";
import { TestRepository } from "./testRepository";

/**
 * utility stub function returns null when called
 */
function nullReturn() {
  return null;
}

class ProjectsTestRepository extends TestRepository<ISalesforceProject> implements IProjectRepository {
  getById(id: string) {
    return super.getOne(x => x.Id === id);
  }

  getAll() {
    return super.getAll();
  }

  getProjectsAsDeveloper() {
    return super.getAll();
  }
}

class PartnerTestRepository extends TestRepository<Partner> implements IPartnerRepository {
  getAllByProjectId(projectId: ProjectId) {
    return super.getWhere(x => x.projectId === projectId);
  }

  getById(partnerId: PartnerId) {
    return super.getOne(x => x.id === partnerId);
  }

  update(updatedPartner: ISalesforcePartner) {
    const item = this.Items.find(x => x.id === updatedPartner.Id);
    if (item) {
      item.postcode = updatedPartner.Acc_Postcode__c !== undefined ? updatedPartner.Acc_Postcode__c : item.postcode;
      item.newForecastNeeded = updatedPartner.Acc_NewForecastNeeded__c;
      item.spendProfileStatus = updatedPartner.Acc_SpendProfileCompleted__c;
      item.bankDetailsTaskStatus = updatedPartner.Acc_BankCheckCompleted__c;
      item.bankCheckStatus = updatedPartner.Acc_BankCheckState__c;
      item.sortCode = updatedPartner.Acc_SortCode__c !== undefined ? updatedPartner.Acc_SortCode__c : item.sortCode;
      item.accountNumber =
        updatedPartner.Acc_AccountNumber__c !== undefined ? updatedPartner.Acc_AccountNumber__c : item.accountNumber;
      item.companyNumber =
        updatedPartner.Acc_RegistrationNumber__c !== undefined
          ? updatedPartner.Acc_RegistrationNumber__c
          : item.companyNumber;
      item.firstName = updatedPartner.Acc_FirstName__c !== undefined ? updatedPartner.Acc_FirstName__c : item.firstName;
      item.lastName = updatedPartner.Acc_LastName__c !== undefined ? updatedPartner.Acc_LastName__c : item.lastName;
      item.accountStreet =
        updatedPartner.Acc_AddressStreet__c !== undefined ? updatedPartner.Acc_AddressStreet__c : item.accountStreet;
      item.accountTownOrCity =
        updatedPartner.Acc_AddressTown__c !== undefined ? updatedPartner.Acc_AddressTown__c : item.accountTownOrCity;
      item.accountBuilding =
        updatedPartner.Acc_AddressBuildingName__c !== undefined
          ? updatedPartner.Acc_AddressBuildingName__c
          : item.accountBuilding;
      item.accountLocality =
        updatedPartner.Acc_AddressLocality__c !== undefined
          ? updatedPartner.Acc_AddressLocality__c
          : item.accountLocality;
      item.accountPostcode =
        updatedPartner.Acc_AddressPostcode__c !== undefined
          ? updatedPartner.Acc_AddressPostcode__c
          : item.accountPostcode;
      item.validationCheckPassed =
        updatedPartner.Acc_ValidationCheckPassed__c !== undefined
          ? updatedPartner.Acc_ValidationCheckPassed__c
          : item.validationCheckPassed;
      item.iban = updatedPartner.Acc_Iban__c !== undefined ? updatedPartner.Acc_Iban__c : item.iban;
      item.validationConditionsSeverity =
        updatedPartner.Acc_ValidationConditionsSeverity__c !== undefined
          ? updatedPartner.Acc_ValidationConditionsSeverity__c
          : item.validationConditionsSeverity;
      item.validationConditionsCode =
        updatedPartner.Acc_ValidationConditionsCode__c !== undefined
          ? updatedPartner.Acc_ValidationConditionsCode__c
          : item.validationConditionsCode;
      item.validationConditionsDesc =
        updatedPartner.Acc_ValidationConditionsDesc__c !== undefined
          ? updatedPartner.Acc_ValidationConditionsDesc__c
          : item.validationConditionsDesc;
      item.addressScore =
        updatedPartner.Acc_AddressScore__c !== undefined ? updatedPartner.Acc_AddressScore__c : item.addressScore;
      item.companyNameScore =
        updatedPartner.Acc_CompanyNameScore__c !== undefined
          ? updatedPartner.Acc_CompanyNameScore__c
          : item.companyNameScore;
      item.personalDetailsScore =
        updatedPartner.Acc_PersonalDetailsScore__c !== undefined
          ? updatedPartner.Acc_PersonalDetailsScore__c
          : item.personalDetailsScore;
      item.regNumberScore =
        updatedPartner.Acc_RegNumberScore__c !== undefined ? updatedPartner.Acc_RegNumberScore__c : item.regNumberScore;
      item.verificationConditionsSeverity =
        updatedPartner.Acc_VerificationConditionsSeverity__c !== undefined
          ? updatedPartner.Acc_VerificationConditionsSeverity__c
          : item.verificationConditionsSeverity;
      item.verificationConditionsCode =
        updatedPartner.Acc_VerificationConditionsCode__c !== undefined
          ? updatedPartner.Acc_VerificationConditionsCode__c
          : item.verificationConditionsCode;
      item.verificationConditionsDesc =
        updatedPartner.Acc_VerificationConditionsDesc__c !== undefined
          ? updatedPartner.Acc_VerificationConditionsDesc__c
          : item.verificationConditionsDesc;
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  getAll() {
    return super.getAll();
  }
}

class ProjectContactTestRepository
  extends TestRepository<ISalesforceProjectContact>
  implements IProjectContactsRepository
{
  getAllByProjectId(projectId: ProjectId) {
    return super.getWhere(x => x.Acc_ProjectId__c === projectId);
  }

  getAllForUser(email: string) {
    return super.getWhere(x => x.Acc_ContactId__r.Email === email);
  }

  update(items: Pick<ISalesforceProjectContact, "Id" | "Acc_StartDate__c">[]): Promise<boolean> {
    for (const item of items) {
      const foundItem = this.Items.find(x => x.Id === item.Id);
      if (!foundItem) return Promise.resolve(false);
      foundItem.Acc_StartDate__c = item.Acc_StartDate__c ?? null;
    }

    return Promise.resolve(true);
  }
}

class CompaniesTestRepository extends ICompaniesHouse {
  searchCompany() {
    return Promise.resolve([]);
  }
}
class CostCategoriesTestRepository extends TestRepository<CostCategory> implements ICostCategoryRepository {
  getAll() {
    return super.getAll();
  }
}

class ClaimsTestRepository extends TestRepository<ISalesforceClaim> implements IClaimRepository {
  constructor(private readonly partnerRepository: PartnerTestRepository) {
    super();
  }

  getAllByProjectId(projectId: ProjectId) {
    const partnerIds = this.partnerRepository.Items.filter(x => x.projectId === projectId).map(x => x.id);
    return super.getWhere(x => partnerIds.indexOf(x.Acc_ProjectParticipant__r.Id as PartnerId) !== -1);
  }

  getAllByPartnerId(partnerId: PartnerId) {
    return super.getWhere(x => x.Acc_ProjectParticipant__r.Id === partnerId);
  }

  getAllIncludingNewByPartnerId(partnerId: PartnerId) {
    return super.getWhere(x => x.Acc_ProjectParticipant__r.Id === partnerId);
  }

  get(partnerId: PartnerId, periodId: number) {
    return super.getOne(x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  getByProjectId(projectId: ProjectId, partnerId: PartnerId, periodId: number) {
    return super.getOne(x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  update(updatedClaim: ISalesforceClaim) {
    const index = this.Items.findIndex(x => x.Id === updatedClaim.Id);
    if (index >= 0) {
      this.Items[index] = Object.assign(this.Items[index], updatedClaim);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  getClaimStatuses() {
    return Promise.resolve([
      { value: ClaimStatus.APPROVED, label: "Approved", active: true, defaultValue: false },
      { value: ClaimStatus.UNKNOWN, label: "Unknown", active: true, defaultValue: false },
      { value: ClaimStatus.PAID, label: "Paid", active: true, defaultValue: false },
      { value: ClaimStatus.INNOVATE_QUERIED, label: "Innovate Queried", active: true, defaultValue: false },
      { value: ClaimStatus.MO_QUERIED, label: "MO Queried", active: true, defaultValue: false },
      { value: ClaimStatus.AWAITING_IUK_APPROVAL, label: "Awaiting IUK Approval", active: true, defaultValue: false },
      { value: ClaimStatus.AWAITING_IAR, label: "Awaiting IAR", active: true, defaultValue: false },
      { value: ClaimStatus.DRAFT, label: "Draft", active: true, defaultValue: false },
      { value: ClaimStatus.SUBMITTED, label: "Submitted", active: true, defaultValue: false },
      { value: ClaimStatus.PAYMENT_REQUESTED, label: "Payment requested", active: true, defaultValue: false },
    ]);
  }
}

class ClaimDetailsTestRepository extends TestRepository<ISalesforceClaimDetails> implements IClaimDetailsRepository {
  getAllByPartnerForPeriod(partnerId: PartnerId, periodId: number): Promise<ISalesforceClaimDetails[]> {
    return super.getWhere(
      x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId,
    );
  }

  getAllByPartner(partnerId: PartnerId): Promise<ISalesforceClaimDetails[]> {
    return super.getWhere(x => x.Acc_ProjectParticipant__r.Id === partnerId);
  }

  get({ partnerId, periodId, costCategoryId }: ClaimDetailKey): Promise<ISalesforceClaimDetails | null> {
    return super.filterOne(
      x =>
        x.Acc_ProjectParticipant__r.Id === partnerId &&
        x.Acc_ProjectPeriodNumber__c === periodId &&
        x.Acc_CostCategory__c === costCategoryId,
    );
  }

  update(item: Updatable<ISalesforceClaimDetails>): Promise<boolean> {
    const index = this.Items.findIndex(x => x.Id === item.Id);
    if (index >= 0) {
      this.Items[index] = Object.assign(this.Items[index], item);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  insert(item: Partial<ISalesforceClaimDetails>): Promise<string> {
    const newId = `ClaimDetails-${this.Items.length}`;
    this.Items.push({ ...item, Id: newId } as ISalesforceClaimDetails);
    return Promise.resolve(newId);
  }
}

class DocumentsTestRepository extends TestRepository<[string, ISalesforceDocument]> implements IDocumentsRepository {
  async insertDocument(file: TestFileWrapper, recordId: string, description: DocumentDescription): Promise<string> {
    const nameParts = file.fileName.split(".");
    const extension = nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;
    if (extension === "zip") {
      throw new FileTypeNotAllowedError("File type not allowed");
    }
    const title = nameParts[0];

    const newDocumentId = (this.Items.length + 1).toString();
    // insert tuple [linkedRecordId, document] to enable lookup by linkedRecordId in test repository
    await super.insertOne([
      recordId,
      {
        Id: newDocumentId,
        Title: title,
        FileExtension: extension,
        ContentDocumentId: newDocumentId,
        ContentSize: 5,
        FileType: extension,
        ReasonForChange: "First upload",
        PathOnClient: file.fileName,
        ContentLocation: "S",
        VersionData: file.content,
        Description: new DocumentDescriptionMapper().mapToSalesforceDocumentDescription(description),
        CreatedDate: new Date().toISOString(),
        Acc_LastModifiedByAlias__c: "User",
        Acc_UploadedByMe__c: false,
        Owner: {
          Username: "aUserName",
        },
      },
    ]);
    return newDocumentId;
  }

  async deleteDocument(documentId: string): Promise<void> {
    const documentToDelete = this.Items.find(x => x[1].Id === documentId);

    if (!documentToDelete) {
      throw Error(`Document '${documentId}' does not exist to delete :(`);
    }

    const isOwner = documentToDelete[1].Acc_UploadedByMe__c;

    if (!isOwner) {
      throw Error(`Document '${documentId}' did not own the document to delete!`);
    }

    return super.deleteItem(documentToDelete);
  }

  async isExistingDocument(documentId: string, linkedEntityId: string): Promise<boolean> {
    const document = await super.getWhere(x => x[0] === linkedEntityId && x[1].Id === documentId);
    return !!document;
  }

  getDocumentContent(documentId: string): Promise<Stream> {
    return super
      .getOne(x => x[1].Id === documentId)
      .then(x => {
        const s = new Stream.Readable();
        s._read = nullReturn;
        s.push(x[1].Id);
        s.push(null);
        return s;
      });
  }

  async getDocumentMetadata(documentId: string): Promise<DocumentEntity> {
    const document = await super.getOne(x => documentId === x[1].Id).then(x => x[1]);
    return new SalesforceDocumentMapper().map(document);
  }

  async getDocumentMetadataForEntityDocument(entityId: string, documentId: string): Promise<DocumentEntity | null> {
    const document = await super.filterOne(x => documentId === x[1].Id && x[0] === entityId).then(x => x && x[1]);
    return document ? new SalesforceDocumentMapper().map(document) : null;
  }

  async getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter): Promise<DocumentEntity[]> {
    const sfDescription =
      filter && new DocumentDescriptionMapper().mapToSalesforceDocumentDescription(filter.description);
    const documents = await super
      .getWhere(x => documentIds.indexOf(x[1].ContentDocumentId) > 1 && (!filter || sfDescription === x[1].Description))
      .then(x => x.map(y => y[1]));
    return documents.map(x => new SalesforceDocumentMapper().map(x));
  }

  async getDocumentsMetadataByLinkedRecord(recordId: string, filter?: DocumentFilter): Promise<DocumentEntity[]> {
    const sfDescription =
      filter && new DocumentDescriptionMapper().mapToSalesforceDocumentDescription(filter.description);
    const documents = await super
      .getWhere(x => x[0] === recordId && (!filter || x[1].Description === sfDescription))
      .then(x => x.map(y => y[1]));
    return documents.map(x => new SalesforceDocumentMapper().map(x));
  }
}

class ClaimLineItemsTestRepository
  extends TestRepository<ISalesforceClaimLineItem>
  implements IClaimLineItemRepository
{
  getAllForCategory(partnerId: PartnerId, categoryId: string, periodId: number) {
    return super.getWhere(
      x =>
        x.Acc_ProjectPeriodNumber__c === periodId &&
        x.Acc_CostCategory__c === categoryId &&
        x.Acc_ProjectParticipant__c === partnerId,
    );
  }

  delete(ids: string[]) {
    ids.forEach(id => {
      const index = this.Items.findIndex(x => x.Id === id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items.splice(index, 1);
    });
    return Promise.resolve();
  }

  update(updates: Updatable<ISalesforceClaimLineItem>[]) {
    if (!(updates instanceof Array)) {
      updates = [updates];
    }
    updates.forEach(update => {
      const index = this.Items.findIndex(x => x.Id === update.Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items[index] = { ...this.Items[index], ...update };
    });
    return Promise.resolve(true);
  }

  insert(lineItems: Partial<ISalesforceClaimLineItem>[]) {
    const newIds: string[] = [];
    lineItems.forEach(item => {
      const Id = `ClaimLineItem-${this.Items.length}`;
      newIds.push(Id);
      this.Items.push({ ...item, Id } as ISalesforceClaimLineItem);
    });
    return Promise.resolve(newIds);
  }
}

class MonitoringReportHeaderTestRepository
  extends TestRepository<ISalesforceMonitoringReportHeader>
  implements IMonitoringReportHeaderRepository
{
  getById(id: string): Promise<ISalesforceMonitoringReportHeader> {
    return super.getOne(x => x.Id === id);
  }

  get(projectId: ProjectId, periodId: number): Promise<ISalesforceMonitoringReportHeader> {
    return super.getOne(x => x.Acc_Project__c === projectId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  update(updateDto: Updatable<ISalesforceMonitoringReportHeader>): Promise<boolean> {
    const currentIndex = this.Items.findIndex(x => x.Id === updateDto.Id);
    this.Items[currentIndex] = Object.assign(this.Items[currentIndex], updateDto);
    return Promise.resolve(true);
  }

  create(item: ISalesforceMonitoringReportHeader): Promise<string> {
    item.Id = `New response ${this.Items.length + 1}`;
    super.insertOne(item);
    return Promise.resolve(item.Id);
  }

  getAllForProject(projectId: ProjectId): Promise<ISalesforceMonitoringReportHeader[]> {
    return super.getWhere(x => x.Acc_Project__c === projectId);
  }

  delete(reportId: string): Promise<void> {
    return super.deleteItem(this.Items.find(x => x.Id === reportId));
  }

  getMonitoringReportStatuses(): Promise<PicklistEntry[]> {
    return Promise.resolve(
      getAllNumericalEnumValues(MonitoringReportStatus)
        // convert to string representation of enum value
        .map(x => MonitoringReportStatus[x])
        .map(statusLabel => ({
          value: statusLabel,
          label: statusLabel,
          active: true,
          defaultValue: false,
        })),
    );
  }
}

class MonitoringReportResponseTestRepository
  extends TestRepository<ISalesforceMonitoringReportResponse>
  implements IMonitoringReportResponseRepository
{
  getAllForHeader(monitoringReportHeaderId: string): Promise<ISalesforceMonitoringReportResponse[]> {
    return super.getWhere(x => x.Acc_MonitoringHeader__c === monitoringReportHeaderId);
  }

  delete(idList: string[]) {
    idList.forEach(Id => {
      const index = this.Items.findIndex(x => x.Id === Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items.splice(index, 1);
    });
    return Promise.resolve();
  }

  update(updates: Updatable<ISalesforceMonitoringReportResponse>[]) {
    if (!(updates instanceof Array)) {
      updates = [updates];
    }
    updates.forEach(item => {
      const index = this.Items.findIndex(x => x.Id === item.Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items[index] = Object.assign(this.Items[index], item);
    });
    return Promise.resolve(true);
  }

  insert(response: Partial<ISalesforceMonitoringReportResponse>[]) {
    const newIds: string[] = [];
    response.forEach(x => {
      const Id = `MonitoringReportResponse-${this.Items.length}`;
      newIds.push(Id);
      this.Items.push({ ...x, Id } as ISalesforceMonitoringReportResponse);
    });
    return Promise.resolve(newIds);
  }
}

class ClaimTotalCostTestRepository
  extends TestRepository<ISalesforceClaimTotalCostCategory>
  implements IClaimTotalCostCategoryRepository
{
  getAllByPartnerId(partnerId: PartnerId) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }
}

class ProfileDetailsTestRepository
  extends TestRepository<ISalesforceProfileDetails>
  implements IProfileDetailsRepository
{
  getRequiredCategories(partnerId: PartnerId): Promise<ISalesforceProfileDetails[]> {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }
  getAllByPartner(partnerId: PartnerId) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }

  getById(partnerId: PartnerId, periodId: number, costCategoryId: CostCategoryId) {
    return super
      .getWhere(
        x =>
          x.Acc_ProjectParticipant__c === partnerId &&
          x.Acc_ProjectPeriodNumber__c === periodId &&
          x.Acc_CostCategory__c === costCategoryId,
      )
      .then(x => x[0]);
  }

  update(updates: Updatable<ISalesforceProfileDetails>[]) {
    updates.forEach(update => {
      const item = this.Items.find(x => x.Id === update.Id);

      if (item) {
        Object.assign(item, update);
      }
    });

    return Promise.resolve(true);
  }
}

class ProfileTotalPeriodTestRepository
  extends TestRepository<ISalesforceProfileTotalPeriod>
  implements IProfileTotalPeriodRepository
{
  constructor(private readonly partnerRepository: PartnerTestRepository) {
    super();
  }

  get(partnerId: PartnerId, periodId: number): Promise<ISalesforceProfileTotalPeriod> {
    return super.getOne(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  getAllByPartnerId(partnerId: PartnerId): Promise<ISalesforceProfileTotalPeriod[]> {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }

  getByProjectIdAndPeriodId(projectId: ProjectId, periodId: number) {
    const partnerIds = this.partnerRepository.Items.filter(x => x.projectId === projectId).map(x => x.id);
    return super.getWhere(
      x =>
        partnerIds.indexOf(x.Acc_ProjectParticipant__c as PartnerId) !== -1 &&
        x.Acc_ProjectPeriodNumber__c === periodId,
    );
  }

  getAllByProjectId(projectId: ProjectId): Promise<ISalesforceProfileTotalPeriod[]> {
    const partnerIds = this.partnerRepository.Items.filter(x => x.projectId === projectId).map(x => x.id);
    return super.getWhere(x => partnerIds.indexOf(x.Acc_ProjectParticipant__c as PartnerId) !== -1);
  }
}

class ProfileTotalCostCategoryTestRepository
  extends TestRepository<ISalesforceProfileTotalCostCategory>
  implements IProfileTotalCostCategoryRepository
{
  getAllByPartnerId(partnerId: PartnerId) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }
}

class MonitoringReportQuestionsRepository
  extends TestRepository<ISalesforceMonitoringReportQuestions>
  implements IMonitoringReportQuestionsRepository
{
  getAll() {
    return super.getAll();
  }
}

class MonitoringReportStatusChangeTestRepository
  extends TestRepository<ISalesforceMonitoringReportStatusChange>
  implements IMonitoringReportStatusChangeRepository
{
  createStatusChange(statusChange: Partial<ISalesforceMonitoringReportStatusChange>) {
    return super.insertOne({
      Id: (this.Items.length + 1).toString(),
      Acc_MonitoringReport__c: statusChange.Acc_MonitoringReport__c ?? "",
      Acc_PreviousMonitoringReportStatus__c: statusChange.Acc_PreviousMonitoringReportStatus__c ?? "",
      Acc_NewMonitoringReportStatus__c: statusChange.Acc_NewMonitoringReportStatus__c ?? "",
      Acc_CreatedByAlias__c: statusChange.Acc_CreatedByAlias__c ?? "",
      CreatedDate: statusChange.CreatedDate ?? "",
      Acc_ExternalComment__c: statusChange.Acc_ExternalComment__c ?? "",
    });
  }

  getStatusChanges(monitoringReportId: string): Promise<ISalesforceMonitoringReportStatusChange[]> {
    return super.getWhere(x => x.Acc_MonitoringReport__c === monitoringReportId);
  }
}

class ClaimStatusChangeTestRepository
  extends TestRepository<ISalesforceClaimStatusChange>
  implements IClaimStatusChangeRepository
{
  constructor(private readonly claimsRepository: ClaimsTestRepository) {
    super();
  }

  getAllForClaim(partnerId: PartnerId, periodId: number) {
    const claim = this.claimsRepository.Items.find(
      x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId,
    );
    return super.getWhere(x => x.Acc_Claim__c === (claim && claim.Id));
  }

  async create(statusChange: Partial<ISalesforceClaimStatusChange>) {
    const id = `NewStatusChange${this.Items.length + 1}`;

    super.insertOne({ ...statusChange, Id: id } as ISalesforceClaimStatusChange);

    return id;
  }
}

class PermissionGroupTestRepository implements IPermissionGroupRepository {
  public Items: PermissionGroup[] = [
    {
      id: "ClaimsTeamID",
      identifier: PermissionGroupIdentifier.ClaimsTeam,
      name: PermissionGroupIdentifier[PermissionGroupIdentifier.ClaimsTeam],
    },
  ];

  getAll() {
    return Promise.resolve(this.Items);
  }
}

class RecordTypeTestRepository extends TestRepository<RecordType> implements IRecordTypeRepository {
  public getAll() {
    return super.getAll();
  }
}

class PCRTestRepository extends TestRepository<ProjectChangeRequestEntity> implements IProjectChangeRequestRepository {
  public PreviousStatus: { [key: string]: PCRStatus } = {};

  getAllByProjectId(projectId: ProjectId): Promise<ProjectChangeRequestEntity[]> {
    return super.getWhere(x => x.projectId === projectId);
  }

  getById(projectId: ProjectId, id: PcrId): Promise<ProjectChangeRequestEntity> {
    return super
      .getOne(x => x.projectId === projectId && x.id === id)
      .then(x => {
        this.PreviousStatus[x.id] = x.status;
        return x;
      });
  }

  updateProjectChangeRequest(): Promise<void> {
    return Promise.resolve();
  }

  updateItems(pcr: ProjectChangeRequestEntity, pcrItems: ProjectChangeRequestItemEntity[]) {
    pcr.items = pcr.items.map(existingItem => {
      const updatedItem = pcrItems.find(x => x.id === existingItem.id);
      return updatedItem || existingItem;
    });
    return Promise.resolve();
  }

  private mapItemsForCreate(
    headerId: string,
    pcr: ProjectChangeRequestForCreateEntity,
    items: ProjectChangeRequestItemForCreateEntity[],
  ) {
    const itemLength = pcr.items ? items.length : 0;
    return items.map((x, i) => {
      const itemId = `ProjectChangeRequest-${headerId}-Item-${itemLength + i}`;
      return {
        id: itemId as PcrItemId,
        pcrId: headerId as PcrId,
        partnerId: "" as PartnerId,
        typeOfAid: TypeOfAid.Unknown,
        accountName: "",
        statusName: "",
        projectEndDate: new Date(),
        projectSummary: "",
        publicDescription: "",
        suspensionStartDate: null,
        suspensionEndDate: null,
        projectSummarySnapshot: "",
        publicDescriptionSnapshot: "",
        existingPartnerName: "",
        shortName: "",
        ...x,
      };
    });
  }

  async insertItems(headerId: string, items: ProjectChangeRequestItemForCreateEntity[]): Promise<void> {
    const pcr = await super.getOne(x => x.id === headerId);
    const insert = this.mapItemsForCreate(headerId, pcr, items);
    if (!pcr.items) pcr.items = [];
    pcr.items.push(...insert);
  }

  async createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreateEntity): Promise<PcrId> {
    const id = `ProjectChangeRequest${this.Items.length}` as PcrId;
    const items = this.mapItemsForCreate(id, projectChangeRequest, projectChangeRequest.items);

    await super.insertOne({
      ...projectChangeRequest,
      id,
      items,
      number: 0,
      started: new Date("2009-08-07"),
      updated: new Date("2012-02-12"),
      statusName: "",
      reasoningStatusName: "",
      reasoning: "",
      comments: "",
    });

    return id;
  }

  isExisting(projectId: ProjectId, projectChangeRequestId: string): Promise<boolean> {
    const data = super.filterOne(x => x.projectId === projectId && x.id === projectChangeRequestId);
    return Promise.resolve(!!data);
  }

  delete(item: ProjectChangeRequestEntity) {
    return super.deleteItem(item);
  }

  getPcrChangeStatuses(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = [];
    pcrStatusesPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getProjectRoles(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = [];
    pcrProjectRolesPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getPartnerTypes(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = [];
    pcrPartnerTypesPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getParticipantSizes(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = [];
    pcrParticipantSizePicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getProjectLocations(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = [];
    pcrProjectLocationPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }
}

class PcrSpendProfileTestRepository
  extends TestRepository<PcrSpendProfileEntity>
  implements IPcrSpendProfileRepository
{
  getAllForPcr(pcrItemId: PcrItemId): Promise<PcrSpendProfileEntity[]> {
    return super.getWhere(x => x.pcrItemId === pcrItemId);
  }
  insertSpendProfiles(items: PcrSpendProfileEntityForCreate[]) {
    const newIds: string[] = [];
    items.forEach(x => {
      const id = `PcrSpendProfile-${this.Items.length}` as PcrId;
      newIds.push(id);
      this.Items.push({ ...x, id });
    });
    return Promise.resolve(newIds);
  }
  updateSpendProfiles(updates: PcrSpendProfileEntity[]) {
    updates.forEach(update => {
      const item = this.Items.find(x => x.id === update.id);
      if (item) Object.assign(item, update);
    });
    return Promise.resolve(true);
  }
  deleteSpendProfiles(ids: string[]) {
    ids.forEach(x => (this.Items = this.Items.filter(element => element.id !== x)));
    return Promise.resolve();
  }

  getCapitalUsageTypes(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = [];
    pcrSpendProfileCapitalUsageTypePicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getOverheadRateOptions(): Promise<IPicklistEntry[]> {
    const picklistEntry: IPicklistEntry[] = [];
    pcrSpendProfileOverheadRatePicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }
}

class ProjectChangeRequestStatusChangeTestRepository
  extends TestRepository<ProjectChangeRequestStatusChangeEntity>
  implements IProjectChangeRequestStatusChangeRepository
{
  constructor(private readonly pcrRepository: PCRTestRepository) {
    super();
  }

  createStatusChange(statusChange: ICreateProjectChangeRequestStatusChange) {
    const previousStatus = this.pcrRepository.PreviousStatus[statusChange.Acc_ProjectChangeRequest__c];
    const newStatus = this.pcrRepository.Items.find(x => x.id === statusChange.Acc_ProjectChangeRequest__c)
      ?.status as PCRStatus;
    return super.insertOne({
      id: (this.Items.length + 1).toString() as PcrItemId,
      pcrId: statusChange.Acc_ProjectChangeRequest__c as PcrId,
      createdBy: "Sentient being Alpha B-25",
      createdDate: new Date(),
      previousStatus,
      newStatus,
      externalComments: statusChange.Acc_ExternalComment__c,
      participantVisibility: statusChange.Acc_ParticipantVisibility__c,
    });
  }

  getStatusChanges(
    projectId: ProjectId,
    projectChangeRequestId: string,
  ): Promise<ProjectChangeRequestStatusChangeEntity[]> {
    return super.getWhere(x => x.pcrId === projectChangeRequestId);
  }
}

class FinancialLoanVirementsTestRepository
  extends TestRepository<LoanFinancialVirement>
  implements IFinancialLoanVirementRepository
{
  async getForPcr(): Promise<LoanFinancialVirement[]> {
    return await Promise.resolve(this.Items);
  }

  updateVirements(items: Updatable<ISalesforceFinancialLoanVirement>[]): Promise<boolean> {
    items.forEach(x => this.updateVirement(x));
    return Promise.resolve(true);
  }

  private updateVirement(item: Updatable<ISalesforceFinancialLoanVirement>) {
    return this.Items.reduce<LoanFinancialVirement[]>((loans, loan) => {
      const isEditable = loan.status === LoanStatus.REQUESTED;
      const isItem = item.Id === loan.id;
      const shouldReturnLoan = isItem && isEditable;

      return shouldReturnLoan ? [...loans, loan] : loans;
    }, []);
  }
}

class FinancialVirementsTestRepository
  extends TestRepository<PartnerFinancialVirement>
  implements IFinancialVirementRepository
{
  getAllForPcr(pcrItemId: PcrItemId): Promise<PartnerFinancialVirement[]> {
    return super.getWhere(x => x.pcrItemId === pcrItemId);
  }

  updateVirements(items: Updatable<ISalesforceFinancialVirement>[]): Promise<boolean> {
    items.forEach(x => this.updateVirement(x));
    return Promise.resolve(true);
  }

  private updateVirement(item: Updatable<ISalesforceFinancialVirement>) {
    this.Items.forEach(partnerVirement => {
      if (partnerVirement.id === item.Id) {
        partnerVirement.newEligibleCosts = item.Acc_NewTotalEligibleCosts__c;
        partnerVirement.newRemainingGrant = item.Acc_NewRemainingGrant__c;
      }
      partnerVirement.virements.forEach(costCategoryVirement => {
        if (costCategoryVirement.id === item.Id) {
          costCategoryVirement.newEligibleCosts = item.Acc_NewCosts__c || costCategoryVirement.newEligibleCosts;
        }
      });
    });
  }
}

class LoansTestRepository {
  public Items: ISalesforceLoan[] = [];

  getAll() {
    const loans = this.Items.map(x => new LoanMapper().map(x));
    return Promise.resolve(loans);
  }

  get(projectId: ProjectId, options: { loanId?: string; periodId?: number }) {
    return new Promise<LoanDto>(resolve => {
      if (options.loanId) {
        const loanItem = this.Items.find(x => x.Id === options.loanId);

        if (!loanItem) throw new BadSalesforceQuery();

        const loan = new LoanMapper().mapWithTotals(loanItem);

        resolve(loan);
      }

      if (options.periodId) {
        const loanItem = this.Items.find(x => x.Acc_PeriodNumber__c === options.periodId);

        if (!loanItem) throw new BadSalesforceQuery();

        const loan = new LoanMapper().mapWithTotals(loanItem);

        resolve(loan);
      }
    });
  }

  update(item: Updatable<ISalesforceLoan>): Promise<boolean> {
    const index = this.Items.findIndex(x => x.Id === item.Id);
    if (index >= 0) {
      this.Items[index] = Object.assign(this.Items[index], item);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

class AccountsTestRepository extends TestRepository<ISalesforceAccount> implements IAccountsRepository {
  getAllByJesName(searchString = "") {
    if (searchString?.length && searchString.length < 3) {
      throw new BadRequestError("You must include at least 3 characters to filter on.");
    }
    return super.getWhere(x => x.JES_Organisation__c === "Yes" && x.Name.includes(searchString));
  }
}

export interface ITestRepositories extends IRepositories {
  accounts: AccountsTestRepository;
  claims: ClaimsTestRepository;
  claimDetails: ClaimDetailsTestRepository;
  claimLineItems: ClaimLineItemsTestRepository;
  claimStatusChanges: ClaimStatusChangeTestRepository;
  costCategories: CostCategoriesTestRepository;
  documents: DocumentsTestRepository;
  loans: LoansTestRepository;
  financialVirements: FinancialVirementsTestRepository;
  monitoringReportHeader: MonitoringReportHeaderTestRepository;
  monitoringReportResponse: MonitoringReportResponseTestRepository;
  monitoringReportQuestions: MonitoringReportQuestionsRepository;
  monitoringReportStatusChange: MonitoringReportStatusChangeTestRepository;
  projectChangeRequests: PCRTestRepository;
  pcrSpendProfile: PcrSpendProfileTestRepository;
  projectChangeRequestStatusChange: ProjectChangeRequestStatusChangeTestRepository;
  profileDetails: ProfileDetailsTestRepository;
  profileTotalCostCategory: ProfileTotalCostCategoryTestRepository;
  profileTotalPeriod: ProfileTotalPeriodTestRepository;
  projects: ProjectsTestRepository;
  partners: PartnerTestRepository;
  projectContacts: ProjectContactTestRepository;
  claimTotalCostCategory: ClaimTotalCostTestRepository;
  permissionGroups: PermissionGroupTestRepository;
  recordTypes: RecordTypeTestRepository;
}

export const createTestRepositories = (): ITestRepositories => {
  const partnerRepository = new PartnerTestRepository();

  const claimsRepository = new ClaimsTestRepository(partnerRepository);

  const projectChangeRequests = new PCRTestRepository();

  return {
    accounts: new AccountsTestRepository(),
    claims: claimsRepository,
    claimStatusChanges: new ClaimStatusChangeTestRepository(claimsRepository),
    claimDetails: new ClaimDetailsTestRepository(),
    claimLineItems: new ClaimLineItemsTestRepository(),
    companies: new CompaniesTestRepository(),
    costCategories: new CostCategoriesTestRepository(),
    documents: new DocumentsTestRepository(),
    financialVirements: new FinancialVirementsTestRepository(),
    financialLoanVirements: new FinancialLoanVirementsTestRepository(),
    loans: new LoansTestRepository(),
    monitoringReportResponse: new MonitoringReportResponseTestRepository(),
    monitoringReportHeader: new MonitoringReportHeaderTestRepository(),
    monitoringReportQuestions: new MonitoringReportQuestionsRepository(),
    monitoringReportStatusChange: new MonitoringReportStatusChangeTestRepository(),
    profileDetails: new ProfileDetailsTestRepository(),
    profileTotalPeriod: new ProfileTotalPeriodTestRepository(partnerRepository),
    profileTotalCostCategory: new ProfileTotalCostCategoryTestRepository(),
    projects: new ProjectsTestRepository(),
    projectChangeRequests,
    pcrSpendProfile: new PcrSpendProfileTestRepository(),
    projectChangeRequestStatusChange: new ProjectChangeRequestStatusChangeTestRepository(projectChangeRequests),
    partners: partnerRepository,
    projectContacts: new ProjectContactTestRepository(),
    claimTotalCostCategory: new ClaimTotalCostTestRepository(),
    permissionGroups: new PermissionGroupTestRepository(),
    recordTypes: new RecordTypeTestRepository(),
  };
};
