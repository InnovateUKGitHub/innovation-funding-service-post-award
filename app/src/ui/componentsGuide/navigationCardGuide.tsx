import React from "react";
import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { NavigationCard, NavigationCardsGrid } from "@ui/components/navigationCard";
import { RouterProvider } from "react-router5";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "@ui/redux";
import { SimpleString } from "@ui/components/renderers";
import { IGuide, ILinkInfo } from "@framework/types";

const route = { name: "test", path: "/components" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

const dummyLink: ILinkInfo = {
  routeName: route.name,
  routeParams: {},
  accessControl: () => true
};

export const navigationCardGuide: IGuide = {
  name: "Navigation card",
  options: [
    {
      name: "Simple",
      comments: "A simple card which renders a navigation link",
      example: `<NavigationCard route={dummyLink} label="The link" qa="example" />`,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <NavigationCard route={dummyLink} label="The link" qa="example" />
          </RouterProvider>
        </Provider>
      )
    },
    {
      name: "With content",
      comments: "A card which renders a navigation link with associated text",
      example: `
        <NavigationCard route={dummyLink} label="The link" qa="example">
          <SimpleString>Some text</SimpleString>
        </NavigationCard>
      `,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <NavigationCard route={dummyLink} label="The link" qa="example">
              <SimpleString>Some text</SimpleString>
            </NavigationCard>
          </RouterProvider>
        </Provider>
      )
    },
    {
      name: "Dashboard",
      comments: "A number of card which renders a 3 column dashboard",
      example: `
        <NavigationCardsGrid>
          <NavigationCard route={dummyLink} label="Example link" qa="example">Row 1 column 1</NavigationCard>
          <NavigationCard route={dummyLink} label="Example link" qa="example">Row 1 column 2</NavigationCard>
          <NavigationCard route={dummyLink} label="Example link" qa="example">Row 1 column 3</NavigationCard>
          <NavigationCard route={dummyLink} label="Example link" qa="example">Row 2 column 1</NavigationCard>
          <NavigationCard route={dummyLink} label="Example link" qa="example">Row 2 column 2</NavigationCard>
        </NavigationCardsGrid>
      `,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <NavigationCardsGrid>
              <NavigationCard route={dummyLink} label="Example link" qa="example">Row 1 column 1</NavigationCard>
              <NavigationCard route={dummyLink} label="Example link" qa="example">Row 1 column 2</NavigationCard>
              <NavigationCard route={dummyLink} label="Example link" qa="example">Row 1 column 3</NavigationCard>
              <NavigationCard route={dummyLink} label="Example link" qa="example">Row 2 column 1</NavigationCard>
              <NavigationCard route={dummyLink} label="Example link" qa="example">Row 2 column 2</NavigationCard>
            </NavigationCardsGrid>
          </RouterProvider>
        </Provider>
      )
    }
  ]
};
