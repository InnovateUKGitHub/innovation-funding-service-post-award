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
        partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });

    test("when the partner is on hold", () => {
      const partnerStatus = PartnerStatus.OnHold;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: ClaimStatus.PAID },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.DRAFT", () => {
    const claimState = ClaimStatus.DRAFT;

    test("when partner is FC returns edit link", () => {
      const partnerRole = ProjectRole.FinancialContact;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });

    test("when project is MO returns view link", () => {
      const projectRole = ProjectRole.MonitoringOfficer;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: ProjectRole.MonitoringOfficer, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(draftProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });

    test("when project is not an FC and the partner is not MO returns view link", () => {
      const projectRole = ProjectRole.FinancialContact;
      const partnerRole = ProjectRole.MonitoringOfficer;

      const draftProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active },
      };

      const { container } = setup(draftProps);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("when ClaimStatus.MO_QUERIED", () => {
    const claimState = ClaimStatus.MO_QUERIED;

    test("when project role is MO returns view link", () => {
      const projectRole = ProjectRole.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });

    describe("when project role is not MO returns edit link", () => {
      test("when PM", () => {
        const projectRole = ProjectRole.ProjectManager;

        const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
          claim: { periodId: 3, status: claimState },
          project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
          partner: { id: partnerId, roles: ProjectRole.MonitoringOfficer, partnerStatus: PartnerStatus.Active },
        };

        const { queryByText } = setup(moQueriedProps);

        expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
      });

      test("when FC", () => {
        const projectRole = ProjectRole.FinancialContact;

        const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
          claim: { periodId: 3, status: claimState },
          project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
          partner: { id: partnerId, roles: ProjectRole.MonitoringOfficer, partnerStatus: PartnerStatus.Active },
        };

        const { queryByText } = setup(moQueriedProps);

        expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
      });
    });
  });

  describe("when ClaimStatus.INNOVATE_QUERIED", () => {
    const claimState = ClaimStatus.INNOVATE_QUERIED;

    test("when partner FC returns edit link", () => {
      const partnerRole = ProjectRole.FinancialContact;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });

    test("when partner is not FC returns view link", () => {
      const partnerRole = ProjectRole.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("when ClaimStatus.SUBMITTED", () => {
    const claimState = ClaimStatus.SUBMITTED;

    test("when project role is MO returns view link", () => {
      const projectRole = ProjectRole.MonitoringOfficer;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.reviewClaimText.content)).toBeInTheDocument();
    });

    test("when project role is not MO always returns view", () => {
      const projectRole = ProjectRole.FinancialContact;

      const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
        claim: { periodId: 3, status: claimState },
        project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
        partner: { id: partnerId, roles: ProjectRole.MonitoringOfficer, partnerStatus: PartnerStatus.Active },
      };

      const { queryByText } = setup(moQueriedProps);

      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  /* OLD CODE */

  // describe("as a monitoring officer when claim is submitted", () => {
  //   test("as review claim link", () => {
  //     const claimState = ClaimStatus.SUBMITTED;
  //     const projectRole = ProjectRole.MonitoringOfficer;

  //     const claimSubmittedProps: ClaimDetailsLinkWithoutRoutes = {
  //       claim: { periodId: 3, status: claimState },
  //       project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
  //       partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus: PartnerStatus.Active },
  //     };

  //     const { queryByText } = setup(claimSubmittedProps);

  //     expect(queryByText(stubContent.components.claimDetailsLinkContent.reviewClaimText.content)).toBeInTheDocument();
  //   });

  //   test("as review claim link when not an MO", () => {
  //     const claimState: ClaimStatus = ClaimStatus.SUBMITTED;
  //     const projectRole: ProjectRole = ProjectRole.FinancialContact;

  //     const claimSubmittedProps: ClaimDetailsLinkWithoutRoutes = {
  //       claim: { periodId: 3, status: claimState },
  //       project: { id: projectId, roles: projectRole, status: ProjectStatus.Live },
  //       partner: { id: partnerId, roles: ProjectRole.FinancialContact, partnerStatus: PartnerStatus.Active },
  //     };

  //     const { queryByText } = setup(claimSubmittedProps);

  //     expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
  //   });
  // });

  // describe("as an unknown role", () => {
  //   test("should render a View Claim link when claim is MO Queried", () => {
  //     const claimState: ClaimStatus = ClaimStatus.MO_QUERIED;
  //     const partnerRole: ProjectRole = ProjectRole.Unknown;

  //     const moQueriedProps: ClaimDetailsLinkWithoutRoutes = {
  //       claim: { periodId: 3, status: claimState },
  //       project: { id: projectId, roles: ProjectRole.FinancialContact, status: ProjectStatus.Live },
  //       partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active },
  //     };

  //     const { queryByText } = setup(moQueriedProps);

  //     expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
  //   });

  //   test("should render a View Claim link when claim is Innovate Queried", () => {
  //     const claimState: ClaimStatus = ClaimStatus.INNOVATE_QUERIED;
  //     const partnerRole: ProjectRole = ProjectRole.Unknown;

  //     const innovateQueriedProps: ClaimDetailsLinkWithoutRoutes = {
  //       claim: { periodId: 3, status: claimState },
  //       project: { id: projectId, roles: ProjectRole.FinancialContact, status: ProjectStatus.Live },
  //       partner: { id: partnerId, roles: partnerRole, partnerStatus: PartnerStatus.Active },
  //     };

  //     const { queryByText } = setup(innovateQueriedProps);

  //     expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
  //   });
  // });

  // describe.only("as a financial contact", () => {
  //   test.only("should render an Edit Claim link when claim is MO Queried", () => {
  //     const { queryByText } = setup({
  //       claim: { periodId: 3, status: ClaimStatus.MO_QUERIED },
  //       project: { id: projectId },
  //       partner: { id: partnerId, roles: ProjectRole.FinancialContact },
  //     });
  //     expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
  //   });

  //   test("should render an Edit Claim link when claim is Innovate Queried", () => {
  //     const { queryByText } = setup({
  //       claim: { periodId: 3, status: ClaimStatus.INNOVATE_QUERIED },
  //       project: { id: projectId },
  //       partner: { id: partnerId, roles: ProjectRole.FinancialContact },
  //     });
  //     expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
  //   });

  //   test("should render an Edit Claim link when claim is in draft", () => {
  //     const { queryByText } = setup({
  //       claim: { periodId: 3, status: ClaimStatus.DRAFT },
  //       project: { id: projectId },
  //       partner: { id: partnerId, roles: ProjectRole.FinancialContact },
  //     });
  //     expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
  //   });
  // });

  // test("should render a View Claim link by default", () => {
  //   const { queryByText } = setup({
  //     claim: { periodId: 3 },
  //     project: { id: projectId },
  //     partner: { id: partnerId },
  //   });
  //   expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
  // });

  // test("should render null if partner is someone other than a finance contact, and claim is in draft", () => {
  //   const { container } = setup({
  //     claim: { periodId: 3, status: ClaimStatus.DRAFT },
  //     project: { id: projectId },
  //     partner: { id: partnerId },
  //   });
  //   expect(container.firstChild).toBeNull();
  // });
});
