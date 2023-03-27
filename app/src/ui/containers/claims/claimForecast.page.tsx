import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { getArrayExcludingPeriods, isNumber } from "@framework/util";
import {
  ClaimDetailsSummaryDto,
  ClaimDto,
  ForecastDetailsDTO,
  getAuthRoles,
  GOLCostDto,
  ILinkInfo,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { Pending } from "@shared/pending";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { IEditorStore, useStores } from "@ui/redux";
import { useContent } from "@ui/hooks";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export interface ClaimForecastParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claim: Pending<ClaimDto | null>;
  claims: Pending<ClaimDto[]>;
  claimDetails: Pending<ClaimDetailsSummaryDto[]>;
  IARDueOnClaimPeriods: Pending<string[]>;
  forecastDetails: Pending<ForecastDetailsDTO[]>;
  golCosts: Pending<GOLCostDto[]>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ForecastDetailsDTO[], link?: ILinkInfo) => void;
}

const Form = ACC.createTypedForm<ForecastDetailsDTO[]>();

class ClaimForecastComponent extends ContainerBase<ClaimForecastParams, Data, Callbacks> {
  render() {
    const combinedForecastData = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      claim: this.props.claim,
      claims: this.props.claims,
      claimDetails: this.props.claimDetails,
      IARDueOnClaimPeriods: this.props.IARDueOnClaimPeriods,
      forecastDetails: this.props.forecastDetails,
      golCosts: this.props.golCosts,
      costCategories: this.props.costCategories,
    });

    const combined = Pending.combine({ data: combinedForecastData, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor)} />;
  }

  renderOverheadsRate(overheadRate: number | null) {
    if (!isNumber(overheadRate)) return null;

    return (
      <ACC.Renderers.SimpleString qa="overhead-costs">
        <ACC.Content value={x => x.pages.claimForecast.overheadsCosts} />
        <ACC.Renderers.Percentage value={overheadRate} />
      </ACC.Renderers.SimpleString>
    );
  }

  renderContents(
    combined: ACC.Claims.ForecastData,
    editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>,
  ) {
    // Get a set of periods that we have ALREADY claimed.
    const periodsClaimed = new Set(this.props.claims?.data?.map(x => x.periodId));

    // Get a DTO array of periods that we have not yet claimed.
    const arrayExcludingClaimedPeriods = getArrayExcludingPeriods(editor.data, periodsClaimed);
    const lastChanceToEditPeriod = arrayExcludingClaimedPeriods[0]?.periodId;

    /**
     * Submit all non-claimed periods
     */
    const handleSubmit = () => {
      return this.props.onUpdate(
        true,
        arrayExcludingClaimedPeriods,
        this.props.routes.claimSummary.getLink({
          projectId: this.props.projectId,
          partnerId: this.props.partnerId,
          periodId: this.props.periodId,
        }),
      );
    };

    const onFormSave = () => {
      this.props.onUpdate(true, arrayExcludingClaimedPeriods, this.getBackLink(combined.project));
    };

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink
            route={this.props.routes.claimDocuments.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
              periodId: this.props.periodId,
            })}
          >
            <ACC.Content value={x => x.pages.claimForecast.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...combined.project} />}
      >
        <ACC.Section qa="partner-name">
          <ACC.Renderers.AriaLive>
            {combined.partner.newForecastNeeded && (
              <ACC.ValidationMessage
                messageType="info"
                message={x => x.claimsMessages.frequencyChangeMessage}
                qa="period-change-warning"
              />
            )}
            <ACC.ValidationMessage
              messageType="info"
              message={x => x.claimsMessages.lastChanceToChangeForecast({ periodId: lastChanceToEditPeriod })}
            />
          </ACC.Renderers.AriaLive>
          <ACC.Forecasts.Warning {...combined} editor={editor} />
          {this.renderOverheadsRate(combined.partner.overheadRate)}
          <Form.Form
            editor={editor}
            onChange={data => this.props.onUpdate(false, data)}
            onSubmit={handleSubmit}
            qa="claim-forecast-form"
          >
            <Form.Custom
              name="claimForecastTable"
              value={({ onChange }) => (
                <ACC.Claims.ForecastTable
                  onChange={onChange}
                  data={combined}
                  editor={editor}
                  isSubmitting
                  allowRetroactiveForecastEdit
                />
              )}
            />
            <Form.Fieldset qa="last-saved">
              {combined.partner.forecastLastModifiedDate && (
                <ACC.Claims.ClaimLastModified modifiedDate={combined.partner.forecastLastModifiedDate} />
              )}
            </Form.Fieldset>
            <Form.Fieldset qa="save-and-continue">
              <Form.Submit>
                <ACC.Content value={x => x.pages.claimForecast.buttonContinueToSummary} />
              </Form.Submit>
              <Form.Button name="save" onClick={onFormSave}>
                <ACC.Content value={x => x.pages.claimForecast.buttonSaveAndReturn} />
              </Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private getBackLink(project: ProjectDto) {
    const { isPmOrMo } = getAuthRoles(project.roles);
    return isPmOrMo
      ? this.props.routes.allClaimsDashboard.getLink({ projectId: project.id })
      : this.props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: this.props.partnerId });
  }
}

const ClaimForecastContainer = (props: ClaimForecastParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();
  const claimSavedMessage = getContent(x => x.claimsMessages.claimSavedMessage);

  const handleOnUpdate: Callbacks["onUpdate"] = (saving, dto, link) => {
    stores.forecastDetails.updateForecastEditor(
      saving,
      props.projectId,
      props.partnerId,
      dto,
      false,
      claimSavedMessage,
      () => {
        if (link) navigate(link.path);
      },
    );
  };

  return (
    <ClaimForecastComponent
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      claim={stores.claims.getActiveClaimForPartner(props.partnerId)}
      claims={stores.claims.getAllClaimsForPartner(props.partnerId)}
      IARDueOnClaimPeriods={stores.claims.getIARDueOnClaimPeriods(props.partnerId)}
      claimDetails={stores.claimDetails.getAllByPartner(props.partnerId)}
      forecastDetails={stores.forecastDetails.getAllByPartner(props.partnerId)}
      golCosts={stores.forecastGolCosts.getAllByPartner(props.partnerId)}
      costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
      editor={stores.forecastDetails.getForecastEditor(props.partnerId)}
      onUpdate={handleOnUpdate}
      {...props}
    />
  );
};

export const ClaimForecastRoute = defineRoute({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  container: ClaimForecastContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: () => ({
    htmlTitle: "Update forecast",
    displayTitle: "Update forecast",
  }),
});
