import { render } from "@testing-library/react";

import { TestBed, TestBedContent, TestBedStore } from "@shared/TestBed";
import { ClaimDrawdownTable, ClaimDrawdownTableProps } from "@ui/containers/claims/components/ClaimDrawdownTable";
import { LoanDto } from "@framework/dtos";
import { LoanStatus } from "@framework/entities";
import { createProjectDto } from "@framework/util/stubDtos";
import { Pending } from "@shared/pending";
import { LoadingStatus } from "@framework/constants";

describe("<ClaimDrawdownTable />", () => {
  const stubProject = createProjectDto({ competitionType: "LOANS" });

  const stubLoan: LoanDto = {
    id: "a0H3M0000002GRYUA2",
    status: LoanStatus.APPROVED,
    period: 1,
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
        message: { content: "stub-loading" },
      },
    },
  };

  const setup = (props?: Partial<ClaimDrawdownTableProps>, stubLoanQuery: Pending<any> = Pending.done(stubLoan)) => {
    const stubStore = {
      loans: {
        get: jest.fn().mockReturnValue(stubLoanQuery),
      },
    } as any;

    return render(
      <TestBed stores={stubStore as TestBedStore} content={stubContent as TestBedContent}>
        <ClaimDrawdownTable {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  describe("@returns", () => {
    test("with no UI when compeition is not LOANS", () => {
      const { container } = setup({ competitionType: "CR&D" });

      expect(container.firstChild).toBeNull();
    });

    test("with UI when compeition is LOANS", () => {
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
        const misingTotalsQuery = Pending.done({ ...stubLoan, totals: undefined });

        expect(() => setup(undefined, misingTotalsQuery)).toThrow("Loan totals must be available.");
      });

      test("with a default error", () => {
        const errorQuery = new Pending(LoadingStatus.Failed);

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
