import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ProjectRole } from "@framework/types";
import { isNumber } from "@framework/util";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { ForecastData } from "../claims/forecasts/common";

interface Params {
  projectId: string;
  partnerId: string;
}

interface Data {
  data: Pending<ForecastData>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: ForecastDetailsDTO[]) => void;
}

class UpdateForecastComponent extends ContainerBase<Params, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({ data: this.props.data, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor)} />;
  }

  public renderContents(combined: ForecastData, editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.forecastDetails.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId })}>Back to forecast</ACC.BackLink>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={combined.project} />}
      >
        <ACC.Section title="" qa="partner-forecast" >
          <ACC.Forecasts.Warning {...combined} editor={editor}/>
          {this.renderOverheadsRate(combined.partner.overheadRate)}
          <Form.Form
            editor={editor}
            onChange={data => this.props.onChange(false, data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="partner-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} editor={editor} />
            <Form.Fieldset>
              <Form.Submit>Submit</Form.Submit>
              <ACC.Claims.ClaimLastModified partner={combined.partner} />
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderOverheadsRate(overheadRate: number | null) {
    if (!isNumber(overheadRate)) return null;
    return <ACC.Renderers.SimpleString qa="overhead-costs">Overhead costs: <ACC.Renderers.Percentage value={overheadRate} /></ACC.Renderers.SimpleString>;
  }
}

const UpdateForecastContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <UpdateForecastComponent
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
        editor={stores.forecastDetails.getForecastEditor(props.partnerId)}
        onChange={(saving, dto) => {
          stores.forecastDetails.updateForcastEditor(saving, props.projectId, props.partnerId, dto, false, "Your forecast has been updated.", () => {
            stores.navigation.navigateTo(props.routes.forecastDetails.getLink({ projectId: props.projectId, partnerId: props.partnerId }));
          });
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const UpdateForecastRoute = defineRoute({
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast",
  container: UpdateForecastContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: () => ({
    htmlTitle: "Update forecast",
    displayTitle: "Update forecast"
  }),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
