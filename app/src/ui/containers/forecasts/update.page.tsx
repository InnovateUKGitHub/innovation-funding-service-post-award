import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { ForecastDetailsDTO, ProjectRole } from "@framework/types";
import { getArrayExcludingPeriods, isNumber } from "@framework/util";
import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { useContent, useProjectStatus } from "@ui/hooks";
import { ForecastData } from "@ui/components/claims";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";

export interface ForecastUpdateParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface ForecastUpdateData {
  data: Pending<ACC.Claims.ForecastData>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>>;
  onChange: (saving: boolean, dto: ForecastDetailsDTO[]) => void;
}

const Form = ACC.createTypedForm<ForecastDetailsDTO[]>();

const UpdateForecastComponent = (props: ForecastUpdateParams & ForecastUpdateData & BaseProps) => {
  const { isActive: isProjectActive } = useProjectStatus();

  const combined = Pending.combine({
    data: props.data,
    editor: props.editor,
  });

  const renderContents = (
    forecastData: ForecastData,
    editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>,
  ) => {
    const { partnerId, projectId, routes, onChange } = props;
    const { project, claim, partner } = forecastData;

    const handleSubmit = () => {
      if (!isProjectActive) return;

      // Get a set of periods that we have ALREADY claimed.
      const periodsClaimed = new Set(combined.data?.data.claims?.map(x => x.periodId));

      // Get a DTO array of periods that we have not yet claimed.
      const arrayExcludingClaimedPeriods = getArrayExcludingPeriods(editor.data, periodsClaimed);
      return props.onChange(true, arrayExcludingClaimedPeriods);
    };

    const renderOverheadsRate = (overheadRate: number | null) => {
      if (!isNumber(overheadRate)) return null;

      return (
        <ACC.Renderers.SimpleString qa="overhead-costs">
          <ACC.Content value={x => x.forecastsLabels.overheadCosts} />
          <ACC.Renderers.Percentage value={overheadRate} />
        </ACC.Renderers.SimpleString>
      );
    };

    const allClaimsDashboardLink = routes.allClaimsDashboard.getLink({ projectId });

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={routes.viewForecast.getLink({ projectId, partnerId })}>
            <ACC.Content value={x => x.pages.forecastsUpdate.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...project} />}
      >
        <ForecastClaimAdvice claimLink={allClaimsDashboardLink} />

        {claim && claim.isFinalClaim && (
          <ACC.ValidationMessage messageType="info" message={x => x.forecastsMessages.finalClaim} />
        )}

        <ACC.Section title="" qa="partner-forecast">
          <ACC.Forecasts.Warning {...forecastData} editor={editor} />

          {renderOverheadsRate(partner.overheadRate)}

          <Form.Form
            editor={editor}
            onChange={forecastDetail => onChange(false, forecastDetail)}
            onSubmit={handleSubmit}
            qa="partner-forecast-form"
          >
            <Form.Custom
              name="forecastTable"
              update={() => null}
              value={({ onChange }) => (
                <ACC.Claims.ForecastTable
                  onChange={onChange}
                  data={forecastData}
                  editor={editor}
                  allowRetroactiveForecastEdit
                />
              )}
            />

            <Form.Fieldset>
              {partner.forecastLastModifiedDate && (
                <ACC.Claims.ClaimLastModified modifiedDate={partner.forecastLastModifiedDate} />
              )}

              <Form.Submit>
                <ACC.Content value={x => x.pages.forecastsUpdate.buttonSubmit} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  };
  return <ACC.PageLoader pending={combined} render={x => renderContents(x.data, x.editor)} />;
};

const UpdateForecastContainer = (props: ForecastUpdateParams & BaseProps) => {
  const { getContent } = useContent();
  const stores = useStores();
  const navigate = useNavigate();
  const forecastUpdatedMessage = getContent(x => x.forecastsMessages.forecastUpdated);

  return (
    <UpdateForecastComponent
      {...props}
      data={Pending.combine({
        project: stores.projects.getById(props.projectId),
        partner: stores.partners.getById(props.partnerId),
        claim: stores.claims.getActiveClaimForPartner(props.partnerId),
        claims: stores.claims.getAllClaimsForPartner(props.partnerId),
        IARDueOnClaimPeriods: stores.claims.getIARDueOnClaimPeriods(props.partnerId),
        claimDetails: stores.claimDetails.getAllByPartner(props.partnerId),
        forecastDetails: stores.forecastDetails.getAllByPartner(props.partnerId),
        golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
        costCategories: stores.costCategories.getAllFiltered(props.partnerId),
      })}
      editor={stores.forecastDetails.getForecastEditor(props.partnerId)}
      onChange={(saving, dto) => {
        stores.forecastDetails.updateForecastEditor(
          saving,
          props.projectId,
          props.partnerId,
          dto,
          false,
          forecastUpdatedMessage,
          () => {
            navigate(
              props.routes.viewForecast.getLink({ projectId: props.projectId, partnerId: props.partnerId }).path,
            );
          },
        );
      }}
    />
  );
};

export const UpdateForecastRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast/:periodId",
  container: UpdateForecastContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsUpdate.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
