import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { ProjectRole } from "@framework/dtos";
import { ClaimStatus } from "@framework/constants";
import { routeConfig } from "@ui/routing/routeConfig";

import { ClaimDetailsLink, ClaimDetailsBaseProps } from "@ui/components/claims/claimDetailsLink";

// TODO: This test data needs updating there are way too many "as any" overrides here...
describe("<ClaimDetailsLink />", () => {
  const partnerId = "a0B0Q000001eWRHUA2";
  const projectId = "a0C0Q000001uK5VUAU";
  const claimId = "a050Q00000206gHQAQ";

  const stubContent = {
    components: {
      claimDetailsLinkContent: {
        editClaimText: { content: "stub_editClaimText" },
        reviewClaimText: { content: "stub-reviewClaimText" },
        viewClaimText: { content: "stub-viewClaimText" },
      },
    },
  };

  const setup = (props: ClaimDetailsBaseProps) =>
    render(
      <TestBed content={stubContent as TestBedContent}>
        <ClaimDetailsLink {...props} routes={routeConfig} />
      </TestBed>,
    );

  describe("as a monitoring officer", () => {
    test("should render a Review Claim link when claim is submitted", () => {
      const { queryByText } = setup({
        claim: { id: claimId, periodId: 3, status: ClaimStatus.SUBMITTED } as any,
        project: { id: projectId, roles: ProjectRole.MonitoringOfficer } as any,
        partner: { id: partnerId } as any,
      });

      expect(queryByText(stubContent.components.claimDetailsLinkContent.reviewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("as an unknown role", () => {
    test("should render a View Claim link when claim is MO Queried", () => {
      const { queryByText } = setup({
        claim: { id: claimId, periodId: 3, status: ClaimStatus.MO_QUERIED } as any,
        project: { id: projectId } as any,
        partner: { id: partnerId, roles: ProjectRole.Unknown } as any,
      });
      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });

    test("should render a View Claim link when claim is Innovate Queried", () => {
      const { queryByText } = setup({
        claim: { id: claimId, periodId: 3, status: ClaimStatus.INNOVATE_QUERIED } as any,
        project: { id: projectId } as any,
        partner: { id: partnerId, roles: ProjectRole.Unknown } as any,
      });
      expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
    });
  });

  describe("as a financial contact", () => {
    test("should render an Edit Claim link when claim is MO Queried", () => {
      const { queryByText } = setup({
        claim: { id: claimId, periodId: 3, status: ClaimStatus.MO_QUERIED } as any,
        project: { id: projectId } as any,
        partner: { id: partnerId, roles: ProjectRole.FinancialContact } as any,
      });
      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });

    test("should render an Edit Claim link when claim is Innovate Queried", () => {
      const { queryByText } = setup({
        claim: { id: claimId, periodId: 3, status: ClaimStatus.INNOVATE_QUERIED } as any,
        project: { id: projectId } as any,
        partner: { id: partnerId, roles: ProjectRole.FinancialContact } as any,
      });
      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });

    test("should render an Edit Claim link when claim is in draft", () => {
      const { queryByText } = setup({
        claim: { id: claimId, periodId: 3, status: ClaimStatus.DRAFT } as any,
        project: { id: projectId } as any,
        partner: { id: partnerId, roles: ProjectRole.FinancialContact } as any,
      });
      expect(queryByText(stubContent.components.claimDetailsLinkContent.editClaimText.content)).toBeInTheDocument();
    });
  });

  test("should render a View Claim link by default", () => {
    const { queryByText } = setup({
      claim: { id: claimId, periodId: 3 } as any,
      project: { id: projectId } as any,
      partner: { id: partnerId } as any,
    });
    expect(queryByText(stubContent.components.claimDetailsLinkContent.viewClaimText.content)).toBeInTheDocument();
  });

  test("should render null if partner is someone other than a finance contact, and claim is in draft", () => {
    const { container } = setup({
      claim: { id: claimId, periodId: 3, status: ClaimStatus.DRAFT } as any,
      project: { id: projectId } as any,
      partner: { id: partnerId } as any,
    });
    expect(container.firstChild).toBeNull();
  });
});
