import { render } from "@testing-library/react";

import TestBed from "@shared/TestBed";
import { ILinkInfo } from "@framework/types";
import { ForecastClaimAdvice, ForecastClaimAdviceProps } from "./ForecastClaimAdvice";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("<ForecastClaimAdvice />", () => {
  const stubContent = {
    pages: {
      forecastsComponents: {
        adviceMessage: "You must eat <0>lettuce</0> to proceed.",
      },
    },
  };

  const stubLink: ILinkInfo = {
    path: "stub-path",
    routeName: "stub-routeName",
    routeParams: {},
    accessControl: () => false,
  };

  const defaultProps: ForecastClaimAdviceProps = {
    claimLink: stubLink,
  };

  const setup = (props: ForecastClaimAdviceProps) =>
    render(
      <TestBed>
        <ForecastClaimAdvice {...defaultProps} {...props} />
      </TestBed>,
    );

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  describe("@content", () => {
    test("renders", () => {
      const { queryByTestId } = setup({ claimLink: stubLink });

      const forecastClaimAdvice = queryByTestId("forecastClaimAdvice");

      expect(forecastClaimAdvice).toBeInTheDocument();
      expect(forecastClaimAdvice).toMatchSnapshot();
    });
  });
});
