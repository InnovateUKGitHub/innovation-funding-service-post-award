import { ProjectRole } from "@framework/types";
import { getFirstEdge } from "@gql/selectors/edges";
import { Content, EmailContent, Page, Section } from "@ui/components";
import { ProjectBackLink } from "@ui/components/projects";
import { ProjectStatusMessage } from "@ui/components/projects/ProjectStatusMessage";
import { SimpleString } from "@ui/components/renderers";
import { ShortDateRange } from "@ui/components/renderers/date";
import { PageTitle } from "@ui/features/page-title";
import { useContent } from "@ui/hooks";
import { useLazyLoadQuery } from "relay-hooks";
import { BaseProps, defineRoute } from "../../containerBase";
import { ProjectDetailProjectContactLinkTable } from "./ProjectDetailProjectContactLinkTable";
import { ProjectDetailProjectInformationTable } from "./ProjectDetailProjectInformationTable";
import { ProjectDetailProjectParticipantsProjectTable } from "./ProjectDetailProjectParticipantsProjectTable";
import { projectDetailsQuery } from "./ProjectDetails.query";
import { ProjectDetailsQuery } from "./__generated__/ProjectDetailsQuery.graphql";

interface Params {
  projectId: string;
}

const ProjectDetailsPage = (props: Params & BaseProps) => {
  const { data } = useLazyLoadQuery<ProjectDetailsQuery>(projectDetailsQuery, {
    projectId: props.projectId,
  });
  const { getContent } = useContent();
  const project = getFirstEdge(data?.uiapi.query.Acc_Project__c?.edges).node;

  return (
    <Page
      pageTitle={
        <PageTitle
          title={getContent(x => x.pages.projectDetails.title)}
          caption={`${project?.Acc_ProjectNumber__c?.value} : ${project?.Acc_ProjectTitle__c?.value}`}
        />
      }
      backLink={<ProjectBackLink routes={props.routes} projectId={project.Id} />}
    >
      {project && <ProjectStatusMessage project={project} />}
      <Section
        title={getContent(x =>
          x.projectMessages.currentPeriodInfo({
            currentPeriod: project.Acc_CurrentPeriodNumber__c?.value,
            numberOfPeriods: project.Acc_NumberofPeriods__c?.value,
          }),
        )}
      >
        <SimpleString>
          <ShortDateRange
            start={project.Acc_CurrentPeriodStartDate__c?.value}
            end={project.Acc_CurrentPeriodEndDate__c?.value}
          />
        </SimpleString>
      </Section>
      <Section title={getContent(x => x.projectLabels.projectMembers)}>
        <ProjectDetailProjectContactLinkTable project={project} partnerTypeWhitelist={["Monitoring officer"]} />
        <ProjectDetailProjectContactLinkTable
          beforeContent={
            project.Acc_CompetitionType__c?.value !== "KTP" && (
              <SimpleString>{getContent(x => x.pages.projectDetails.projectManagerInfo)}</SimpleString>
            )
          }
          project={project}
          partnerTypeWhitelist={["Project Manager"]}
        />
        <ProjectDetailProjectContactLinkTable
          project={project}
          partnerTypeWhitelist={["Finance contact"]}
          beforeContent={<SimpleString>{getContent(x => x.pages.projectDetails.financeContactInfo)}</SimpleString>}
          afterContent={
            <SimpleString>
              <Content
                value={x => x.pages.projectDetails.changeInfo}
                components={[<EmailContent key="email" value={x => x.pages.projectDetails.changeEmail} />]}
              />
            </SimpleString>
          }
        />
        <ProjectDetailProjectContactLinkTable
          project={project}
          partnerTypeBlacklist={["Monitoring officer", "Project Manager", "Finance contact"]}
        />
      </Section>
      <ProjectDetailProjectParticipantsProjectTable project={project} />
      <ProjectDetailProjectInformationTable project={project} />
    </Page>
  );
};

export const ProjectDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDetails",
  routePath: "/projects/:projectId/details",
  container: ProjectDetailsPage,
  getParams: r => ({ projectId: r.params.projectId }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectDetails.title),
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
