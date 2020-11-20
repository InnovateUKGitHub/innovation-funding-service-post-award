import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TestBed, { TestBedContent } from "@shared/TestBed";
import * as hookModule from "@ui/hooks/is-client.hook";
import { AccordionItem, AccordionItemProps } from "../../src/ui/components";
import { AccordionProvider, IAccordionContext } from "../../src/ui/components/accordion/accordion-context";

const stubContent = {
  home: {
    exampleContentTitle: {
      content: "stub-content",
    },
  },
} as TestBedContent;

const defaultProps = {
  qa: "stub-qa",
  children: <p>stub-children</p>,
};

const stubToggleFn = jest.fn();
const stubSubscribeFn = jest.fn();

const defaultAccordionContext = {
  forceIsOpen: null,
  toggle: stubToggleFn,
  subscribe: stubSubscribeFn,
};

interface ISetup {
  props?: Partial<AccordionItemProps>;
  contentStore?: TestBedContent;
  accordionContext?: IAccordionContext;
}

// Note: Created this component as there is currently no way of calling RTL rerender with a new context
const setupComponent = ({
  props,
  // TODO: Check is this key name correct ??
  contentStore,
  accordionContext = defaultAccordionContext,
}: ISetup) => (
  <TestBed content={contentStore}>
    <AccordionProvider value={accordionContext}>
      <AccordionItem {...defaultProps} {...props} />
    </AccordionProvider>
  </TestBed>
);

const accordionItemSetup = (unitTestProps: ISetup) => render(setupComponent(unitTestProps));

const accordionItemQa = {
  jsTitle: "accordion-item-js-title",
  noJsTitle: "accordion-item-nojs-title",
};

// tslint:disable-next-line: no-big-function
describe("AccordionItem", () => {
  const isClientSpy = jest.spyOn(hookModule, "useIsClient");

  beforeEach(jest.clearAllMocks);

  describe("@renders", () => {
    describe("with no UI", () => {
      test.each`
        name                                      | props
        ${"with no title"}                        | ${{ title: undefined }}
        ${"with title with empty string"}         | ${{ title: "" }}
        ${"with title undefined"}                 | ${{ title: undefined }}
        ${"with titleContent with empty string "} | ${{ titleContent: "" }}
        ${"with titleContent undefined"}          | ${{ titleContent: undefined }}
      `("$name", ({ props }) => {
        const testQa = "needed-for-query";
        const { queryByTestId } = accordionItemSetup({ ...props, qa: testQa });

        expect(queryByTestId(testQa)).toBeNull();
      });
    });

    describe("with a title", () => {
      it("with title as string", () => {
        const stubTitle = "stub-title-as-string";
        const { queryByText } = accordionItemSetup({ props: { title: stubTitle, qa: "added-to-find-title-value" } });

        expect(queryByText(stubTitle)).toBeInTheDocument();
      });

      it("with title as content solution", () => {
        const { getByTestId } = accordionItemSetup({
          props: {
            title: (x) => x.home.exampleContentTitle,
            qa: "added-to-find-title-value",
          },
          contentStore: stubContent,
        });

        const targetElement = getByTestId(accordionItemQa.jsTitle);
        const expectedText = (stubContent as any).home.exampleContentTitle.content;

        expect(targetElement.textContent).toBe(expectedText);
        expect(targetElement.tagName).toBe("BUTTON");
      });

      it("with titleContent as content solution", () => {
        const { getByTestId } = accordionItemSetup({
          props: {
            titleContent: (x) => x.home.exampleContentTitle,
            qa: "added-to-find-titleContent-value",
          },
          contentStore: stubContent,
        });

        const targetElement = getByTestId(accordionItemQa.jsTitle);
        const expectedText = (stubContent as any).home.exampleContentTitle.content;

        expect(targetElement.textContent).toBe(expectedText);
        expect(targetElement.tagName).toBe("BUTTON");
      });

      it("should toggle focused class when onFocus is called", () => {
        const focusClass = "govuk-accordion__section-header--focused";

        isClientSpy.mockReturnValue(true);
        const { getByTestId } = accordionItemSetup({ props: { title: "show-focus-className" } });
        const targetHeader = getByTestId("accordion-item-header");

        expect(targetHeader).not.toHaveClass(focusClass);

        userEvent.tab();
        expect(targetHeader).toHaveClass(focusClass);
      });
    });

    describe("with isClient", () => {
      it("when true should render a title in a button", () => {
        isClientSpy.mockReturnValue(true);
        const { getByTestId } = accordionItemSetup({ props: { title: "stub-title" } });

        expect(getByTestId(accordionItemQa.jsTitle).tagName).toBe("BUTTON");
      });

      it("when false should render a title in a span", () => {
        isClientSpy.mockReturnValue(false);
        const { getByTestId } = accordionItemSetup({ props: { title: "stub-title" } });

        expect(getByTestId(accordionItemQa.noJsTitle).tagName).toBe("SPAN");
      });
    });

    describe("<Accordion /> should override local UI", () => {
      const expandedClass = "govuk-accordion__section--expanded";

      it("when forced open should be expanded", () => {
        const stubAccordionContext = {
          ...defaultAccordionContext,
          forceIsOpen: null,
        };

        isClientSpy.mockReturnValue(true);
        const testProps = { title: "stub-title-onMount-override", qa: "provider-forceIsOpen-default" };
        const { getByTestId, rerender } = accordionItemSetup({
          props: testProps,
          contentStore: {},
          accordionContext: stubAccordionContext,
        });
        const targetHeader = getByTestId(testProps.qa);

        expect(targetHeader).not.toHaveClass(expandedClass);

        rerender(
          setupComponent({
            props: testProps,
            contentStore: {},
            accordionContext: { ...stubAccordionContext, forceIsOpen: true },
          }),
        );

        expect(targetHeader).toHaveClass(expandedClass);
      });

      it("when forced closed should be collapsed", () => {
        const stubAccordionContext = {
          ...defaultAccordionContext,
          forceIsOpen: false,
        };

        isClientSpy.mockReturnValue(true);
        const testProps = { title: "stub-title-onMount-override", qa: "provider-forceIsOpen-false" };
        const { getByTestId } = accordionItemSetup({
          props: testProps,
          contentStore: {},
          accordionContext: stubAccordionContext,
        });
        const targetHeader = getByTestId(testProps.qa);

        expect(targetHeader).not.toHaveClass(expandedClass);
      });

      it("should allow manual collapse after being forced open", () => {
        const stubAccordionContext = {
          ...defaultAccordionContext,
          forceIsOpen: true,
        };

        isClientSpy.mockReturnValue(true);
        const testProps = { title: "stub-title-manual-follow-up", qa: "provider-forceIsOpen-true" };
        const { getByTestId } = accordionItemSetup({
          props: testProps,
          contentStore: {},
          accordionContext: stubAccordionContext,
        });
        const targetHeader = getByTestId(testProps.qa);
        const targetButton = getByTestId(accordionItemQa.jsTitle);

        // Loads with expanded state
        expect(targetHeader).toHaveClass(expandedClass);

        // Manually close with click
        userEvent.click(targetButton);
        expect(targetHeader).not.toHaveClass(expandedClass);
      });
    });
  });

  describe("@context", () => {
    it("should call onFocus then call onBlur when tabbing", () => {
      isClientSpy.mockReturnValue(true);
      const { getByTestId } = accordionItemSetup({ props: { title: "show-focus-className" } });
      const targetButton = getByTestId(accordionItemQa.jsTitle);

      expect(targetButton).not.toHaveFocus();

      targetButton.focus();
      expect(targetButton).toHaveFocus();

      targetButton.blur();
      expect(targetButton).not.toHaveFocus();
    });

    it("should call subscribe() when component loads", () => {
      accordionItemSetup({ props: { title: "stub-title-subscribe" } });

      expect(stubSubscribeFn).toHaveBeenCalledTimes(1);
    });

    describe("should invoke toggle()", () => {
      describe("when clicked once", () => {
        it("calls context once", () => {
          isClientSpy.mockReturnValue(true);
          const { getByTestId } = accordionItemSetup({ props: { title: "stub-toggle-1-title" } });
          const targetElement = getByTestId(accordionItemQa.jsTitle);

          expect(stubToggleFn).toHaveBeenCalledTimes(0);

          userEvent.click(targetElement);

          expect(stubToggleFn).toHaveBeenCalledTimes(1);
        });

        it("calls context with expanded state", () => {
          isClientSpy.mockReturnValue(true);
          const { getByTestId } = accordionItemSetup({ props: { title: "stub-toggle-1-title" } });
          const targetElement = getByTestId(accordionItemQa.jsTitle);

          userEvent.click(targetElement);

          expect(stubToggleFn).toHaveBeenCalledWith(true);
        });
      });

      describe("when clicked twice", () => {
        it("calls context twice", () => {
          isClientSpy.mockReturnValue(true);
          const { getByTestId } = accordionItemSetup({ props: { title: "stub-toggle-2-title" } });
          const targetElement = getByTestId(accordionItemQa.jsTitle);

          userEvent.dblClick(targetElement);

          expect(stubToggleFn).toHaveBeenCalledTimes(2);
        });

        it("calls context twice with closed expanded state", () => {
          isClientSpy.mockReturnValue(true);
          const { getByTestId } = accordionItemSetup({ props: { title: "stub-toggle-2-title" } });
          const targetElement = getByTestId(accordionItemQa.jsTitle);

          userEvent.dblClick(targetElement);

          expect(stubToggleFn).toHaveBeenCalledWith(false);
        });
      });
    });
  });
});
