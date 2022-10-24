import { render } from "@testing-library/react";

import TestBed from "@shared/TestBed";
import { ILinkInfo } from "@framework/types";
import { ForecastClaimAdvice, ForecastClaimAdviceProps } from "./ForecastClaimAdvice";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<ForecastClaimAdvice />", () => {
  const stubContent = {
    pages: {
      forecastsComponents: {
        adviseMessage: {
          part1: "stub-part1",
          part2Link: "stub-part2Link",
          part3: "stub-part3",
        },
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
    await testInitialiseInternationalisation(stubContent);
  });

  describe("@content", () => {
    const contentSolution = stubContent.pages.forecastsComponents.adviseMessage;

    test.each`
      name                | stringToCheck
      ${"with part1"}     | ${contentSolution.part1}
      ${"with part2Link"} | ${contentSolution.part2Link}
      ${"with part3"}     | ${contentSolution.part3}
    `("$name", ({ stringToCheck }) => {
      const { getByText } = setup({ claimLink: stubLink });

      // Note: exact is false since not each content string has its own node
      const targetElement = getByText(stringToCheck, { exact: false });

      // Note: toBeInTheDocument() checks the element, not all stubs have there own elements
      expect(targetElement).toBeDefined();
    });
  });
});
