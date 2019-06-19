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
import { PartnerDto, ProjectRole } from "@framework/types";
import { ProjectDashboardRoute, ProjectForecastRoute } from "../../projects";
import { Percentage, SimpleString } from "../../../components/renderers";
import { isNumber } from "@framework/util";

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
    const backText = isMoPm ? "Back to project" : "Back to all projects";

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>{backText}</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={data.project} />}
        tabs={this.renderTabs(isMoPm, data)}
        project={data.project}
      >
        <ACC.Section title={partnerName} qa="partner-name">
          <ACC.Renderers.AriaLive>
            <ACC.Renderers.Messages messages={this.props.messages} />
          </ACC.Renderers.AriaLive>
          {renderWarning(data)}
          {this.renderOverheadsRate(data.partner.overheadRate)}
          <ACC.Claims.ForecastTable data={data} hideValidation={isMoPm} />
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

  private renderOverheadsRate(overheadRate: number | null) {
    if (!isNumber(overheadRate)) return null;

    return <SimpleString qa="overhead-costs">Overhead costs: <Percentage value={overheadRate}/></SimpleString>;
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
    const combined = Pending.combine({
      project: Selectors.getProject(props.projectId).getPending(state),
      partner: Selectors.getPartner(props.partnerId).getPending(state),
      claim: Selectors.getCurrentClaim(state, props.partnerId),
      claims: Selectors.findClaimsByPartner(props.partnerId).getPending(state),
      claimDetails: Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
      forecastDetails: Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
      golCosts: Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
    });

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
  accessControl: (auth, { projectId, partnerId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
  || auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: (store, params) => {
    return {
      htmlTitle: "View forecast - View project",
      displayTitle: "View project"
    };
  }

});
