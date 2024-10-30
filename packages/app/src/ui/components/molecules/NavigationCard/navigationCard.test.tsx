import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { NavigationCardProps, NavigationCard, NavigationCardsGrid } from "./navigationCard";

const createRoute = (uid: string) => ({
  path: `${uid}-path`,
  routeName: `${uid}-routeName`,
  routeParams: { projectId: `${uid}-projectId` },
  accessControl: () => true,
});

/**
 * iteratively creates a list of message stubs up to length.
 */
function createMessages(totalMessages: number, uid: string) {
  return Array.from({ length: totalMessages }, (_, i) => ({
    message: `${uid}-message-${i + 1}`,
    qa: `${uid}-message-qa-${i + 1}`,
  }));
}

/**
 * iteratively creates stub data for the mock tests
 */
function createStubData(length: number): NavigationCardProps[] {
  return Array.from({ length }, (_, uid): NavigationCardProps => {
    const uidString = `stub-${uid}`;

    return {
      label: `${uidString}-content`,
      qa: `${uidString}-qa`,
      messages: createMessages(2, uidString),
      route: createRoute(uidString),
    };
  });
}

describe("<NavigationCard>", () => {
  const defaultProps = {
    label: "stub-label",
    route: createRoute("stub-route"),
    qa: "stub-qa",
  };

  const setup = (props?: Partial<NavigationCardProps>) => {
    return render(
      <TestBed>
        <NavigationCard {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  it("should render with default props", () => {
    const { container, queryByText } = setup();

    const labelElement = queryByText(defaultProps.label);
    const queryListElement = container.querySelector(".card-link__messages");

    expect(labelElement).toBeInTheDocument();
    expect(queryListElement).not.toBeInTheDocument();
  });

  describe("should render label", () => {
    it("as a string", () => {
      const { queryByText } = setup();

      const labelElement = queryByText(defaultProps.label);

      expect(labelElement).toBeInTheDocument();
    });

    it("as a react element", () => {
      const stubComponentText = "label as node";
      const StubLabelComponent = () => <span>{stubComponentText}</span>;
      const { queryByText } = setup({ label: <StubLabelComponent /> });

      const reactElementContent = queryByText(stubComponentText);

      expect(reactElementContent).toBeInTheDocument();
    });
  });

  it("should render with one message", () => {
    const stubMessage = { message: "stub-message-1", qa: "stub-message-1-qa" };
    const { queryByTestId } = setup({ messages: [stubMessage] });

    const firstMessage = queryByTestId(stubMessage.qa);

    expect(firstMessage).toBeInTheDocument();
  });

  it("should render with multiple messages", () => {
    const stubMessages = createMessages(2, "stub-multiple-message-test");
    const { queryByTestId } = setup({ messages: stubMessages });

    stubMessages.forEach(mssg => {
      const firstMessage = queryByTestId(mssg.qa);

      expect(firstMessage?.innerHTML).toBe(mssg.message);
    });
  });
});

describe("<NavigationCardsGrid>", () => {
  test("should render child components", () => {
    const stubNavigation = createStubData(8);
    const { container } = render(
      <TestBed>
        <NavigationCardsGrid>
          {stubNavigation.map((navItem, i) => (
            <NavigationCard key={i} {...navItem} />
          ))}
        </NavigationCardsGrid>
      </TestBed>,
    );

    const navGroupElement = container.querySelectorAll(".card-link-grid");

    expect(navGroupElement).toMatchSnapshot();
  });
});
