import { TestRepository } from "./testRepository";
import * as Repositories from "../../src/server/repositories";
import { IRepositories } from "../../src/server/features/common/context";

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

export const createTestRepositories = () => ({
    claimCosts: new ClaimCostTestRepository(),
    costCategories: new CostCategoriesTestRepository(),
    contacts: new ContactsTestRepository(),
    projects: new ProjectsTestRepository(),
    partners: new PartnerTestRepository(),
    projectContacts: new ProjectContactTestRepository()
});

export type ITestRepositories = ReturnType<typeof createTestRepositories>;