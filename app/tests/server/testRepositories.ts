import { TestRepository } from "./testRepository";
import * as Repositories from "../../src/server/repositories";
import { IRepositories } from "../../src/server/features/common/context";
import { FileUpload } from "../../src/types/FileUpload";
import { Updatable } from "../../src/server/repositories/salesforceBase";
import { Stream } from "stream";

class ContactsTestRepository extends TestRepository<Repositories.ISalesforceContact> implements Repositories.IContactsRepository {
    getById(id: string) {
        return super.getOne(x => x.Id === id);
    }

    getAll() {
        return super.getAll();
    }
}

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

    get({ partnerId, periodId, costCategoryId }: ClaimDetailKey): Promise<Repositories.ISalesforceClaimDetails> {
        return super.getOne(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === costCategoryId);
    }
}

class ContentDocumentTestRepository extends TestRepository<Repositories.ISalesforceContentDocument> implements Repositories.IContentDocumentRepository {
    delete(id: string): Promise<void> {
        return super.deleteItem(this.Items.find(x => x.Id === id));
    }
}

class ContentDocumentLinkTestRepository extends TestRepository<Repositories.ISalesforceContentDocumentLink> implements Repositories.IContentDocumentLinkRepository {
    getAllForEntity(entityId: string): Promise<Repositories.ISalesforceContentDocumentLink[]> {
        return super.getWhere(x => x.LinkedEntityId === entityId);
    }
    public insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string) {
        return super.insertOne({ ContentDocumentId: contentDocumentId, LinkedEntityId: linkedEntityId, ShareType: "V" });
    }
}

class ContentVersionTestRepository extends TestRepository<Repositories.ISalesforceContentVersion> implements Repositories.IContentVersionRepository {
    getDocuments(contentDocumentIds: string[], filter: DocumentFilter): Promise<Repositories.ISalesforceContentVersion[]> {
      return super.getWhere(x => (
        contentDocumentIds.indexOf(x.ContentDocumentId) !== -1 && (!filter || x.Description === filter.description)
      ));
    }
    getDocument(documentId: string): Promise<Repositories.ISalesforceContentVersion> {
        return super.getOne(x => documentId === x.Id);
    }
    getDocumentData(documentId: string): Promise<Stream> {
        return super.getOne(x => x.Id === documentId).then(x => {
            const s = new Stream.Readable();
            s._read = () => null;
            s.push(x.Id);
            s.push(null);
            return s;
        });
    }
    public insertDocument({ content, fileName, description }: FileUpload) {
        const nameParts = fileName.split(".");
        const extension = nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;
        const title = nameParts[0];
        return super.insertOne({
            Id: (this.Items.length + 1).toString(),
            Title: title,
            FileExtension: extension,
            ContentDocumentId: (this.Items.length + 1).toString(),
            ContentSize: 5,
            FileType: extension,
            ReasonForChange: "First upload",
            PathOnClient: fileName,
            ContentLocation: "S",
            VersionData: content,
            Description: description
        });
    }
}

class ClaimLineItemsTestRepository extends TestRepository<Repositories.ISalesforceClaimLineItem> implements Repositories.IClaimLineItemRepository {
    getAllForCategory(partnerId: string, categoryId: string, periodId: number) {
        return super.getWhere(x => x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === categoryId && x.Acc_ProjectParticipant__c === partnerId);
    }

    delete(ids: string | string[]) {
        if (!(ids instanceof Array)) {
            ids = [ids];
        }
        ids.forEach((id) => {
            const index = this.Items.findIndex(x => x.Id === id);
            if (index === -1) {
                return Promise.reject();
            }
            this.Items = this.Items.splice(index, 1);
        });
        return Promise.resolve();
    }

    update(updates: Updatable<Repositories.ISalesforceClaimLineItem>[] | Updatable<Repositories.ISalesforceClaimLineItem>) {
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

    insert(lineItems: Partial<Repositories.ISalesforceClaimLineItem>[] | Partial<Repositories.ISalesforceClaimLineItem>) {
        const insert = lineItems instanceof Array ? lineItems : [lineItems];
        if (!(lineItems instanceof Array)) {
            lineItems = [lineItems];
        }
        const newIds: string[] = [];
        insert.forEach((item) => {
            const Id = `ClaimLineItem-${this.Items.length}`;
            newIds.push(Id);
            this.Items.push({ ...item, Id } as Repositories.ISalesforceClaimLineItem);
        });
        if (lineItems instanceof Array) {
            return Promise.resolve(newIds);
        }
        return Promise.resolve(newIds[0]);
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

export interface ITestRepositories extends IRepositories {
    claims: ClaimsTestRepository;
    claimDetails: ClaimDetailsTestRepository;
    claimLineItems: ClaimLineItemsTestRepository;
    costCategories: CostCategoriesTestRepository;
    contacts: ContactsTestRepository;
    contentDocumentLinks: ContentDocumentLinkTestRepository;
    contentDocument: ContentDocumentTestRepository;
    contentVersions: ContentVersionTestRepository;
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
        contacts: new ContactsTestRepository(),
        contentDocument: new ContentDocumentTestRepository(),
        contentDocumentLinks: new ContentDocumentLinkTestRepository(),
        contentVersions: new ContentVersionTestRepository(),
        profileDetails: new ProfileDetailsTestRepository(),
        profileTotalPeriod: new ProfileTotalPeriodTestRepository(partnerRepository),
        profileTotalCostCategory: new ProfileTotalCostCategoryTestRepository(),
        projects: new ProjectsTestRepository(),
        partners: partnerRepository,
        projectContacts: new ProjectContactTestRepository(),
        claimTotalCostCategory: new ClaimTotalCostTestRepository(),
    });
};
