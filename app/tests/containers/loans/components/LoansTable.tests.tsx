import { v4 as uuidv4 } from "uuid";
import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { LoansTable, LoansTableProps } from "@ui/containers/loans/components/LoansTable";
import { LoanDto } from "@framework/dtos";
import { LoanStatus } from "@framework/entities";
import { ILinkInfo } from "@framework/types";

describe("<LoansTable />", () => {
  const stubLink: ILinkInfo = {
    routeName: "stub-routename",
    routeParams: {},
    accessControl: () => false,
  };

  const stubCreateLinkFn = jest.fn().mockReturnValue(stubLink);

  const defaultProps: LoansTableProps = {
    items: [],
    createLink: stubCreateLinkFn,
  };

  const setup = (props?: Partial<LoansTableProps>) =>
    render(
      <TestBed>
        <LoansTable {...defaultProps} {...props} />
      </TestBed>,
    );

  beforeEach(jest.clearAllMocks);

  describe("@returns", () => {
    const stubLoanItem: LoanDto = {
      id: uuidv4(),
      status: LoanStatus.REQUESTED,
      period: 1,
      requestDate: new Date(Date.UTC(2021, 9, 1)),
      amount: 10000,
      comments: "",
    };

    test("with empty items", () => {
      const { container } = setup();

      const loanRows = container.querySelectorAll(".loan-table_row");

      expect(loanRows).toHaveLength(0);
    });

    test("with single item defined", () => {
      const stubItem: LoanDto = {
        id: uuidv4(),
        status: LoanStatus.PLANNED,
        period: 1,
        requestDate: new Date(Date.UTC(2021, 9, 1)),
        amount: 10000,
        comments: "This is a test comment for period 1\r\n\r\n45345456\r\n\r\n!@£$%^&*()",
      };

      const { container, queryByText } = setup({ items: [stubItem] });

      const loanRows = container.querySelectorAll(".loan-table_row");

      expect(loanRows).toHaveLength(1);

      const firstItemPeriodId = queryByText("1");
      const firstItemRequestedDate = queryByText("01/10/2021");
      const firstItemAmount = queryByText("£10,000");
      const firstItemStatus = queryByText("Planned");

      expect(firstItemPeriodId).toBeInTheDocument();
      expect(firstItemRequestedDate).toBeInTheDocument();
      expect(firstItemAmount).toBeInTheDocument();
      expect(firstItemStatus).toBeInTheDocument();
    });

    test("with multiple items defined", () => {
      const stubFirstItem: LoanDto = {
        id: uuidv4(),
        status: LoanStatus.REQUESTED,
        period: 1,
        requestDate: new Date(Date.UTC(2021, 9, 1)),
        amount: 10000,
        comments: "This is a test comment for period 1\r\n\r\n45345456\r\n\r\n!@£$%^&*()",
      };

      const stubSecondItem: LoanDto = {
        id: uuidv4(),
        status: LoanStatus.PLANNED,
        period: 2,
        requestDate: new Date(Date.UTC(2021, 7, 1)),
        amount: 11000,
        comments: "",
      };

      const { container, queryByText } = setup({ items: [stubFirstItem, stubSecondItem] });

      const loanRows = container.querySelectorAll(".loan-table_row");

      expect(loanRows).toHaveLength(2);

      const secondItemPeriodId = queryByText("2");
      const secondItemRequestedDate = queryByText("01/08/2021");
      const secondItemAmount = queryByText("£11,000");
      const secondItemStatus = queryByText("Planned");

      expect(secondItemPeriodId).toBeInTheDocument();
      expect(secondItemRequestedDate).toBeInTheDocument();
      expect(secondItemAmount).toBeInTheDocument();
      expect(secondItemStatus).toBeInTheDocument();
    });

    describe("with row classNames", () => {
      test.each`
        name                          | expectedClassName                | stubLoan
        ${"with locked styling"}      | ${"loan-table_row--locked"}      | ${{ ...stubLoanItem, status: LoanStatus.APPROVED }}
        ${"with available styling"}   | ${"loan-table_row--available"}   | ${{ ...stubLoanItem, status: LoanStatus.PLANNED }}
        ${"with unavailable styling"} | ${"loan-table_row--unavailable"} | ${{ ...stubLoanItem, status: LoanStatus.REQUESTED }}
        ${"when unknown status"}      | ${"loan-table_row--locked"}      | ${{ ...stubLoanItem, status: LoanStatus.UNKNOWN }}
      `("$name", ({ expectedClassName, stubLoan }) => {
        const { container } = setup({ items: [stubLoan] });

        const loanRowClass = container.querySelector(".loan-table_row");
        const expectedStyledElement = container.querySelector(`.${expectedClassName}`);

        expect(loanRowClass).toBeInTheDocument();
        expect(expectedStyledElement).toBeInTheDocument();
      });
    });
  });

  describe("@events", () => {
    test("with no call to createLink as status is not 'PLANNED'", () => {
      const stubItem: LoanDto = {
        id: uuidv4(),
        status: LoanStatus.REQUESTED,
        period: 1,
        requestDate: new Date(Date.UTC(2021, 7, 1)),
        amount: 11000,
        comments: "",
      };

      const stubPlannedLinkFn = jest.fn().mockReturnValue(stubLink);

      const { queryByText } = setup({
        createLink: stubPlannedLinkFn,
        items: [stubItem],
      });

      const secondItemStatus = queryByText("Planned");
      expect(secondItemStatus).not.toBeInTheDocument();

      expect(stubPlannedLinkFn).toHaveBeenCalledTimes(0);
    });

    test("calls createLink with planned loan id", () => {
      const stubIdToBeCalled = "stub-id-to-be-called";

      const stubItem: LoanDto = {
        id: stubIdToBeCalled,
        status: LoanStatus.PLANNED,
        period: 1,
        requestDate: new Date(Date.UTC(2021, 7, 1)),
        amount: 11000,
        comments: "",
      };

      const stubPlannedLinkFn = jest.fn().mockReturnValue({
        ...stubLink,
        routeName: "stub-planned-routename",
      });

      const { queryByText } = setup({
        createLink: stubPlannedLinkFn,
        items: [stubItem],
      });

      const secondItemStatus = queryByText("Planned");
      expect(secondItemStatus).toBeInTheDocument();

      expect(stubPlannedLinkFn).toHaveBeenCalledTimes(1);
      expect(stubPlannedLinkFn).toHaveBeenCalledWith(stubIdToBeCalled);
    });
  });
});
