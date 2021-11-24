import { render } from "@testing-library/react";

import { TestBed, TestBedStore, TestBedContent } from "@shared/TestBed";
import { ILinkInfo, LoadingStatus } from "@framework/types";
import { LoansSummaryPage, LoansSummaryProps } from "@ui/containers/loans/overview";
import { Pending } from "@shared/pending";

describe("<LoansSummaryPage />", () => {
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
    } as unknown) as LoansSummaryProps["routes"],
  } as LoansSummaryProps;

  const stubContent = {
    projectOverview: {
      backToProjects: { content: "stub-backToProjects" },
    },
    loansSummary: {
      loadingDrawdowns: { content: "stub-loadingDrawdowns" },
      rejectedDrawdownsError: { content: "stub-rejectedDrawdownsError" },
    },
  };

  const setup = (props?: LoansSummaryProps, stores?: TestBedStore) =>
    render(
      <TestBed stores={stores} content={stubContent as TestBedContent}>
        <LoansSummaryPage {...defaultProps} {...props} />
      </TestBed>,
    );

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

    test("with resolved data", () => {
      const storeWithResolvedData = ({
        loans: {
          getAll: jest.fn().mockReturnValue(new Pending(LoadingStatus.Done, [])),
        },
        projects: {
          getById: jest.fn().mockReturnValue(new Pending(LoadingStatus.Done, {})),
        },
      } as unknown) as TestBedStore;

      const { queryByTestId } = setup(undefined, storeWithResolvedData);

      const loanTable = queryByTestId("drawdown-list");

      expect(loanTable).toBeInTheDocument();
    });
  });
});
