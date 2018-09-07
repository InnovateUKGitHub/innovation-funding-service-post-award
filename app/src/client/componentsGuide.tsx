import React from "react";
import ReactDom from "react-dom";
import { Guide } from "../ui/componentsGuide/guide";

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

ReactDom.render(<Guide source={"client"} filter={getGuide()} />, document.getElementById("root"));
