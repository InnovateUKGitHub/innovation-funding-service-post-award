import { render } from "@testing-library/react";

import { DualDetails, DualDetailsProps, TypedDetails } from "@ui/components/details";

describe("Detail Components", () => {
  describe("<Details>", () => {
    describe("Fields", () => {
      it("String values render title and value", () => {
        const stubLabel = "stub-label";
        const stubValue = "stub-value";

        const example = { name: stubValue };
        const DTest = TypedDetails<typeof example>();

        const { queryByText } = render(
          <DTest.Details data={example}>
            <DTest.String label={stubLabel} qa="name" value={x => x.name} />
          </DTest.Details>,
        );

        expect(queryByText(stubLabel)).toBeInTheDocument();
        expect(queryByText(stubValue)).toBeInTheDocument();
      });

      it("Multi line string values render title and value", () => {
        const stubLabel = "stub-label";
        const stubValue = "stub-multiline-item-1\nstub-multiline-item-2";

        const example = { name: stubValue };
        const DTest = TypedDetails<typeof example>();

        const { queryByText } = render(
          <DTest.Details data={example}>
            <DTest.MultilineString label={stubLabel} qa="name" value={x => x.name} />
          </DTest.Details>,
        );

        expect(queryByText(stubLabel)).toBeInTheDocument();

        const [multilineLine1, multilineLine2] = stubValue.split("\n");

        expect(queryByText(multilineLine1)).toBeInTheDocument();
        expect(queryByText(multilineLine2)).toBeInTheDocument();
      });

      it("Date values render title and value", () => {
        const stubCreatedDate = new Date("2018/12/1");

        const example = { created: stubCreatedDate };
        const DTest = TypedDetails<typeof example>();

        const { queryByText } = render(
          <DTest.Details data={example}>
            <DTest.Date label="Created" qa="created" value={x => x.created} />
          </DTest.Details>,
        );

        const expectedRenderedDate = "1 December 2018";

        expect(queryByText(expectedRenderedDate)).toBeInTheDocument();
      });

      it("Date time values render title and value", () => {
        const stubCreatedDate = new Date("2018/12/1 9:08");

        const example = { created: stubCreatedDate };
        const DTest = TypedDetails<typeof example>();

        const { queryByText } = render(
          <DTest.Details data={example}>
            <DTest.DateTime label="Created" qa="created" value={x => x.created} />
          </DTest.Details>,
        );

        const expectedRenderedDateTime = "1 December 2018, 9:08am";

        expect(queryByText(expectedRenderedDateTime)).toBeInTheDocument();
      });

      it("Custom values render expected content", () => {
        const stubCustomContent = "example";

        const example = { name: stubCustomContent };
        const DTest = TypedDetails<typeof example>();

        const { queryByText } = render(
          <DTest.Details data={example}>
            <DTest.Custom label="Custom" qa="custom" value={x => <p>Custom Content {x.name}</p>} />
          </DTest.Details>,
        );

        const expectedCustomContent = `Custom Content ${stubCustomContent}`;

        expect(queryByText(expectedCustomContent)).toBeInTheDocument();
      });

      it("Number values render expected content", () => {
        const stubNumber = 12.22;

        const example = { number: stubNumber };
        const DTest = TypedDetails<typeof example>();

        const { queryByText } = render(
          <DTest.Details data={example}>
            <DTest.Number label="Number" qa="Number" value={x => x.number} />
          </DTest.Details>,
        );

        expect(queryByText(stubNumber)).toBeInTheDocument();
      });

      it("Currency values render expected content", () => {
        const stubCurrency = 12;

        const example = { cost: stubCurrency };
        const DTest = TypedDetails<typeof example>();

        const { queryByText } = render(
          <DTest.Details data={example}>
            <DTest.Currency fractionDigits={2} label="Cost" qa="cost" value={x => x.cost} />
          </DTest.Details>,
        );

        const expectedRenderedCurrency = "£12.00";

        expect(queryByText(expectedRenderedCurrency)).toBeInTheDocument();
      });
    });

    describe("with layouts", () => {
      test("as default", () => {
        const example = { id: 1, name: "example", cost: 100 };
        const DTest = TypedDetails<typeof example>();

        const { container } = render(
          <DTest.Details data={example} labelWidth="Narrow">
            <DTest.Number label="Id" qa="id" value={x => x.id} />
            <DTest.String label="Name" qa="name" value={x => x.name} />
            <DTest.Currency label="Cost" qa="cost" value={x => x.cost} />
          </DTest.Details>,
        );

        const totalOneQuarterSections = container.querySelectorAll(".govuk-grid-column-one-quarter");
        const totalThreeQuarterSections = container.querySelectorAll(".govuk-grid-column-three-quarters");

        expect(totalOneQuarterSections).toHaveLength(3);
        expect(totalThreeQuarterSections).toHaveLength(3);
      });

      describe("with labelWidths", () => {
        test("as default", () => {
          const example = { id: 1, name: "example", cost: 100 };
          const DTest = TypedDetails<typeof example>();

          const { container } = render(
            <DTest.Details data={example}>
              <DTest.Number label="Id" qa="id" value={x => x.id} />
              <DTest.String label="Name" qa="name" value={x => x.name} />
              <DTest.Currency label="Cost" qa="cost" value={x => x.cost} />
            </DTest.Details>,
          );

          const totalOneHalfSections = container.querySelectorAll(".govuk-grid-column-one-half");
          const totalOneQuarterSections = container.querySelectorAll(".govuk-grid-column-one-quarter");
          const totalThreeQuarterSections = container.querySelectorAll(".govuk-grid-column-three-quarters");

          expect(totalOneHalfSections).toHaveLength(6);
          expect(totalOneQuarterSections).toHaveLength(0);
          expect(totalThreeQuarterSections).toHaveLength(0);
        });

        test("with Narrow", () => {
          const example = { id: 1, name: "example", cost: 100 };
          const DTest = TypedDetails<typeof example>();

          const { container } = render(
            <DTest.Details data={example} labelWidth="Narrow">
              <DTest.Number label="Id" qa="id" value={x => x.id} />
              <DTest.String label="Name" qa="name" value={x => x.name} />
              <DTest.Currency label="Cost" qa="cost" value={x => x.cost} />
            </DTest.Details>,
          );

          const totalOneHalfSections = container.querySelectorAll(".govuk-grid-column-one-half");
          const totalOneQuarterSections = container.querySelectorAll(".govuk-grid-column-one-quarter");
          const totalThreeQuarterSections = container.querySelectorAll(".govuk-grid-column-three-quarters");

          expect(totalOneHalfSections).toHaveLength(0);
          expect(totalOneQuarterSections).toHaveLength(3);
          expect(totalThreeQuarterSections).toHaveLength(3);
        });

        test("with Wide", () => {
          const example = { id: 1, name: "example", cost: 100 };
          const DTest = TypedDetails<typeof example>();

          const { container } = render(
            <DTest.Details data={example} labelWidth="Wide">
              <DTest.Number label="Id" qa="id" value={x => x.id} />
              <DTest.String label="Name" qa="name" value={x => x.name} />
              <DTest.Currency label="Cost" qa="cost" value={x => x.cost} />
            </DTest.Details>,
          );

          const totalOneHalfSections = container.querySelectorAll(".govuk-grid-column-one-half");
          const totalOneQuarterSections = container.querySelectorAll(".govuk-grid-column-one-quarter");
          const totalThreeQuarterSections = container.querySelectorAll(".govuk-grid-column-three-quarters");

          expect(totalOneHalfSections).toHaveLength(0);
          expect(totalOneQuarterSections).toHaveLength(3);
          expect(totalThreeQuarterSections).toHaveLength(3);
        });
      });
    });
  });

  describe("<DualDetails />", () => {
    describe("@renders", () => {
      const TestChild = ({ title, children }: any) => (
        <div data-id={title}>
          <p>{children}</p>
        </div>
      );

      const setup = (children: DualDetailsProps["children"]) => render(<DualDetails>{children}</DualDetails>);

      describe("with one child", () => {
        test("with one section with title", () => {
          const stubTitleContent = "stub-show-one-child-with-title";
          const stubChildrenContent = "stub-show-one-child-with-content";

          const { container, queryByText } = setup(
            <TestChild title={stubTitleContent}>{stubChildrenContent}</TestChild>,
          );

          const title = queryByText(stubTitleContent);
          const content = queryByText(stubChildrenContent);
          const sections = container.querySelectorAll(".govuk-grid-column-one-half");

          expect(title).toBeInTheDocument();
          expect(content).toBeInTheDocument();

          expect(sections).toHaveLength(2);
        });

        test("with one section without title", () => {
          const stubChildrenContent = "stub-show-one-child-with-content";

          const { container, queryByText } = setup(<TestChild>{stubChildrenContent}</TestChild>);

          const content = queryByText(stubChildrenContent);
          const childSection = container.querySelectorAll(".govuk-grid-column-one-half");

          expect(content).toBeInTheDocument();
          expect(childSection).toHaveLength(1);
        });
      });

      // Note: We're using render() not setup as you cannot sent an array of element without a child node
      describe("with multiple children", () => {
        test("with two sections with two titles", () => {
          const stubFirstTitleContent = "stub-show-first-child-with-title";
          const stubFirstChildrenContent = "stub-show-first-child-with-content";
          const stubSecondTitleContent = "stub-show-second-child-with-title";
          const stubSecondChildrenContent = "stub-show-second-child-with-content";

          const { container, queryByText } = render(
            <DualDetails>
              <TestChild title={stubFirstTitleContent}>{stubFirstChildrenContent}</TestChild>
              <TestChild title={stubSecondTitleContent}>{stubSecondChildrenContent}</TestChild>
            </DualDetails>,
          );

          const sections = container.querySelectorAll(".govuk-grid-column-one-half");

          const firstTitle = queryByText(stubFirstTitleContent);
          const firstContent = queryByText(stubFirstChildrenContent);
          const secondTitle = queryByText(stubSecondTitleContent);
          const secondContent = queryByText(stubSecondChildrenContent);

          expect(firstTitle).toBeInTheDocument();
          expect(firstContent).toBeInTheDocument();

          expect(secondTitle).toBeInTheDocument();
          expect(secondContent).toBeInTheDocument();

          expect(sections).toHaveLength(4);
        });

        test("with two sections with one title", () => {
          const stubFirstTitleContent = "stub-show-first-child-with-title";
          const stubFirstChildrenContent = "stub-show-first-child-with-content";

          const stubSecondChildrenContent = "stub-show-second-child-with-content";

          const { container, queryByText } = render(
            <DualDetails>
              <TestChild title={stubFirstTitleContent}>{stubFirstChildrenContent}</TestChild>
              <TestChild>{stubSecondChildrenContent}</TestChild>
            </DualDetails>,
          );

          const sections = container.querySelectorAll(".govuk-grid-column-one-half");

          const firstTitle = queryByText(stubFirstTitleContent);
          const firstContent = queryByText(stubFirstChildrenContent);

          const secondContent = queryByText(stubSecondChildrenContent);

          expect(firstTitle).not.toBeInTheDocument();
          expect(firstContent).toBeInTheDocument();

          expect(secondContent).toBeInTheDocument();

          expect(sections).toHaveLength(2);
        });
      });
    });
  });
});
