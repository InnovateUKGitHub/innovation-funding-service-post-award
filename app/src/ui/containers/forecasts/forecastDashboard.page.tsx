import { roundCurrency } from "@framework/util";
import { ProjectRole } from "@framework/constants";
import { Page, Projects, Section, TypedTable, getPartnerName, Content } from "../../components";
import { BaseProps, defineRoute } from "../containerBase";
import { useForecastDashboardData, Partner } from "./forecastDashboard.logic";

interface Params {
  projectId: string;
}

const ForecastDashboardPage = (props: Params & BaseProps) => {
  const Table = TypedTable<Partner>();
  const { project, partners } = useForecastDashboardData(props.projectId);

  return (
    <Page
      pageTitle={<Projects.Title {...project} />}
      backLink={<Projects.ProjectBackLink routes={props.routes} projectId={project.id} />}
      projectStatus={project.status}
    >
      <Section qa="project-forecasts">
        <Table.Table data={partners} qa="partner-table">
          <Table.Custom
            header={x => x.pages.forecastsDashboard.headerPartner}
            value={x => getPartnerName(x, true)}
            qa="partner"
          />
          <Table.Currency
            header={x => x.pages.forecastsDashboard.headerTotalEligibleCosts}
            value={x => x.totalParticipantCosts}
            qa="grant-offered"
          />
          <Table.Currency
            header={x => x.pages.forecastsDashboard.headerForecastsAndCosts}
            value={x => x.forecastsAndCosts}
            qa="forecasts-and-costs"
          />
          <Table.Currency
            header={x => x.pages.forecastsDashboard.headerUnderspend}
            value={x => roundCurrency(x.totalParticipantCosts ?? 0 - x.forecastsAndCosts)}
            qa="underspend"
          />
          <Table.ShortDate
            header={x => x.pages.forecastsDashboard.headerLastUpdate}
            value={x => x.forecastLastModifiedDate}
            qa="last-updated"
          />
          <Table.Link
            header={x => x.pages.forecastsDashboard.headerAction}
            hideHeader
            value={x => props.routes.forecastDetails.getLink({ projectId: props.projectId, partnerId: x.id })}
            content={<Content value={x => x.pages.forecastsDashboard.viewForecast} />}
            qa="view-partner-forecast"
          />
        </Table.Table>
      </Section>
    </Page>
  );
};

export const ForecastDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectForecasts",
  routePath: "/projects/:projectId/forecasts",
  container: ForecastDashboardPage,
  getParams: r => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsDashboard.title),
});
