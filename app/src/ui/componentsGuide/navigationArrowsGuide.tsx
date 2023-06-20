import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { createStore } from "redux";
import { IGuide } from "@framework/types/IGuide";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { NavigationArrows } from "@ui/components/navigationArrows";
import { rootReducer } from "@ui/redux/reducers/rootReducer";

const route = { name: "test", path: "/components" };

interface DummyLink {
  label: string;
  route: ILinkInfo;
}

const previousLink: DummyLink = {
  label: "The previous item",
  route: {
    routeName: route.name,
    path: route.name,
    routeParams: {},
    accessControl: () => true,
  },
};

const nextLink: DummyLink = {
  label: "The next item",
  route: {
    routeName: route.name,
    path: route.name,
    routeParams: {},
    accessControl: () => true,
  },
};

const history = createMemoryHistory();

export const navigationArrowsGuide: IGuide = {
  name: "Navigation arrows",
  options: [
    {
      name: "First cost category",
      comments: "Renders only the 'Next' arrow",
      example: `<NavigationArrows previousLink={null} nextLink={nextLink} />`,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <Router location={history.location} navigator={history}>
            <NavigationArrows previousLink={null} nextLink={nextLink} />
          </Router>
        </Provider>
      ),
    },
    {
      name: "Middle cost category",
      comments: "Renders the 'Next' & 'Previous' arrows",
      example: `<NavigationArrows previousLink={previousLink} nextLink={previousLink} />`,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <Router location={history.location} navigator={history}>
            <NavigationArrows previousLink={previousLink} nextLink={nextLink} />
          </Router>
        </Provider>
      ),
    },
    {
      name: "Last cost category",
      comments: "Renders only the 'Previous' arrow",
      example: `<NavigationArrows previousLink={previousLink} nextLink={null} />`,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <Router location={history.location} navigator={history}>
            <NavigationArrows previousLink={previousLink} nextLink={null} />
          </Router>
        </Provider>
      ),
    },
  ],
};
