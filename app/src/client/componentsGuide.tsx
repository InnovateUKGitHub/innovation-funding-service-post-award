import React from "react";
import ReactDom from "react-dom";
import { Guide } from "../ui/componentsGuide/guide";
import { Provider } from "react-redux";
import { PageTitleState } from "@ui/redux/reducers/pageTitleReducer";
import { combineReducers, createStore } from "redux";
import { ContentProvider } from "@ui/redux";
import { Content } from "@content/content";

const exampleTitle: PageTitleState = {
  displayTitle: "Component guide example title",
  htmlTitle: "Example title",
};

const reducer = combineReducers({
  title: (s: PageTitleState = exampleTitle) => s,
});

const store = createStore(reducer, { title: exampleTitle });

const ClientGuide = () => {
  function getGuide(): string {
    let query = window.location.search;

    if (!query) return "";

    query = query.substring(1);
    return query
      .split("&")
      .map((x) => {
        const parts = x.split("=");
        return {
          key: parts[0] && parts[0].toLowerCase(),
          value: decodeURIComponent(parts[1]),
        };
      })
      .filter((x) => x.key === "guide")
      .map((x) => x.value)[0];
  }

  return (
    <Provider store={store}>
      <ContentProvider value={new Content(null)}>
        <Guide source="client" filter={getGuide()} />
      </ContentProvider>
    </Provider>
  );
};

ReactDom.render(<ClientGuide />, document.getElementById("root"));
