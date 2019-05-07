import React from "react";
import ReactDom from "react-dom";
import { Guide } from "../ui/componentsGuide/guide";
import { Provider } from "react-redux";
import { PageTitleState } from "@framework/ui/redux/reducers/pageTitleReducer";
import { combineReducers, createStore } from "redux";

function getGuide(): string {
    let query = window.location.search;
    if (query) {
        query = query.substring(1);
        return query.split("&")
            .map(x => {
                const parts = x.split("=");
                return { key: parts[0] && parts[0].toLowerCase(), value: decodeURIComponent(parts[1]) };
            })
            .filter(x => x.key === "guide")
            .map(x => x.value)[0];
    }
    return "";
}

const exampleTitle: PageTitleState = {
    displayTitle: "Component guide example title",
    htmlTitle: "Example title",
};

const reducer = combineReducers({
    title: (s: PageTitleState = exampleTitle) => s
});

const store = createStore(reducer, { title: exampleTitle });

const rootComponent = (
    <Provider store={store}>
        <Guide source={"client"} filter={getGuide()} />
    </Provider>
);

ReactDom.render(rootComponent, document.getElementById("root"));
