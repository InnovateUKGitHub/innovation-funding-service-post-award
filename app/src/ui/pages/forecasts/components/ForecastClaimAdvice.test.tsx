import { render } from "@testing-library/react";

import TestBed from "@shared/TestBed";
import { ForecastClaimAdvice, ForecastClaimAdviceProps } from "./ForecastClaimAdvice";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("<ForecastClaimAdvice />", () => {
  const stubContent = {
    pages: {
      forecastsComponents: {
        adviceMessage: "Your Finance Contact must now eat lettuce to proceed.",
        adviceMessageFc: "You must now eat lettuce to proceed.",
      },
    },
  };

  const defaultProps: ForecastClaimAdviceProps = {
    isFc: false,
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
    test("renders when not Fc", () => {
      const { queryByTestId } = setup({ isFc: false });

      const forecastClaimAdvice = queryByTestId("forecastClaimAdvice");

      expect(forecastClaimAdvice).toBeInTheDocument();
      expect(forecastClaimAdvice).toMatchSnapshot();
    });

    test("renders when Fc", () => {
      const { queryByTestId } = setup({ isFc: true });

      const forecastClaimAdvice = queryByTestId("forecastClaimAdvice");

      expect(forecastClaimAdvice).toBeInTheDocument();
      expect(forecastClaimAdvice).toMatchSnapshot();
    });
  });
});
