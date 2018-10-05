import { TestRepository } from "./testRepository";
import * as Repositories from "../../src/server/repositories";
import { IRepositories } from "../../src/server/features/common/context";
import { ISalesforceClaimTotalCostCategory } from "../../src/server/repositories";

class ContactsTestRepository extends TestRepository<Repositories.ISalesforceContact> implements Repositories.IContactsRepository {
    getById(id: string) {
        return super.getOne(x => x.Id == id);
    }

    getAll(){
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
    getById(id: string) {
        return super.getOne(x => x.Id === id);
    }
}

class ClaimDetailsTestRepository extends TestRepository<Repositories.ISalesforceClaimDetails> implements Repositories.IClaimDetailsRepository{
    getAllByPartnerId(partnerId: string, periodId: number): Promise<Repositories.ISalesforceClaimDetails[]> {
        return super.getWhere(x => x.Acc_ProjectPartner_c === partnerId && x.Acc_PeriodId === periodId);
    }

    getAllPreviousByPartnerId(partnerId: string, periodId: number): Promise<Repositories.ISalesforceClaimDetails[]> {
        return super.getWhere(x => x.Acc_ProjectPartner_c === partnerId && x.Acc_PeriodId < periodId);
    }
}

class ClaimLineItemsTestRepository extends TestRepository<Repositories.ISalesforceClaimLineItem> implements Repositories.IClaimLineItemRepository{
    getAllForCategory(partnerId: string, categoryId: string, periodId: number)  {
        return super.getWhere(x => x.Acc_ProjectPeriodId__c === periodId && x.Acc_CostCategory__c === categoryId && x.Acc_ProjectParticipant__c === partnerId);
    }
}

class ClaimTotalCostTestRepository extends TestRepository<ISalesforceClaimTotalCostCategory> implements Repositories.IClaimTotalCostCategoryRepository{
    getAllByPartnerId(partnerId: string) {
        return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId);
    }
}

class ProfileDetailsTestRepository extends TestRepository<Repositories.ISalesforceProfileDetails> implements Repositories.ProfileDetailsRepository {
  getAllByPartnerWithPeriodGt(partnerId: string, periodId: number) {
    return super.getWhere(x => x.Acc_ProjectParticipant__c === partnerId && x.Acc_ProjectPeriodId__c > periodId);
  }
}

export interface ITestRepositories extends IRepositories {
    claims: ClaimsTestRepository;
    claimDetails: ClaimDetailsTestRepository;
    claimCosts: ClaimCostTestRepository;
    claimLineItems: ClaimLineItemsTestRepository;
    costCategories: CostCategoriesTestRepository;
    contacts: ContactsTestRepository;
    profileDetails: ProfileDetailsTestRepository;
    projects: ProjectsTestRepository;
    partners: PartnerTestRepository;
    projectContacts: ProjectContactTestRepository;
    claimTotalCostCategory: ClaimTotalCostTestRepository;
}

export const createTestRepositories = (): ITestRepositories => ({
    claims: new ClaimsTestRepository(),
    claimCosts: new ClaimCostTestRepository(),
    claimDetails: new ClaimDetailsTestRepository(),
    claimLineItems: new ClaimLineItemsTestRepository(),
    costCategories: new CostCategoriesTestRepository(),
    contacts: new ContactsTestRepository(),
    profileDetails: new ProfileDetailsTestRepository(),
    projects: new ProjectsTestRepository(),
    partners: new PartnerTestRepository(),
    projectContacts: new ProjectContactTestRepository(),
    claimTotalCostCategory: new ClaimTotalCostTestRepository(),
});
