import { LoanStatus } from "@framework/entities";
import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";
import { LoanDto } from "@framework/dtos";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getPending } from "@ui/helpers/get-pending";
import { useContent } from "@ui/hooks";
import { Pending } from "@shared/pending";

import { LoansTable } from "./components/LoansTable";

interface LoansOverviewParams {
  projectId: string;
}

interface LoansOverviewProps extends BaseProps {
  projectId: string;
  loans: LoanDto[];
}

function LoansOverview({ loans, routes, projectId }: LoansOverviewProps) {
  const pendingLoanIndex = loans.findIndex(x => x.status === LoanStatus.REQUESTED);
  const pendingLoan = loans[pendingLoanIndex];

  const isLastItem = pendingLoanIndex === loans.length - 1;

  return (
    <ACC.Section>
      {pendingLoan && (
        <ACC.Renderers.SimpleString>
          {isLastItem
            ? "Your last drawdown request has been received. It is currently being reviewed."
            : `You can request your next drawdown once drawdown ${pendingLoan.period} is approved.`}
        </ACC.Renderers.SimpleString>
      )}

      <LoansTable items={loans} createLink={loanId => routes.loansRequest.getLink({ projectId, loanId })} />
    </ACC.Section>
  );
}

export type LoansOverviewContainerProps = BaseProps & LoansOverviewParams;

export function LoansOverviewContainer({ projectId, ...props }: LoansOverviewContainerProps) {
  const { getContent } = useContent();
  const stores = useStores();

  const loansPending = stores.loans.getAll(projectId);
  const projectPending = stores.projects.getById(projectId);
  const pagePending = Pending.combine({ project: projectPending, loans: loansPending });

  const { isRejected, isResolved, payload } = getPending(pagePending);

  const pageTitleValue =
    isResolved && !!payload ? (
      <ACC.Projects.Title {...payload.project} />
    ) : (
      <ACC.Renderers.SimpleString>{getContent(x => x.loansSummary.loadingDrawdowns)}</ACC.Renderers.SimpleString>
    );

  return (
    <ACC.Page
      pageTitle={pageTitleValue}
      backLink={
        <ACC.BackLink route={props.routes.projectOverview.getLink({ projectId })}>
          {getContent(x => x.projectOverview.backToProjects)}
        </ACC.BackLink>
      }
    >
      {isRejected && (
        <ACC.Renderers.SimpleString>
          {getContent(x => x.loansSummary.rejectedDrawdownsError)}
        </ACC.Renderers.SimpleString>
      )}

      {payload && <LoansOverview projectId={projectId} loans={payload.loans} {...props} />}
    </ACC.Page>
  );
}

export const LoansSummaryRoute = defineRoute<LoansOverviewParams>({
  routeName: "loansSummary",
  routePath: "/loans/:projectId",
  container: LoansOverviewContainer,
  getParams: r => ({
    projectId: r.params.projectId,
  }),
  getTitle: x => x.content.loansSummary.title(),
});
