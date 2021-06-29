import { render } from "@testing-library/react";

import { Section, SectionProps } from "@ui/components/layout/section";

describe("Section", () => {
  const setup = (props: SectionProps) => render(<Section {...props} />);

  it("should the render the title", () => {
    const stubTitle = "stub-title";
    const { getByRole } = setup({ title: stubTitle });

    const titleElement = getByRole("heading", { name: new RegExp(stubTitle) });

    expect(titleElement).toBeInTheDocument();
  });

  it("should the render the sub title", () => {
    const stubSubTitle = "stub-sub-title";
    const { getByText } = setup({ subtitle: stubSubTitle });

    const subTitleElement = getByText(stubSubTitle);

    expect(subTitleElement).toBeInTheDocument();
  });

  it("should the render the content", () => {
    const stubContent = "stub-content";

    const { queryByText } = setup({ children: stubContent });

    expect(queryByText(stubContent)).toBeInTheDocument();
  });

  it("should the render the badge", () => {
    const stubBadge = "stub-badge";

    const { queryByText } = setup({ badge: <p>{stubBadge}</p> });

    expect(queryByText(stubBadge)).toBeInTheDocument();
  });

  it("should the render h2 subsection", () => {
    const stubTitle = "stub-title";
    const { getByRole } = setup({ title: stubTitle });

    const titleElement = getByRole("heading", { name: new RegExp(stubTitle) });

    expect(titleElement.nodeName).toBe("H2");
  });
});
