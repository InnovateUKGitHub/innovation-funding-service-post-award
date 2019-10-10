// tslint:disable:no-duplicate-string
import { DateTime } from "luxon";
import * as Repositories from "@server/repositories";
import * as Entites from "@framework/entities";
import { range } from "@shared/range";
import { ClaimStatus, IClientUser } from "@framework/types";
import { ITestRepositories } from "./testRepositories";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";

export class TestData {
  constructor(private repositories: ITestRepositories, private getCurrentUser: () => IClientUser) {

  }

  public range<T>(no: number, create: (seed: number, index: number) => T) {
    return Array.from({ length: no }, (_, i) => create(i + 1, i));
  }

  public createCostCategory(update?: Partial<Entites.CostCategory>): Entites.CostCategory {
    const seed = this.repositories.costCategories.Items.length + 1;

    const newItem: Entites.CostCategory = {
      id: `CostCat${seed}`,
      name: `Cost Category ${seed}`,
      displayOrder: seed,
      competitionType: "SBRI",
      organisationType: "Industrial",
      description: `Cost Category description ${seed}`,
      hintText: `Cost Category hint ${seed}`,
      hasRelated: false,
      isCalculated: false
    };

    if (!!update) Object.assign(newItem, update);

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
      if (update) update(x);
    });
  }

  public createPartner(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforcePartner) => void) {
    const seed = this.repositories.partners.Items.length + 1;
    project = project || this.createProject();

    const newItem: Repositories.ISalesforcePartner = {
      Id: `Partner${seed}`,
      Acc_AccountId__r: {
        Id: `AccountId${seed}`,
        Name: `Participant Name ${seed}`
      },
      Acc_ParticipantType__c: "Accedemic",
      Acc_ParticipantSize__c: "Large",
      Acc_ProjectId__r: {
        Id: project.Id,
        Acc_CompetitionType__c: project.Acc_CompetitionType__c,
      },
      Acc_TotalParticipantCosts__c: 125000,
      Acc_TotalApprovedCosts__c: 17474,
      Acc_TotalPaidCosts__c: 25000,
      Acc_Cap_Limit__c: 50,
      Acc_Award_Rate__c: 50,
      Acc_ForecastLastModifiedDate__c: "",
      Acc_OrganisationType__c: "Industrial",
      Acc_OverheadRate__c: 20,
      Acc_ClaimsForReview__c: 0,
      Acc_ClaimsOverdue__c: 0,
      Acc_ClaimsUnderQuery__c: 0,
      Acc_ProjectRole__c: "Unknown",
      ProjectRoleName: "Unknown",
      Acc_TotalCostsSubmitted__c: 0,
      Acc_TotalFutureForecastsForParticipant__c: 0,
      Acc_TrackingClaims__c: "",
      Acc_AuditReportFrequency__c: "Never, for this project",
      AuditReportFrequencyName: "Never, for this project",
      Acc_TotalCostsAwarded__c: 100000,
      Acc_TotalPrepayment__c: 500
    };

    if (!!update) update(newItem);

    this.repositories.partners.Items.push(newItem);

    return newItem;
  }

  private getRoleName(role: Repositories.SalesforceRole) {
    switch (role) {
      case "Finance contact":
        return "Finance Contact";
      case "Monitoring officer":
        return "Monitoring Officer";
      case "Project Manager":
        return "Project Manager";
    }
  }

  private createProjectContact(project: Repositories.ISalesforceProject, partner: Repositories.ISalesforcePartner | null, role?: Repositories.SalesforceRole, update?: (item: Repositories.ISalesforceProjectContact) => void) {

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
      if (update) update(item);
    });
  }

  public createMonitoringOfficer(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    project = project || this.createProject();
    return this.createProjectContact(project, null, "Monitoring officer", update);
  }

  public createCurrentUserAsMonitoringOfficer(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforceProjectContact) => void) {
    return this.createMonitoringOfficer(project, item => {
      this.assignToCurrentUser(item);
      if (update) update(item);
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
      if (update) update(item);
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
      Acc_QuestionDescription__c: `Description Text ${displayOrder} Item: ${score}`,
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

  public createMonitoringReportResponse(header?: Repositories.ISalesforceMonitoringReportHeader, question?: Repositories.ISalesforceMonitoringReportQuestions, update?: Partial<Repositories.ISalesforceMonitoringReportResponse>): Repositories.ISalesforceMonitoringReportResponse {
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

    const seed = this.repositories.monitoringReportStatusChange.Items.length + 1;
    const response: Repositories.ISalesforceMonitoringReportStatusChange = {
      Id: `StatusChange: ${seed}`,
      Acc_MonitoringReport__c: header.Id,
      Acc_PreviousMonitoringReportStatus__c: "Draft",
      Acc_NewMonitoringReportStatus__c: "Submitted to Monitoring Officer",
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
      Acc_ReasonForDifference__c: null,
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

  public createClaimDetail(project?: Repositories.ISalesforceProject, costCategory?: Entites.CostCategory, partner?: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaimDetails) => void): Repositories.ISalesforceClaimDetails {

    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    project = project || this.createProject();
    periodId = periodId || 1;

    const newItem: Repositories.ISalesforceClaimDetails = {
      Id: `${partner.Id}_${periodId}_${costCategory.id}`,
      Acc_CostCategory__c: costCategory.id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_ProjectParticipant__r: {
        Id: partner.Id,
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

  public createClaimLineItem(
    costCategory?: Entites.CostCategory,
    partner?: Repositories.ISalesforcePartner,
    periodId?: number,
    update?: (item: Partial<Repositories.ISalesforceClaimLineItem>) => void
  ): Repositories.ISalesforceClaimLineItem {

    const seed = this.repositories.claimLineItems.Items.length + 1;
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    periodId = periodId || 1;

    const newItem: Repositories.ISalesforceClaimLineItem = {
      Id: `ClaimLineItem-${seed}`,
      Acc_CostCategory__c: costCategory.id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_LineItemCost__c: 200,
      Acc_LineItemDescription__c: "We hired a person to do a thing",
      RecordTypeId: "Claims Line Item"
    };

    if (update) {
      update(newItem);
    }

    this.repositories.claimLineItems.Items.push(newItem);

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
      CreatedDate: new Date().toISOString()
    };

    Object.assign(newItem, update);

    this.repositories.claimStatusChanges.Items.push(newItem);

    return newItem;
  }

  public createProfileDetail(
    costCategory?: Entites.CostCategory,
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
      Acc_CostCategory__c: costCategory.id,
      Acc_ProjectParticipant__c: partner.Id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_LatestForecastCost__c: 1000,
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
    };

    if (update) {
      update(newItem);
    }

    this.repositories.profileDetails.Items.push(newItem);

    return newItem;
  }

  public createDocument(
    entityId: string,
    title: string = "cat",
    fileType: string | null = "jpg",
    content: string = "",
    description?: string,
    update?: (item: Repositories.ISalesforceDocument) => void
  ) {
    const id = "" + this.repositories.documents.Items.length + 1;
    const item: Repositories.ISalesforceDocument = {
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
    costCategory?: Entites.CostCategory,
    partner?: Repositories.ISalesforcePartner,
    golCost?: number,
    update?: (item: Repositories.ISalesforceProfileTotalCostCategory) => void
  ): Repositories.ISalesforceProfileTotalCostCategory {
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    golCost = golCost || 100;

    const newItem: Repositories.ISalesforceProfileTotalCostCategory = {
      Acc_CostCategory__c: costCategory.id,
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

  public createFile(content: string = "Test File Content", fileName: string = "testFile.csv"): TestFileWrapper {
    return new TestFileWrapper(fileName, content);
  }

  public createRecordType(update?: Partial<Entites.RecordType>) {

    const seed = this.repositories.recordTypes.Items.length + 1;

    const newItem: Entites.RecordType = {
      id: "RecordType " + seed,
      type: "Type " + seed,
      parent: "Parent " + seed,
    };

    if (update) {
      Object.assign(newItem, update);
    }

    this.repositories.recordTypes.Items.push(newItem);

    return newItem;

  }

  public createPCRRecordTypes() {
    return PCRRecordTypeMetaValues.map(x => {
      const parent = "Acc_ProjectChangeRequest__c";
      const existing = this.repositories.recordTypes.Items.find(r => r.parent === parent && r.type === x.typeName);
      return existing || this.createRecordType({
        parent,
        type: x.typeName
      });
    });
  }

  public createPCR(project?: Repositories.ISalesforceProject, update?: Partial<Entites.ProjectChangeRequestEntity>) {
    const seed = this.repositories.projectChangeRequests.Items.length + 1;

    project = project || this.createProject();

    const newItem: Entites.ProjectChangeRequestEntity = {
      id: `PCR_${seed}`,
      projectId: project.Id,
      guidance: "This is some hardcoded guidance",
      comments: "",
      number: seed,
      status: Entites.ProjectChangeRequestStatus.Unknown,
      statusName: Entites.ProjectChangeRequestStatus[Entites.ProjectChangeRequestStatus.Unknown],
      started: new Date(),
      updated: new Date(),
      reasoningStatus: Entites.ProjectChangeRequestItemStatus.Complete,
      reasoning: "Test Reasoning",
      reasoningStatusName: Entites.ProjectChangeRequestItemStatus[Entites.ProjectChangeRequestItemStatus.Complete],
      items: []
    };

    if (update) {
      Object.assign(newItem, update);
    }

    this.repositories.projectChangeRequests.Items.push(newItem);

    return newItem;
  }

  public createPCRItem(pcr: Entites.ProjectChangeRequestEntity, recordType?: Entites.RecordType, update?: Partial<Entites.ProjectChangeRequestItemEntity>) {
    const seed = this.repositories.projectChangeRequests.Items.reduce((c, x) => c + x.items.length, 0) + 1;
    pcr = pcr || this.createPCR();
    recordType = recordType || this.createPCRRecordTypes().find(x => pcr.items.every(y => x.id !== y.recordTypeId));

    if(!recordType) {
      throw new Error("Unable to create pcr item as pcr already has all the record types");
    }

    const newItem: Entites.ProjectChangeRequestItemEntity = {
      id: `PCR_Item_${seed}`,
      pcrId: pcr.id,
      accountName: "",
      guidance: "This is some hardcoded guidance",
      recordTypeId: recordType.id,
      projectId: pcr.projectId,
      projectEndDate: new Date(),
      projectSummary: "",
      publicDescription: "",
      partnerId: "",
      status: Entites.ProjectChangeRequestItemStatus.Complete,
      statusName: "Complete",
      suspensionStartDate: null,
      suspensionEndDate: null,
    };

    if (update) {
      Object.assign(newItem, update);
    }

    pcr.items.push(newItem);

    return newItem;
  }

  public createProjectChangeRequestStatusChange(projectChangeRequest: Entites.ProjectChangeRequestEntity, participantVisibility: boolean): Repositories.ISalesforceProjectChangeRequestStatusChange {
    const seed = this.repositories.projectChangeRequestStatusChange.Items.length + 1;

    const response: Repositories.ISalesforceProjectChangeRequestStatusChange = {
      Id: `StatusChange: ${seed}`,
      Acc_ProjectChangeRequest__c: projectChangeRequest.id,
      Acc_PreviousProjectChangeRequestStatus__c: "Draft",
      Acc_NewProjectChangeRequestStatus__c: "Submitted to Monitoring Officer",
      CreatedDate: DateTime.local().toISO(),
      Acc_ExternalComment__c: "This is a comment",
      Acc_ParticipantVisibility__c: participantVisibility
    };

    this.repositories.projectChangeRequestStatusChange.Items.push(response);

    return response;
  }

}

export class TestFileWrapper implements IFileWrapper {

  constructor(public fileName: string, public content: string) {
  }

  public get size(): number { return this.content && this.content.length || 0; }
}
