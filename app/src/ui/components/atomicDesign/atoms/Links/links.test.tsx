import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { BackLink, Link } from "./links";

const route: ILinkInfo = {
  path: "stub-path",
  routeName: "test",
  routeParams: { id: "exampleId" },
  accessControl: () => true,
};

const expectedPath = `/${route.path}`;

describe("<Link />", () => {
  describe("@returns", () => {
    test("with path", () => {
      const linkText = "someLinkText";
      const { container } = render(
        <TestBed>
          <Link route={route}>{linkText}</Link>
        </TestBed>,
      );

      const expectedLink = container.querySelector("a");

      if (!expectedLink) throw Error("Link not found to check href value!");

      const linkProps = expectedLink.getAttribute("href");

      expect(linkProps).toBe(expectedPath);
    });

    test("with defined link", () => {
      const expectedGovLink = "govuk-link";

      const { container } = render(
        <TestBed>
          <Link route={route}>stub-link</Link>
        </TestBed>,
      );

      const expectedLink = container.querySelector(`.${expectedGovLink}`);

      if (!expectedLink) throw Error("Gov link not found to check className value!");

      const govClassName = expectedLink.classList.contains(expectedGovLink);

      expect(govClassName).toBeTruthy();
    });

    test("with children", () => {
      const linkText = "someLinkText";
      const { queryByText } = render(
        <TestBed>
          <Link route={route}>{linkText}</Link>
        </TestBed>,
      );

      expect(queryByText(linkText)).toBeInTheDocument();
    });
  });
});

describe("<BackLink />", () => {
  describe("@returns", () => {
    test("with path", () => {
      const linkText = "someLinkText";
      const { container } = render(
        <TestBed>
          <BackLink route={route}>{linkText}</BackLink>
        </TestBed>,
      );

      const expectedLink = container.querySelector("a");

      if (!expectedLink) throw Error("Link not found to check href value!");

      const linkProps = expectedLink.getAttribute("href");

      expect(linkProps).toBe(expectedPath);
    });

    test("with defined link", () => {
      const expectedGovLink = "govuk-back-link";

      const { container } = render(
        <TestBed>
          <BackLink route={route}>stub-link</BackLink>
        </TestBed>,
      );

      const expectedLink = container.querySelector(`.${expectedGovLink}`);

      if (!expectedLink) throw Error("Gov link not found to check className value!");

      const govClassName = expectedLink.classList.contains(expectedGovLink);

      expect(govClassName).toBeTruthy();
    });

    test("with children", () => {
      const linkText = "someLinkText";
      const { queryByText } = render(
        <TestBed>
          <BackLink route={route}>{linkText}</BackLink>
        </TestBed>,
      );

      expect(queryByText(linkText)).toBeInTheDocument();
    });
  });
});
