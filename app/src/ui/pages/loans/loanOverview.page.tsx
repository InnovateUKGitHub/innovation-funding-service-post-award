import { LoanStatus } from "@framework/entities/loan-status";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink } from "@ui/components/atoms/Links/links";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { LoansTable } from "./components/LoansTable";
import { useLoanOverviewData } from "./loanOverview.logic";

interface LoanOverviewParams {
  projectId: ProjectId;
}

const LoansOverviewPage = (props: BaseProps & LoanOverviewParams) => {
  const { getContent } = useContent();

  const { project, loans, fragmentRef } = useLoanOverviewData(props.projectId);
  const pendingLoanIndex = loans.findIndex(x => x.status === LoanStatus.REQUESTED);
  const pendingLoan = loans[pendingLoanIndex];

  const isLastItem = pendingLoanIndex === loans.length - 1;

  return (
    <Page
      fragmentRef={fragmentRef}
      backLink={
        <BackLink route={props.routes.projectOverview.getLink({ projectId: props.projectId })}>
          {getContent(x => x.pages.projectOverview.backToProjects)}
        </BackLink>
      }
    >
      <Section>
        {pendingLoan && (
          <SimpleString>
            {isLastItem
              ? "Your last drawdown request has been received. It is currently being reviewed."
              : `You can request your next drawdown once drawdown ${pendingLoan.period} is approved.`}
          </SimpleString>
        )}
        <LoansTable
          items={loans}
          roles={project.roles}
          createLink={loanId => props.routes.loansRequest.getLink({ projectId: project.id, loanId })}
          caption="Loan overview"
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
    projectId: r.params.projectId as ProjectId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.loansSummary.title),
});
