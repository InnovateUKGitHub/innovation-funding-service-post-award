import { Stream } from "stream";
import { TestRepository } from "./testRepository";
import * as Repositories from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { FileUpload, IRepositories } from "@framework/types";

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
        return super.getWhere(x => x.Acc_ProjectId__c === projectId);
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

class CostCategoriesTestRepository extends TestRepository<Repositories.ISalesforceCostCategory> implements Repositories.ICostCategoryRepository {
    getAll() {
        return super.getAll();
    }
}

class ClaimsTestRepository extends TestRepository<Repositories.ISalesforceClaim> implements Repositories.IClaimRepository {
    constructor(private partnerRepository: PartnerTestRepository) {
        super();
    }

    getAllByProjectId(projectId: string) {
        const partnerIds = this.partnerRepository.Items.filter(x => x.Acc_ProjectId__c === projectId).map(x => x.Id);
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
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
    }

    getAllByPartnerWithPeriodLt(partnerId: string, periodId: number): Promise<Repositories.ISalesforceClaimDetails[]> {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c < periodId);
    }

    getAllByPartner(partnerId: string): Promise<Repositories.ISalesforceClaimDetails[]> {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
    }

    get({ partnerId, periodId, costCategoryId }: ClaimDetailKey): Promise<Repositories.ISalesforceClaimDetails|null> {
        return super.filterOne(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === costCategoryId);
    }

    update(item: Updatable<Repositories.ISalesforceClaimDetails>): Promise<boolean> {
        const index = this.Items.findIndex(x => x.Id === item.Id);
        if (index >= 0) {
          this.Items[index] = Object.assign(this.Items[index], item);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}

class DocumentsTestRepository extends TestRepository<any> implements Repositories.IDocumentsRepository {
  async insertDocument({ content, fileName, description }: FileUpload, recordId: string): Promise<string> {
    const nameParts = fileName.split(".");
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
      PathOnClient: fileName,
      ContentLocation: "S",
      VersionData: content,
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

    getAllByPartnerWithPeriodGt(partnerId: string, periodId: number) {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c > periodId);
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
        const partnerIds = this.partnerRepository.Items.filter(x => x.Acc_ProjectId__c === projectId).map(x => x.Id);
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
      CreatedById: statusChange.CreatedById!,
      CreatedDate: statusChange.CreatedDate!
    });
  }

  getStatusChanges(monitoringReportId: string): Promise<Repositories.ISalesforceMonitoringReportStatusChange[]> {
    return super.getWhere(x => x.Acc_MonitoringReport__c === monitoringReportId);
  }
}

export interface ITestRepositories extends IRepositories {
    claims: ClaimsTestRepository;
    claimDetails: ClaimDetailsTestRepository;
    claimLineItems: ClaimLineItemsTestRepository;
    costCategories: CostCategoriesTestRepository;
    documents: DocumentsTestRepository;
    monitoringReportHeader: MonitoringReportHeaderTestRepository;
    monitoringReportResponse: MonitoringReportResponseTestRepository;
    monitoringReportQuestions: MonitoringReportQuestionsRepository;
    monitoringReportStatusChange: MonitoringReportStatusChangeTestRepository;
    profileDetails: ProfileDetailsTestRepository;
    profileTotalCostCategory: ProfileTotalCostCategoryTestRepository;
    profileTotalPeriod: ProfileTotalPeriodTestRepository;
    projects: ProjectsTestRepository;
    partners: PartnerTestRepository;
    projectContacts: ProjectContactTestRepository;
    claimTotalCostCategory: ClaimTotalCostTestRepository;
}

export const createTestRepositories = (): ITestRepositories => {
    const partnerRepository = new PartnerTestRepository();

    return ({
        claims: new ClaimsTestRepository(partnerRepository),
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
        partners: partnerRepository,
        projectContacts: new ProjectContactTestRepository(),
        claimTotalCostCategory: new ClaimTotalCostTestRepository(),
    });
};
