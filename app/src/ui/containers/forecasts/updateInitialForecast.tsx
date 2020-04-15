import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ProjectRole } from "@framework/types";
import { isNumber } from "@framework/util";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { IForecastDetailsDtosValidator } from "@ui/validators";

export interface UpdateInitialForecastParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  data: Pending<ACC.Claims.ForecastData>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: ForecastDetailsDTO[]) => void;
}

class UpdateInitialForecastComponent extends ContainerBase<UpdateInitialForecastParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({ data: this.props.data, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor)} />;
  }

  public renderContents(combined: ACC.Claims.ForecastData, editor: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();

    return (
      <ACC.Page
        backLink={<ACC.Projects.ProjectBackLink project={combined.project} routes={this.props.routes}/>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={combined.project} />}
      >
        <ACC.Section title="" qa="partner-forecast" >
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

const UpdateForecastContainer = (props: UpdateInitialForecastParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <UpdateInitialForecastComponent
        data={Pending.combine({
          project: stores.projects.getById(props.projectId),
          partner: stores.partners.getById(props.partnerId),
          forecastDetails: stores.forecastDetails.getAllInitialByPartner(props.partnerId),
          golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
          costCategories: stores.costCategories.getAll(),
          // Initial forecast so happens before claims
          claim: Pending.done(null),
          claims: Pending.done([]),
          claimDetails: Pending.done([]),
        })}
        editor={stores.forecastDetails.getInitialForecastEditor(props.partnerId)}
        onChange={(saving, dto) => {
          stores.forecastDetails.updateInitialForcastEditor(saving, props.projectId, props.partnerId, dto, "Your forecast has been updated.", () => {
            stores.navigation.navigateTo(props.routes.projectOverview.getLink({ projectId: props.projectId }));
          });
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const UpdateInitialForecastRoute = defineRoute({
  routeName: "updateInitialForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateInitialForecast",
  container: UpdateForecastContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: () => ({
    htmlTitle: "Update initial forecast",
    displayTitle: "Update initial forecast"
  }),
  accessControl: (auth, { projectId, partnerId }, config) => config.features.initialForecast && auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
