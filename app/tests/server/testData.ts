import * as Repositories from "../../src/server/repositories";
import { ITestRepositories } from "./testRepositories";

export class TestData {
    constructor(private repositories: ITestRepositories){

    }

    public range<T>(no: number, create: (seed: number, index: number) => T){
        return Array.from({ length: no }, (_, i) => create(i + 1, i));
    }

    public createCostCategory(update?:(item: Repositories.ISalesforceCostCategory) => void): Repositories.ISalesforceCostCategory {
        let seed = this.repositories.costCategories.Items.length + 1;

        let newItem: Repositories.ISalesforceCostCategory = {
            Id : `CostCat${seed}`,
            Acc_CostCategoryName__c : `Cost Category ${seed}`,
            Acc_DisplayOrder__c : seed,
            Acc_CompetitionType__c : "Industrial",
            Acc_OrganisationType__c : "Sector",
            Acc_CostCategoryDescription__c: `Cost Category description ${seed}`,
            Acc_HintText__c: `Cost Category hint ${seed}`,
        };

        update && update(newItem);

        this.repositories.costCategories.Items.push(newItem);

        return newItem;
    }

    public createContact(update?: (item: Repositories.ISalesforceContact) => void) {
        let seed = this.repositories.contacts.Items.length + 1;

        let newItem = {
            Id: "Contact" + seed,
            Salutation: "Mr",
            LastName: "James" + seed,
            FirstName: "Joyce" + seed,
            Email: "james" + seed + "@test.com",
            MailingStreet: "",
            MailingCity: "",
            MailingState: "",
            MailingPostalCode: "",
        } as Repositories.ISalesforceContact;

        update && update(newItem);

        this.repositories.contacts.Items.push(newItem);

        return newItem;
    }

    public createProject(update?: (item: Repositories.ISalesforceProject) => void) {
        let seed = this.repositories.projects.Items.length + 1;

        let newItem = {
            Id: "Project" + seed,
            Acc_ProjectTitle__c: "Project " + seed
        } as Repositories.ISalesforceProject;

        update && update(newItem);

        this.repositories.projects.Items.push(newItem);

        return newItem;
    }

    public createPartner(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforcePartner) => void) {
        let seed = this.repositories.partners.Items.length + 1;
        project = project || this.createProject();

        let newItem = {
            Id: `Partner${seed}`,
            Acc_AccountId__r: {
                Id: `AccountId${seed}`,
                Name: `Participant Name ${seed}`
            },
            Acc_ParticipantSize__c: "Large",
            Acc_ParticipantType__c: "Accedemic",
            Acc_ProjectRole__c: "Project Lead",
            Acc_ProjectId__c: project.Id
        } as Repositories.ISalesforcePartner;

        update && update(newItem);

        this.repositories.partners.Items.push(newItem);

        return newItem;
    }

    public createProjectContact(project?: Repositories.ISalesforceProject, partner?: Repositories.ISalesforcePartner, update?: (item: Repositories.ISalesforceProjectContact) => void) {

        project = project || this.createProject();
        partner = partner || this.createPartner(project);

        let seed = this.repositories.projectContacts.Items.length + 1;

        let newItem: Repositories.ISalesforceProjectContact = {
            Id: `ProjectContact${seed}`,
            Acc_ProjectId__c: project.Id,
            Acc_AccountId__c: partner && partner.Acc_AccountId__r && partner.Acc_AccountId__r.Id,
            Acc_EmailOfSFContact__c: `projectcontact${seed}@text.com`,
            Acc_ContactId__r: {
                Id: "Contact" + seed,
                Name: `Ms Contact ${seed}`,
            },
            Acc_Role__c: "Finance officer",
        };

        if(update){
            update(newItem);
        }

        this.repositories.projectContacts.Items.push(newItem);

        return newItem;
    }

    public createClaimDetail(costCategory: Repositories.ISalesforceCostCategory, partner?: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaimDetails) => void): Repositories.ISalesforceClaimDetails {

        costCategory = costCategory || this.createCostCategory();
        partner = partner || this.createPartner();
        periodId = periodId || 1;

        const newItem: Repositories.ISalesforceClaimDetails = {
            Acc_CostCategory__c: costCategory.Id,
            Acc_ProjectPeriodNumber__c: periodId,
            Acc_ProjectParticipant__c: partner.Id,
            Acc_PeriodCostCategoryTotal__c: 1000
        };

        if (update) {
            update(newItem);
        }
        this.repositories.claimDetails.Items.push(newItem);

        return newItem;

    }

    public createProfileDetail(
      costCategory?: Repositories.ISalesforceCostCategory,
      partner?: Repositories.ISalesforcePartner,
      periodId?: number,
      update?: (item: Repositories.ISalesforceClaimDetails) => void
    ): Repositories.ISalesforceClaimDetails {
        costCategory = costCategory || this.createCostCategory();
        partner      = partner || this.createPartner();
        periodId     = periodId || 1;

        const newItem: Repositories.ISalesforceProfileDetails = {
          Acc_CostCategory__c: costCategory.Id,
          Acc_ProjectParticipant__c: partner.Id,
          Acc_ProjectPeriodNumber__c: periodId,
          Acc_PeriodCostCategoryTotal__c: 1000
        };

        if(!!update){
          update(newItem);
        }

        this.repositories.profileDetails.Items.push(newItem);

        return newItem;
    }

}