import { RouterProvider } from "react-router5";
import { createRouter } from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { render } from "@testing-library/react";

import * as Links from "@ui/components/links";
import { rootReducer } from "@ui/redux/reducers";

const route = { routeName: "test", routeParams: { id: "exampleId" }, accessControl: () => true };
const router = createRouter([{ name: route.routeName, path: "/test/:id" }]).usePlugin(
  browserPluginFactory({ useHash: false }),
);

const expectedPath = `/${route.routeName}/${route.routeParams.id}`;

describe("<Link />", () => {
  describe("@returns", () => {
    test("with path", () => {
      const linkText = "someLinkText";
      const { container } = render(
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.Link route={route}>{linkText}</Links.Link>
          </RouterProvider>
        </Provider>,
      );

      const expectedLink = container.querySelector("a");

      if (!expectedLink) throw Error("Link not found to check href value!");

      const linkProps = expectedLink.getAttribute("href");

      expect(linkProps).toBe(expectedPath);
    });

    test("with defined link", () => {
      const expectedGovLink = "govuk-link";

      const { container } = render(
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.Link route={route}>stub-link</Links.Link>
          </RouterProvider>
        </Provider>,
      );

      const expectedLink = container.querySelector(`.${expectedGovLink}`);

      if (!expectedLink) throw Error("Gov link not found to check className value!");

      const govClassName = expectedLink.classList.contains(expectedGovLink);

      expect(govClassName).toBeTruthy();
    });

    test("with children", () => {
      const linkText = "someLinkText";
      const { queryByText } = render(
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.Link route={route}>{linkText}</Links.Link>
          </RouterProvider>
        </Provider>,
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
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.BackLink route={route}>{linkText}</Links.BackLink>
          </RouterProvider>
        </Provider>,
      );

      const expectedLink = container.querySelector("a");

      if (!expectedLink) throw Error("Link not found to check href value!");

      const linkProps = expectedLink.getAttribute("href");

      expect(linkProps).toBe(expectedPath);
    });

    test("with defined link", () => {
      const expectedGovLink = "govuk-back-link";

      const { container } = render(
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.BackLink route={route}>stub-link</Links.BackLink>
          </RouterProvider>
        </Provider>,
      );

      const expectedLink = container.querySelector(`.${expectedGovLink}`);

      if (!expectedLink) throw Error("Gov link not found to check className value!");

      const govClassName = expectedLink.classList.contains(expectedGovLink);

      expect(govClassName).toBeTruthy();
    });

    test("with children", () => {
      const linkText = "someLinkText";
      const { queryByText } = render(
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.BackLink route={route}>{linkText}</Links.BackLink>
          </RouterProvider>
        </Provider>,
      );

      expect(queryByText(linkText)).toBeInTheDocument();
    });
  });
});
