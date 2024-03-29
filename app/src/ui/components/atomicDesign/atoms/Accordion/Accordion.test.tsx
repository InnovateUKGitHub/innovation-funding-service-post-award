import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestBed from "@shared/TestBed";
import { AccordionProps, Accordion } from "./Accordion";
import { AccordionItem } from "./AccordionItem";

describe("<Accordion />", () => {
  const createAccordionItem = (uid: string | number, content?: string) => (
    <AccordionItem key={`${uid}`} qa={`${uid}`} title={`${uid}-title`}>
      <p>{content || `${uid} stub content`}</p>
    </AccordionItem>
  );

  const defaultProps: AccordionProps = {
    children: createAccordionItem("default-props"),
  };

  const setup = (props?: Partial<AccordionProps>, isServer?: boolean) => {
    const rtl = render(
      <TestBed isServer={isServer}>
        <Accordion {...defaultProps} {...props} />
      </TestBed>,
    );

    const getToggleContainer = (textToQuery: string): HTMLElement => {
      const toggleContainer = rtl.getByText(textToQuery).parentElement;

      if (!toggleContainer) throw Error(`Can't find container for '${textToQuery}'`);

      const accordionNode = toggleContainer.parentElement;

      if (!accordionNode) throw Error(`Can't find accordion node for '${textToQuery}'`);

      return accordionNode;
    };

    const queryAccordionIsOpen = (textToQuery: string) => {
      const node = getToggleContainer(textToQuery);
      return node.classList.contains("govuk-accordion__section--expanded");
    };

    return {
      ...rtl,
      queryAccordionIsOpen,
    };
  };

  beforeEach(jest.clearAllMocks);

  describe("@renders", () => {
    describe("with qa", () => {
      test("as default", () => {
        const { queryByTestId } = setup();

        const targetElement = queryByTestId("accordion-container");

        expect(targetElement).toBeTruthy();
      });

      test("with custom value", () => {
        const stubQa = "stub-qa";
        const { queryByTestId } = setup({ qa: stubQa });

        const targetElement = queryByTestId(stubQa + "-accordion-container");

        expect(targetElement).toBeTruthy();
      });
    });

    describe("with condition controls (when mounting)", () => {
      test("should be unavailable when on the client with one child", () => {
        const { queryByTestId } = setup({
          children: [createAccordionItem("poland")],
        });

        const toggleElement = queryByTestId("all-accordion-toggle");

        expect(toggleElement).not.toBeInTheDocument();
      });

      test("should be available when on the client with multiple children", () => {
        const { queryByTestId } = setup({
          children: [createAccordionItem("new zealand"), createAccordionItem("old zealand")],
        });

        const toggleElement = queryByTestId("all-accordion-toggle");

        expect(toggleElement).toBeInTheDocument();
      });

      test("should be unavailable when rendered on the server", () => {
        const { queryByTestId } = setup(undefined, true);

        const toggleElement = queryByTestId("all-accordion-toggle");

        expect(toggleElement).not.toBeInTheDocument();
      });
    });
  });

  describe("@actions", () => {
    describe("calls show/hide", () => {
      test("when clicked many times", async () => {
        const stubFirstContent = "stub-1";
        const stubSecondContent = "stub-2";

        const stubNodes = [createAccordionItem(1, stubFirstContent), createAccordionItem(2, stubSecondContent)];

        const { queryByText, getByTestId, queryAccordionIsOpen } = setup({ children: stubNodes });

        const toggleBtn = getByTestId("all-accordion-toggle");

        expect(queryByText("Hide all sections")).not.toBeInTheDocument();
        expect(queryByText("Show all sections")).toBeInTheDocument();
        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();

        // Open all nodes
        await act(async () => {
          await userEvent.click(toggleBtn);
        });

        expect(queryByText("Hide all sections")).toBeInTheDocument();
        expect(queryByText("Show all sections")).not.toBeInTheDocument();
        expect(queryAccordionIsOpen(stubFirstContent)).toBeTruthy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeTruthy();

        // Close all nodes
        await act(async () => {
          await userEvent.click(toggleBtn);
        });

        expect(queryByText("Hide all sections")).not.toBeInTheDocument();
        expect(queryByText("Show all sections")).toBeInTheDocument();
        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();
      });
    });

    describe("calls toggle on child nodes", () => {
      test("calls toggle on one item in the list", async () => {
        const stubFirstContent = "stub-1";
        const stubSecondContent = "stub-2";

        const stubNodes = [createAccordionItem(1, stubFirstContent), createAccordionItem(2, stubSecondContent)];

        const { getAllByTestId, queryAccordionIsOpen } = setup({ children: stubNodes });

        const [firstToggle] = getAllByTestId("accordion-toggle");

        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();

        // Open
        await act(async () => {
          await userEvent.click(firstToggle);
        });

        expect(queryAccordionIsOpen(stubFirstContent)).toBeTruthy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();

        // Close
        await act(async () => {
          await userEvent.click(firstToggle);
        });

        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();
      });

      test("calls toggle in the correct order (open/closes first node, then second...)", async () => {
        const stubFirstContent = "stub-1";
        const stubSecondContent = "stub-2";

        const stubNodes = [createAccordionItem(1, stubFirstContent), createAccordionItem(2, stubSecondContent)];

        const { getAllByTestId, queryAccordionIsOpen } = setup({ children: stubNodes });

        const [firstToggle, secondToggle] = getAllByTestId("accordion-toggle");

        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();

        // Open - first
        await act(async () => {
          await userEvent.click(firstToggle);
        });

        expect(queryAccordionIsOpen(stubFirstContent)).toBeTruthy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();

        // Close - first
        await act(async () => {
          await userEvent.click(firstToggle);
        });

        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();

        // Open - second
        await act(async () => {
          await userEvent.click(secondToggle);
        });

        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeTruthy();

        // Close - second
        await act(async () => {
          await userEvent.click(secondToggle);
        });

        expect(queryAccordionIsOpen(stubFirstContent)).toBeFalsy();
        expect(queryAccordionIsOpen(stubSecondContent)).toBeFalsy();
      });
    });
  });
});
