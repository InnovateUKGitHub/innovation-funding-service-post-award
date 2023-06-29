import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { Section, SectionProps } from "@ui/components/atomicDesign/molecules/Section/section";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ContentSelector, PossibleCopyStrings } from "@copy/type";

describe("<Section />", () => {
  const stubContent = {
    stubCategory: {
      stubValue: "stub-content-solution-value",
    },
  };

  const setup = (props?: SectionProps) =>
    render(
      <TestBed>
        <Section {...props} />
      </TestBed>,
    );

  beforeAll(async () => {
    initStubTestIntl(stubContent);
  });

  describe("with edge cases", () => {
    test("should render null when no data is passed", () => {
      const { container } = setup();

      expect(container.firstChild).toBeNull();
    });
  });

  describe("with a title", () => {
    test("as a string", () => {
      const stubTitle = "stub-title";
      const { getByRole } = setup({ title: stubTitle });

      const titleElement = getByRole("heading", { name: new RegExp(stubTitle) });

      expect(titleElement).toBeInTheDocument();
    });

    test("as a content solution", () => {
      const stubTitleContentSolution = ((x: typeof stubContent) =>
        x.stubCategory.stubValue) as unknown as ContentSelector<PossibleCopyStrings>;
      const { queryByText } = setup({ title: stubTitleContentSolution });

      const titleElement = queryByText(stubContent.stubCategory.stubValue);

      expect(titleElement).toBeInTheDocument();
    });

    test("with no value", () => {
      const { queryByTestId } = setup();

      const subTitleElement = queryByTestId("section-title");

      expect(subTitleElement).not.toBeInTheDocument();
    });
  });

  describe("with a subtitle", () => {
    test("as a string", () => {
      const stubSubTitle = "stub-sub-title";
      const { getByText } = setup({ subtitle: stubSubTitle });

      const subTitleElement = getByText(stubSubTitle);

      expect(subTitleElement).toBeInTheDocument();
    });

    test("as a content solution", () => {
      const stubSubTitleContentSolution = ((x: typeof stubContent) =>
        x.stubCategory.stubValue) as unknown as ContentSelector<PossibleCopyStrings>;
      const { queryByText } = setup({ subtitle: stubSubTitleContentSolution });

      const subTitleElement = queryByText(stubContent.stubCategory.stubValue);

      expect(subTitleElement).toBeInTheDocument();
    });

    test("with no value", () => {
      const { queryByTestId } = setup();

      const subTitleElement = queryByTestId("section-subtitle");

      expect(subTitleElement).not.toBeInTheDocument();
    });
  });

  describe("with content", () => {
    test("with a node", () => {
      const stubContentValue = "stub-content";

      const { queryByText } = setup({ children: <p>{stubContentValue}</p> });

      expect(queryByText(stubContentValue)).toBeInTheDocument();
    });

    test("with no value", () => {
      const { queryByTestId } = setup({ title: "defined-tile-to-show-content" });

      expect(queryByTestId("section-content")).not.toBeInTheDocument();
    });
  });

  describe("with badge", () => {
    test("when node", () => {
      const stubBadge = "stub-badge";

      const { queryByText } = setup({ badge: <p>{stubBadge}</p> });

      expect(queryByText(stubBadge)).toBeInTheDocument();
    });

    test("with no value", () => {
      const { queryByTestId } = setup({ children: <p>some content</p> });

      expect(queryByTestId("section-badge")).not.toBeInTheDocument();
    });
  });

  describe("with correct nested heading elements", () => {
    test("with first level returns h2", () => {
      const stubTitle = "stub-title-level-1";
      const { getByRole } = setup({ title: stubTitle });

      const titleElement = getByRole("heading", { name: new RegExp(stubTitle) });

      expect(titleElement.nodeName).toBe("H2");
    });

    test("with second level returns h3", () => {
      const stubTitleLevel1 = "stub-title-level-1";
      const stubTitleLevel2 = "stub-title-level-2";

      const { getByRole } = render(
        <TestBed>
          <Section title={stubTitleLevel1}>
            <Section title={stubTitleLevel2} />
          </Section>
        </TestBed>,
      );

      const titleLevel1 = getByRole("heading", { name: new RegExp(stubTitleLevel1) });
      const titleLevel2 = getByRole("heading", { name: new RegExp(stubTitleLevel2) });

      expect(titleLevel1.nodeName).toBe("H2");
      expect(titleLevel2.nodeName).toBe("H3");
    });

    test("with third level returns h4", () => {
      const stubTitleLevel1 = "stub-title-level-1";
      const stubTitleLevel2 = "stub-title-level-2";
      const stubTitleLevel3 = "stub-title-level-3";

      const { getByRole } = render(
        <TestBed>
          <Section title={stubTitleLevel1}>
            <Section title={stubTitleLevel2}>
              <Section title={stubTitleLevel3} />
            </Section>
          </Section>
        </TestBed>,
      );

      const titleLevel1 = getByRole("heading", { name: new RegExp(stubTitleLevel1) });
      const titleLevel2 = getByRole("heading", { name: new RegExp(stubTitleLevel2) });
      const titleLevel3 = getByRole("heading", { name: new RegExp(stubTitleLevel3) });

      expect(titleLevel1.nodeName).toBe("H2");
      expect(titleLevel2.nodeName).toBe("H3");
      expect(titleLevel3.nodeName).toBe("H4");
    });

    test("with forth level and onwards returns h4", () => {
      const stubTitleLevel1 = "stub-title-level-1";
      const stubTitleLevel2 = "stub-title-level-2";
      const stubTitleLevel3 = "stub-title-level-3";
      const stubTitleLevel4 = "stub-title-level-4";

      const { getByRole } = render(
        <TestBed>
          <Section title={stubTitleLevel1}>
            <Section title={stubTitleLevel2}>
              <Section title={stubTitleLevel3}>
                <Section title={stubTitleLevel4} />
              </Section>
            </Section>
          </Section>
        </TestBed>,
      );

      const titleLevel1 = getByRole("heading", { name: new RegExp(stubTitleLevel1) });
      const titleLevel2 = getByRole("heading", { name: new RegExp(stubTitleLevel2) });
      const titleLevel3 = getByRole("heading", { name: new RegExp(stubTitleLevel3) });
      const titleLevel4 = getByRole("heading", { name: new RegExp(stubTitleLevel4) });

      expect(titleLevel1.nodeName).toBe("H2");
      expect(titleLevel2.nodeName).toBe("H3");
      expect(titleLevel3.nodeName).toBe("H4");
      expect(titleLevel4.nodeName).toBe("H4");
    });
  });
});
