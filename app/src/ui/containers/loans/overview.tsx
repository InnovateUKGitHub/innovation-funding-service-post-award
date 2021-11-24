import { useStores } from "@ui/redux";

import { useContent } from "@ui/hooks";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getPending } from "@ui/helpers/get-pending";

import * as ACC from "@ui/components";
import { LoansTable } from "./components/LoansTable";

interface LoansSummaryParams {
  projectId: string;
}

export interface LoansSummaryProps extends BaseProps, LoansSummaryParams {}

export function LoansSummaryPage({ routes, projectId }: LoansSummaryProps) {
  const { getContent } = useContent();
  const stores = useStores();

  const loansPending = stores.loans.getAll(projectId);
  const projectPending = stores.projects.getById(projectId);
  const pagePending = Pending.combine({ project: projectPending, loans: loansPending });

  const { isLoading, isRejected, payload } = getPending(pagePending);

  const pageTitleValue =
    !isLoading && payload ? (
      <ACC.Projects.Title {...payload.project} />
    ) : (
      <ACC.Renderers.SimpleString>{getContent(x => x.loansSummary.loadingDrawdowns)}</ACC.Renderers.SimpleString>
    );

  return (
    <ACC.Page
      pageTitle={pageTitleValue}
      backLink={
        <ACC.BackLink route={routes.projectOverview.getLink({ projectId })}>
          {getContent(x => x.projectOverview.backToProjects)}
        </ACC.BackLink>
      }
    >
      {isRejected && (
        <ACC.Renderers.SimpleString>
          {getContent(x => x.loansSummary.rejectedDrawdownsError)}
        </ACC.Renderers.SimpleString>
      )}

      {payload && (
        <ACC.Section>
          <LoansTable items={payload.loans} createLink={loanId => routes.loansRequest.getLink({ projectId, loanId })} />
        </ACC.Section>
      )}
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
