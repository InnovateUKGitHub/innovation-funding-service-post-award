import userEvent from "@testing-library/user-event";
import { render, act } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { AccordionItem, AccordionItemProps } from "..";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

const stubContent = {
  example: {
    contentTitle: "stub-exampleContentTitle",
  },
};

const defaultProps: AccordionItemProps = {
  title: "stub-title-as-string",
  qa: "stub-qa",
  children: <p>stub-children</p>,
};

const setup = (props?: Partial<AccordionItemProps>, isServer?: boolean) => {
  const rtl = render(
    <TestBed isServer={isServer}>
      <AccordionItem {...defaultProps} {...props} />
    </TestBed>,
  );

  const getAccordion = (textToQuery: string) => {
    const titleNode = rtl.getByText(textToQuery);
    const toggleContainer = titleNode.parentElement;

    if (!toggleContainer) throw Error(`Can't find container for '${textToQuery}'`);

    const accordionNode = toggleContainer.parentElement;

    if (!accordionNode) throw Error(`Can't find accordion node for '${textToQuery}'`);

    return { titleNode, accordionNode };
  };

  const queryOpenAccordions = () => {
    return rtl.container.querySelectorAll("govuk-accordion__section--expanded");
  };

  const queryAccordionToggle = () => {
    return rtl.queryByTestId("accordion-toggle");
  };

  return {
    ...rtl,
    getAccordion,
    queryOpenAccordions,
    queryAccordionToggle,
  };
};

describe("AccordionItem", () => {
  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  describe("@renders", () => {
    describe("with isOpen", () => {
      test.each`
        name            | isOpen
        ${"when true"}  | ${true}
        ${"when false"} | ${false}
      `("$name", ({ isOpen }) => {
        const { container } = setup({ isOpen });

        expect(container.firstChild).toMatchSnapshot();
      });
    });

    describe("with a title", () => {
      test("with title as string", () => {
        const stubTitle = "stub-title-as-string";
        const { queryByText } = setup({ title: stubTitle });

        expect(queryByText(stubTitle)).toBeInTheDocument();
      });

      test("with title as content solution", () => {
        const { getAccordion } = setup({ title: x => x.example.contentTitle });

        const { titleNode, accordionNode } = getAccordion(stubContent.example.contentTitle);

        expect(titleNode).toBeInTheDocument();
        expect(accordionNode.tagName).toBe("BUTTON");
      });
    });

    describe("when mounted", () => {
      test("when client should render a button", () => {
        const { queryAccordionToggle } = setup();

        expect(queryAccordionToggle()).toBeInTheDocument();
      });

      test("when client should render with a span button", () => {
        const { queryAccordionToggle } = setup(undefined, true);

        expect(queryAccordionToggle()).not.toBeInTheDocument();
      });
    });
  });

  describe("@calls", () => {
    test("with onClick when clicked", async () => {
      const stubToggleFn = jest.fn();
      const { queryAccordionToggle } = setup({ onClick: stubToggleFn });
      const toggleBtn = queryAccordionToggle();

      if (!toggleBtn) throw Error("Toggle button was not found!");

      expect(stubToggleFn).toHaveBeenCalledTimes(0);

      await act(() => userEvent.click(toggleBtn));

      expect(stubToggleFn).toHaveBeenCalledTimes(1);
    });
  });
});
