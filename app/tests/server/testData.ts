// tslint:disable:no-duplicate-string
import * as Repositories from "../../src/server/repositories";
import { ITestRepositories } from "./testRepositories";
import { ClaimStatus } from "../../src/types";
import { SalesforceRole } from "../../src/server/repositories";
import { ISalesforceMonitoringReportResponse} from "../../src/server/repositories";
import { MonitoringReportStatus } from "../../src/types/constants/monitoringReportStatus";

export class TestData {
  constructor(private repositories: ITestRepositories) {

  }

  public range<T>(no: number, create: (seed: number, index: number) => T) {
    return Array.from({ length: no }, (_, i) => create(i + 1, i));
  }

  public createCostCategory(update?: (item: Repositories.ISalesforceCostCategory) => void): Repositories.ISalesforceCostCategory {
    const seed = this.repositories.costCategories.Items.length + 1;

    const newItem: Repositories.ISalesforceCostCategory = {
      Id: `CostCat${seed}`,
      Acc_CostCategoryName__c: `Cost Category ${seed}`,
      Acc_DisplayOrder__c: seed,
      Acc_CompetitionType__c: "Sector",
      Acc_OrganisationType__c: "Industrial",
      Acc_CostCategoryDescription__c: `Cost Category description ${seed}`,
      Acc_HintText__c: `Cost Category hint ${seed}`,
    };

    if (!!update) update(newItem);

    this.repositories.costCategories.Items.push(newItem);

    return newItem;
  }

  public createProject(update?: (item: Repositories.ISalesforceProject) => void) {
    const seed = this.repositories.projects.Items.length + 1;

    const newItem = {
      Id: "Project" + seed,
      Acc_ProjectTitle__c: "Project " + seed,
      Acc_CompetitionType__c: "SBRI",
    } as Repositories.ISalesforceProject;

    if (!!update) update(newItem);

    this.repositories.projects.Items.push(newItem);

    return newItem;
  }

  public createPartner(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforcePartner) => void) {
    const seed = this.repositories.partners.Items.length + 1;
    project = project || this.createProject();

    const newItem = {
      Id: `Partner${seed}`,
      Acc_AccountId__r: {
        Id: `AccountId${seed}`,
        Name: `Participant Name ${seed}`
      },
      Acc_ParticipantType__c: "Accedemic",
      Acc_ParticipantSize__c: "Large",
      Acc_ProjectId__c: project.Id,
      Acc_TotalParticipantGrant__c: 125000,
      Acc_TotalParticipantCosts__c: 17474,
      Acc_TotalParticipantCostsPaid__c: 50000,
      Acc_TotalPaidCosts__c: 25000,
      Acc_Cap_Limit__c: 50,
      Acc_Award_Rate__c: 50,
      Acc_ForecastLastModifiedDate__c: "",
      Acc_OrganisationType__c: "Industrial"

    } as Repositories.ISalesforcePartner;

    if (!!update) update(newItem);

    this.repositories.partners.Items.push(newItem);

    return newItem;
  }

  private getRoleName(role: SalesforceRole) {
    switch (role) {
      case "Finance contact":
        return "Finance Contact";
      case "Monitoring officer":
        return "Monitoring Officer";
      case "Project Manager":
        return "Project Manager";
    }
  }

  private createProjectContact(project?: Repositories.ISalesforceProject, partner?: Repositories.ISalesforcePartner, role?: SalesforceRole, update?: (item: Repositories.ISalesforceProjectContact) => void) {

    project = project || this.createProject();
    role = role || "Monitoring officer";
    const roleName = this.getRoleName(role);

    const seed = this.repositories.projectContacts.Items.length + 1;

    const newItem: Repositories.ISalesforceProjectContact = {
      Id: `ProjectContact${seed}`,
      Acc_ProjectId__c: project.Id,
      Acc_AccountId__c: partner && partner.Acc_AccountId__r && partner.Acc_AccountId__r.Id,
      Acc_EmailOfSFContact__c: `projectcontact${seed}@text.com`,
      Acc_ContactId__r: {
        Id: "Contact" + seed,
        Name: `Ms Contact ${seed}`,
        Email: `projectcontact${seed}@login.com`,
      },
      Acc_Role__c: role,
      RoleName: roleName,
    };

    if (update) {
      update(newItem);
    }

    this.repositories.projectContacts.Items.push(newItem);

    return newItem;
  }

  public createFinanceContact(project?: Repositories.ISalesforceProject, partner?: Repositories.ISalesforcePartner, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    project = project || this.createProject();
    partner = partner || this.createPartner(project);
    return this.createProjectContact(project, partner, "Finance contact", update);
  }

  public createMonitoringOfficer(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    return this.createProjectContact(project, undefined, "Monitoring officer", update);
  }

  public createProjectManager(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    return this.createProjectContact(project, undefined, "Project Manager", update);
  }

  // TODO remove 'createQuestion' and use this instead
  public createQuestionA(answersPerQuestion: number, displayOrder: number): Repositories.ISalesforceQuestions[] {
    const newQuestionArray = [];
    const seed = this.repositories.monitoringReportQuestions.Items.length + 1;
    for (let i = 0; i < answersPerQuestion; i++) {
      const newQuestion: Repositories.ISalesforceQuestions = {
        Id: `QuestionId: ${seed + i}`,
        Acc_QuestionName__c: `QuestionName: ${displayOrder}`,
        Acc_DisplayOrder__c: displayOrder,
        Acc_Score__c: i + 1,
        Acc_QuestionText__c: `QuestionText: ${seed} ${i}`,
        Acc_ActiveFlag__c: "Y",
      };
      this.repositories.monitoringReportQuestions.Items.push(newQuestion);
      newQuestionArray.push(newQuestion);
    }
    return newQuestionArray;
  }

  public createQuestion(answersPerQuestion: number, displayOrder = 1, overrideCalculation = false): Repositories.ISalesforceQuestions[] {
    let i;
    const newQuestionArray = [];
    const seed = this.repositories.monitoringReportQuestions.Items.length + 1;
    for (i = 0; i < answersPerQuestion; i++) {
      const newQuestion: Repositories.ISalesforceQuestions = {
        Id: `QuestionId: ${seed + i}`,
        Acc_QuestionName__c: `QuestionName: ${overrideCalculation ? displayOrder : (seed-1)/answersPerQuestion + displayOrder}`,
        Acc_DisplayOrder__c: overrideCalculation ? displayOrder : (seed-1)/answersPerQuestion + displayOrder,
        Acc_Score__c: i + 1,
        Acc_QuestionText__c: `QuestionText: ${seed} ${i}`,
        Acc_ActiveFlag__c: "Y",
      };
      this.repositories.monitoringReportQuestions.Items.push(newQuestion);
      newQuestionArray.push(newQuestion);
    }

    return newQuestionArray;
  }

  public createMonitoringReportHeader(id: string, projectId: string, period: number): Repositories.ISalesforceMonitoringReportHeader {

    const newHeader = {
      Id: id,
      Acc_MonitoringReportStatus__c: MonitoringReportStatus.DRAFT,
      Acc_ProjectId__c: projectId,
      Acc_ProjectPeriodNumber__c: period,
      Acc_ProjectStartDate__c: "2018-02-04",
      Acc_ProjectEndDate__c: "2018-03-04"
    };
    this.repositories.monitoringReportHeader.Items.push(newHeader);

    return newHeader;
  }

  public createMonitoringReportResponseFromQuestions(questions: Repositories.ISalesforceQuestions[], questionCount = 0) {
    const uniqueQuestionIds = [...new Set(questions.map(x => x.Id))];
    const responseArray: ISalesforceMonitoringReportResponse[] = [];

    uniqueQuestionIds.forEach(x => {
      responseArray.push(
        {
          Id: "",
          Acc_MonitoringReportHeader__c: "",
          Acc_Question__c: x,
          Acc_QuestionComments__c: "",
        }
      );
    });

    responseArray.forEach(r => {
      questions.forEach(q => {
        if (r.Acc_Question__c === q.Id) {
          r.Id = `Response: ${questionCount + 1}`;
          r.Acc_MonitoringReportHeader__c = "a";
          r.Acc_QuestionComments__c = `Comments: ${q.Acc_DisplayOrder__c}`;
        }
      });
      this.repositories.monitoringReportResponse.Items.push(r);
    });

    return responseArray;
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
      Acc_ProjectParticipant__r: {
        Id: partner.Id,
        Acc_ProjectRole__c: partner.Acc_ProjectRole__c,
        Acc_AccountId__r: partner.Acc_AccountId__r
      },
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
      Acc_ApprovedDate__c: null,
      Acc_ClaimStatus__c: ClaimStatus.DRAFT,
      Acc_LineItemDescription__c: null,
      Acc_ProjectPeriodCost__c: 100,
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

  public createClaimDetail(costCategory?: Repositories.ISalesforceCostCategory, partner?: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaimDetails) => void): Repositories.ISalesforceClaimDetails {

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

  public createContentVersion(entityId: string, title: string, fileType: string | null, content: string = "", description?: string) {
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
      Description: description,
      CreatedDate: new Date().toISOString(),
      Owner: {
        Username: "aUserId"
      }
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
