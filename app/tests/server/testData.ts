// tslint:disable:no-duplicate-string
import { DateTime } from "luxon";
import * as Repositories from "@server/repositories";
import { ISalesforceDocument, ISalesforceMonitoringReportQuestions, SalesforceRole } from "@server/repositories";
import { range } from "@shared/range";
import { ClaimStatus, IClientUser } from "@framework/types";
import { ITestRepositories } from "./testRepositories";

export class TestData {
  constructor(private repositories: ITestRepositories, private getCurrentUser: () => IClientUser ) {

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

    const newItem: Repositories.ISalesforceProject = {
      Id: "Project" + seed,
      Acc_ProjectTitle__c: "Project " + seed,
      Acc_CompetitionType__c: "SBRI",
      Acc_StartDate__c: "",
      Acc_EndDate__c: "",
      Acc_ClaimFrequency__c: "",
      Acc_ClaimsForReview__c: 0,
      Acc_ClaimsOverdue__c: 0,
      Acc_ClaimsUnderQuery__c: 0,
      Acc_GOLTotalCostAwarded__c: 0,
      Acc_IFSApplicationId__c: 0,
      Acc_NumberOfOpenClaims__c: 0,
      Acc_ProjectNumber__c: "",
      Acc_ProjectSource__c: "",
      Acc_ProjectStatus__c: "",
      ProjectStatusName: "",
      Acc_ProjectSummary__c: "",
      Acc_PublicDescription__c: "",
      Acc_TotalProjectCosts__c: 0,
      Acc_TrackingClaimStatus__c: "",
      ClaimStatusName: "",
    };

    if (!!update) update(newItem);

    this.repositories.projects.Items.push(newItem);

    return newItem;
  }

  public createLeadPartner(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforcePartner) => void) {
    return this.createPartner(project, x => {
      x.Acc_ProjectRole__c = "Lead";
      if(update) update(x);
    });
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

  private createProjectContact(project: Repositories.ISalesforceProject, partner: Repositories.ISalesforcePartner|null, role?: SalesforceRole, update?: (item: Repositories.ISalesforceProjectContact) => void) {

    role = role || "Monitoring officer";
    const roleName = this.getRoleName(role);

    const seed = this.repositories.projectContacts.Items.length + 1;

    const newItem: Repositories.ISalesforceProjectContact = {
      Id: `ProjectContact${seed}`,
      Acc_ProjectId__c: project.Id,
      Acc_AccountId__c: partner && partner.Acc_AccountId__r && partner.Acc_AccountId__r.Id || undefined,
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

  private assignToCurrentUser(item: Repositories.ISalesforceProjectContact) {
    item.Acc_ContactId__r.Email = this.getCurrentUser().email;
  }

  public createFinanceContact(project?: Repositories.ISalesforceProject, partner?: Repositories.ISalesforcePartner, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    project = project || this.createProject();
    partner = partner || this.createPartner(project);
    return this.createProjectContact(project, partner, "Finance contact", update);
  }

  public createCurrentUserAsFinanceContact(project?: Repositories.ISalesforceProject, partner?: Repositories.ISalesforcePartner, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    return this.createFinanceContact(project, partner, item => {
      this.assignToCurrentUser(item);
      if(update) update(item);
    });
  }

  public createMonitoringOfficer(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    project = project || this.createProject();
    return this.createProjectContact(project, null, "Monitoring officer", update);
  }

  public createCurrentUserAsMonitoringOfficer(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    return this.createMonitoringOfficer(project,  item => {
      this.assignToCurrentUser(item);
      if(update) update(item);
    });
  }

  // tslint:disable-next-line
  public createProjectManager(project?: Repositories.ISalesforceProject, partner?: Repositories.ISalesforcePartner, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    project = project || this.createProject();
    partner = partner || this.createPartner(project);
    return this.createProjectContact(project, partner, "Project Manager", update);
  }

  public createCurrentUserAsProjectManager(project?: Repositories.ISalesforceProject, partner?: Repositories.ISalesforcePartner, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    return this.createProjectManager(project, partner, item => {
      this.assignToCurrentUser(item);
      if(update) update(item);
    });
  }

  public createMonitoringReportQuestionSet(displayOrder: number, noOptions: number = 3, isActive: boolean = true): Repositories.ISalesforceMonitoringReportQuestions[] {
    return range(noOptions).map(x => this.createMonitoringReportQuestion(displayOrder, isActive, true));
  }

  public createMonitoringReportQuestion(displayOrder: number, isActive: boolean = true, isScored: boolean = true): Repositories.ISalesforceMonitoringReportQuestions {

    const seed = this.repositories.monitoringReportQuestions.Items.length + 1;
    const score = this.repositories.monitoringReportQuestions.Items.filter(x => x.Acc_DisplayOrder__c === displayOrder).length + 1;

    const newQuestion = {
      Id: `QuestionId: ${seed}`,
      Acc_QuestionName__c: `QuestionName: ${displayOrder}`,
      Acc_DisplayOrder__c: displayOrder,
      Acc_QuestionScore__c: score,
      Acc_QuestionText__c: `QuestionText: ${displayOrder} Item: ${score}`,
      Acc_ActiveFlag__c: isActive,
      Acc_ScoredQuestion__c: isScored,
    };

    this.repositories.monitoringReportQuestions.Items.push(newQuestion);

    return newQuestion;
  }

  public createMonitoringReportHeader(project?: Repositories.ISalesforceProject, periodId: number = 1, update?: Partial<Repositories.ISalesforceMonitoringReportHeader>): Repositories.ISalesforceMonitoringReportHeader {
    const seed = this.repositories.monitoringReportHeader.Items.length + 1;

    project = project || this.createProject(x => {
      x.Acc_StartDate__c = "2000-01-01";
      x.Acc_EndDate__c = "2019-12-31";
    });

    const startDate = project.Acc_StartDate__c || "2000-01-01";
    const frequency = project.Acc_ClaimFrequency__c === "Quarterly" ? 3 : 1;
    const format = "yyyy-MM-dd";

    const newHeader: Repositories.ISalesforceMonitoringReportHeader = {
      Id: "Report Header " + seed,
      Acc_MonitoringReportStatus__c: "Draft",
      MonitoringReportStatusName: "Draft",
      Acc_Project__c: project.Id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: DateTime.fromFormat(startDate, format).plus({ months: (periodId - 1) * frequency }).toFormat(format),
      Acc_PeriodEndDate__c: DateTime.fromFormat(startDate, format).plus({ months: periodId * frequency, days: -1 }).toFormat(format),
      LastModifiedDate: DateTime.local().toISO()
    };

    if (update) {
      Object.assign(newHeader, update);
    }

    this.repositories.monitoringReportHeader.Items.push(newHeader);

    return newHeader;
  }

  public createMonitoringReportResponse(header?: Repositories.ISalesforceMonitoringReportHeader, question?: ISalesforceMonitoringReportQuestions, update?: Partial<Repositories.ISalesforceMonitoringReportResponse>): Repositories.ISalesforceMonitoringReportResponse {
    header = header || this.createMonitoringReportHeader();
    question = question || this.createMonitoringReportQuestion(this.repositories.monitoringReportQuestions.Items.reduce((a, b) => a > b.Acc_DisplayOrder__c ? a : b.Acc_DisplayOrder__c, 0));

    const seed = this.repositories.monitoringReportResponse.Items.length + 1;
    const response: Repositories.ISalesforceMonitoringReportResponse = {
      Id: `Response: ${seed}`,
      Acc_MonitoringHeader__c: header.Id,
      Acc_QuestionComments__c: `Comments: ${question.Acc_DisplayOrder__c}`,
      Acc_Question__c: question.Id,
    };

    if (update) {
      Object.assign(response, update);
    }

    this.repositories.monitoringReportResponse.Items.push(response);

    return response;
  }

  public createMonitoringReportStatusChange(header?: Repositories.ISalesforceMonitoringReportHeader, partner?: Repositories.ISalesforcePartner): Repositories.ISalesforceMonitoringReportStatusChange {
    header = header || this.createMonitoringReportHeader();
    partner = partner || this.createPartner();

    const seed = this.repositories.monitoringReportStatusChange.Items.length + 1;
    const response: Repositories.ISalesforceMonitoringReportStatusChange = {
      Id: `StatusChange: ${seed}`,
      Acc_MonitoringReport__c: header.Id,
      Acc_PreviousMonitoringReportStatus__c: "Draft",
      Acc_NewMonitoringReportStatus__c: "Submitted to Monitoring Officer",
      CreatedBy: { Name: partner.Acc_AccountId__r.Name },
      CreatedDate: DateTime.local().toISO()
    };

    this.repositories.monitoringReportStatusChange.Items.push(response);

    return response;
  }

  public createClaim(partner?: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaim) => void): Repositories.ISalesforceClaim {

    partner = partner || this.createPartner();
    periodId = periodId || 1;

    let seed = this.repositories.claims.Items.length + 1;
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
        Acc_OverheadRate__c: 0,
        Acc_ProjectRole__c: partner.Acc_ProjectRole__c,
        Acc_AccountId__r: partner.Acc_AccountId__r
      },
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
      Acc_ApprovedDate__c: null,
      Acc_ClaimStatus__c: ClaimStatus.DRAFT,
      ClaimStatusLabel: ClaimStatus.DRAFT,
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

  public createClaimDetail(project?: Repositories.ISalesforceProject, costCategory?: Repositories.ISalesforceCostCategory, partner?: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaimDetails) => void): Repositories.ISalesforceClaimDetails {

    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    project = project || this.createProject();
    periodId = periodId || 1;

    const newItem: Repositories.ISalesforceClaimDetails = {
      Id: `${partner.Id}_${periodId}_${costCategory.Id}`,
      Acc_CostCategory__c: costCategory.Id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_ProjectParticipant__r: {
        Acc_ProjectId__c: project.Id
      },
      Acc_PeriodCostCategoryTotal__c: 1000,
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
      Acc_ReasonForDifference__c: "comments",
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
      Acc_ProjectPeriodNumber__c: periodId,
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

  public createClaimStatusChange(claim: Repositories.ISalesforceClaim, update?: Partial<Repositories.ISalesforceClaimStatusChange>): Repositories.ISalesforceClaimStatusChange {
    const seed = this.repositories.claimStatusChanges.Items.length + 1;
    const newItem: Repositories.ISalesforceClaimStatusChange = {
      Id: `ClaimStatusChange_${seed}`,
      Acc_Claim__c: claim.Id,
      Acc_PreviousClaimStatus__c: "Draft",
      Acc_NewClaimStatus__c: "Submitted",
      Acc_ExternalComment__c: "Comments",
      Acc_ParticipantVisibility__c: true,
      CreatedBy: {
        Name: "CreatedBy_User"
      },
      CreatedDate: new Date().toISOString()
    };

    Object.assign(newItem, update);

    this.repositories.claimStatusChanges.Items.push(newItem);

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

  public createDocument(
    entityId: string,
    title: string= "cat",
    fileType: string|null = "jpg",
    content: string = "",
    description?: string,
    update?: (item: Repositories.ISalesforceDocument) => void
  ) {
    const id = "" + this.repositories.documents.Items.length + 1;
    const item: ISalesforceDocument = {
      Id: id,
      ContentDocumentId: id,
      Title: title,
      FileExtension: fileType,
      ContentSize: content.length,
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

    if (!!update) {
      update(item);
    }

    this.repositories.documents.Items.push([entityId, item]);
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
