import { DateTime } from "luxon";
import * as Repositories from "@server/repositories";
import * as Entities from "@framework/entities";
import { PartnerFinancialVirement, ProjectChangeRequestStatusChangeEntity } from "@framework/entities";
import { range } from "@shared/range";
import {
  ClaimStatus,
  DocumentDescription,
  IClientUser,
  IFileWrapper,
  PCRPartnerType,
  PCRProjectRole,
  TypeOfAid,
} from "@framework/types";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import {
  CostCategoryType,
  PCRItemStatus,
  PCRParticipantSize,
  PCRStatus,
  PCROrganisationType,
} from "@framework/constants";
import { ISalesforceDocument } from "@server/repositories/contentVersionRepository";
import { ITestRepositories } from "./testRepositories";

export class TestData {
  constructor(private readonly repositories: ITestRepositories, private readonly getCurrentUser: () => IClientUser) {}

  public range<T>(no: number, create: (seed: number, index: number) => T) {
    return Array.from({ length: no }, (_, i) => create(i + 1, i));
  }

  public createBroadcasts() {
    const startDate = DateTime.fromFormat("1 Dec 2014", "d MMM yyyy").toFormat("yyyy-MM-dd");
    const endDate = DateTime.fromFormat("1 Dec 2044", "d MMM yyyy").toFormat("yyyy-MM-dd");
    const broadcasts: Repositories.ISalesforceBroadcast[] = [
      {
        Id: "1",
        Name: "Achtung, Achtung",
        Acc_Message__c: "Würde der Besitzer eines roten Fiat-Pandas bitte die Rezeption kontaktieren",
        Acc_StartDate__c: startDate,
        Acc_EndDate__c: endDate,
      },
      {
        Id: "2",
        Name: "Achtung, Achtung",
        Acc_Message__c: "Der Verzehr eigener Speisen in der Mensa ist untersagt",
        Acc_StartDate__c: startDate,
        Acc_EndDate__c: endDate,
      },
      {
        Id: "3",
        Name: "Achtung, Achtung",
        Acc_Message__c: "Bitte halten Sie wegen des Virus die soziale Distanz ein",
        Acc_StartDate__c: startDate,
        Acc_EndDate__c: endDate,
      },
    ];

    this.repositories.broadcast.setItems(broadcasts);
  }

  public createCostCategory(update?: Partial<Entities.CostCategory>): Entities.CostCategory {
    const seed = this.repositories.costCategories.Items.length + 1;

    const newItem: Entities.CostCategory = {
      id: `CostCat${seed}`,
      name: `Cost Category ${seed}`,
      type: CostCategoryType.Unknown,
      displayOrder: seed,
      competitionType: "SBRI",
      organisationType: PCROrganisationType.Industrial,
      description: `Cost Category description ${seed}`,
      hintText: `Cost Category hint ${seed}`,
      hasRelated: false,
      isCalculated: false,
    };

    if (update) Object.assign(newItem, update);

    this.repositories.costCategories.Items.push(newItem);

    return newItem;
  }

  public createAccount(item?: Repositories.ISalesforceAccount) {
    const seed = this.repositories.accounts.Items.length + 1;

    const newItem: Repositories.ISalesforceAccount = {
      Id: `id_${seed}`,
      Name: `test_name${seed}`,
      JES_Organisation__c: "No",
    };

    this.repositories.accounts.Items.push({
      ...newItem,
      ...item,
    });

    return newItem;
  }

  public createProject(update?: (item: Repositories.ISalesforceProject) => void) {
    const seed = this.repositories.projects.Items.length + 1;

    const newItem: Repositories.ISalesforceProject = {
      Id: "Project" + seed,
      Acc_ProjectTitle__c: "Project " + seed,
      Acc_CompetitionType__c: "CR&D",
      Acc_StartDate__c: "",
      Acc_EndDate__c: "",
      Acc_ClaimFrequency__c: "Quarterly",
      Acc_ClaimsForReview__c: 0,
      Acc_ClaimsOverdue__c: 0,
      Acc_ClaimsUnderQuery__c: 0,
      Acc_GOLTotalCostAwarded__c: 0,
      Acc_IFSApplicationId__c: 0,
      Acc_NumberOfOpenClaims__c: 0,
      Acc_ProjectNumber__c: seed.toString(),
      Acc_ProjectSource__c: "",
      Acc_ProjectStatus__c: "Live",
      ProjectStatusName: "",
      Acc_PCRsForReview__c: 0,
      Acc_PCRsUnderQuery__c: 0,
      Acc_ProjectSummary__c: "",
      Acc_PublicDescription__c: "",
      Acc_TotalProjectCosts__c: 0,
      Acc_TrackingClaimStatus__c: "",
      ClaimStatusName: "",
      Acc_LeadParticipantName__c: "",
      Acc_NumberofPeriods__c: 5,
      Acc_CurrentPeriodNumber__c: 0,
      Acc_Duration__c: 15,
      Acc_CurrentPeriodStartDate__c: "2020-06-01",
      Acc_CurrentPeriodEndDate__c: "2020-06-30",
      Acc_NonFEC__c: false,
      Loan_LoanEndDate__c: null,
      Loan_LoanAvailabilityPeriodLength__c: null,
      Loan_LoanExtensionPeriodLength__c: null,
      Loan_LoanRepaymentPeriodLength__c: null,
    };

    if (update) update(newItem);

    this.repositories.projects.Items.push(newItem);

    return newItem;
  }

  public createLeadPartner(project?: Repositories.ISalesforceProject, update?: (item: Entities.Partner) => void) {
    return this.createPartner(project, x => {
      x.projectRole = "Lead";
      if (update) update(x);
    });
  }

  public createPartner(project?: Repositories.ISalesforceProject, update?: (item: Entities.Partner) => void) {
    const seed = this.repositories.partners.Items.length + 1;
    project = project || this.createProject();

    const newItem: Entities.Partner = {
      id: `Partner${seed}`,
      accountId: `AccountId${seed}`,
      name: `Participant Name ${seed}`,
      participantType: "Academic",
      participantSize: "Large",
      projectId: project.Id,
      competitionType: project.Acc_CompetitionType__c,
      totalParticipantCosts: 125000,
      totalApprovedCosts: 17474,
      totalPaidCosts: 25000,
      capLimit: 50,
      awardRate: 50,
      forecastLastModifiedDate: null,
      organisationType: PCROrganisationType.Industrial,
      overheadRate: 20,
      overdueProject: false,
      claimsForReview: 0,
      claimsOverdue: 0,
      claimsUnderQuery: 0,
      projectRole: "Unknown",
      projectRoleName: "Unknown",
      totalCostsSubmitted: 0,
      participantStatus: "On Hold",
      participantStatusLabel: "On Hold",
      totalFutureForecastsForParticipant: 0,
      trackingClaims: "",
      auditReportFrequency: "Never, for this project",
      auditReportFrequencyName: "Never, for this project",
      totalCostsAwarded: 100000,
      totalPrepayment: 500,
      postcode: "BS1 1AA",
      postcodeStatusLabel: "",
      postcodeStatus: "",
      newForecastNeeded: false,
      spendProfileStatus: "",
      spendProfileStatusLabel: "",
      bankDetailsTaskStatus: "",
      bankDetailsTaskStatusLabel: "",
      bankCheckStatus: "",
      firstName: "",
      lastName: "",
      accountPostcode: "",
      accountStreet: "",
      accountTownOrCity: "",
      accountBuilding: "",
      accountLocality: "",
      accountNumber: "",
      sortCode: "",
      companyNumber: "",
      validationCheckPassed: false,
      iban: "",
      validationConditionsSeverity: "",
      validationConditionsCode: "",
      validationConditionsDesc: "",
      addressScore: 0,
      companyNameScore: 0,
      personalDetailsScore: 0,
      regNumberScore: "No match",
      verificationConditionsSeverity: "",
      verificationConditionsCode: "",
      verificationConditionsDesc: "",
      totalGrantApproved: 0,
      remainingParticipantGrant: 0,
      isNonFunded: true,
    };

    if (update) update(newItem);

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

  private createProjectContact(
    project: Repositories.ISalesforceProject,
    partner: Entities.Partner | null,
    role?: Repositories.SalesforceRole,
    update?: (item: Repositories.ISalesforceProjectContact) => void,
  ) {
    role = role || "Monitoring officer";
    const roleName = this.getRoleName(role);

    const seed = this.repositories.projectContacts.Items.length + 1;

    const newItem: Repositories.ISalesforceProjectContact = {
      Id: `ProjectContact${seed}`,
      Acc_ProjectId__c: project.Id,
      Acc_AccountId__c: (partner && partner.accountId) || undefined,
      Acc_EmailOfSFContact__c: `projectcontact${seed}@text.com`,
      Acc_ContactId__r: {
        Id: "Contact" + seed,
        Name: `Ms Contact ${seed}`,
        Email: `projectcontact${seed}@login.com`,
      },
      Acc_UserId__r: {
        Name: "Mr Internal Contact",
        Username: `projectcontact${seed}@login.com.bjssdev`,
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

  public createFinanceContact(
    project?: Repositories.ISalesforceProject,
    partner?: Entities.Partner,
    update?: (item: Repositories.ISalesforceProjectContact) => void,
  ) {
    project = project || this.createProject();
    partner = partner || this.createPartner(project);
    return this.createProjectContact(project, partner, "Finance contact", update);
  }

  public createCurrentUserAsFinanceContact(
    project?: Repositories.ISalesforceProject,
    partner?: Entities.Partner,
    update?: (item: Repositories.ISalesforceProjectContact) => void,
  ) {
    return this.createFinanceContact(project, partner, item => {
      this.assignToCurrentUser(item);
      if (update) update(item);
    });
  }

  public createMonitoringOfficer(
    project?: Repositories.ISalesforceProject,
    update?: (item: Repositories.ISalesforceProjectContact) => void,
  ) {
    project = project || this.createProject();
    return this.createProjectContact(project, null, "Monitoring officer", update);
  }

  public createCurrentUserAsMonitoringOfficer(
    project?: Repositories.ISalesforceProject,
    update?: (item: Repositories.ISalesforceProjectContact) => void,
  ) {
    return this.createMonitoringOfficer(project, item => {
      this.assignToCurrentUser(item);
      if (update) update(item);
    });
  }

  public createProjectManager(
    project?: Repositories.ISalesforceProject,
    partner?: Entities.Partner,
    update?: (item: Repositories.ISalesforceProjectContact) => void,
  ) {
    project = project || this.createProject();
    partner = partner || this.createPartner(project);
    return this.createProjectContact(project, partner, "Project Manager", update);
  }

  public createCurrentUserAsProjectManager(
    project?: Repositories.ISalesforceProject,
    partner?: Entities.Partner,
    update?: (item: Repositories.ISalesforceProjectContact) => void,
  ) {
    return this.createProjectManager(project, partner, item => {
      this.assignToCurrentUser(item);
      if (update) update(item);
    });
  }

  public createMonitoringReportQuestionSet(
    displayOrder: number,
    noOptions = 3,
    isActive = true,
  ): Repositories.ISalesforceMonitoringReportQuestions[] {
    return range(noOptions).map(() => this.createMonitoringReportQuestion(displayOrder, isActive, true));
  }

  public createMonitoringReportQuestion(
    displayOrder: number,
    isActive = true,
    isScored = true,
  ): Repositories.ISalesforceMonitoringReportQuestions {
    const seed = this.repositories.monitoringReportQuestions.Items.length + 1;
    const score =
      this.repositories.monitoringReportQuestions.Items.filter(x => x.Acc_DisplayOrder__c === displayOrder).length + 1;

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

  public createMonitoringReportHeader(
    project?: Repositories.ISalesforceProject,
    periodId = 1,
    update?: Partial<Repositories.ISalesforceMonitoringReportHeader>,
  ): Repositories.ISalesforceMonitoringReportHeader {
    const seed = this.repositories.monitoringReportHeader.Items.length + 1;

    if (!project) {
      project = this.createProject(x => {
        x.Acc_CurrentPeriodNumber__c = periodId;
        x.Acc_StartDate__c = "2000-01-01";
        x.Acc_EndDate__c = "2019-12-31";
      });
    }

    const format = "yyyy-MM-dd";

    const newHeader: Repositories.ISalesforceMonitoringReportHeader = {
      Id: "Report Header " + seed,
      Acc_MonitoringReportStatus__c: "Draft",
      MonitoringReportStatusName: "Draft",
      Acc_Project__c: project.Id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: DateTime.fromFormat("2020-01-01", format).toFormat(format),
      Acc_PeriodEndDate__c: DateTime.fromFormat("2020-04-01", format).toFormat(format),
      Acc_AddComments__c: "",
      LastModifiedDate: DateTime.local().toISO(),
    };

    if (update) {
      Object.assign(newHeader, update);
    }

    this.repositories.monitoringReportHeader.Items.push(newHeader);

    return newHeader;
  }

  public createMonitoringReportResponse(
    header?: Repositories.ISalesforceMonitoringReportHeader,
    question?: Repositories.ISalesforceMonitoringReportQuestions,
    update?: Partial<Repositories.ISalesforceMonitoringReportResponse>,
  ): Repositories.ISalesforceMonitoringReportResponse {
    header = header || this.createMonitoringReportHeader();
    question =
      question ||
      this.createMonitoringReportQuestion(
        this.repositories.monitoringReportQuestions.Items.reduce(
          (a, b) => (a > b.Acc_DisplayOrder__c ? a : b.Acc_DisplayOrder__c),
          0,
        ),
      );

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

  public createMonitoringReportStatusChange(
    header?: Repositories.ISalesforceMonitoringReportHeader,
  ): Repositories.ISalesforceMonitoringReportStatusChange {
    header = header || this.createMonitoringReportHeader();

    const seed = this.repositories.monitoringReportStatusChange.Items.length + 1;
    const response: Repositories.ISalesforceMonitoringReportStatusChange = {
      Id: `StatusChange: ${seed}`,
      Acc_MonitoringReport__c: header.Id,
      Acc_PreviousMonitoringReportStatus__c: "Draft",
      Acc_NewMonitoringReportStatus__c: "Submitted to Monitoring Officer",
      Acc_CreatedByAlias__c: "The Beast from The Chase",
      CreatedDate: DateTime.local().toISO(),
      Acc_ExternalComment__c: "Test comment",
    };

    this.repositories.monitoringReportStatusChange.Items.push(response);

    return response;
  }

  public createClaim(
    partner?: Entities.Partner,
    periodId?: number,
    update?: (item: Repositories.ISalesforceClaim) => void,
  ): Repositories.ISalesforceClaim {
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
        Id: partner.id,
        Acc_OverheadRate__c: 0,
        Acc_ProjectId__c: partner.projectId,
        Acc_ProjectRole__c: partner.projectRole,
        Acc_AccountId__r: {
          Name: partner.name,
        },
      },
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
      Acc_ApprovedDate__c: null,
      Acc_PCF_Status__c: "",
      Acc_IAR_Status__c: "",
      Acc_ClaimStatus__c: ClaimStatus.DRAFT,
      ClaimStatusLabel: ClaimStatus.DRAFT,
      Acc_ReasonForDifference__c: null,
      Acc_ProjectPeriodCost__c: 100,
      Acc_PaidDate__c: null,
      Acc_TotalCostsApproved__c: 100,
      Acc_TotalCostsSubmitted__c: 100,
      Acc_TotalGrantApproved__c: 100,
      LastModifiedDate: "2018-03-04T12:00:00.000+00",
      Acc_IARRequired__c: false,
      Acc_FinalClaim__c: false,
      Acc_PeriodCoststobePaid__c: 100,
      Acc_TotalDeferredAmount__c: 100,
    };

    if (update) {
      update(newItem);
    }

    this.repositories.claims.Items.push(newItem);

    return newItem;
  }

  public createClaimDetail(
    project?: Repositories.ISalesforceProject,
    costCategory?: Entities.CostCategory,
    partner?: Entities.Partner,
    periodId?: number,
    update?: (item: Repositories.ISalesforceClaimDetails) => void,
  ): Repositories.ISalesforceClaimDetails {
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    project = project || this.createProject();
    periodId = periodId || 1;

    const newItem: Repositories.ISalesforceClaimDetails = {
      Id: `${partner.id}_${periodId}_${costCategory.id}`,
      Acc_CostCategory__c: costCategory.id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_ProjectParticipant__r: {
        Id: partner.id,
        Acc_ProjectId__c: project.Id,
      },
      Acc_PeriodCostCategoryTotal__c: 1000,
      Acc_ProjectPeriodStartDate__c: "2018-01-02",
      Acc_ProjectPeriodEndDate__c: "2018-03-04",
      Acc_ReasonForDifference__c: "comments",
      Acc_CreatedByMe__c: true,
    };

    if (update) {
      update(newItem);
    }
    this.repositories.claimDetails.Items.push(newItem);

    return newItem;
  }

  public createClaimLineItem(
    costCategory?: Entities.CostCategory,
    partner?: Entities.Partner,
    periodId?: number,
    update?: (item: Partial<Repositories.ISalesforceClaimLineItem>) => void,
  ): Repositories.ISalesforceClaimLineItem {
    const seed = this.repositories.claimLineItems.Items.length + 1;
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    periodId = periodId || 1;

    const newItem: Repositories.ISalesforceClaimLineItem = {
      Id: `ClaimLineItem-${seed}`,
      Acc_CostCategory__c: costCategory.id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_ProjectParticipant__c: partner.id,
      Acc_LineItemCost__c: 200,
      Acc_LineItemDescription__c: "We hired a person to do a thing",
      LastModifiedDate: "2018-03-04T12:00:00.000+00",
      RecordTypeId: "Claims Line Item",
    };

    if (update) {
      update(newItem);
    }

    this.repositories.claimLineItems.Items.push(newItem);

    return newItem;
  }

  public createClaimStatusChange(
    claim: Repositories.ISalesforceClaim,
    update?: Partial<Repositories.ISalesforceClaimStatusChange>,
  ): Repositories.ISalesforceClaimStatusChange {
    const seed = this.repositories.claimStatusChanges.Items.length + 1;
    const newItem: Repositories.ISalesforceClaimStatusChange = {
      Id: `ClaimStatusChange_${seed}`,
      Acc_Claim__c: claim.Id,
      Acc_PreviousClaimStatus__c: "Draft",
      Acc_NewClaimStatus__c: "Submitted",
      Acc_ExternalComment__c: "Comments",
      Acc_ParticipantVisibility__c: true,
      Acc_CreatedByAlias__c: "Generic username",
      CreatedDate: new Date().toISOString(),
    };

    Object.assign(newItem, update);

    this.repositories.claimStatusChanges.Items.push(newItem);

    return newItem;
  }

  public createProfileDetail(
    costCategory?: Entities.CostCategory,
    partner?: Entities.Partner,
    periodId?: number,
    update?: (item: Repositories.ISalesforceProfileDetails) => void,
  ): Repositories.ISalesforceProfileDetails {
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    periodId = periodId || 1;

    const seed = this.repositories.profileDetails.Items.length + 1;
    const newItem: Repositories.ISalesforceProfileDetails = {
      Id: `ProfileDetailsItem-${seed}`,
      Acc_CostCategory__c: costCategory.id,
      Acc_ProjectParticipant__c: partner.id,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_InitialForecastCost__c: 2000,
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
    title = "cat",
    fileType: string | null = "jpg",
    uploadedBy = "Catwoman",
    uploadedByPartnerName = "Hedge's Hedges Ltd",
    content = "",
    description?: string,
    update?: (item: ISalesforceDocument) => void,
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
      Description: description || null,
      Acc_LastModifiedByAlias__c: uploadedBy,
      Acc_UploadedByMe__c: false,
      CreatedDate: new Date().toISOString(),
      Owner: {
        Username: "aUserId",
      },
      LastModifiedBy: {
        Contact: {
          Account: {
            Name: uploadedByPartnerName,
          },
        },
      },
    };

    if (update) {
      update(item);
    }

    this.repositories.documents.Items.push([entityId, item]);
    return item;
  }

  public createProfileTotalCostCategory(
    costCategory?: Entities.CostCategory,
    partner?: Entities.Partner,
    golCost?: number,
    profileOverrideAwardRate?: number,
    update?: (item: Repositories.ISalesforceProfileTotalCostCategory) => void,
  ): Repositories.ISalesforceProfileTotalCostCategory {
    costCategory = costCategory || this.createCostCategory();
    partner = partner || this.createPartner();
    golCost = golCost || 100;

    const newItem: Repositories.ISalesforceProfileTotalCostCategory = {
      Acc_CostCategory__c: costCategory.id,
      Acc_CostCategory__r: {
        Acc_CostCategoryName__c: costCategory.name,
      },
      Acc_ProjectParticipant__c: partner.id,
      Acc_CostCategoryGOLCost__c: golCost,
      Id: this.repositories.profileTotalCostCategory.Items.length + 1 + "",
      Acc_OverrideAwardRate__c: profileOverrideAwardRate ?? costCategory.overrideAwardRate ?? null,
      Acc_ProfileOverrideAwardRate__c: profileOverrideAwardRate ?? null,
    };

    if (update) {
      update(newItem);
    }

    this.repositories.profileTotalCostCategory.Items.push(newItem);

    return newItem;
  }

  public createProfileTotalPeriod(
    partner?: Entities.Partner,
    periodId?: number,
    profileOverrideAwardRate?: number,
    update?: (item: Repositories.ISalesforceProfileTotalPeriod) => void,
  ): Repositories.ISalesforceProfileTotalPeriod {
    partner = partner || this.createPartner();

    const newItem: Repositories.ISalesforceProfileTotalPeriod = {
      Acc_PeriodLatestForecastCost__c: 100,
      Acc_ProjectParticipant__c: partner.id,
      Acc_ProjectPeriodNumber__c: periodId || 1,
      Acc_ProjectPeriodStartDate__c: "2020-08-01",
      Acc_ProjectPeriodEndDate__c: "2020-08-31",
      Acc_OverrideAwardRate__c: profileOverrideAwardRate ?? 14,
      Acc_ProfileOverrideAwardRate__c: profileOverrideAwardRate ?? 14,
      LastModifiedDate: new Date().toISOString(),
    };

    if (update) {
      update(newItem);
    }

    this.repositories.profileTotalPeriod.Items.push(newItem);

    return newItem;
  }

  public createFile(
    content = "Test File Content",
    fileName = "testFile.csv",
    description?: DocumentDescription,
  ): TestFileWrapper {
    return new TestFileWrapper(fileName, content, description);
  }

  public createRecordType(update?: Partial<Entities.RecordType>) {
    const seed = this.repositories.recordTypes.Items.length + 1;

    const newItem: Entities.RecordType = {
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
    return GetPCRItemTypesQuery.recordTypeMetaValues.map(x => {
      const parent = "Acc_ProjectChangeRequest__c";
      const existing = this.repositories.recordTypes.Items.find(r => r.parent === parent && r.type === x.typeName);
      return (
        existing ||
        this.createRecordType({
          parent,
          type: x.typeName,
        })
      );
    });
  }

  public createPCR(project?: Repositories.ISalesforceProject, update?: Partial<Entities.ProjectChangeRequestEntity>) {
    const seed = this.repositories.projectChangeRequests.Items.length + 1;

    project = project || this.createProject();

    const newItem: Entities.ProjectChangeRequestEntity = {
      id: `PCR_${seed}`,
      projectId: project.Id,
      comments: "",
      number: seed,
      status: PCRStatus.Unknown,
      statusName: PCRStatus[PCRStatus.Unknown],
      started: new Date(),
      updated: new Date(),
      reasoningStatus: PCRItemStatus.Complete,
      reasoning: "Test Reasoning",
      reasoningStatusName: PCRItemStatus[PCRItemStatus.Complete],
      items: [],
    };

    if (update) {
      Object.assign(newItem, update);
    }

    this.repositories.projectChangeRequests.Items.push(newItem);

    return newItem;
  }

  public createPCRItem(
    pcr?: Entities.ProjectChangeRequestEntity,
    recordType?: Entities.RecordType,
    update?: Partial<Entities.ProjectChangeRequestItemEntity>,
  ) {
    // id is total of pcr items
    const seed = this.repositories.projectChangeRequests.Items.reduce((c, x) => c + x.items.length, 0) + 1;
    pcr = pcr || this.createPCR();

    // find a record type that hasn't yet been used
    recordType = recordType || this.createPCRRecordTypes().find(x => pcr?.items.every(y => x.id !== y.recordTypeId));

    if (!recordType) {
      throw new Error("Unable to create pcr item as pcr already has all the record types");
    }

    const newItem: Entities.ProjectChangeRequestItemEntity = {
      id: `PCR_Item_${seed}`,
      pcrId: pcr.id,
      accountName: "",
      recordTypeId: recordType.id,
      projectId: pcr.projectId,
      typeOfAid: TypeOfAid.Unknown,
      offsetMonths: 0,
      projectDurationSnapshot: null,
      projectSummary: "",
      publicDescription: "",
      partnerId: "",
      status: PCRItemStatus.Complete,
      statusName: "Complete",
      suspensionStartDate: null,
      suspensionEndDate: null,
      projectSummarySnapshot: "",
      publicDescriptionSnapshot: "",
      partnerNameSnapshot: "",
      shortName: "",
      projectRole: PCRProjectRole.Unknown,
      partnerType: PCRPartnerType.Unknown,
      projectCity: "",
      projectPostcode: "",
      participantSize: PCRParticipantSize.Unknown,
      numberOfEmployees: null,
    };

    if (update) {
      Object.assign(newItem, update);
    }

    pcr.items.push(newItem);

    return newItem;
  }

  public async createPcrSpendProfile(options: {
    pcrItem?: Entities.ProjectChangeRequestItemEntity;
    costCategory?: Entities.CostCategory;
    update?: Partial<Entities.PcrSpendProfileEntityForCreate>;
  }): Promise<string[]> {
    const pcrItem = options.pcrItem ? options.pcrItem : this.createPCRItem();
    const costCategory = options.costCategory ? options.costCategory : this.createCostCategory();
    const newItem: Entities.PcrSpendProfileEntityForCreate = {
      value: 0,
      description: "",
      pcrItemId: pcrItem.id,
      costCategoryId: costCategory.id,
      ...options.update,
    };
    return this.repositories.pcrSpendProfile.insertSpendProfiles([newItem]);
  }

  public createProjectChangeRequestStatusChange(
    projectChangeRequest: Entities.ProjectChangeRequestEntity,
    participantVisibility: boolean,
  ): ProjectChangeRequestStatusChangeEntity {
    const seed = this.repositories.projectChangeRequestStatusChange.Items.length + 1;

    const response: ProjectChangeRequestStatusChangeEntity = {
      id: `StatusChange: ${seed}`,
      pcrId: projectChangeRequest.id,
      previousStatus: PCRStatus.Draft,
      newStatus: PCRStatus.SubmittedToMonitoringOfficer,
      createdBy: "Person A",
      createdDate: new Date(),
      externalComments: "This is a comment",
      participantVisibility,
    };

    this.repositories.projectChangeRequestStatusChange.Items.push(response);

    return response;
  }

  public createFinancialVirement(
    pcrItem: Entities.ProjectChangeRequestItemEntity,
    partner: Entities.Partner,
    update?: Partial<PartnerFinancialVirement>,
  ): PartnerFinancialVirement {
    const seed = this.repositories.financialVirements.Items.length + 1;
    const response: PartnerFinancialVirement = {
      id: `FinancialVirement: ${seed}`,
      pcrItemId: pcrItem.id,
      partnerId: partner.id,
      originalFundingLevel: 100,
      newFundingLevel: 100,
      virements: [],
      newRemainingGrant: undefined,
      newEligibleCosts: undefined,
      ...update,
    };

    this.repositories.financialVirements.Items.push(response);

    return response;
  }
}

export class TestFileWrapper implements IFileWrapper {
  constructor(public fileName: string, public content: string, public description?: DocumentDescription) {}

  public get size(): number {
    return (this.content && this.content.length) || 0;
  }
}
