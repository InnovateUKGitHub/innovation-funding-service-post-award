import { Section, SummaryList, SummaryListItem } from "@ui/components";
import { FullDate, SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { useFragment } from "relay-hooks";
import { projectDetailProjectInformationTableFragment } from "./ProjectDetailProjectInformationTable.fragment";
import { ProjectDetailProjectInformationTableFragment$key } from "./__generated__/ProjectDetailProjectInformationTableFragment.graphql";

const ProjectDetailProjectInformationTable = ({
  project,
}: {
  project: ProjectDetailProjectInformationTableFragment$key;
}) => {
  const { getContent } = useContent();
  const data = useFragment(projectDetailProjectInformationTableFragment, project);

  return (
    <Section title={getContent(x => x.projectLabels.projectInformation)} qa="project-details">
      <SummaryList qa="project-information">
        {data.Acc_CompetitionId__r?.Name?.value && (
          <SummaryListItem
            label={x => x.projectLabels.competitionName}
            qa="competition-name"
            content={data.Acc_CompetitionId__r?.Name?.value}
          />
        )}

        <SummaryListItem
          label={x => x.projectLabels.competitionType}
          qa="competition-type"
          content={data.Acc_CompetitionType__c?.value}
        />

        <SummaryListItem
          label={x => x.projectLabels.startDate}
          qa="start-date"
          content={<FullDate value={data.Acc_StartDate__c?.value} />}
        />

        <SummaryListItem
          label={x => x.projectLabels.endDate}
          qa="end-date"
          content={
            <FullDate
              value={
                data.Acc_CompetitionType__c?.value === "LOANS"
                  ? data.Loan_LoanEndDate__c?.value
                  : data.Acc_EndDate__c?.value
              }
            />
          }
        />

        {data.Acc_CompetitionType__c?.value === "LOANS" ? (
          <>
            <SummaryListItem
              qa="availability-period"
              label={x => x.projectLabels.availabilityPeriod}
              content={getContent(x =>
                x.projectLabels.months({ count: data.Loan_LoanAvailabilityPeriodLength__c?.value }),
              )}
            />
            <SummaryListItem
              qa="extension-period"
              label={x => x.projectLabels.extensionPeriod}
              content={getContent(x =>
                x.projectLabels.months({ count: data.Loan_LoanExtensionPeriodLength__c?.value }),
              )}
            />
            <SummaryListItem
              qa="repayment-period"
              label={x => x.projectLabels.repaymentPeriod}
              content={getContent(x =>
                x.projectLabels.months({ count: data.Loan_LoanRepaymentPeriodLength__c?.value }),
              )}
            />
          </>
        ) : (
          <>
            <SummaryListItem
              label={x => x.projectLabels.duration}
              qa="duration"
              content={getContent(x => x.projectLabels.months({ count: data.Acc_Duration__c?.value }))}
            />

            <SummaryListItem
              label={x => x.projectLabels.numberOfPeriods}
              qa="periods"
              content={data.Acc_NumberofPeriods__c?.value}
            />
          </>
        )}

        <SummaryListItem
          label={x => x.projectLabels.scope}
          qa="scope"
          content={<SimpleString multiline>{data.Acc_ProjectSummary__c?.value}</SimpleString>}
        />
      </SummaryList>
    </Section>
  );
};

export { ProjectDetailProjectInformationTable };
