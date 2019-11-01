import { Stream } from "stream";
import { TestRepository } from "./testRepository";
import * as Repositories from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { IRepositories, PCRStatus } from "@framework/types";
import { TestFileWrapper } from "./testData";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";
import * as Entities from "@framework/entities";

class ProjectsTestRepository extends TestRepository<Repositories.ISalesforceProject> implements Repositories.IProjectRepository {
  getById(id: string) {
    return super.getOne(x => x.Id === id);
  }

  getAll() {
    return super.getAll();
  }
}

class PartnerTestRepository extends TestRepository<Repositories.ISalesforcePartner> implements Repositories.IPartnerRepository {
  getAllByProjectId(projectId: string) {
    return super.getWhere(x => x.Acc_ProjectId__r.Id === projectId);
  }

  getById(partnerId: string) {
    return super.getOne(x => x.Id === partnerId);
  }

  update(updatedPartner: Repositories.ISalesforcePartner) {
    const index = this.Items.findIndex(x => x.Id === updatedPartner.Id);
    if (index >= 0) {
      this.Items[index] = Object.assign(this.Items[index], updatedPartner);
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
  constructor(private partnerRepository: PartnerTestRepository) {
    super();
  }

  getAllByProjectId(projectId: string) {
    const partnerIds = this.partnerRepository.Items.filter(x => x.Acc_ProjectId__r.Id === projectId).map(x => x.Id);
    return super.getWhere(x => partnerIds.indexOf(x.Acc_ProjectParticipant__r.Id) !== -1);
  }

  getAllByPartnerId(partnerId: string) {
    return super.getWhere(x => x.Acc_ProjectParticipant__r.Id === partnerId);
  }

  get(partnerId: string, periodId: number) {
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

class DocumentsTestRepository extends TestRepository<[string, Repositories.ISalesforceDocument]> implements Repositories.IDocumentsRepository {
  async insertDocument(file: TestFileWrapper, recordId: string, description: string): Promise<string> {
    const nameParts = file.fileName.split(".");
    const extension = nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;
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
      Description: description,
      CreatedDate: new Date().toISOString(),
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

  getDocumentMetadata(documentId: string): Promise<Repositories.ISalesforceDocument> {
    return super.getOne(x => documentId === x[1].Id).then(x => x[1]);
  }

  getDocumentMetadataForEntityDocument(entityId: string, documentId: string): Promise<Repositories.ISalesforceDocument | null> {
    return super.filterOne(x => documentId === x[1].Id && x[0] === entityId).then(x => (x && x[1]));
  }

  getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter): Promise<Repositories.ISalesforceDocument[]> {
    return super.getWhere(x => documentIds.indexOf(x[1].ContentDocumentId) > 1 && (!filter || filter.description === x[1].Description)).then(x => x.map(y => y[1]));
  }

  getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter): Promise<Repositories.ISalesforceDocument[]> {
    return super.getWhere(x => x[0] === recordId && (!filter || x[1].Description === filter.description)).then(x => x.map(y => y[1]));
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
  constructor(private partnerRepository: PartnerTestRepository) {
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

  getAllByProjectId(projectId: string): Promise<Repositories.ISalesforceProfileTotalPeriod[]> {
    const partnerIds = this.partnerRepository.Items.filter(x => x.Acc_ProjectId__r.Id === projectId).map(x => x.Id);
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
      CreatedDate: statusChange.CreatedDate!
    });
  }

  getStatusChanges(monitoringReportId: string): Promise<Repositories.ISalesforceMonitoringReportStatusChange[]> {
    return super.getWhere(x => x.Acc_MonitoringReport__c === monitoringReportId);
  }
}

class ClaimStatusChangeTestRepository extends TestRepository<Repositories.ISalesforceClaimStatusChange> implements Repositories.IClaimStatusChangeRepository {

  constructor(private claimsRepository: ClaimsTestRepository) {
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
        accountName: "",
        guidance: "This is some hardcoded guidance",
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
}

class ProjectChangeRequestStatusChangeTestRepository extends TestRepository<Repositories.ISalesforceProjectChangeRequestStatusChange> implements Repositories.IProjectChangeRequestStatusChangeRepository {
  constructor(private pcrRepository: PCRTestRepository) {
    super();
  }

  createStatusChange(statusChange: Repositories.ICreateProjectChangeRequestStatusChange) {
    const originalStatus = this.pcrRepository.PreviousStatus[statusChange.Acc_ProjectChangeRequest__c];
    const newStatus = this.pcrRepository.Items.find(x => x.id === statusChange.Acc_ProjectChangeRequest__c)!.status;
    return super.insertOne({
      Id: (this.Items.length + 1).toString(),
      Acc_ProjectChangeRequest__c: statusChange.Acc_ProjectChangeRequest__c,
      Acc_PreviousProjectChangeRequestStatus__c: PCRStatus[originalStatus],
      Acc_NewProjectChangeRequestStatus__c: PCRStatus[newStatus],
      CreatedDate: new Date().toISOString(),
      Acc_ParticipantVisibility__c: statusChange.Acc_ParticipantVisibility__c,
      Acc_ExternalComment__c: statusChange.Acc_ExternalComment__c
    });
  }

  getStatusChanges(projectId: string, projectChangeRequestId: string): Promise<Repositories.ISalesforceProjectChangeRequestStatusChange[]> {
    return super.getWhere(x => x.Acc_ProjectChangeRequest__c === projectChangeRequestId);
  }
}

export interface ITestRepositories extends IRepositories {
  claims: ClaimsTestRepository;
  claimDetails: ClaimDetailsTestRepository;
  claimLineItems: ClaimLineItemsTestRepository;
  claimStatusChanges: ClaimStatusChangeTestRepository;
  costCategories: CostCategoriesTestRepository;
  documents: DocumentsTestRepository;
  monitoringReportHeader: MonitoringReportHeaderTestRepository;
  monitoringReportResponse: MonitoringReportResponseTestRepository;
  monitoringReportQuestions: MonitoringReportQuestionsRepository;
  monitoringReportStatusChange: MonitoringReportStatusChangeTestRepository;
  projectChangeRequests: PCRTestRepository;
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
    claims: claimsRepository,
    claimStatusChanges: new ClaimStatusChangeTestRepository(claimsRepository),
    claimDetails: new ClaimDetailsTestRepository(),
    claimLineItems: new ClaimLineItemsTestRepository(),
    costCategories: new CostCategoriesTestRepository(),
    documents: new DocumentsTestRepository(),
    monitoringReportResponse: new MonitoringReportResponseTestRepository(),
    monitoringReportHeader: new MonitoringReportHeaderTestRepository(),
    monitoringReportQuestions: new MonitoringReportQuestionsRepository(),
    monitoringReportStatusChange: new MonitoringReportStatusChangeTestRepository(),
    profileDetails: new ProfileDetailsTestRepository(),
    profileTotalPeriod: new ProfileTotalPeriodTestRepository(partnerRepository),
    profileTotalCostCategory: new ProfileTotalCostCategoryTestRepository(),
    projects: new ProjectsTestRepository(),
    projectChangeRequests,
    projectChangeRequestStatusChange: new ProjectChangeRequestStatusChangeTestRepository(projectChangeRequests),
    partners: partnerRepository,
    projectContacts: new ProjectContactTestRepository(),
    claimTotalCostCategory: new ClaimTotalCostTestRepository(),
    permissionGroups: new PermissionGroupTestRepository(),
    recordTypes: new RecordTypeTestRepository()
  });
};
