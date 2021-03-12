import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ForecastDetailsDTO, ProjectRole } from "@framework/types";
import { isNumber } from "@framework/util";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { useContent } from "@ui/hooks";
import { getArrayFromPeriod } from "../claims/utils/claimForecastUtils";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";

export interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  data: Pending<ACC.Claims.ForecastData>;
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

  public renderContents(
    combined: ACC.Claims.ForecastData,
    editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>,
  ) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();

    const { partnerId, projectId, periodId, routes, onChange } = this.props;

    const handleSubmit = () => {
      const forecasts = getArrayFromPeriod(editor.data, periodId, combined.project.numberOfPeriods);
      return this.props.onChange(true, forecasts);
    };

    const allClaimsDashboardLink = routes.allClaimsDashboard.getLink({ projectId });

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={routes.forecastDetails.getLink({ projectId, partnerId })}>
            <ACC.Content value={x => x.forecastsUpdate.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...combined.project} />}
      >
        <ForecastClaimAdvice claimLink={allClaimsDashboardLink} />

        {combined.claim && combined.claim.isFinalClaim && (
          <ACC.ValidationMessage messageType="info" message={x => x.forecastsUpdate.messages.finalClaim} />
        )}

        <ACC.Section title="" qa="partner-forecast">
          <ACC.Forecasts.Warning {...combined} editor={editor} />

          {this.renderOverheadsRate(combined.partner.overheadRate)}

          <Form.Form
            editor={editor}
            onChange={data => onChange(false, data)}
            onSubmit={handleSubmit}
            qa="partner-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} editor={editor} />

            <Form.Fieldset>
              {combined.partner.forecastLastModifiedDate && (
                <ACC.Claims.ClaimLastModified modifiedDate={combined.partner.forecastLastModifiedDate} />
              )}

              <Form.Submit>
                <ACC.Content value={x => x.forecastsUpdate.submitButton} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderOverheadsRate(overheadRate: number | null) {
    if (!isNumber(overheadRate)) return null;

    return (
      <ACC.Renderers.SimpleString qa="overhead-costs">
        <ACC.Content value={x => x.forecastsUpdate.labels.overheadCosts} />
        <ACC.Renderers.Percentage value={overheadRate} />
      </ACC.Renderers.SimpleString>
    );
  }
}

const UpdateForecastContainer = (props: Params & BaseProps) => {
  const { getContent } = useContent();

  const forecastUpdatedMessage = getContent(x => x.forecastsUpdate.messages.forecastUpdated);

  return (
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
            stores.forecastDetails.updateForcastEditor(
              saving,
              props.projectId,
              props.partnerId,
              dto,
              false,
              forecastUpdatedMessage,
              () => {
                stores.navigation.navigateTo(
                  props.routes.forecastDetails.getLink({ projectId: props.projectId, partnerId: props.partnerId }),
                );
              },
            );
          }}
          {...props}
        />
      )}
    </StoresConsumer>
  );
};

export const UpdateForecastRoute = defineRoute({
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast/:periodId",
  container: UpdateForecastContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  getTitle: ({ content }) => content.forecastsUpdate.title(),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
