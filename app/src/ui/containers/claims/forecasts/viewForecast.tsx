import React from "react";
import * as ACC from "../../../components";
import * as Actions from "../../../redux/actions";
import * as Selectors from "../../../redux/selectors";
import { Pending } from "../../../../shared/pending";
import { ContainerBase, ReduxContainer } from "../../containerBase";
import { UpdateForecastRoute } from "./updateForecast";
import {
  ForecastData,
  forecastDataLoadActions,
  forecastParams,
  Params,
  PendingForecastData,
  renderWarning,
} from "./common";
import { PartnerDto, ProjectRole } from "../../../../types";
import { ProjectDashboardRoute, ProjectForecastRoute } from "../../projects";

interface Callbacks {
  onSubmit: (params: Params) => void;
}

class ViewForecastComponent extends ContainerBase<Params, PendingForecastData, Callbacks> {
  public render() {
    return <ACC.PageLoader pending={this.props.combined} render={data => this.renderContents(data)} />;
  }

  handleSubmit() {
    this.props.onSubmit({
      projectId: this.props.projectId,
      partnerId: this.props.partnerId
    });
  }

  public renderContents(data: ForecastData) {
    // MO, PM & FC/PM should see partner name
    const isMoPm = !!(data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer));
    const partnerName = isMoPm ? data.partner.name : null;

    const backLink = isMoPm ? ProjectForecastRoute.getLink({ projectId: data.project.id }) : ProjectDashboardRoute.getLink({});

    const backText = isMoPm ? "Back" : "Back to dashboard";

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={backLink}>{backText}</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="View project" project={data.project} />
        {this.renderTabs(isMoPm, data)}
        <ACC.Section title={partnerName} qa="partner-name">
          {renderWarning(data)}
          <ACC.Claims.ForecastTable data={data} />
        </ACC.Section>
        <ACC.Section>
          {this.renderUpdateSection(data.partner)}
          <ACC.Claims.ClaimLastModified partner={data.partner} />
        </ACC.Section>
      </ACC.Page>
    );
  }

  // MO, PM & FC/PM should not see tabs
  private renderTabs(isMoPm: boolean, data: ForecastData) {
    return isMoPm ? null : <ACC.Projects.ProjectNavigation currentRoute={ViewForecastRoute.routeName} partners={[data.partner]} project={data.project} />;
  }

  private renderUpdateSection(partner: PartnerDto) {
    // TODO: Should this really be a form?
    const Form = ACC.TypedForm();
    if (partner.roles & ProjectRole.FinancialContact) {
      return (
        <Form.Form data={{}} qa={"update-navigation-button"} onSubmit={() => this.handleSubmit()}>
          <Form.Submit>Update forecast</Form.Submit>
        </Form.Form>
      );
    }
    return null;
  }
}

const definition = ReduxContainer.for<Params, PendingForecastData, Callbacks>(ViewForecastComponent);

const ViewForecast = definition.connect({
  withData: (state, props) => {
    const combined = Pending.combine(
      Selectors.getProject(props.projectId).getPending(state),
      Selectors.getPartner(props.partnerId).getPending(state),
      Selectors.getCurrentClaim(state, props.partnerId),
      Selectors.findClaimsByPartner(props.partnerId).getPending(state),
      Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
      Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
      Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
      Selectors.getCostCategories().getPending(state),
      (project, partner, claim, claims, claimDetails, forecastDetails, golCosts, costCategories) => ({ project, partner, claim, claims, claimDetails, forecastDetails, golCosts, costCategories })
    );

    return { combined };
  },
  withCallbacks: dispatch => ({
    onSubmit: (p: Params) => dispatch(Actions.navigateTo(UpdateForecastRoute.getLink(p)))
  })
});

export const ViewForecastRoute = definition.route({
  routeName: "viewForecast",
  routePath: "/projects/:projectId/claims/:partnerId/viewForecast",
  getParams: forecastParams,
  getLoadDataActions: forecastDataLoadActions,
  container: ViewForecast,
  accessControl: (user, params) => user.roleInfo[params.projectId] && user.roleInfo[params.projectId].projectRoles !== ProjectRole.Unknown
});
