import { TestRepository } from "./testRepository";
import * as Repositories from "../../src/server/repositories";
import { IRepositories } from "../../src/server/features/common/context";
import {Updatable} from "../../src/server/repositories/salesforceBase";

class ContactsTestRepository extends TestRepository<Repositories.ISalesforceContact> implements Repositories.IContactsRepository {
    getById(id: string) {
        return super.getOne(x => x.Id == id);
    }

    getAll() {
        return super.getAll();
    }
}

class ProjectsTestRepository extends TestRepository<Repositories.ISalesforceProject> implements Repositories.IProjectRepository {
    getById(id: string) {
        return super.getOne(x => x.Id == id);
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
}

class ProjectContactTestRepository extends TestRepository<Repositories.ISalesforceProjectContact> implements Repositories.IProjectContactsRepository {
    getAllByProjectId(projectId: string) {
        return super.getWhere(x => x.Acc_ProjectId__c === projectId);
    }
}

class ClaimCostTestRepository extends TestRepository<Repositories.ISalesforceClaimCost> implements Repositories.IClaimCostRepository {
    getAllForClaim(claimId: string) {
        return super.getWhere(x => x.ACC_Claim_Id__c === claimId);
    }
}

class CostCategoriesTestRepository extends TestRepository<Repositories.ISalesforceCostCategory> implements Repositories.ICostCategoryRepository {
    getAll() {
        return super.getAll();
    }
}

class ClaimsTestRepository extends TestRepository<Repositories.ISalesforceClaim> implements Repositories.IClaimRepository{
    getAllByPartnerId(partnerId: string) {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
    }

    getByPartnerIdAndPeriodId(partnerId: string, periodId: number) {
        return super.getOne(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
    }

    update(updatedClaim: Repositories.ISalesforceClaim) {
        const index = super.Items.findIndex(x => x.Acc_ProjectParticipant__c === updatedClaim.Acc_ProjectParticipant__c && x.Acc_ProjectPeriodNumber__c == updatedClaim.Acc_ProjectPeriodNumber__c);
        if(index >= 0) {
            super.Items[index] = updatedClaim;
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}

class ClaimDetailsTestRepository extends TestRepository<Repositories.ISalesforceClaimDetails> implements Repositories.IClaimDetailsRepository{
    getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<Repositories.ISalesforceClaimDetails[]> {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId);
    }

    getAllByPartnerWithPeriodLt(partnerId: string, periodId: number): Promise<Repositories.ISalesforceClaimDetails[]> {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c < periodId);
    }

    getAllByPartner(partnerId: string): Promise<Repositories.ISalesforceClaimDetails[]> {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
    }
}

class ClaimLineItemsTestRepository extends TestRepository<Repositories.ISalesforceClaimLineItem> implements Repositories.IClaimLineItemRepository{
    getAllForCategory(partnerId: string, categoryId: string, periodId: number)  {
        return super.getWhere(x => x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === categoryId && x.Acc_ProjectParticipant__c === partnerId);
    }
    delete() { return super.delete(); }
    update(update: Updatable<Repositories.ISalesforceClaimLineItem>) { return super.update(update); }
    insert() { return super.insert(); }
}

class ClaimTotalCostTestRepository extends TestRepository<Repositories.ISalesforceClaimTotalCostCategory> implements Repositories.IClaimTotalCostCategoryRepository{
    getAllByPartnerId(partnerId: string) {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
    }
}

class ProfileDetailsTestRepository extends TestRepository<Repositories.ISalesforceProfileDetails> implements Repositories.IProfileDetailsRepository {
  getAllByPartnerWithPeriodGt(partnerId: string, periodId: number) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c > periodId);
  }

  getById(partnerId: string, periodId: number, costCategoryId: string) {
    return super
      .getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodNumber__c === periodId && x.Acc_CostCategory__c === costCategoryId)
      .then(x => x[0]);
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
    profileDetails: ProfileDetailsTestRepository;
    profileTotalCostCategory: ProfileTotalCostCategoryTestRepository;
    projects: ProjectsTestRepository;
    partners: PartnerTestRepository;
    projectContacts: ProjectContactTestRepository;
    claimTotalCostCategory: ClaimTotalCostTestRepository;
}

export const createTestRepositories = (): ITestRepositories => ({
    claims: new ClaimsTestRepository(),
    claimDetails: new ClaimDetailsTestRepository(),
    claimLineItems: new ClaimLineItemsTestRepository(),
    costCategories: new CostCategoriesTestRepository(),
    contacts: new ContactsTestRepository(),
    profileDetails: new ProfileDetailsTestRepository(),
    profileTotalCostCategory: new ProfileTotalCostCategoryTestRepository(),
    projects: new ProjectsTestRepository(),
    partners: new PartnerTestRepository(),
    projectContacts: new ProjectContactTestRepository(),
    claimTotalCostCategory: new ClaimTotalCostTestRepository(),
});
