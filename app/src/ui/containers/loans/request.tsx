import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getPending } from "@ui/helpers/get-pending";
import { useContent } from "@ui/hooks";
import { Pending } from "@shared/pending";
import { LoanDto } from "@framework/dtos/loanDto";
import { noop } from "@ui/helpers/noop";

interface LoansRequestParams {
  projectId: string;
  loanId: string;
}

interface LoansRequestProps extends BaseProps, LoansRequestParams {}

// TODO: Throw an error if you request a page which is not the first "Planned" period
function LoansRequestPage(props: LoansRequestProps) {
  const stores = useStores();
  const { getContent } = useContent();

  const loansPending = Pending.done(null);
  const { isLoading, isRejected, payload } = getPending(loansPending);

  const titleElement = (
    <ACC.PageTitle caption="CAPTION_MESSAGE" title={isLoading ? "TITLE_LOADING_MESSAGE" : undefined} />
  );

  const backLinkElement = (
    <ACC.BackLink route={props.routes.loansSummary.getLink({ projectId: props.projectId })}>
      Back to loans summary page
    </ACC.BackLink>
  );

  return (
    <ACC.Page pageTitle={titleElement} backLink={backLinkElement}>
      {isLoading && <ACC.Renderers.SimpleString>loading message</ACC.Renderers.SimpleString>}

      {isRejected && <ACC.Renderers.SimpleString>Rejected message</ACC.Renderers.SimpleString>}

      {payload && (
        <>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </>
      )}
    </ACC.Page>
  );
}

export const LoansRequestRoute = defineRoute<LoansRequestParams>({
  routeName: "loansRequest",
  routePath: "/loans/:projectId/:loanId",
  container: LoansRequestPage,
  getParams: r => ({
    projectId: r.params.projectId,
    loanId: r.params.loanId,
  }),
  // TODO: Replace this
  getTitle: x => x.content.loansSummary.title(),
});
