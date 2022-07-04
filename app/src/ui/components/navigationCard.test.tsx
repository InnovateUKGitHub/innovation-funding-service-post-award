import { render } from "@testing-library/react";

import { chunks, NavigationCard, NavigationCardProps, NavigationCardsGrid } from "@ui/components";
import { TestBed } from "@shared/TestBed";

const createRoute = (uid: string) => ({
  path: `${uid}-path`,
  routeName: `${uid}-routeName`,
  routeParams: { projectId: `${uid}-projectId` },
  accessControl: () => true,
});

function createMessages(totalMessages: number, uid: string) {
  return Array.from({ length: totalMessages }, (_, i) => ({
    message: `${uid}-message-${i + 1}`,
    qa: `${uid}-message-qa-${i + 1}`,
  }));
}

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

describe("chunks()", () => {
  test.each`
    name                                  | chunkSize | array                          | expected
    ${"with 1 chunks with a length of 2"} | ${2}      | ${[1, 2]}                      | ${[[1, 2]]}
    ${"with 2 chunks with a length of 2"} | ${2}      | ${[1, 2, 3, 4]}                | ${[[1, 2], [3, 4]]}
    ${"with 1 chunk with a length of 3"}  | ${3}      | ${[1, 2, 3]}                   | ${[[1, 2, 3]]}
    ${"with 2 chunks with a length of 3"} | ${3}      | ${[1, 2, 3, 4, 5, 6]}          | ${[[1, 2, 3], [4, 5, 6]]}
    ${"with 3 chunks with a length of 3"} | ${3}      | ${[1, 2, 3, 4, 5, 6, 7, 8, 9]} | ${[[1, 2, 3], [4, 5, 6], [7, 8, 9]]}
  `("should return $name", ({ chunkSize, array, expected }) => {
    expect(chunks(array, chunkSize)).toStrictEqual(expected);
  });
});

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
  const setup = (totalChildren: number) => {
    const stubNavigation = createStubData(totalChildren);
    const { container } = render(
      <TestBed>
        <NavigationCardsGrid>
          {stubNavigation.map((navItem, i) => (
            <NavigationCard key={i} {...navItem} />
          ))}
        </NavigationCardsGrid>
      </TestBed>,
    );

    const navGroupElement = container.querySelectorAll(".govuk-grid-row");
    const navGroupItemElement = container.querySelectorAll(".govuk-grid-column-one-third");

    return {
      navGroupElement,
      navGroupItemElement,
    };
  };

  test.each`
    name                        | totalItems | totalGroups
    ${"with 1 group, 1 item"}   | ${1}       | ${1}
    ${"with 1 group, 2 items"}  | ${2}       | ${1}
    ${"with 2 groups, 4 item"}  | ${4}       | ${2}
    ${"with 2 groups, 6 items"} | ${6}       | ${2}
    ${"with 3 groups, 9 items"} | ${9}       | ${3}
  `("should render $name", ({ totalItems, totalGroups }) => {
    const { navGroupElement, navGroupItemElement } = setup(totalItems);

    expect(navGroupItemElement).toHaveLength(totalItems);
    expect(navGroupElement).toHaveLength(totalGroups);
  });
});
