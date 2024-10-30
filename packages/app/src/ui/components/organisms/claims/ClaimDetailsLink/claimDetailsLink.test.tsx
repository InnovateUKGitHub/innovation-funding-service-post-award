import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { routeConfig } from "@ui/routing/routeConfig";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { PartnerStatus } from "@framework/constants/partner";
import { ProjectStatus, ProjectRolePermissionBits } from "@framework/constants/project";
import { ClaimDetailsLinkRoutes, ClaimDetailsLink } from "./claimDetailsLink";

// TODO: This test data needs updating there are way too many "as any" overrides here...
describe("<ClaimDetailsLink />", () => {
  const partnerId = "a0B0Q000001eWRHUA2" as PartnerId;
  const projectId = "a0C0Q000001uK5VUAU" as ProjectId;

  const stubContent = {
    components: {
      claimDetailsLinkContent: {
        editClaim: "stub_editClaimText",
        reviewClaim: "stub-reviewClaimText",
        viewClaim: "stub-viewClaimText",
      },
    },
  };

  type ClaimDetailsLinkWithoutRoutes = Omit<ClaimDetailsLinkRoutes, "routes">;

  const setup = (props: ClaimDetailsLinkWithoutRoutes) => {
    const defaultProps = {
      routes: routeConfig,
    };

    return render(
      <TestBed>
        <ClaimDetailsLink {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  const getMo = () => ({ isMo: true, isFc: false, isPm: false, isAssociate: false });
  const getFc = () => ({ isMo: false, isFc: true, isPm: false, isAssociate: false });
  const getPm = () => ({ isMo: false, isFc: false, isPm: true, isAssociate: false });

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  describe("with edge cases", () => {
    test("when the project is on hold", () => {
      const projectStatus = ProjectStatus.OnHold;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: ClaimStatus.PAID },
        project: {
          id: projectId,
          roles: getMo(),
          status: projectStatus,
          isActive: true,
        },
        partner: {
          id: partnerId,
          roles: ProjectRolePermissionBits.FinancialContact,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });

    test("when the partner is on hold", () => {
      const partnerStatus = PartnerStatus.OnHold;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: ClaimStatus.PAID },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: getFc(), partnerStatus, isWithdrawn: false },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });

    test("when the partner is withdrawn", () => {
      const partnerStatus = PartnerStatus.InvoluntaryWithdrawal;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: ClaimStatus.PAID },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: ProjectRolePermissionBits.FinancialContact, partnerStatus, isWithdrawn: true },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.DRAFT", () => {
    const draftClaimState = ClaimStatus.DRAFT;

    test("when partner is FC returns edit link", () => {
      const partnerRole = ProjectRolePermissionBits.FinancialContact;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: draftClaimState },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaim)).toBeInTheDocument();
    });

    test("when project is MO returns view link", () => {
      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: draftClaimState },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: {
          id: partnerId,
          roles: ProjectRolePermissionBits.MonitoringOfficer,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });

    test("when project is not an FC and the partner is not MO returns view link", () => {
      const partnerRole = ProjectRolePermissionBits.MonitoringOfficer;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: draftClaimState },
        project: { id: projectId, roles: getFc(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { container } = setup(draftProps);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("when ClaimStatus.MO_QUERIED", () => {
    const moQueriedClaimState = ClaimStatus.MO_QUERIED;

    test("when partner FC returns edit link", () => {
      const partnerRole = ProjectRolePermissionBits.FinancialContact;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: moQueriedClaimState },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaim)).toBeInTheDocument();
    });

    test("when partner is not FC returns view link", () => {
      const partnerRole = ProjectRolePermissionBits.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: moQueriedClaimState },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.INNOVATE_QUERIED", () => {
    const innovateQueriedClaimState = ClaimStatus.INNOVATE_QUERIED;

    test("when partner FC returns edit link", () => {
      const partnerRole = ProjectRolePermissionBits.FinancialContact;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: innovateQueriedClaimState },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaim)).toBeInTheDocument();
    });

    test("when partner is not FC returns view link", () => {
      const partnerRole = ProjectRolePermissionBits.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: innovateQueriedClaimState },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.SUBMITTED", () => {
    const submittedClaimState = ClaimStatus.SUBMITTED;

    test("when project role is MO returns view link", () => {
      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: submittedClaimState },
        project: { id: projectId, roles: getMo(), status: ProjectStatus.Live, isActive: true },
        partner: {
          id: partnerId,
          roles: ProjectRolePermissionBits.FinancialContact,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.reviewClaim)).toBeInTheDocument();
    });

    test("when project role is not MO always returns view", () => {
      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: submittedClaimState },
        project: { id: projectId, roles: getFc(), status: ProjectStatus.Live, isActive: true },
        partner: {
          id: partnerId,
          roles: ProjectRolePermissionBits.MonitoringOfficer,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.AWAITING_IAR", () => {
    const iarClaimState = ClaimStatus.AWAITING_IAR;

    test.each`
      name                                               | projectRole
      ${"when project role is MO returns view link"}     | ${getMo()}
      ${"when project role is not FC returns view link"} | ${getPm()}
    `("$name", ({ projectRole }) => {
      const awaitingIarProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3 as PeriodId, status: iarClaimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live, isActive: true },
        partner: {
          id: partnerId,
          roles: ProjectRolePermissionBits.ProjectManager,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(awaitingIarProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaim)).toBeInTheDocument();
    });
  });
});
