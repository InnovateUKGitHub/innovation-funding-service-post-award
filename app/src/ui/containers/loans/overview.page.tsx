import { Section, Page, Projects, BackLink, Renderers } from "@ui/components";
import { LoanStatus } from "@framework/entities";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { LoansTable } from "./components/LoansTable";
import { useLoanOverviewData } from "./loanOverview.logic";

interface LoanOverviewParams {
  projectId: string;
}

const LoansOverviewPage = (props: BaseProps & LoanOverviewParams) => {
  const { getContent } = useContent();

  const { project, loans } = useLoanOverviewData(props.projectId);
  const pendingLoanIndex = loans.findIndex(x => x.status === LoanStatus.REQUESTED);
  const pendingLoan = loans[pendingLoanIndex];

  const isLastItem = pendingLoanIndex === loans.length - 1;

  return (
    <Page
      backLink={
        <BackLink route={props.routes.projectOverview.getLink({ projectId: props.projectId })}>
          {getContent(x => x.pages.projectOverview.backToProjects)}
        </BackLink>
      }
      pageTitle={<Projects.Title title={project.title} projectNumber={project.projectNumber} />}
    >
      <Section>
        {pendingLoan && (
          <Renderers.SimpleString>
            {isLastItem
              ? "Your last drawdown request has been received. It is currently being reviewed."
              : `You can request your next drawdown once drawdown ${pendingLoan.period} is approved.`}
          </Renderers.SimpleString>
        )}
        <LoansTable
          items={loans}
          roles={project.roles}
          createLink={loanId => props.routes.loansRequest.getLink({ projectId: project.id, loanId })}
        />
      </Section>
    </Page>
  );
};

export const LoansSummaryRoute = defineRoute<LoanOverviewParams>({
  routeName: "loansSummary",
  routePath: "/loans/:projectId",
  container: LoansOverviewPage,
  getParams: r => ({
    projectId: r.params.projectId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.loansSummary.title),
});
