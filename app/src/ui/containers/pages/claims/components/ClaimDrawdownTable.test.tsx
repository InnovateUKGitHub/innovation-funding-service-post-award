import { render } from "@testing-library/react";
import { TestBed, TestBedStore } from "@shared/TestBed";
import { ClaimDrawdownTable, ClaimDrawdownTableProps } from "@ui/containers/pages/claims/components/ClaimDrawdownTable";
import { createProjectDto } from "@framework/util/stubDtos";
import { Pending } from "@shared/pending";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { LoadingStatus } from "@framework/constants/enums";
import { LoanDto } from "@framework/dtos/loanDto";
import { LoanStatus } from "@framework/entities/loan-status";

describe("<ClaimDrawdownTable />", () => {
  const stubProject = createProjectDto({ competitionType: "LOANS" });

  const stubLoan: LoanDto = {
    id: "a0H3M0000002GRYUA2" as LoanId,
    status: LoanStatus.APPROVED,
    period: 1 as PeriodId,
    requestDate: new Date(Date.UTC(1, 10)),
    amount: 10000,
    forecastAmount: 10000,
    comments: "",
    totals: {
      totalLoan: 30000,
      totalPaidToDate: 6000,
      remainingLoan: 14000,
    },
  };

  const defaultProps: ClaimDrawdownTableProps = {
    competitionType: stubProject.competitionType,
    id: stubProject.id,
    requiredPeriod: stubLoan.period,
  };

  const stubContent = {
    components: {
      loading: {
        message: "stub-loading",
      },
    },
  };

  const setup = (
    props?: Partial<ClaimDrawdownTableProps>,
    stubLoanQuery: Pending<LoanDto | undefined> = Pending.done(stubLoan),
  ) => {
    const stubStore = {
      loans: {
        get: jest.fn().mockReturnValue(stubLoanQuery),
      },
    };

    return render(
      <TestBed stores={stubStore as unknown as TestBedStore}>
        <ClaimDrawdownTable {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  describe("@returns", () => {
    test("with no UI when competition is not LOANS", () => {
      const { container } = setup({ competitionType: "CR&D" });

      expect(container.firstChild).toBeNull();
    });

    test("with UI when competition is LOANS", () => {
      const validQuery = Pending.done(stubLoan);
      const { queryByTestId } = setup({ competitionType: "LOANS" }, validQuery);

      const claimDrawdownTable = queryByTestId("period-loan-table");

      expect(claimDrawdownTable).toMatchSnapshot();
    });

    test("with loading state", () => {
      const loadingQuery = new Pending(LoadingStatus.Loading, { ...stubLoan, totals: undefined });
      const { queryByTestId } = setup(undefined, loadingQuery);

      const loadingUI = queryByTestId("loading-message");

      expect(loadingUI).toBeInTheDocument();
    });

    test("when requiredPeriod could not be found", () => {
      const noLoanFoundQuery = new Pending(LoadingStatus.Failed, undefined, {
        message: "No loan found.",
      });
      const { container } = setup(undefined, noLoanFoundQuery);

      expect(container.firstChild).toBeNull();
    });

    describe("with an error", () => {
      // TODO: Figure out a better way to silencing console errors for thrown expect's...
      jest.spyOn(console, "error").mockImplementation(jest.fn);

      test("with no totals provided from query", () => {
        const missingTotalsQuery = Pending.done({ ...stubLoan, totals: undefined });

        expect(() => setup(undefined, missingTotalsQuery)).toThrow("Loan totals must be available.");
      });

      test("with a default error", () => {
        const errorQuery = new Pending<LoanDto>(LoadingStatus.Failed);

        expect(() => setup(undefined, errorQuery)).toThrow(
          "There was an error fetching data within ClaimDrawdownTable",
        );
      });

      test("with a thrown message", () => {
        const stubErrorMessage = "stub-error";
        const errorQuery = new Pending(LoadingStatus.Failed, undefined, { message: stubErrorMessage });

        expect(() => setup(undefined, errorQuery)).toThrow(stubErrorMessage);
      });

      test("with a throw error no message", () => {
        const errorQuery = new Pending(LoadingStatus.Failed, undefined, {});

        expect(() => setup(undefined, errorQuery)).toThrow(
          "There was an error fetching data within ClaimDrawdownTable",
        );
      });
    });
  });
});
