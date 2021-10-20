import { render } from "@testing-library/react";

import TestBed from "@shared/TestBed";
import { Title, TitleProps } from "../../../src/ui/components/projects/title";

describe("<Title />", () => {
  const setup = (props: TitleProps) =>
    render(
      <TestBed>
        <Title {...props} />
      </TestBed>,
    );

  test("should render with required props", () => {
    const stubProject: TitleProps = {
      projectNumber: "000000",
      title: "stub-title",
    };
    const { queryByText } = setup(stubProject);

    const expectedTitle = queryByText(`${stubProject.projectNumber} : ${stubProject.title}`);

    expect(expectedTitle).toBeTruthy();
  });

  test("should pass heading to PageTitle", () => {
    const stubProject: TitleProps = {
      projectNumber: "000000",
      title: "stub-title",
      heading: "stub-heading",
    };
    const { queryByText } = setup(stubProject);
    const expectedHeading = queryByText("stub-heading");

    expect(expectedHeading).toBeTruthy();
  });
});
