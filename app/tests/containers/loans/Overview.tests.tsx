import { v4 as uuidv4 } from "uuid";
import { render } from "@testing-library/react";

import { TestBed, TestBedStore, TestBedContent } from "@shared/TestBed";
import { ILinkInfo, LoadingStatus, LoanDto } from "@framework/types";
import { LoansOverviewContainer, LoansOverviewContainerProps } from "@ui/containers/loans/overview";
import { Pending } from "@shared/pending";
import { LoanStatus } from "@framework/entities";

describe("<LoansOverviewContainer />", () => {
  const stubLink: ILinkInfo = {
    routeName: "stub-routename",
    routeParams: {},
    accessControl: () => false,
  };

  const stubProjectOverviewLink = jest.fn();

  const defaultProps = {
    projectId: "stub-projectId",
    routes: ({
      projectOverview: ({
        getLink: stubProjectOverviewLink.mockReturnValue(stubLink),
      } as unknown) as ILinkInfo,
      loansRequest: ({
        getLink: stubProjectOverviewLink.mockReturnValue(stubLink),
      } as unknown) as ILinkInfo,
    } as unknown) as LoansOverviewContainerProps["routes"],
  } as LoansOverviewContainerProps;

  const stubContent = {
    projectOverview: {
      backToProjects: { content: "stub-backToProjects" },
    },
    loansSummary: {
      loadingDrawdowns: { content: "stub-loadingDrawdowns" },
      rejectedDrawdownsError: { content: "stub-rejectedDrawdownsError" },
    },
  };

  const setup = (props?: LoansOverviewContainerProps, stores?: TestBedStore) =>
    render(
      <TestBed stores={stores} content={stubContent as TestBedContent}>
        <LoansOverviewContainer {...defaultProps} {...props} />
      </TestBed>,
    );

  const stubUnknownLoan: LoanDto = {
    id: uuidv4(),
    status: LoanStatus.UNKNOWN,
    period: 1,
    requestDate: new Date(Date.UTC(2021, 9, 1)),
    forecastAmount: 10000,
    amount: 10000,
    comments: "",
  };

  const createStubLoan = <T extends LoanStatus>(status: T): LoanDto => ({ ...stubUnknownLoan, status });

  const stubPlannedLoan = createStubLoan(LoanStatus.PLANNED);
  const stubApprovedLoan = createStubLoan(LoanStatus.APPROVED);
  const stubRequestedLoan = createStubLoan(LoanStatus.REQUESTED);

  describe("@returns", () => {
    test("with loading state", () => {
      const storeWithLoadingData = ({
        loans: {
          getAll: jest.fn().mockReturnValue(new Pending(LoadingStatus.Loading)),
        },
        projects: {
          getById: jest.fn().mockReturnValue(new Pending(LoadingStatus.Loading)),
        },
      } as unknown) as TestBedStore;

      const { queryByText } = setup(undefined, storeWithLoadingData);

      const loadingMessage = queryByText(stubContent.loansSummary.loadingDrawdowns.content);

      expect(loadingMessage).toBeInTheDocument();
    });

    test("with reject state", () => {
      const storeWithErrorData = ({
        loans: {
          getAll: jest.fn().mockReturnValue(new Pending(LoadingStatus.Failed)),
        },
        projects: {
          getById: jest.fn().mockReturnValue(new Pending(LoadingStatus.Failed)),
        },
      } as unknown) as TestBedStore;

      const { queryByText } = setup(undefined, storeWithErrorData);

      const rejectedMessage = queryByText(stubContent.loansSummary.rejectedDrawdownsError.content);

      expect(rejectedMessage).toBeInTheDocument();
    });

    describe("with resolved state", () => {
      describe("with loading message", () => {
        test("with no data", () => {
          const storeWithResolvedLoadingData = ({
            loans: {
              getAll: jest.fn().mockReturnValue(new Pending<LoanDto[]>(LoadingStatus.Loading, [])),
            },
            projects: {
              getById: jest.fn().mockReturnValue(new Pending(LoadingStatus.Loading, {})),
            },
          } as unknown) as TestBedStore;

          const { queryByText } = setup(undefined, storeWithResolvedLoadingData);

          const loanLoadingMessage = queryByText(stubContent.loansSummary.loadingDrawdowns.content);

          expect(loanLoadingMessage).toBeInTheDocument();
        });
      });

      test("renders correctly", () => {
        const storeWithResolvedData = ({
          loans: {
            getAll: jest.fn().mockReturnValue(
              new Pending<LoanDto[]>(LoadingStatus.Done, [stubApprovedLoan]),
            ),
          },
          projects: {
            getById: jest.fn().mockReturnValue(Pending.done({})),
          },
        } as unknown) as TestBedStore;

        const { queryByTestId } = setup(undefined, storeWithResolvedData);

        const loanTable = queryByTestId("drawdown-list");

        expect(loanTable).toBeInTheDocument();
      });

      describe("with intro message", () => {
        test("when another loan is available", () => {
          const storeWithResolvedData = ({
            loans: {
              getAll: jest.fn().mockReturnValue(Pending.done([stubApprovedLoan, stubRequestedLoan, stubPlannedLoan])),
            },
            projects: {
              getById: jest.fn().mockReturnValue(Pending.done({})),
            },
          } as unknown) as TestBedStore;

          const { queryByText } = setup(undefined, storeWithResolvedData);

          const loanIntroMessage = queryByText("You can request your next drawdown once drawdown 1 is approved.");

          expect(loanIntroMessage).toBeInTheDocument();
        });

        test("when requested the final loan", () => {
          const storeWithResolvedData = ({
            loans: {
              getAll: jest.fn().mockReturnValue(Pending.done([stubApprovedLoan, stubRequestedLoan])),
            },
            projects: {
              getById: jest.fn().mockReturnValue(Pending.done({})),
            },
          } as unknown) as TestBedStore;

          const { queryByText } = setup(undefined, storeWithResolvedData);

          const loanIntroMessage = queryByText(
            "Your last drawdown request has been received. It is currently being reviewed.",
          );

          expect(loanIntroMessage).toBeInTheDocument();
        });
      });
    });
  });
});
