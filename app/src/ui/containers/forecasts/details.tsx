import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { PartnerDto, PartnerStatus, ProjectDto, ProjectRole, ProjectStatus } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { StoresConsumer } from "@ui/redux";

interface Params {
  projectId: string;
  partnerId: string;
}

interface Data {
  data: Pending<ACC.Claims.ForecastData>;
}

class ViewForecastComponent extends ContainerBase<Params, Data, {}> {
  public render() {
    return <ACC.PageLoader pending={this.props.data} render={data => this.renderContents(data)} />;
  }

  public renderContents(data: ACC.Claims.ForecastData) {
    // MO, PM & FC/PM should see partner name
    const isMoPm = !!(data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer));
    const partnerName = isMoPm ? data.partner.name : null;
    const backLink = isMoPm ? this.props.routes.forecastDashboard.getLink({ projectId: data.project.id }) : this.props.routes.projectOverview.getLink({ projectId: data.project.id });
    const backText = isMoPm ? "Back to forecasts" : "Back to project";

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={data.project} />}
        backLink={<ACC.BackLink route={backLink}>{backText}</ACC.BackLink>}
        project={data.project}
      >
        <ACC.Section title={partnerName} qa="partner-name" className="govuk-!-padding-bottom-3">
          <ACC.Renderers.Messages messages={this.props.messages} />
          <ACC.Forecasts.Warning {...data}/>
          {this.renderOverheadsRate(data.partner.overheadRate)}
          <ACC.Claims.ForecastTable data={data} hideValidation={isMoPm} />
        </ACC.Section>
        <ACC.Section qa="viewForecastUpdate">
          <ACC.Claims.ClaimLastModified partner={data.partner} />
          {this.renderUpdateSection(data.project, data.partner)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderOverheadsRate(overheadRate: number | null) {
    if (overheadRate === null || overheadRate === undefined) return null;

    return <ACC.Renderers.SimpleString qa="overhead-costs">Overhead costs: <ACC.Renderers.Percentage value={overheadRate} /></ACC.Renderers.SimpleString>;
  }

  private renderUpdateSection(project: ProjectDto, partner: PartnerDto) {

    if (project.status === ProjectStatus.OnHold) return null;
    if (!(partner.roles & ProjectRole.FinancialContact)) return null;
    if (partner.partnerStatus === PartnerStatus.VoluntaryWithdrawal || partner.partnerStatus === PartnerStatus.InvoluntaryWithdrawal) return null;
    return <ACC.Link styling="PrimaryButton" route={this.props.routes.forecastUpdate.getLink({ projectId: project.id, partnerId: partner.id })}>Update forecast</ACC.Link>;
  }
}

const ViewForecastContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ViewForecastComponent
        data={Pending.combine({
          project: stores.projects.getById(props.projectId),
          partner: stores.partners.getById(props.partnerId),
          claim: stores.claims.getActiveClaimForPartner(props.partnerId),
          claims: stores.claims.getAllClaimsForPartner(props.partnerId),
          claimDetails: stores.claimDetails.getAllByPartner(props.partnerId),
          forecastDetails: stores.forecastDetails.getAllByPartner(props.partnerId),
          golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
          costCategories: stores.costCategories.getAll(),
        })}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ForecastDetailsRoute = defineRoute({
  routeName: "viewForecast",
  routePath: "/projects/:projectId/claims/:partnerId/viewForecast",
  container: ViewForecastContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  accessControl: (auth, { projectId, partnerId }) => {
    const isMOOrPM = auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
    const isFC = auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact);
    return isMOOrPM || isFC;
  },
  getTitle: () => ({
    htmlTitle: "View forecast - View project",
    displayTitle: "Forecast"
  })
});
