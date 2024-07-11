import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { NavigationArrows } from "./navigationArrows";
import { routeConfig } from "@ui/routing/routeConfig";

describe("<NavigationArrows />", () => {
  const routes = routeConfig;

  const previousLink = {
    label: "Overheads",
    route: routes.reviewClaimLineItems.getLink({
      partnerId: "a0B0Q000001e3HdUAI" as PartnerId,
      projectId: "a0C0Q000001tr5yUAA" as ProjectId,
      periodId: 2 as PeriodId,
      costCategoryId: "a060Q000000oAYZQA2" as CostCategoryId,
    }),
  };

  const nextLink = {
    label: "Labour",
    route: routes.reviewClaimLineItems.getLink({
      partnerId: "a0B0Q000001e3HdUAI" as PartnerId,
      projectId: "a0C0Q000001tr5yUAA" as ProjectId,
      periodId: 2 as PeriodId,
      costCategoryId: "a060Q000000oAYYQA2" as CostCategoryId,
    }),
  };

  const setup = (element: React.ReactElement) => render(<TestBed>{element}</TestBed>);

  describe("@returns", () => {
    test("with next link only", () => {
      const { queryByTestId, queryByText } = setup(<NavigationArrows nextLink={nextLink} />);

      const nextArrow = queryByTestId("govuk-navigation-arrow-right");

      expect(queryByText("Previous")).not.toBeInTheDocument();
      expect(queryByText("Next")).toBeInTheDocument();
      expect(nextArrow).toBeInTheDocument();

      expect(queryByText(nextLink.label)).toBeInTheDocument();
    });

    test("with previous link only", () => {
      const { queryByTestId, queryByText } = setup(<NavigationArrows previousLink={previousLink} />);

      const previousArrow = queryByTestId("govuk-navigation-arrow-left");

      expect(queryByText("Next")).not.toBeInTheDocument();
      expect(queryByText("Previous")).toBeInTheDocument();
      expect(previousArrow).toBeInTheDocument();

      expect(queryByText(previousLink.label)).toBeInTheDocument();
    });

    test("with both previous and next link concurrently", () => {
      const { container, queryByText } = setup(<NavigationArrows previousLink={previousLink} nextLink={nextLink} />);

      const targetButtons = container.querySelectorAll(".govuk-navigation-arrows__button");

      expect(targetButtons).toHaveLength(2);

      expect(queryByText("Previous")).toBeInTheDocument();
      expect(queryByText(previousLink.label)).toBeInTheDocument();

      expect(queryByText("Next")).toBeInTheDocument();
      expect(queryByText(nextLink.label)).toBeInTheDocument();
    });

    test("with no prev or next link provided", () => {
      const { container } = setup(<NavigationArrows />);

      expect(container.firstChild).toBeNull();
    });
  });
});
