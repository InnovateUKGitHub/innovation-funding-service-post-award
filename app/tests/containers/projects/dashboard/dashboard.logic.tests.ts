import {
  generateFilteredProjects,
  getPartnerOnProject,
  getProjectSection,
} from "@ui/containers/projects/dashboard/dashboard.logic";
import {
  BankCheckStatus,
  BankDetailsTaskStatus,
  ClaimFrequency,
  PartnerClaimStatus,
  PartnerDto,
  PartnerStatus,
  ProjectDto,
  ProjectRole,
  ProjectStatus,
  SpendProfileStatus,
} from "@framework/dtos";

const validPartnerId = "stub-valid-id";

const stubProject: ProjectDto = {
  id: validPartnerId,
  title: "stub-title",
  startDate: new Date(),
  endDate: new Date(),
  summary: "stub-summary",
  description: "stub-description",
  applicationUrl: null,
  grantOfferLetterUrl: null,
  projectNumber: "stub-projectNumber",
  leadPartnerName: "stub-leadPartnerName",

  claimFrequency: ClaimFrequency.Unknown,
  claimFrequencyName: "stub-claimFrequencyName",
  competitionType: "stub-competitionType",

  isPastEndDate: false,
  periodId: 1,
  periodStartDate: null,
  periodEndDate: null,

  pcrsQueried: 0,
  pcrsToReview: 0,

  grantOfferLetterCosts: 0,
  costsClaimedToDate: 0,
  claimedPercentage: null,

  roles: ProjectRole.FinancialContact,
  roleTitles: ["stub-roleTitles"],

  status: ProjectStatus.Live,
  statusName: "stub-statusName",
  claimsToReview: 0,
  claimsOverdue: 0,
  claimsWithParticipant: 0,
  numberOfOpenClaims: 0,
  durationInMonths: 0,
  numberOfPeriods: 0,
};

const stubProjectStatusUnknown: ProjectDto = {
  ...stubProject,
  status: ProjectStatus.Unknown,
};

const stubProjectStatusTerminated: ProjectDto = {
  ...stubProject,
  status: ProjectStatus.Terminated,
};

const stubPartner: PartnerDto = {
  id: "stub-id",
  type: "stub-type",

  postcode: "stub-postcode",
  isLead: true,
  isWithdrawn: false,
  projectRoleName: "stub-projectRoleName",
  projectId: validPartnerId,
  accountId: "stub-accountId",
  name: "stub-name",
  organisationType: "stub-organisationType",
  competitionType: "stub-competitionType",
  totalParticipantGrant: null,
  totalParticipantCostsClaimed: null,
  totalPaidCosts: null,
  awardRate: null,
  percentageParticipantCostsClaimed: null,
  capLimit: null,
  totalFutureForecastsForParticipants: null,
  totalCostsSubmitted: null,
  roles: ProjectRole.FinancialContact,
  forecastLastModifiedDate: null,
  claimsOverdue: null,
  claimsWithParticipant: null,
  claimStatus: PartnerClaimStatus.Unknown,
  statusName: "stub-statusName",
  totalCostsAwarded: null,
  auditReportFrequencyName: "stub-auditReportFrequencyName",
  totalPrepayment: null,
  partnerStatus: PartnerStatus.Unknown,
  partnerStatusLabel: "stub-partnerStatusLabel",
  percentageParticipantCostsSubmitted: null,
  totalFundingDueToReceive: null,
  totalGrantApproved: null,
  remainingParticipantGrant: null,

  overheadRate: null,
  newForecastNeeded: null,
  spendProfileStatus: SpendProfileStatus.Unknown,
  spendProfileStatusLabel: null,
  bankDetailsTaskStatus: BankDetailsTaskStatus.Unknown,
  bankDetailsTaskStatusLabel: null,
  bankCheckStatus: BankCheckStatus.Unknown,

  // Bank details checks
  bankDetails: {
    companyNumber: null,
    sortCode: null,
    accountNumber: null,
    firstName: null,
    lastName: null,
    address: {
      accountPostcode: null,
      accountStreet: null,
      accountBuilding: null,
      accountLocality: null,
      accountTownOrCity: null,
    },
  },
  bankCheckRetryAttempts: 0,
  validationResponse: {
    validationCheckPassed: false,
    iban: null,
    validationConditionsSeverity: null,
    validationConditionsCode: null,
    validationConditionsDesc: null,
  },
  verificationResponse: {
    personalDetailsScore: null,
    addressScore: null,
    companyNameScore: null,
    regNumberScore: null,
    verificationConditionsSeverity: null,
    verificationConditionsCode: null,
    verificationConditionsDesc: null,
  },

  isNonFunded: false,
};

const stubPartnerOpenClaims: PartnerDto = {
  ...stubPartner,
  claimStatus: PartnerClaimStatus.ClaimSubmitted,
};

const stubPartnerStatusPending: PartnerDto = {
  ...stubPartner,
  partnerStatus: PartnerStatus.Pending,
  roles: ProjectRole.FinancialContact,
};

const createStubData = (uid: string, project: ProjectDto, partner: PartnerDto): [ProjectDto, PartnerDto] => [
  {
    ...project,
    id: uid,
  },
  {
    ...partner,
    projectId: uid,
  },
];

// tslint:disable: no-duplicate-string no-big-function
describe("generateFilteredProjects()", () => {
  describe("returns totalProjects", () => {
    test.each`
      name               | stubProjects
      ${"no projects"}   | ${[]}
      ${"one project"}   | ${[stubProject]}
      ${"two projects"}  | ${[stubProject, stubProject]}
      ${"many projects"} | ${[stubProject, stubProject, stubProject]}
    `("returns with $name", ({ stubProjects }) => {
      const { totalProjects } = generateFilteredProjects(stubProjects, [stubPartner]);

      expect(totalProjects).toBe(stubProjects.length);
    });
  });

  describe("returns curatedProjects", () => {
    describe("with open", () => {
      test("should return a single project with open state", () => {
        const [stubOpenProject, stubOpenPartner] = createStubData("open-id", stubProject, stubPartnerOpenClaims);

        const stubProjects = [stubOpenProject];
        const stubPartners = [stubOpenPartner];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        const [firstOpenProject] = curatedProjects.open;

        expect(firstOpenProject).toStrictEqual({
          project: stubProjects[0],
          partner: stubPartners[0],
          projectSection: "open",
        });

        // Assert that no other projects get populated
        expect(curatedProjects.archived).toStrictEqual([]);
        expect(curatedProjects.pending).toStrictEqual([]);
        expect(curatedProjects.upcoming).toStrictEqual([]);
      });

      test("should return a single project with awaiting state", () => {
        const stubPartnerNoClaims = {
          ...stubPartner,
          claimStatus: PartnerClaimStatus.NoClaimsDue,
        };
        const stubProjects = [stubProject];
        const stubPartners = [stubPartnerNoClaims];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        const [firstOpenProject] = curatedProjects.open;

        expect(firstOpenProject).toStrictEqual({
          project: stubProjects[0],
          partner: stubPartners[0],
          projectSection: "awaiting",
        });

        // Note: We coerce this section to open, need to check this registers the project we sent in.
        expect(curatedProjects.open.length).toStrictEqual(1);

        // Assert that no other projects get populated
        expect(curatedProjects.archived).toStrictEqual([]);
        expect(curatedProjects.pending).toStrictEqual([]);
        expect(curatedProjects.upcoming).toStrictEqual([]);
      });

      test("should return multiple projects", () => {
        const stubProjects = [stubProject, stubProject];
        const stubPartners = [stubPartnerOpenClaims, stubPartnerOpenClaims];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        expect(curatedProjects.open.length).toBe(2);
      });
    });

    describe("with pending", () => {
      test("should return a single project", () => {
        const [stubPendingProject, stubPendingPartner] = createStubData(
          "pending-id",
          stubProject,
          stubPartnerStatusPending,
        );

        const stubProjects = [stubPendingProject];
        const stubPartners = [stubPendingPartner];

        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        const [firstOpenProject] = curatedProjects.pending;

        expect(firstOpenProject).toStrictEqual({
          project: stubProjects[0],
          partner: stubPartners[0],
          projectSection: "pending",
        });

        // Assert that no other projects get populated
        expect(curatedProjects.open).toStrictEqual([]);
        expect(curatedProjects.archived).toStrictEqual([]);
        expect(curatedProjects.upcoming).toStrictEqual([]);
      });

      test("should return multiple projects", () => {
        const stubProjects = [stubProject, stubProject];
        const stubPartners = [stubPartnerStatusPending, stubPartnerStatusPending];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        expect(curatedProjects.pending.length).toBe(2);
      });
    });

    describe("with upcoming", () => {
      test("should return a single project", () => {
        const [stubUpComingProject, stubUpComingPartner] = createStubData(
          "upcoming-id",
          stubProjectStatusUnknown,
          stubPartnerStatusPending,
        );

        const stubProjects = [stubUpComingProject];
        const stubPartners = [stubUpComingPartner];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        const [firstOpenProject] = curatedProjects.pending;
        expect(firstOpenProject).toStrictEqual({
          project: stubProjects[0],
          partner: stubPartners[0],
          projectSection: "pending",
        });

        // Assert that no other projects get populated
        expect(curatedProjects.upcoming).toStrictEqual([]);
        expect(curatedProjects.open).toStrictEqual([]);
        expect(curatedProjects.archived).toStrictEqual([]);
      });

      test("should return multiple projects", () => {
        const stubProjects = [stubProjectStatusUnknown, stubProjectStatusUnknown];
        const stubPartners = [stubPartnerStatusPending, stubPartnerStatusPending];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        expect(curatedProjects.pending.length).toBe(2);
      });
    });

    describe("with archived", () => {
      test("should return a single project", () => {
        const [stubArchivedProject, stubArchivedPartner] = createStubData(
          "archived-id",
          stubProjectStatusTerminated,
          stubPartner,
        );

        const stubProjects = [stubArchivedProject];
        const stubPartners = [stubArchivedPartner];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        const [firstOpenProject] = curatedProjects.archived;
        expect(firstOpenProject).toStrictEqual({
          project: stubProjects[0],
          partner: stubPartners[0],
          projectSection: "archived",
        });

        // Assert that no other projects get populated
        expect(curatedProjects.upcoming).toStrictEqual([]);
        expect(curatedProjects.open).toStrictEqual([]);
        expect(curatedProjects.pending).toStrictEqual([]);
      });

      test("should return multiple projects", () => {
        const stubProjects = [stubProjectStatusTerminated, stubProjectStatusTerminated];
        const stubPartners = [stubPartner, stubPartner];
        const { curatedProjects } = generateFilteredProjects(stubProjects, stubPartners);

        expect(curatedProjects.archived.length).toBe(2);
      });
    });
  });

  describe("returns curatedTotals", () => {
    test("should return 1 project in each section totalling 4", () => {
      // Note: No block ignore available with prettier currently
      // prettier-ignore
      const [openProject, openPartner] = createStubData("stub-open", stubProject, stubPartnerOpenClaims);
      // prettier-ignore
      const [pendingProject, pendingPartner] = createStubData("stub-pending", stubProject, stubPartnerStatusPending);
      // prettier-ignore
      const [upComingProject, upComingPartner] = createStubData("stub-upcoming", stubProjectStatusUnknown, stubPartner);
      // prettier-ignore
      const [archivedProject, archivedPartner] = createStubData("stub-archived", stubProjectStatusTerminated, stubPartner);

      const stubData: [ProjectDto[], PartnerDto[]] = [
        [openProject, pendingProject, upComingProject, archivedProject],
        [openPartner, pendingPartner, upComingPartner, archivedPartner],
      ];

      const { curatedTotals } = generateFilteredProjects(...stubData);

      expect(curatedTotals.open).toBe(1);
      expect(curatedTotals.pending).toBe(1);
      expect(curatedTotals.upcoming).toBe(1);
      expect(curatedTotals.archived).toBe(1);
    });
  });
});

describe("getPartnerOnProject()", () => {
  describe("@returns", () => {
    describe("with no matching partner", () => {
      test("when no matching partner matches a project", () => {
        const stubPartnerNoMatchingProjectId: PartnerDto = {
          ...stubPartner,
          projectId: "this-should-never-match",
        };

        const expectedPartner = getPartnerOnProject(stubProject, [stubPartnerNoMatchingProjectId]);

        expect(expectedPartner).toBeUndefined();
      });

      test("when a partner is not a lead", () => {
        const stubProjectIsPm: ProjectDto = {
          ...stubProject,
          roles: ProjectRole.ProjectManager,
        };

        const stubPartnerNoLeadNoRole = {
          ...stubPartner,
          isLead: false,
          roles: ProjectRole.ProjectManager,
        };

        // prettier-ignore
        const [stubProjectNoPm, noMatchingPartner] = createStubData("not-lead-is-pm", stubProjectIsPm, stubPartnerNoLeadNoRole);

        const expectedPartner = getPartnerOnProject(stubProjectNoPm, [noMatchingPartner]);

        expect(expectedPartner).toBeUndefined();
      });

      test("when a partner is not an fc", () => {
        const stubProjectNotPm: ProjectDto = {
          ...stubProject,
          roles: ProjectRole.Unknown,
        };

        const stubPartnerAsMo = {
          ...stubPartner,
          roles: ProjectRole.Unknown,
        };

        // prettier-ignore
        const [stubProjectNoValidRole, noMatchingPartner] = createStubData("is-mo", stubProjectNotPm, stubPartnerAsMo);

        const expectedPartner = getPartnerOnProject(stubProjectNoValidRole, [noMatchingPartner]);

        expect(expectedPartner).toBeUndefined();
      });
    });

    describe("with a valid partner", () => {
      test("when a partner is a lead", () => {
        const stubProjectIsPm: ProjectDto = {
          ...stubProject,
          roles: ProjectRole.ProjectManager,
        };

        const stubPartnerNoLeadNoRole = {
          ...stubPartner,
          isLead: true,
          roles: ProjectRole.ProjectManager,
        };

        // prettier-ignore
        const [stubProjectNoPm, matchingPartner] = createStubData("is-lead-is-pm", stubProjectIsPm, stubPartnerNoLeadNoRole);

        const expectedPartner = getPartnerOnProject(stubProjectNoPm, [matchingPartner]);

        expect(expectedPartner).toBeDefined();
      });

      test("when a partner is an fc", () => {
        const stubProjectIsPm: ProjectDto = {
          ...stubProject,
          roles: ProjectRole.FinancialContact,
        };

        const stubPartnerHasValidRole = {
          ...stubPartner,
          roles: ProjectRole.FinancialContact,
        };

        // prettier-ignore
        const [stubProjectNoPm, matchingPartner] = createStubData("not-pm-has-valid-partner-role", stubProjectIsPm, stubPartnerHasValidRole);

        const expectedPartner = getPartnerOnProject(stubProjectNoPm, [matchingPartner]);

        expect(expectedPartner).toBeDefined();
      });
    });
  });
});

describe("getProjectSection()", () => {
  // Note: Some scenarios are repetitive with different ProjectStatus types
  const describeEach: [string, ProjectStatus][] = [
    ["when status is Live", ProjectStatus.Live],
    ["when status is FinalClaim", ProjectStatus.FinalClaim],
    ["when status is OnHold", ProjectStatus.OnHold],
  ];

  describe("@returns", () => {
    describe("with upcoming", () => {
      test("when no valid status set", () => {
        const stubProjectNoStatus: ProjectDto = {
          ...stubProject,
          status: ProjectStatus.Unknown,
        };
        const section = getProjectSection(stubProjectNoStatus);

        expect(section).toBe("upcoming");
      });

      describe.each(describeEach)("%s", (_name, statusType) => {
        test("when periodId is 0", () => {
          const stubProjectNoStatus: ProjectDto = {
            ...stubProject,
            status: statusType,
            periodId: 0,
          };
          const section = getProjectSection(stubProjectNoStatus);

          expect(section).toBe("upcoming");
        });

        test("when default condition is returned", () => {
          const stubProjectNoStatus: ProjectDto = {
            ...stubProject,
            roles: ProjectRole.Unknown,
            status: statusType,
            periodId: 1,
          };

          const section = getProjectSection(stubProjectNoStatus);

          expect(section).toBe("upcoming");
        });
      });
    });

    describe("with archived", () => {
      test.each`
        name                           | project                                 | partner | expectedSection
        ${"when status is closed"}     | ${{ status: ProjectStatus.Closed }}     | ${{}}   | ${"archived"}
        ${"when status is terminated"} | ${{ status: ProjectStatus.Terminated }} | ${{}}   | ${"archived"}
      `("$name", ({ project, partner, expectedSection }) => {
        const section = getProjectSection(project, partner);

        expect(section).toBe(expectedSection);
      });
    });

    describe("with open", () => {
      describe.each(describeEach)("%s", (_name, statusType) => {
        test("when total claims is above 0", () => {
          const stubOpenProject: ProjectDto = {
            ...stubProject,
            status: statusType,
            roles: ProjectRole.ProjectManager,
            numberOfOpenClaims: 1,
          };

          const section = getProjectSection(stubOpenProject);

          expect(section).toBe("open");
        });

        test("when parter role is FC and partner has claims due", () => {
          const stubOpenProject: ProjectDto = {
            ...stubProject,
            status: statusType,
            roles: ProjectRole.FinancialContact,
          };

          const stubClaimsDuePartner: PartnerDto = {
            ...stubPartner,
            claimStatus: PartnerClaimStatus.ClaimDue,
          };

          const section = getProjectSection(stubOpenProject, stubClaimsDuePartner);

          expect(section).toBe("open");
        });
      });
    });

    describe("with awaiting", () => {
      describe.each(describeEach)("%s", (_name, statusType) => {
        test("when no claims are open", () => {
          const stubAwaitingProject: ProjectDto = {
            ...stubProject,
            status: statusType,
            roles: ProjectRole.ProjectManager,
            numberOfOpenClaims: 0,
          };

          const section = getProjectSection(stubAwaitingProject);

          expect(section).toBe("awaiting");
        });

        test("when partner role is FC and partner and claimStatus has no claims due", () => {
          const stubOpenProject: ProjectDto = {
            ...stubProject,
            status: statusType,
            roles: ProjectRole.FinancialContact,
          };

          const stubNoClaimsDuePartner: PartnerDto = {
            ...stubPartner,
            claimStatus: PartnerClaimStatus.NoClaimsDue,
          };

          const section = getProjectSection(stubOpenProject, stubNoClaimsDuePartner);

          expect(section).toBe("awaiting");
        });
      });
    });
  });
});
