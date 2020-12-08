import React from "react";
import { render } from "@testing-library/react";

import TestBed, { TestBedContent } from "@shared/TestBed";
import { ILinkInfo } from "@framework/types";
import {
  ForecastClaimAdvice,
  ForecastClaimAdviceProps,
} from "../../../../src/ui/containers/forecasts/components/ForecastClaimAdvice";

describe("<ForecastClaimAdvice />", () => {
  const stubContent = {
    forecastsComponents: {
      adviseMessage: {
        part1: {
          content: "stub-part1",
        },
        part2Link: {
          content: "stub-part2Link",
        },
        part3: {
          content: "stub-part3",
        },
      },
    },
  };

  const stubLink: ILinkInfo = {
    routeName: "stub-routeName",
    routeParams: {},
    accessControl: () => false,
  };

  const defaultProps: ForecastClaimAdviceProps = {
    claimLink: stubLink,
  };

  const setup = (props: ForecastClaimAdviceProps) =>
    render(
      <TestBed content={stubContent as TestBedContent}>
        <ForecastClaimAdvice {...defaultProps} {...props} />
      </TestBed>,
    );

  beforeEach(jest.clearAllMocks);

  describe("@content", () => {
    const contentSolution = stubContent.forecastsComponents.adviseMessage;

    test.each`
      name                | stringToCheck
      ${"with part1"}     | ${contentSolution.part1.content}
      ${"with part2Link"} | ${contentSolution.part2Link.content}
      ${"with part3"}     | ${contentSolution.part3.content}
    `("$name", ({ stringToCheck }) => {
      const { getByText } = setup({ claimLink: stubLink });

      // Note: exact is false since not each content string has its own node
      const targetElement = getByText(stringToCheck, { exact: false });

      // Note: toBeInTheDocument() checks the element, not all stubs have there own elements
      expect(targetElement).toBeDefined();
    });
  });
});
