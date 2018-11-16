import * as Repositories from "../../src/server/repositories";
import { ITestRepositories } from "./testRepositories";
import { ClaimStatus, DocumentDescription } from "../../src/types";

export class TestData {
  constructor(private repositories: ITestRepositories) {

  }

  public range<T>(no: number, create: (seed: number, index: number) => T) {
    return Array.from({ length: no }, (_, i) => create(i + 1, i));
  }

  public createCostCategory(update?: (item: Repositories.ISalesforceCostCategory) => void): Repositories.ISalesforceCostCategory {
    let seed = this.repositories.costCategories.Items.length + 1;

    let newItem: Repositories.ISalesforceCostCategory = {
      Id: `CostCat${seed}`,
      Acc_CostCategoryName__c: `Cost Category ${seed}`,
      Acc_DisplayOrder__c: seed,
      Acc_CompetitionType__c: "Sector",
      Acc_OrganisationType__c: "Industrial",
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

    const newItem = {
      Id: `Partner${seed}`,
      Acc_AccountId__r: {
        Id: `AccountId${seed}`,
        Name: `Participant Name ${seed}`
      },
      Acc_ParticipantType__c: "Accedemic",
      Acc_ParticipantSize__c: "Large",
      Acc_ProjectRole__c: "Project Lead",
      Acc_ProjectId__c: project.Id,
      Acc_TotalParticipantGrant__c: 125000,
      Acc_TotalParticipantCosts__c: 17474,
      Acc_TotalParticipantCostsPaid__c: 50000,
      Acc_Cap_Limit__c: 50,
      Acc_Award_Rate__c: 50,
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

    if (update) {
      update(newItem);
    }

    this.repositories.projectContacts.Items.push(newItem);

    return newItem;
  }

  public createClaim(partner?: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaim) => void): Repositories.ISalesforceClaim {

    partner = partner || this.createPartner();
    periodId = periodId || 1;

    let seed = this.repositories.claims.Items.length;
    let id = `Claim_${seed}`;

    while (this.repositories.claims.Items.some(x => x.Id === id)) {
      seed++;
      id = `Claim_${seed}`;
    }

        const newItem: Repositories.ISalesforceClaim = {
            Id: id,
            Acc_ProjectPeriodNumber__c: periodId,
            Acc_ProjectParticipant__c: partner.Id,
            Acc_ProjectPeriodStartDate__c: "2018-01-02",
            Acc_ProjectPeriodEndDate__c: "2018-03-04",
            Acc_ApprovedDate__c: null,
            Acc_ClaimStatus__c: ClaimStatus.DRAFT,
            Acc_LineItemDescription__c: null,
            Acc_ProjectPeriodCost__c : 100,
            Acc_PaidDate__c: null,
            Acc_TotalCostsApproved__c: 100,
            Acc_TotalCostsSubmitted__c: 100,
            Acc_TotalGrantApproved__c: 100,
            LastModifiedDate: "2018-03-04T12:00:00.000+00",
            Acc_IARRequired__c: false
        };

    if (update) {
      update(newItem);
    }

    this.repositories.claims.Items.push(newItem);

    return newItem;

  }

  public createClaimDetail(costCategory: Repositories.ISalesforceCostCategory, partner?: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaimDetails) => void): Repositories.ISalesforceClaimDetails {

    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    periodId = periodId || 1;

    const newItem: Repositories.ISalesforceClaimDetails = {
      Id: `${partner.Id}_${periodId}_${costCategory.Id}`,
      Acc_CostCategory__c: costCategory.Id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_PeriodCostCategoryTotal__c: 1000,
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
    };

    if (update) {
      update(newItem);
    }
    this.repositories.claimDetails.Items.push(newItem);

    return newItem;
  }

  public createClaimLineItem(options: {
    persist: boolean
    costCategory?: Repositories.ISalesforceCostCategory,
    partner?: Repositories.ISalesforcePartner,
    periodId?: number,
    update?: (item: Partial<Repositories.ISalesforceClaimLineItem>) => void
  } = {
      persist: true,
      periodId: 1
    }): Partial<Repositories.ISalesforceClaimLineItem> {

    let { costCategory, partner } = options;
    const { update, periodId, persist } = options;

    const seed = this.repositories.claimLineItems.Items.length + 1;
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();

    const newItem: Partial<Repositories.ISalesforceClaimLineItem> = {
      Acc_CostCategory__c: costCategory.Id,
      Acc_ProjectPeriodNumber__c: periodId!,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_LineItemCost__c: 200,
      Acc_LineItemDescription__c: "We hired a person to do a thing"
    };

    if (persist) {
      newItem.Id = `ClaimLineItem-${seed}`;
    }
    if (update) {
      update(newItem);
    }
    if (persist) {
      this.repositories.claimLineItems.Items.push(newItem as Repositories.ISalesforceClaimLineItem);
    }
    return newItem;
  }

  public createProfileDetail(
    costCategory?: Repositories.ISalesforceCostCategory,
    partner?: Repositories.ISalesforcePartner,
    periodId?: number,
    update?: (item: Repositories.ISalesforceProfileDetails) => void
  ): Repositories.ISalesforceProfileDetails {
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    periodId = periodId || 1;

    const seed = this.repositories.profileDetails.Items.length + 1;
    const newItem: Repositories.ISalesforceProfileDetails = {
      Id: `ProfileDetailsItem-${seed}`,
      Acc_CostCategory__c: costCategory.Id,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_LatestForecastCost__c: 1000,
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
    };

    if (!!update) {
      update(newItem);
    }

    this.repositories.profileDetails.Items.push(newItem);

    return newItem;
  }

  public createContentDocumentLink(contentDocumentId: string, entityId: string) {
    const item = {
      ContentDocumentId: contentDocumentId,
      LinkedEntityId: entityId,
      ShareType: "V",
      Id: this.repositories.contentDocumentLinks.Items.length + 1 + ""
    };
    this.repositories.contentDocumentLinks.Items.push(item);
    return item;
  }

  public createContentVersion(entityId: string, title: string, fileType: string, content: string = "", description: string) {
    const id = "" + this.repositories.contentVersions.Items.length + 1;
    const item = {
      Id: id,
      ContentDocumentId: id,
      LinkedEntityId: entityId,
      Title: title,
      FileExtension: fileType,
      ContentSize: 2,
      FileType: fileType,
      ReasonForChange: "First upload",
      PathOnClient: fileType ? `${title}.${fileType}` : title,
      ContentLocation: "S",
      VersionData: content,
      Description: description
    };
    this.repositories.contentVersions.Items.push(item);
    this.repositories.contentDocument.Items.push({ Id: item.ContentDocumentId });
    return item;
  }

  public createProfileTotalCostCategory(
    costCategory?: Repositories.ISalesforceCostCategory,
    partner?: Repositories.ISalesforcePartner,
    golCost?: number,
    update?: (item: Repositories.ISalesforceProfileTotalCostCategory) => void
  ): Repositories.ISalesforceProfileTotalCostCategory {
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    golCost = golCost || 100;

    const newItem: Repositories.ISalesforceProfileTotalCostCategory = {
      Acc_CostCategory__c: costCategory.Id,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_CostCategoryGOLCost__c: golCost,
      Id: this.repositories.profileTotalCostCategory.Items.length + 1 + ""
    };

    if (!!update) {
      update(newItem);
    }

    this.repositories.profileTotalCostCategory.Items.push(newItem);

    return newItem;
  }

  public createProfileTotalPeriod(
    partner?: Repositories.ISalesforcePartner,
    periodId?: number,
    update?: (item: Repositories.ISalesforceProfileTotalPeriod) => void
  ): Repositories.ISalesforceProfileTotalPeriod {
    partner = partner || this.createPartner();

    const newItem: Repositories.ISalesforceProfileTotalPeriod = {
      Acc_PeriodInitialForecastCost__c: 100,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_ProjectPeriodNumber__c: periodId || 1,
      LastModifiedDate: new Date().toISOString()
    };

    if (!!update) {
      update(newItem);
    }

    this.repositories.profileTotalPeriod.Items.push(newItem);

    return newItem;
  }
}
