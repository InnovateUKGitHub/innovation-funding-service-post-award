import { ProjectRole } from "@framework/constants/project";
import { BaseProps, defineRoute } from "../../containerBase";
import { useForecastDashboardData, Partner } from "./forecastDashboard.logic";
import { useContent } from "@ui/hooks/content.hook";
import { roundCurrency } from "@framework/util/numberHelper";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { getPartnerName } from "@ui/components/atomicDesign/organisms/partners/utils/partnerName";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";

interface Params {
  projectId: ProjectId;
}

const Table = createTypedTable<Partner>();
const ForecastDashboardPage = (props: Params & BaseProps) => {
  const { project, partners } = useForecastDashboardData(props.projectId);
  const { getContent } = useContent();

  return (
    <Page
      pageTitle={<Title {...project} />}
      backLink={<ProjectBackLink projectId={project.id} />}
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
            value={x => x.totalParticipantGrant ?? 0}
            qa="grant-offered"
          />
          <Table.Currency
            header={x => x.pages.forecastsDashboard.headerForecastsAndCosts}
            value={x => x.forecastsAndCosts}
            qa="forecasts-and-costs"
          />
          <Table.Currency
            header={x => x.pages.forecastsDashboard.headerUnderspend}
            value={x => roundCurrency(x.totalParticipantGrant ?? 0 - x.forecastsAndCosts)}
            qa="underspend"
          />
          <Table.ShortDate
            header={x => x.pages.forecastsDashboard.headerLastUpdate}
            value={x => x.forecastLastModifiedDate}
            qa="last-updated"
            nullDisplay={<AccessibilityText>{getContent(x => x.components.claimLastModified.never)}</AccessibilityText>}
          />
          <Table.Link
            header={x => x.pages.forecastsDashboard.headerAction}
            hideHeader
            value={x => props.routes.viewForecast.getLink({ projectId: props.projectId, partnerId: x.id })}
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
  getParams: r => ({ projectId: r.params.projectId as ProjectId }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsDashboard.title),
});
