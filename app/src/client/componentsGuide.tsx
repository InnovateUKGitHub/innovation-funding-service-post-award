import ReactDom from "react-dom/client";

import { TestBed } from "@shared/TestBed";
import { Guide } from "@ui/componentsGuide/guide";

/**
 * parses query string to get name of component to display in the guide
 */
function getGuide() {
  let query = window.location.search;
  if (!query) return "";
  query = query.substring(1);
  const m = query.match(/guide=(\w+)&?/);
  if (!m) return "";
  return m[1];
}

const ClientGuide = () => (
  <TestBed shouldOmitRouterProvider>
    <Guide source="client" filter={getGuide()} />
  </TestBed>
);

const rootNode = document.getElementById("root");
if (!rootNode) throw new Error("cannot find root node to attach component guide to");

ReactDom.createRoot(rootNode).render(<ClientGuide />);
