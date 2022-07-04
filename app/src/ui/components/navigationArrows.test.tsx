import { createStore } from "redux";
import { render } from "@testing-library/react";
import { IClientUser, ProjectRole } from "@framework/types";
import { routeConfig } from "@ui/routing";
import { IStores } from "@ui/redux/storesProvider";
import { rootReducer } from "@ui/redux/reducers";
import { NavigationArrows } from "@ui/components";
import { TestBed } from "@shared/TestBed";

describe("<NavigationArrows />", () => {
  const routes = routeConfig;

  const store = createStore(rootReducer, {
    user: {
      email: "iuk.accproject@bjss.com.bjsspoc2",
      roleInfo: {
        a0C0Q000001tr5yUAA: {
          projectRoles: ProjectRole.MonitoringOfficer,
          partnerRoles: {},
        },
      },
      csrf: "CSFR",
    } as IClientUser,
  }) as IStores;

  const previousLink = {
    label: "Overheads",
    route: routes.reviewClaimLineItems.getLink({
      partnerId: "a0B0Q000001e3HdUAI",
      projectId: "a0C0Q000001tr5yUAA",
      periodId: 2,
      costCategoryId: "a060Q000000oAYZQA2",
    }),
  };

  const nextLink = {
    label: "Labour",
    route: routes.reviewClaimLineItems.getLink({
      partnerId: "a0B0Q000001e3HdUAI",
      projectId: "a0C0Q000001tr5yUAA",
      periodId: 2,
      costCategoryId: "a060Q000000oAYYQA2",
    }),
  };

  const setup = (element: React.ReactElement) =>
    render(<TestBed stores={store}>{element}</TestBed>);

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
