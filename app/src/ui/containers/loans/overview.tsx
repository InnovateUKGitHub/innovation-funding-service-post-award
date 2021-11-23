import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getPending } from "@ui/helpers/get-pending";
import { useContent } from "@ui/hooks";
import { Pending } from "@shared/pending";

interface LoansSummaryParams {
  projectId: string;
}

interface LoansSummaryProps extends BaseProps, LoansSummaryParams {}

function LoansSummaryPage(props: LoansSummaryProps) {
  const stores = useStores();
  const { getContent } = useContent();

  const stubPending = Pending.done(null);
  const { isLoading, isRejected, payload } = getPending(stubPending);

  const titleElement = (
    <ACC.PageTitle caption="CAPTION_MESSAGE" title={isLoading ? "TITLE_LOADING_MESSAGE" : undefined} />
  );

  const backLinkElement = (
    <ACC.BackLink route={props.routes.projectDashboard.getLink({})}>
      {getContent(x => x.projectOverview.backToProjects)}
    </ACC.BackLink>
  );

  return (
    <ACC.Page pageTitle={titleElement} backLink={backLinkElement}>
      {isLoading && <ACC.Renderers.SimpleString>loading message</ACC.Renderers.SimpleString>}

      {isRejected && <ACC.Renderers.SimpleString>Rejected message</ACC.Renderers.SimpleString>}

      {payload && <pre>{JSON.stringify(payload, null, 2)}</pre>}
    </ACC.Page>
  );
}

export const LoansSummaryRoute = defineRoute<LoansSummaryParams>({
  routeName: "loansSummary",
  routePath: "/loans/:projectId",
  container: LoansSummaryPage,
  getParams: r => ({
    projectId: r.params.projectId,
  }),
  getTitle: x => x.content.loansSummary.title(),
});
