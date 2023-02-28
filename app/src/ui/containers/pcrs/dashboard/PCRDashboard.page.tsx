import { ProjectRole } from "@framework/types";
import { getDefinedEdges, getFirstEdge } from "@gql/selectors/edges";
import { Accordion, AccordionItem, Link, Page } from "@ui/components";
import { ProjectBackLink } from "@ui/components/projects";
import { PageTitle } from "@ui/features/page-title";
import { useContent } from "@ui/hooks";
import { useLazyLoadQuery } from "react-relay";
import { BaseProps, defineRoute } from "../../containerBase";
import { collateProjectChangeRequests } from "./PCRDashboard.logic";
import { pcrDashboardQuery } from "./PCRDashboard.query";
import { PCRDashboardTable } from "./PCRDashboardTable";
import { PCRDashboardQuery } from "./__generated__/PCRDashboardQuery.graphql";

const PCRsDashboardContainer = (props: BaseProps) => {
  const { getContent } = useContent();

  const data = useLazyLoadQuery<PCRDashboardQuery>(
    pcrDashboardQuery,
    {
      projectId: props.projectId,
    },
    {
      fetchPolicy: "network-only",
      networkCacheConfig: {
        force: true,
      },
    },
  );

  const { node: project } = getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges);
  const { isPm } = project.roles;
  const pcrs = getDefinedEdges(project.Project_Change_Requests__r?.edges);

  const collated = collateProjectChangeRequests(pcrs);

  return (
    <Page
      pageTitle={
        <PageTitle
          title={getContent(x => x.pages.pcrsDashboard.title)}
          caption={`${project?.Acc_ProjectNumber__c?.value} : ${project?.Acc_ProjectTitle__c?.value}`}
        />
      }
      backLink={<ProjectBackLink routes={props.routes} projectId={project.Id as ProjectId} />}
    >
      <PCRDashboardTable active qa="pcrs-active" collated={collated} project={project} routes={props.routes} />
      {project.isActive && isPm && (
        <Link route={props.routes.pcrCreate.getLink({ projectId: project.Id as ProjectId })} className="govuk-button">
          {getContent(x => x.pages.pcrsDashboard.create)}
        </Link>
      )}
      <Accordion>
        <AccordionItem title="Past requests" qa="past-requests">
          <PCRDashboardTable archived qa="pcrs-archived" collated={collated} project={project} routes={props.routes} />
        </AccordionItem>
      </Accordion>
    </Page>
  );
};

export const PCRsDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "pcrsDashboard",
  routePath: "/projects/:projectId/pcrs/dashboard",
  container: PCRsDashboardContainer,
  getParams: route => ({
    projectId: route.params.projectId,
  }),
  getTitle: x => x.content.getTitleCopy(y => y.pages.pcrsDashboard.title),
  accessControl: (auth, { projectId }) =>
    auth
      .forProject(projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
