import React from "react";
import * as ACC from "../../../components";
import * as Actions from "../../../redux/actions";
import * as Selectors from "../../../redux/selectors";
import { Pending } from "../../../../shared/pending";
import { ContainerBase, ReduxContainer } from "../../containerBase";
import { ProjectOverviewPage } from "../../../components/projectOverview";
import { UpdateForecastRoute } from "./updateForecast";
import {
  ForecastData,
  forecastDataLoadActions,
  forecastParams,
  Params,
  PendingForecastData,
  renderWarning,
} from "./common";

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
    const Form = ACC.TypedForm();
    const periodId = data.project.periodId;

    return (
      <ProjectOverviewPage
        selectedTab={ViewForecastRoute.routeName}
        project={data.project}
        partners={[data.partner]}
      >
        <ACC.Section title="" qa={"partner-name"} >
          {renderWarning(data)}
          <ACC.Claims.ForecastTable data={data} projectPeriodId={periodId} />
        </ACC.Section>
        <ACC.Section>
          <Form.Form data={{}} onSubmit={() => this.handleSubmit()}>
            <Form.Submit>Update forecast</Form.Submit>
            <ACC.Claims.ClaimLastModified claim={data.claim} />
          </Form.Form>
        </ACC.Section>
      </ProjectOverviewPage>
    );
  }
}

const definition = ReduxContainer.for<Params, PendingForecastData, Callbacks>(ViewForecastComponent);

const ViewForecast = definition.connect({
  withData: (state, props) => {
    const combined = Pending.combine(
      Selectors.getProject(props.projectId).getPending(state),
      Selectors.getPartner(props.partnerId).getPending(state),
      Selectors.getCurrentClaim(state, props.partnerId),
      Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
      Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
      Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
      Selectors.getCostCategories().getPending(state),
      (a, b, c, d, e, f, g) => ({ project: a, partner: b, claim: c, claimDetails: d, forecastDetails: e, golCosts: f, costCategories: g })
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
  container: ViewForecast
});
