import ReactDom from "react-dom";
import { Content } from "@content/content";
import { Guide } from "@ui/componentsGuide/guide";
import { TestBed } from "@shared/TestBed";

const ClientGuide = () => {
  function getGuide(): string {
    let query = window.location.search;

    if (!query) return "";

    query = query.substring(1);

    return query
      .split("&")
      .map(x => {
        const parts = x.split("=");
        return {
          key: parts[0] && parts[0].toLowerCase(),
          value: decodeURIComponent(parts[1]),
        };
      })
      .filter(x => x.key === "guide")
      .map(x => x.value)[0];
  }

  return (
    <TestBed content={new Content()} shouldOmitRouterProvider>
      <Guide source="client" filter={getGuide()} />
    </TestBed>
  );
};

ReactDom.render(<ClientGuide />, document.getElementById("root"));
