import { Stream } from "stream";
import { TestRepository } from "./testRepository";
import * as Repositories from "@server/repositories";
import { FileTypeNotAllowedError } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import {
  ClaimStatus,
  DocumentDescription,
  IPicklistEntry,
  IRepositories,
  MonitoringReportStatus,
  PCRStatus, TypeOfAid
} from "@framework/types";
import { TestFileWrapper } from "./testData";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";
import * as Entities from "@framework/entities";
import { PicklistEntry } from "jsforce";
import { getAllEnumValues } from "@shared/enumHelper";
import { PCRStatusesPicklist } from "../server/features/pcrs/pcrStatusesPicklist";
import { PCRProjectRolesPicklist } from "./features/pcrs/pcrProjectRolesPicklist";
import { PCRPartnerTypesPicklist } from "./features/pcrs/pcrPartnerTypesPicklist";
import { PCRParticipantSizePicklist } from "./features/pcrs/pcrParticipantSizePicklist";
import { DocumentDescriptionMapper, SalesforceDocumentMapper } from "@server/repositories/mappers/documentMapper";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentFilter } from "@framework/types/DocumentFilter";
import { ISalesforceDocument } from "@server/repositories/contentVersionRepository";
import { PcrSpendProfileEntity } from "@framework/entities/pcrSpendProfile";
import { PcrSpendProfileEntityForCreate } from "@framework/entities";
import { PCRProjectLocationPicklist } from "./features/pcrs/pcrProjectLocationPicklist";
import { PCRSpendProfileCapitalUsageTypePicklist } from "./features/pcrs/pcrSpendProfileCapitalUsageTypesPicklist";
import { PCRSpendProfileOverheadRatePicklist } from "./features/pcrs/pcrSpendProfileOverheadsRateOptionsPicklist";

class ProjectsTestRepository extends TestRepository<Repositories.ISalesforceProject> implements Repositories.IProjectRepository {
  getById(id: string) {
    return super.getOne(x => x.Id === id);
  }

  getAll() {
    return super.getAll();
  }
}

class PartnerTestRepository extends TestRepository<Entities.Partner> implements Repositories.IPartnerRepository {
  getAllByProjectId(projectId: string) {
    return super.getWhere(x => x.projectId === projectId);
  }

  getById(partnerId: string) {
    return super.getOne(x => x.id === partnerId);
  }

  // tslint:disable-next-line: cognitive-complexity
  update(updatedPartner: Repositories.ISalesforcePartner) {
    const item = this.Items.find(x => x.id === updatedPartner.Id);
    if (item) {
      item.postcode = updatedPartner.Acc_Postcode__c !== undefined ? updatedPartner.Acc_Postcode__c : item.postcode;
      item.newForecastNeeded = updatedPartner.Acc_NewForecastNeeded__c;
      item.spendProfileStatus = updatedPartner.Acc_SpendProfileCompleted__c;
      item.bankDetailsTaskStatus = updatedPartner.Acc_BankCheckCompleted__c;
      item.bankCheckStatus = updatedPartner.Acc_BankCheckState__c;
      item.sortCode = updatedPartner.Acc_SortCode__c !== undefined ? updatedPartner.Acc_SortCode__c : item.sortCode;
      item.accountNumber = updatedPartner.Acc_AccountNumber__c !== undefined ? updatedPartner.Acc_AccountNumber__c : item.accountNumber;
      item.companyNumber = updatedPartner.Acc_RegistrationNumber__c !== undefined ? updatedPartner.Acc_RegistrationNumber__c : item.companyNumber;
      item.firstName = updatedPartner.Acc_FirstName__c !== undefined ? updatedPartner.Acc_FirstName__c : item.firstName;
      item.lastName = updatedPartner.Acc_LastName__c !== undefined ? updatedPartner.Acc_LastName__c : item.lastName;
      item.accountStreet = updatedPartner.Acc_AddressStreet__c !== undefined ? updatedPartner.Acc_AddressStreet__c : item.accountStreet;
      item.accountTownOrCity = updatedPartner.Acc_AddressTown__c !== undefined ? updatedPartner.Acc_AddressTown__c : item.accountTownOrCity;
      item.accountBuilding = updatedPartner.Acc_AddressBuildingName__c !== undefined ? updatedPartner.Acc_AddressBuildingName__c : item.accountBuilding;
      item.accountLocality = updatedPartner.Acc_AddressLocality__c !== undefined ? updatedPartner.Acc_AddressLocality__c : item.accountLocality;
      item.accountPostcode = updatedPartner.Acc_AddressPostcode__c !== undefined ? updatedPartner.Acc_AddressPostcode__c : item.accountPostcode;
      item.validationCheckPassed = updatedPartner.Acc_ValidationCheckPassed__c !== undefined ? updatedPartner.Acc_ValidationCheckPassed__c : item.validationCheckPassed;
      item.iban = updatedPartner.Acc_Iban__c !== undefined ? updatedPartner.Acc_Iban__c : item.iban;
      item.validationConditionsSeverity = updatedPartner.Acc_ValidationConditionsSeverity__c !== undefined ? updatedPartner.Acc_ValidationConditionsSeverity__c : item.validationConditionsSeverity;
      item.validationConditionsCode = updatedPartner.Acc_ValidationConditionsCode__c !== undefined ? updatedPartner.Acc_ValidationConditionsCode__c : item.validationConditionsCode;
      item.validationConditionsDesc = updatedPartner.Acc_ValidationConditionsDesc__c !== undefined ?  updatedPartner.Acc_ValidationConditionsDesc__c : item.validationConditionsDesc;
      item.addressScore = updatedPartner.Acc_AddressScore__c !== undefined ? updatedPartner.Acc_AddressScore__c : item.addressScore;
      item.companyNameScore = updatedPartner.Acc_CompanyNameScore__c !== undefined ? updatedPartner.Acc_CompanyNameScore__c : item.companyNameScore;
      item.personalDetailsScore = updatedPartner.Acc_PersonalDetailsScore__c !== undefined ? updatedPartner.Acc_PersonalDetailsScore__c : item.personalDetailsScore;
      item.regNumberScore = updatedPartner.Acc_RegNumberScore__c !== undefined ? updatedPartner.Acc_RegNumberScore__c : item.regNumberScore;
      item.verificationConditionsSeverity = updatedPartner.Acc_VerificationConditionsSeverity__c !== undefined ? updatedPartner.Acc_VerificationConditionsSeverity__c : item.verificationConditionsSeverity;
      item.verificationConditionsCode = updatedPartner.Acc_VerificationConditionsCode__c !== undefined ? updatedPartner.Acc_VerificationConditionsCode__c : item.verificationConditionsCode;
      item.verificationConditionsDesc = updatedPartner.Acc_VerificationConditionsDesc__c !== undefined ? updatedPartner.Acc_VerificationConditionsDesc__c : item.verificationConditionsDesc;
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  getAll() {
    return super.getAll();
  }
}

class ProjectContactTestRepository extends TestRepository<Repositories.ISalesforceProjectContact> implements Repositories.IProjectContactsRepository {
  getAllByProjectId(projectId: string) {
    return super.getWhere(x => x.Acc_ProjectId__c === projectId);
  }

  getAllForUser(email: string) {
    return super.getWhere(x => x.Acc_ContactId__r.Email === email);
  }
}

class CostCategoriesTestRepository extends TestRepository<Entities.CostCategory> implements Repositories.ICostCategoryRepository {
  getAll() {
    return super.getAll();
  }
}

class ClaimsTestRepository extends TestRepository<Repositories.ISalesforceClaim> implements Repositories.IClaimRepository {
  constructor(private readonly partnerRepository: PartnerTestRepository) {
    super();
  }

  getAllByProjectId(projectId: string) {
    const partnerIds = this.partnerRepository.Items.filter(x => x.projectId === projectId).map(x => x.id);
    return super.getWhere(x => partnerIds.indexOf(x.Acc_ProjectParticipant__r.Id) !== -1);
  }

  getAllByPartnerId(partnerId: string) {
    return super.getWhere(x => x.Acc_ProjectParticipant__r.Id === partnerId);
  }

  get(partnerId: string, periodId: number) {
    return super.getOne(x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  getByProjectId(projectId: string, partnerId: string, periodId: number) {
    return super.getOne(x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  update(updatedClaim: Repositories.ISalesforceClaim) {
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
    ]);
  }
}

class ClaimDetailsTestRepository extends TestRepository<Repositories.ISalesforceClaimDetails> implements Repositories.IClaimDetailsRepository {
  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<Repositories.ISalesforceClaimDetails[]> {
    return super.getWhere(x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  getAllByPartner(partnerId: string): Promise<Repositories.ISalesforceClaimDetails[]> {
    return super.getWhere(x => x.Acc_ProjectParticipant__r.Id === partnerId);
  }

  get({ partnerId, periodId, costCategoryId }: ClaimDetailKey): Promise<Repositories.ISalesforceClaimDetails | null> {
    return super.filterOne(x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === costCategoryId);
  }

  update(item: Updatable<Repositories.ISalesforceClaimDetails>): Promise<boolean> {
    const index = this.Items.findIndex(x => x.Id === item.Id);
    if (index >= 0) {
      this.Items[index] = Object.assign(this.Items[index], item);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  insert(item: Partial<Repositories.ISalesforceClaimDetails>): Promise<string> {
    const newId: string = `ClaimDetails-${this.Items.length}`;
    this.Items.push({ ...item, Id: newId } as Repositories.ISalesforceClaimDetails);
    return Promise.resolve(newId);
  }
}

class DocumentsTestRepository extends TestRepository<[string, ISalesforceDocument]> implements Repositories.IDocumentsRepository {
  async insertDocument(file: TestFileWrapper, recordId: string, description: DocumentDescription): Promise<string> {
    const nameParts = file.fileName.split(".");
    const extension = nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;
    if (extension === "zip") {
      throw new FileTypeNotAllowedError("File type not allowed");
    }
    const title = nameParts[0];

    const newDocumentId = (this.Items.length + 1).toString();
    // insert tuple [linkedRecordId, document] to enable lookup by linkedRecordId in test repository
    await super.insertOne([recordId, {
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
      Owner: {
        Username: "aUserName"
      }
    }]);
    return newDocumentId;
  }

  deleteDocument(documentId: string): Promise<void> {
    return super.deleteItem(this.Items.find(x => x[1].Id === documentId));
  }

  async isExistingDocument(documentId: string, linkedEntityId: string): Promise<boolean> {
    const document = await super.getWhere(x => x[0] === linkedEntityId && x[1].Id === documentId);
    return !!document;
  }

  getDocumentContent(documentId: string): Promise<Stream> {
    return super.getOne(x => x[1].Id === documentId).then(x => {
      const s = new Stream.Readable();
      s._read = () => null;
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
    const document = await super.filterOne(x => documentId === x[1].Id && x[0] === entityId).then(x => (x && x[1]));
    return document ? new SalesforceDocumentMapper().map(document) : null;
  }

  async getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter): Promise<DocumentEntity[]> {
    const sfDescription = filter && new DocumentDescriptionMapper().mapToSalesforceDocumentDescription(filter.description);
    const documents = await super.getWhere(x => documentIds.indexOf(x[1].ContentDocumentId) > 1 && (!filter || sfDescription === x[1].Description)).then(x => x.map(y => y[1]));
    return documents.map(x => new SalesforceDocumentMapper().map(x));
  }

  async getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter): Promise<DocumentEntity[]> {
    const sfDescription = filter && new DocumentDescriptionMapper().mapToSalesforceDocumentDescription(filter.description);
    const documents = await super.getWhere(x => x[0] === recordId && (!filter || x[1].Description === sfDescription)).then(x => x.map(y => y[1]));
    return documents.map(x => new SalesforceDocumentMapper().map(x));
  }
}

class ClaimLineItemsTestRepository extends TestRepository<Repositories.ISalesforceClaimLineItem> implements Repositories.IClaimLineItemRepository {
  getAllForCategory(partnerId: string, categoryId: string, periodId: number) {
    return super.getWhere(x => x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === categoryId && x.Acc_ProjectParticipant__c === partnerId);
  }

  delete(ids: string[]) {
    ids.forEach((id) => {
      const index = this.Items.findIndex(x => x.Id === id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items.splice(index, 1);
    });
    return Promise.resolve();
  }

  update(updates: Updatable<Repositories.ISalesforceClaimLineItem>[]) {
    if (!(updates instanceof Array)) {
      updates = [updates];
    }
    updates.forEach((update) => {
      const index = this.Items.findIndex(x => x.Id === update.Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items[index] = { ...this.Items[index], ...update };
    });
    return Promise.resolve(true);
  }

  insert(lineItems: Partial<Repositories.ISalesforceClaimLineItem>[]) {
    const newIds: string[] = [];
    lineItems.forEach((item) => {
      const Id = `ClaimLineItem-${this.Items.length}`;
      newIds.push(Id);
      this.Items.push({ ...item, Id } as Repositories.ISalesforceClaimLineItem);
    });
    return Promise.resolve(newIds);
  }
}

class MonitoringReportHeaderTestRepository extends TestRepository<Repositories.ISalesforceMonitoringReportHeader> implements Repositories.IMonitoringReportHeaderRepository {
  getById(id: string): Promise<Repositories.ISalesforceMonitoringReportHeader> {
    return super.getOne(x => x.Id === id);
  }

  get(projectId: string, periodId: number): Promise<Repositories.ISalesforceMonitoringReportHeader> {
    return super.getOne(x => x.Acc_Project__c === projectId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  update(updateDto: Updatable<Repositories.ISalesforceMonitoringReportHeader>): Promise<boolean> {
    const currentIndex = this.Items.findIndex(x => x.Id === updateDto.Id);
    this.Items[currentIndex] = Object.assign(this.Items[currentIndex], updateDto);
    return Promise.resolve(true);
  }

  create(item: Repositories.ISalesforceMonitoringReportHeader): Promise<string> {
    item.Id = `New resonse ${this.Items.length + 1}`;
    super.insertOne(item);
    return Promise.resolve(item.Id);
  }

  getAllForProject(projectId: string): Promise<Repositories.ISalesforceMonitoringReportHeader[]> {
    return super.getWhere(x => x.Acc_Project__c === projectId);
  }

  delete(reportId: string): Promise<void> {
    return super.deleteItem(this.Items.find(x => x.Id === reportId));
  }

  getMonitoringReportStatuses(): Promise<PicklistEntry[]> {
    return Promise.resolve(
      getAllEnumValues<MonitoringReportStatus>(MonitoringReportStatus)
        // convert to string representation of enum value
        .map(x => MonitoringReportStatus[x])
        .map(statusLabel => ({
          value: statusLabel,
          label: statusLabel,
          active: true,
          defaultValue: false
        })
        )
    );
  }

}

class MonitoringReportResponseTestRepository extends TestRepository<Repositories.ISalesforceMonitoringReportResponse> implements Repositories.IMonitoringReportResponseRepository {
  getAllForHeader(monitoringReportHeaderId: string): Promise<Repositories.ISalesforceMonitoringReportResponse[]> {
    return super.getWhere(x => x.Acc_MonitoringHeader__c === monitoringReportHeaderId);
  }

  delete(idList: string[]) {
    idList.forEach((Id) => {
      const index = this.Items.findIndex(x => x.Id === Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items.splice(index, 1);
    });
    return Promise.resolve();
  }

  update(updates: Updatable<Repositories.ISalesforceMonitoringReportResponse>[]) {
    if (!(updates instanceof Array)) {
      updates = [updates];
    }
    updates.forEach((item) => {
      const index = this.Items.findIndex(x => x.Id === item.Id);
      if (index === -1) {
        return Promise.reject();
      }
      this.Items[index] = Object.assign(this.Items[index], item);
    });
    return Promise.resolve(true);
  }

  insert(response: Partial<Repositories.ISalesforceMonitoringReportResponse>[]) {
    const newIds: string[] = [];
    response.forEach((x) => {
      const Id = `MonitoringReportResponse-${this.Items.length}`;
      newIds.push(Id);
      this.Items.push({ ...x, Id } as Repositories.ISalesforceMonitoringReportResponse);
    });
    return Promise.resolve(newIds);
  }
}

class ClaimTotalCostTestRepository extends TestRepository<Repositories.ISalesforceClaimTotalCostCategory> implements Repositories.IClaimTotalCostCategoryRepository {
  getAllByPartnerId(partnerId: string) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }
}

class ProfileDetailsTestRepository extends TestRepository<Repositories.ISalesforceProfileDetails> implements Repositories.IProfileDetailsRepository {
  getAllByPartner(partnerId: string) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }

  getById(partnerId: string, periodId: number, costCategoryId: string) {
    return super
      .getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === costCategoryId)
      .then(x => x[0]);
  }

  update(updates: Updatable<Repositories.ISalesforceProfileDetails>[]) {
    updates.forEach(update => {
      const item = this.Items.find(x => x.Id === update.Id);

      if (!!item) {
        Object.assign(item, update);
      }
    });

    return Promise.resolve(true);
  }
}

class ProfileTotalPeriodTestRepository extends TestRepository<Repositories.ISalesforceProfileTotalPeriod> implements Repositories.IProfileTotalPeriodRepository {
  constructor(private readonly partnerRepository: PartnerTestRepository) {
    super();
  }

  get(partnerId: string, periodId: number): Promise<Repositories.ISalesforceProfileTotalPeriod> {
    return super
      .getOne(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  getAllByPartnerId(partnerId: string): Promise<Repositories.ISalesforceProfileTotalPeriod[]> {
    return super
      .getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }

  getByProjectIdAndPeriodId(projectId: string, periodId: number) {
    const partnerIds = this.partnerRepository.Items.filter(x => x.projectId === projectId).map(x => x.id);
    return super.getWhere(
      x => partnerIds.indexOf(x.Acc_ProjectParticipant__c) !== -1 && x.Acc_ProjectPeriodNumber__c === periodId);
  }

  getAllByProjectId(projectId: string): Promise<Repositories.ISalesforceProfileTotalPeriod[]> {
    const partnerIds = this.partnerRepository.Items.filter(x => x.projectId === projectId).map(x => x.id);
    return super.getWhere(x => partnerIds.indexOf(x.Acc_ProjectParticipant__c) !== -1);
  }
}

class ProfileTotalCostCategoryTestRepository extends TestRepository<Repositories.ISalesforceProfileTotalCostCategory> implements Repositories.IProfileTotalCostCategoryRepository {
  getAllByPartnerId(partnerId: string) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
  }
}

class MonitoringReportQuestionsRepository extends TestRepository<Repositories.ISalesforceMonitoringReportQuestions> implements Repositories.IMonitoringReportQuestionsRepository {
  getAll() {
    return super.getAll();
  }
}

class MonitoringReportStatusChangeTestRepository extends TestRepository<Repositories.ISalesforceMonitoringReportStatusChange> implements Repositories.IMonitoringReportStatusChangeRepository {
  createStatusChange(statusChange: Partial<Repositories.ISalesforceMonitoringReportStatusChange>) {
    return super.insertOne({
      Id: (this.Items.length + 1).toString(),
      Acc_MonitoringReport__c: statusChange.Acc_MonitoringReport__c!,
      Acc_PreviousMonitoringReportStatus__c: statusChange.Acc_PreviousMonitoringReportStatus__c!,
      Acc_NewMonitoringReportStatus__c: statusChange.Acc_NewMonitoringReportStatus__c!,
      Acc_CreatedByAlias__c: statusChange.Acc_CreatedByAlias__c!,
      CreatedDate: statusChange.CreatedDate!,
      Acc_ExternalComment__c: statusChange.Acc_ExternalComment__c!
    });
  }

  getStatusChanges(monitoringReportId: string): Promise<Repositories.ISalesforceMonitoringReportStatusChange[]> {
    return super.getWhere(x => x.Acc_MonitoringReport__c === monitoringReportId);
  }
}

class ClaimStatusChangeTestRepository extends TestRepository<Repositories.ISalesforceClaimStatusChange> implements Repositories.IClaimStatusChangeRepository {

  constructor(private readonly claimsRepository: ClaimsTestRepository) {
    super();
  }

  getAllForClaim(partnerId: string, periodId: number) {
    const claim = this.claimsRepository.Items.find(x => x.Acc_ProjectParticipant__r.Id === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
    return super.getWhere(x => x.Acc_Claim__c === (claim && claim.Id));
  }

  async create(statusChange: Partial<Repositories.ISalesforceClaimStatusChange>) {

    const id = `NewStatusChange${(this.Items.length + 1)}`;

    super.insertOne({ ...statusChange, Id: id } as Repositories.ISalesforceClaimStatusChange);

    return id;
  }

}

class PermissionGroupTestRepository implements Repositories.IPermissionGroupRepository {
  public Items: Entities.PermissionGroup[] = [
    { id: "ClaimsTeamID", identifier: PermissionGroupIdenfifier.ClaimsTeam, name: PermissionGroupIdenfifier[PermissionGroupIdenfifier.ClaimsTeam] }
  ];

  getAll() {
    return Promise.resolve(this.Items);
  }
}

class RecordTypeTestRepository extends TestRepository<Entities.RecordType> implements Repositories.IRecordTypeRepository {
  public getAll() {
    return super.getAll();
  }
}

class PCRTestRepository extends TestRepository<Entities.ProjectChangeRequestEntity> implements Repositories.IProjectChangeRequestRepository {

  public PreviousStatus: { [key: string]: PCRStatus } = {};

  getAllByProjectId(projectId: string): Promise<Entities.ProjectChangeRequestEntity[]> {
    return super.getWhere(x => x.projectId === projectId);
  }

  getById(projectId: string, id: string): Promise<Entities.ProjectChangeRequestEntity> {
    return super.getOne(x => x.projectId === projectId && x.id === id).then(x => {
      this.PreviousStatus[x.id] = x.status;
      return x;
    });
  }

  updateProjectChangeRequest(pcr: Entities.ProjectChangeRequestEntity): Promise<void> {
    return Promise.resolve();
  }

  updateItems(pcr: Entities.ProjectChangeRequestEntity, pcrItems: Entities.ProjectChangeRequestItemEntity[]) {
    pcr.items = pcr.items.map(existingItem => {
      const updatedItem = pcrItems.find(x => x.id === existingItem.id);
      return updatedItem || existingItem;
    });
    return Promise.resolve();
  }

  private mapItemsForCreate(headerId: string, pcr: Entities.ProjectChangeRequestForCreateEntity, items: Entities.ProjectChangeRequestItemForCreateEntity[]) {
    const itemLength = pcr.items ? items.length : 0;
    return items.map((x, i) => {
      const itemId = `ProjectChangeRequest-${headerId}-Item-${itemLength + i}`;
      return {
        id: itemId,
        pcrId: headerId,
        partnerId: "",
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
        ...x
      };
    });
  }

  async insertItems(headerId: string, items: Entities.ProjectChangeRequestItemForCreateEntity[]): Promise<void> {
    const pcr = await super.getOne(x => x.id === headerId);
    const insert = this.mapItemsForCreate(headerId, pcr, items);
    if (!pcr.items) pcr.items = [];
    pcr.items.push(...insert);
  }

  async createProjectChangeRequest(projectChangeRequest: Entities.ProjectChangeRequestForCreateEntity): Promise<string> {
    const id = `ProjectChangeRequest${(this.Items.length)}`;
    const items = this.mapItemsForCreate(id, projectChangeRequest, projectChangeRequest.items);
    await super.insertOne({ id, items, ...projectChangeRequest } as Entities.ProjectChangeRequestEntity);
    return id;
  }

  isExisting(projectId: string, projectChangeRequestId: string): Promise<boolean> {
    const data = super.filterOne(x => x.projectId === projectId && x.id === projectChangeRequestId);
    return Promise.resolve(!!data);
  }

  delete(item: Entities.ProjectChangeRequestEntity) {
    return super.deleteItem(item);
  }

  getPcrChangeStatuses(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = new Array();
    PCRStatusesPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getProjectRoles(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = new Array();
    PCRProjectRolesPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getPartnerTypes(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = new Array();
    PCRPartnerTypesPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getParticipantSizes(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = new Array();
    PCRParticipantSizePicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getProjectLocations(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = new Array();
    PCRProjectLocationPicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }
}

class PcrSpendProfileTestRepository extends TestRepository<PcrSpendProfileEntity> implements Repositories.IPcrSpendProfileRepository {
  getAllForPcr(pcrItemId: string): Promise<Entities.PcrSpendProfileEntity[]> {
    return super.getWhere(x => x.pcrItemId === pcrItemId);
  }
  insertSpendProfiles(items: PcrSpendProfileEntityForCreate[]) {
    const newIds: string[] = [];
    items.forEach((x) => {
      const id = `PcrSpendProfile-${this.Items.length}`;
      newIds.push(id);
      this.Items.push({ ...x, id });
    });
    return Promise.resolve(newIds);
  }
  updateSpendProfiles(updates: PcrSpendProfileEntity[]) {
    updates.forEach(update => {
      const item = this.Items.find(x => x.id === update.id);
      if (!!item) Object.assign(item, update);
    });
    return Promise.resolve(true);
  }
  deleteSpendProfiles(ids: string[]) {
    ids.forEach(x => this.Items = this.Items.filter(element => element.id !== x));
    return Promise.resolve();
  }

  getCapitalUsageTypes(): Promise<PicklistEntry[]> {
    const picklistEntry: PicklistEntry[] = new Array();
    PCRSpendProfileCapitalUsageTypePicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }

  getOverheadRateOptions(): Promise<IPicklistEntry[]> {
    const picklistEntry: IPicklistEntry[] = new Array();
    PCRSpendProfileOverheadRatePicklist.forEach(x => picklistEntry.push(x));
    return Promise.resolve(picklistEntry);
  }
}

class ProjectChangeRequestStatusChangeTestRepository extends TestRepository<Entities.ProjectChangeRequestStatusChangeEntity> implements Repositories.IProjectChangeRequestStatusChangeRepository {
  constructor(private readonly pcrRepository: PCRTestRepository) {
    super();
  }

  createStatusChange(statusChange: Repositories.ICreateProjectChangeRequestStatusChange) {
    const previousStatus = this.pcrRepository.PreviousStatus[statusChange.Acc_ProjectChangeRequest__c];
    const newStatus = this.pcrRepository.Items.find(x => x.id === statusChange.Acc_ProjectChangeRequest__c)!.status;
    return super.insertOne({
      id: (this.Items.length + 1).toString(),
      pcrId: statusChange.Acc_ProjectChangeRequest__c,
      createdBy: "Sentient being Alpha B-25",
      createdDate: new Date(),
      previousStatus,
      newStatus,
      externalComments: statusChange.Acc_ExternalComment__c,
      participantVisibility: statusChange.Acc_ParticipantVisibility__c
    });
  }

  getStatusChanges(projectId: string, projectChangeRequestId: string): Promise<Entities.ProjectChangeRequestStatusChangeEntity[]> {
    return super.getWhere(x => x.pcrId === projectChangeRequestId);
  }
}

class FinancialVirementsTestRepository extends TestRepository<Entities.PartnerFinancialVirement> implements Repositories.IFinancialVirementRepository {
  getAllForPcr(pcrItemId: string): Promise<Entities.PartnerFinancialVirement[]> {
    return super.getWhere(x => x.pcrItemId === pcrItemId);
  }

  updateVirements(items: Updatable<Repositories.ISalesforceFinancialVirement>[]): Promise<boolean> {
    items.forEach(x => this.updateVirement(x));
    return Promise.resolve(true);
  }

  private updateVirement(item: Updatable<Repositories.ISalesforceFinancialVirement>) {
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

class AccountsTestRepository extends TestRepository<Repositories.ISalesforceAccount> implements Repositories.IAccountsRepository {
  getAccounts() {
    return super.getAll();
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

  return ({
    accounts: new AccountsTestRepository(),
    claims: claimsRepository,
    claimStatusChanges: new ClaimStatusChangeTestRepository(claimsRepository),
    claimDetails: new ClaimDetailsTestRepository(),
    claimLineItems: new ClaimLineItemsTestRepository(),
    costCategories: new CostCategoriesTestRepository(),
    documents: new DocumentsTestRepository(),
    financialVirements: new FinancialVirementsTestRepository(),
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
    recordTypes: new RecordTypeTestRepository()
  });
};
