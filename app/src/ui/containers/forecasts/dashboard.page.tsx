import { Pending } from "@shared/pending";
import { ClaimDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { useStores } from "@ui/redux";
import { roundCurrency } from "@framework/util";
import { ProjectRole } from "@framework/constants";
import * as ACC from "../../components";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  activeClaims: Pending<ClaimDto[]>;
}

interface Params {
  projectId: string;
}

class ProjectForecastComponent extends ContainerBase<Params, Data> {
  render() {
    const combined = Pending.combine({
      projectDetails: this.props.projectDetails,
      partners: this.props.partners,
      activeClaims: this.props.activeClaims,
    });

    return (
      <ACC.PageLoader
        pending={combined}
        render={x => this.renderContents(x.projectDetails, x.partners, x.activeClaims)}
      />
    );
  }

  private renderContents(project: ProjectDto, partners: PartnerDto[], activeClaims: ClaimDto[]) {
    const Table = ACC.TypedTable<PartnerDto>();

    const getForecastsAndCosts = (partner: PartnerDto) => {
      const claim = activeClaims.find(x => x.partnerId === partner.id);
      const claimCost = claim ? claim.totalCost || 0 : 0;
      return (
        claimCost + (partner.totalFutureForecastsForParticipants || 0) + (partner.totalParticipantCostsClaimed || 0)
      );
    };

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title {...project} />}
        backLink={<ACC.Projects.ProjectBackLink routes={this.props.routes} projectId={project.id} />}
        project={project}
      >
        <ACC.Section qa="project-forecasts">
          <Table.Table data={partners} qa="partner-table">
            <Table.Custom
              header={x => x.pages.forecastsDashboard.headerPartner}
              value={x => ACC.getPartnerName(x, true)}
              qa="partner"
            />
            <Table.Currency
              header={x => x.pages.forecastsDashboard.headerTotalEligibleCosts}
              value={x => x.totalParticipantGrant}
              qa="grant-offered"
            />
            <Table.Currency
              header={x => x.pages.forecastsDashboard.headerForecastsAndCosts}
              value={x => getForecastsAndCosts(x)}
              qa="forecasts-and-costs"
            />
            <Table.Currency
              header={x => x.pages.forecastsDashboard.headerUnderspend}
              value={x => roundCurrency(x.totalParticipantGrant ?? 0 - getForecastsAndCosts(x))}
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
              value={x =>
                this.props.routes.forecastDetails.getLink({ projectId: this.props.projectId, partnerId: x.id })
              }
              content={<ACC.Content value={x => x.pages.forecastsDashboard.viewForecast} />}
              qa="view-partner-forecast"
            />
          </Table.Table>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ForecastDashboardContainer = (props: Params & BaseProps) => {
  const stores = useStores();

  return (
    <ProjectForecastComponent
      projectDetails={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
      activeClaims={stores.claims.getActiveClaimsForProject(props.projectId)}
      {...props}
    />
  );
};

export const ForecastDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectForecasts",
  routePath: "/projects/:projectId/forecasts",
  container: ForecastDashboardContainer,
  getParams: r => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsDashboard.title),
});
