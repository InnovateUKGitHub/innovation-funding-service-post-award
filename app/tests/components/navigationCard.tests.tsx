import React from "react";
import { chunks, NavigationCard, NavigationCardProps, NavigationCardsGrid } from "@ui/components";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";
import TestBed from "./helpers/TestBed";
import { findByQa } from "./helpers/find-by-qa";

const createRoute = (uid: string) => ({
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
  return Array.from(
    { length },
    (_, uid): NavigationCardProps => {
      const uidString = `stub-${uid}`;

      return {
        label: `${uidString}-content`,
        qa: `${uidString}-qa`,
        messages: createMessages(2, uidString),
        route: createRoute(uidString),
      };
    },
  );
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
    const wrapper = mount(
      <TestBed>
        <NavigationCard {...defaultProps} {...props} />
      </TestBed>,
    );

    const labelElement = findByQa(wrapper, "navigation-card-label");
    const listElement = findByQa(wrapper, "navigation-card-list");

    return {
      wrapper,
      labelElement,
      listElement,
    };
  };

  it("should render with default props", () => {
    const { labelElement, listElement } = setup();

    expect(labelElement.exists()).toBe(true);
    expect(listElement.exists()).toBe(false);
  });

  describe("should render label", () => {
    it("as a string", () => {
      const { labelElement } = setup();

      expect(labelElement.text()).toBe(defaultProps.label);
    });

    it("as a react element", () => {
      const stubLabel = <span>label as node</span>;
      const { labelElement } = setup({ label: stubLabel });

      const labelElementType = labelElement.children().type();

      expect(labelElementType).toBe(stubLabel.type);
    });
  });

  it("should render with one message", () => {
    const stubMessage = { message: "stub-message-1", qa: "stub-message-1-qa" };
    const { wrapper } = setup({ messages: [stubMessage] });

    const firstMessage = findByQa(wrapper, stubMessage.qa);

    expect(firstMessage.exists()).toBe(true);
  });

  it("should render with multiple messages", () => {
    const stubMessages = createMessages(2, "stub-multiple-message-test");
    const { wrapper } = setup({ messages: stubMessages });

    stubMessages.forEach((mssg) => {
      const firstMessage = findByQa(wrapper, mssg.qa);

      expect(firstMessage.text()).toBe(mssg.message);
    });
  });
});

describe("<NavigationCardsGrid>", () => {
  const setup = (totalChildren: number) => {
    const stubNavigation = createStubData(totalChildren);
    const wrapper = mount(
      <TestBed>
        <NavigationCardsGrid>
          {stubNavigation.map((navItem, i) => (
            <NavigationCard key={i} {...navItem} />
          ))}
        </NavigationCardsGrid>
      </TestBed>,
    );

    const navGroupElement = findByQa(wrapper, "navigation-group");
    const navGroupItemElement = findByQa(wrapper, "navigation-group-item");

    return {
      wrapper,
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

    expect(navGroupItemElement.length).toBe(totalItems);
    expect(navGroupElement.length).toBe(totalGroups);
  });
});
