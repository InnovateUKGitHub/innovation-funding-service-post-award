import { render } from "@testing-library/react";
import { TestBed, TestBedContent } from "@shared/TestBed";
import { ClaimStatus, ProjectRole, PartnerStatus, ProjectStatus } from "@framework/constants";
import { routeConfig } from "@ui/routing/routeConfig";

import { ClaimDetailsLink, ClaimDetailsLinkRoutes } from "@ui/components/claims/claimDetailsLink";

// TODO: This test data needs updating there are way too many "as any" overrides here...
describe("<ClaimDetailsLink />", () => {
  const partnerId = "a0B0Q000001eWRHUA2";
  const projectId = "a0C0Q000001uK5VUAU";

  const stubContent = {
    components: {
      claimDetailsLinkContent: {
        editClaimText: { content: "stub_editClaimText" },
        reviewClaimText: { content: "stub-reviewClaimText" },
        viewClaimText: { content: "stub-viewClaimText" },
      },
    },
  };

  type ClaimDetailsLinkWithoutRoutes = Omit<ClaimDetailsLinkRoutes, "routes">;

  const setup = (props: ClaimDetailsLinkWithoutRoutes) => {
    const defaultProps = {
      routes: routeConfig,
    };

    return render(
      <TestBed content={stubContent as TestBedContent}>
        <ClaimDetailsLink {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  describe("with edge cases", () => {
    test("when the project is on hold", () => {
      const projectStatus = ProjectStatus.OnHold;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: ClaimStatus.PAID },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: projectStatus },
        partner: {
          id: partnerId,
          roles: ProjectRole.FinancialContact,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });

    test("when the partner is on hold", () => {
      const partnerStatus = PartnerStatus.OnHold;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: ClaimStatus.PAID },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus, isWithdrawn: false },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });

    test("when the partner is withdrawn", () => {
      const partnerStatus = PartnerStatus.InvoluntaryWithdrawal;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: ClaimStatus.PAID },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus, isWithdrawn: true },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.DRAFT", () => {
    const draftClaimState = ClaimStatus.DRAFT;

    test("when partner is FC returns edit link", () => {
      const partnerRole = ProjectRole.FinancialContact;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: draftClaimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });

    test("when project is MO returns view link", () => {
      const projectRole = ProjectRole.MonitoringOfficer;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: draftClaimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: {
          id: partnerId,
          roles: ProjectRole.MonitoringOfficer,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });

    test("when project is not an FC and the partner is not MO returns view link", () => {
      const projectRole = ProjectRole.FinancialContact;
      const partnerRole = ProjectRole.MonitoringOfficer;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: draftClaimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { container } = setup(draftProps);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("when ClaimStatus.MO_QUERIED", () => {
    const moQueriedClaimState = ClaimStatus.MO_QUERIED;

    test("when partner FC returns edit link", () => {
      const partnerRole = ProjectRole.FinancialContact;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: moQueriedClaimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });

    test("when partner is not FC returns view link", () => {
      const partnerRole = ProjectRole.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: moQueriedClaimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.INNOVATE_QUERIED", () => {
    const innovateQueriedClaimState = ClaimStatus.INNOVATE_QUERIED;

    test("when partner FC returns edit link", () => {
      const partnerRole = ProjectRole.FinancialContact;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: innovateQueriedClaimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });

    test("when partner is not FC returns view link", () => {
      const partnerRole = ProjectRole.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: innovateQueriedClaimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active, isWithdrawn: false },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.SUBMITTED", () => {
    const submittedClaimState = ClaimStatus.SUBMITTED;

    test("when project role is MO returns view link", () => {
      const projectRole = ProjectRole.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: submittedClaimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: {
          id: partnerId,
          roles: ProjectRole.FinancialContact,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.reviewClaimText.content)).toBeInTheDocument();
    });

    test("when project role is not MO always returns view", () => {
      const projectRole = ProjectRole.FinancialContact;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: submittedClaimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: {
          id: partnerId,
          roles: ProjectRole.MonitoringOfficer,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.AWAITING_IAR", () => {
    const iarClaimState = ClaimStatus.AWAITING_IAR;

    test.each`
      name                                               | projectRole
      ${"when project role is MO returns view link"}     | ${ProjectRole.MonitoringOfficer}
      ${"when project role is not FC returns view link"} | ${ProjectRole.ProjectManager}
    `("$name", ({ projectRole }) => {
      const awaitingIarProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: iarClaimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: {
          id: partnerId,
          roles: ProjectRole.ProjectManager,
          partnerStatus: PartnerStatus.Active,
          isWithdrawn: false,
        },
      };

      const { queryByText } = setup(awaitingIarProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });
});
