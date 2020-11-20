import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TestBed from "@shared/TestBed";
import * as hookModule from "@ui/hooks/is-client.hook";
import { Accordion, AccordionItem, AccordionProps } from "../../src/ui/components";

// TODO: Add this to linting config, tests are naturally going to be verbose to make this easier to read
// tslint:disable: no-duplicate-string
describe("<Accordion />", () => {
  const isClientSpy = jest.spyOn(hookModule, "useIsClient");

  const createAccordionItem = (uid: string) => (
    <AccordionItem qa={`${uid}-accordion-test`} title={`${uid}-title`}>
      <p>{uid} Some content</p>
    </AccordionItem>
  );

  const defaultProps: AccordionProps = {
    children: createAccordionItem("default-props"),
  };

  const setup = (props?: Partial<AccordionProps>) =>
    render(
      <TestBed>
        <Accordion {...defaultProps} {...props} />
      </TestBed>,
    );

  beforeEach(jest.clearAllMocks);

  describe("@renders", () => {
    describe("qa", () => {
      it("as default", () => {
        const { queryByTestId } = setup();

        const targetElement = queryByTestId("accordion-container");

        expect(targetElement).toBeTruthy();
      });

      it("with custom value", () => {
        const stubQa = "stub-qa";
        const { queryByTestId } = setup({ qa: stubQa });

        const targetElement = queryByTestId(stubQa + "-accordion-container");

        expect(targetElement).toBeTruthy();
      });
    });

    describe("controls", () => {
      it("should be available when jsEnabled is true", () => {
        isClientSpy.mockReturnValue(true);
        const { queryByTestId } = setup();

        const toggleElement = queryByTestId("accordion-toggle");

        expect(toggleElement).toBeInTheDocument();
      });

      it("should be unavailable when jsEnabled is false", () => {
        isClientSpy.mockReturnValue(false);
        const { queryByTestId } = setup();

        const toggleElement = queryByTestId("accordion-toggle");

        expect(toggleElement).not.toBeInTheDocument();
      });
    });
  });

  describe("@context", () => {
    describe("handleClick()", () => {
      it("should close all items", () => {
        isClientSpy.mockReturnValue(true);
        const { getByTestId } = setup();

        const toggleBtn = getByTestId("accordion-toggle");

        // Open all
        userEvent.click(toggleBtn);

        // Close all
        userEvent.click(toggleBtn);

        expect(toggleBtn).toHaveTextContent("Open all sections");
      });

      it("should open all items, with one <AccordionItem />", () => {
        isClientSpy.mockReturnValue(true);
        const { getByTestId } = setup();

        const toggleBtn = getByTestId("accordion-toggle");

        userEvent.click(toggleBtn);

        expect(toggleBtn).toHaveTextContent("Close all sections");
      });

      it("should open all items, with multiple <AccordionItem />", () => {
        isClientSpy.mockReturnValue(true);
        const stubMultipleItems = (
          <>
            {createAccordionItem("item-1")}
            {createAccordionItem("item-2")}
          </>
        );
        const { getByTestId } = setup({ children: stubMultipleItems });

        const toggleBtn = getByTestId("accordion-toggle");

        expect(toggleBtn).toHaveTextContent("Open all sections");

        userEvent.click(toggleBtn);

        expect(toggleBtn).toHaveTextContent("Close all sections");
      });
    });
    describe("toggle()", () => {
      it("should call toggle on one item in a multiple list", () => {
        isClientSpy.mockReturnValue(true);
        const stubMultipleItems = (
          <>
            {createAccordionItem("item-1")}
            {createAccordionItem("item-2")}
          </>
        );
        const { getAllByTestId, getByTestId } = setup({ children: stubMultipleItems });

        const toggleBtn = getByTestId("accordion-toggle");
        const [firstItem, secondItem] = getAllByTestId("accordion-item-header");

        expect(toggleBtn).toHaveTextContent("Open all sections");

        expect(firstItem).toHaveAttribute("aria-pressed", "false");
        expect(secondItem).toHaveAttribute("aria-pressed", "false");

        userEvent.click(firstItem);

        expect(firstItem).toHaveAttribute("aria-pressed", "true");
        expect(secondItem).toHaveAttribute("aria-pressed", "false");

        // Not items are open!
        expect(toggleBtn).toHaveTextContent("Open all sections");
      });

      it("should call toggle on all items in a list", () => {
        isClientSpy.mockReturnValue(true);
        const stubMultipleItems = (
          <>
            {createAccordionItem("item-1")}
            {createAccordionItem("item-2")}
          </>
        );
        const { getAllByTestId, getByTestId } = setup({ children: stubMultipleItems });

        const [firstItem, secondItem] = getAllByTestId("accordion-item-header");
        const toggleBtn = getByTestId("accordion-toggle");

        expect(toggleBtn).toHaveTextContent("Open all sections");

        expect(firstItem).toHaveAttribute("aria-pressed", "false");
        expect(secondItem).toHaveAttribute("aria-pressed", "false");

        userEvent.click(firstItem);
        userEvent.click(secondItem);

        expect(firstItem).toHaveAttribute("aria-pressed", "true");
        expect(secondItem).toHaveAttribute("aria-pressed", "true");

        // Should trigger button to update since all items are open ^^
        expect(toggleBtn).toHaveTextContent("Close all sections");
      });

      it("should call toggle and close when all are open", () => {
        isClientSpy.mockReturnValue(true);
        const stubMultipleItems = (
          <>
            {createAccordionItem("item-1")}
            {createAccordionItem("item-2")}
          </>
        );
        const { getAllByTestId, getByTestId } = setup({ children: stubMultipleItems });

        const [firstItem, secondItem] = getAllByTestId("accordion-item-header");
        const toggleBtn = getByTestId("accordion-toggle");

        expect(toggleBtn).toHaveTextContent("Open all sections");

        userEvent.click(firstItem);
        userEvent.click(secondItem);

        // Should only close the first item
        userEvent.click(firstItem);

        expect(firstItem).toHaveAttribute("aria-pressed", "false");
        expect(secondItem).toHaveAttribute("aria-pressed", "true");

        // Should trigger button to update since all items are open ^^
        expect(toggleBtn).toHaveTextContent("Open all sections");
      });
    });
  });
});
