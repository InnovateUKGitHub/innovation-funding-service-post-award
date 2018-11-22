import React from "react";
import * as ACC from "../../../components";
import * as Actions from "../../../redux/actions";
import { ContainerBase, ReduxContainer } from "../../containerBase";
import { ClaimsDashboardRoute } from "../dashboard";
import { PrepareClaimRoute } from "../prepare";
import {
  CombinedData,
  Data,
  forecastDataLoadActions,
  forecastParams,
  Params,
  renderWarning,
  withDataEditor
} from "./common";

interface Callbacks {
  onChange: (partnerId: string, periodId: number, data: ForecastDetailsDTO[], combined: CombinedData) => void;
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, periodId: number, data: CombinedData) => void;
}

class ClaimForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={this.props.combined} render={data => this.renderContents(data)} />;
  }

  saveAndReturn(data: CombinedData, updateClaim: boolean) {
    this.props.saveAndReturn(updateClaim, this.props.projectId, this.props.partnerId, this.props.periodId, data);
  }

  handleChange(data: ForecastDetailsDTO[], combined: CombinedData) {
    this.props.onChange(this.props.partnerId, this.props.periodId, data, combined);
  }

  renderContents(combined: CombinedData) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();
    const editor = combined.editor!;

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={PrepareClaimRoute.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.ValidationSummary validation={editor.validator} compressed={false} />
        {renderWarning(combined)}
        <ACC.Projects.Title pageTitle="Claim" project={combined.project} />
        <ACC.Section title={"Update forecasts table for " + combined.partner.name} qa="partner-name">
          <Form.Form
            data={editor.data}
            onChange={data => this.handleChange(data, combined)}
            onSubmit={() => this.saveAndReturn(combined, true)}
            qa="claim-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} />
            <Form.Fieldset>
              <Form.Submit>Submit claim and forecast changes</Form.Submit>
              <ACC.Renderers.SimpleString>Changes last saved:
                <ACC.Renderers.ShortDateTime value={combined.claim.forecastLastModified} />
              </ACC.Renderers.SimpleString>
            </Form.Fieldset>
            <Form.Fieldset qa="save-button">
              <Form.Button name="save" onClick={() => this.saveAndReturn(combined, false)}>Save and return to claim</Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const updateRedirect = (updateClaim: boolean, dispatch: any, projectId: string, partnerId: string, periodId: number) => {
  return updateClaim
    ? dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({ projectId, partnerId })))
    : dispatch(Actions.navigateTo(PrepareClaimRoute.getLink({ projectId, partnerId, periodId })));
};

const definition = ReduxContainer.for<Params, Data, Callbacks>(ClaimForecastComponent);

const ForecastClaim = definition.connect({
  withData: (state, props) => withDataEditor(state, props),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, data, combined) => dispatch(Actions.validateForecastDetails(partnerId, periodId, data, combined.claimDetails, combined.golCosts, combined.costCategories)),
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data) => dispatch(Actions.saveForecastDetails(updateClaim, partnerId, periodId, data.editor!.data, data.claimDetails, data.golCosts, data.costCategories, () => updateRedirect(updateClaim, dispatch, projectId, partnerId, periodId)))
  })
});

export const ClaimForecastRoute = definition.route({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  getParams: forecastParams,
  getLoadDataActions: forecastDataLoadActions,
  container: ForecastClaim
});
