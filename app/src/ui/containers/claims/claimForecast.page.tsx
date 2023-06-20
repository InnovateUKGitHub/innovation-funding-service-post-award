import { useNavigate } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { useContent } from "@ui/hooks/content.hook";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { getArrayExcludingPeriods } from "@framework/util/arrayHelpers";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { PageLoader } from "@ui/components/loading";
import { Title } from "@ui/components/projects/title";
import { AriaLive } from "@ui/components/renderers/ariaLive";
import { Percentage } from "@ui/components/renderers/percentage";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { ValidationMessage } from "@ui/components/validationMessage";
import { ForecastDetailsDtosValidator } from "@ui/validators/forecastDetailsDtosValidator";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { Warning } from "@ui/components/forecasts/warning";
import { ForecastData, ForecastTable } from "@ui/components/claims/forecastTable";
import { ClaimLastModified } from "@ui/components/claims/claimLastModified";
import { isNumber } from "@framework/util/numberHelper";

export interface ClaimForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
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

const Form = createTypedForm<ForecastDetailsDTO[]>();

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
    return <PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor)} />;
  }

  renderOverheadsRate(overheadRate: number | null) {
    if (!isNumber(overheadRate)) return null;

    return (
      <SimpleString qa="overhead-costs">
        <Content value={x => x.pages.claimForecast.overheadsCosts} />
        <Percentage value={overheadRate} />
      </SimpleString>
    );
  }

  renderContents(combined: ForecastData, editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>) {
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
      <Page
        backLink={
          <BackLink
            route={this.props.routes.claimDocuments.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
              periodId: this.props.periodId,
            })}
          >
            <Content value={x => x.pages.claimForecast.backLink} />
          </BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<Title {...combined.project} />}
      >
        <Section qa="partner-name">
          <AriaLive>
            {combined.partner.newForecastNeeded && (
              <ValidationMessage
                messageType="info"
                message={x => x.claimsMessages.frequencyChangeMessage}
                qa="period-change-warning"
              />
            )}
            <ValidationMessage
              messageType="info"
              message={x => x.claimsMessages.lastChanceToChangeForecast({ periodId: lastChanceToEditPeriod })}
            />
          </AriaLive>
          <Warning {...combined} editor={editor} />
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
                <ForecastTable
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
                <ClaimLastModified modifiedDate={combined.partner.forecastLastModifiedDate} />
              )}
            </Form.Fieldset>
            <Form.Fieldset qa="save-and-continue">
              <Form.Submit>
                <Content value={x => x.pages.claimForecast.buttonContinueToSummary} />
              </Form.Submit>
              <Form.Button name="save" onClick={onFormSave}>
                <Content value={x => x.pages.claimForecast.buttonSaveAndReturn} />
              </Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </Section>
      </Page>
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
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: () => ({
    htmlTitle: "Update forecast",
    displayTitle: "Update forecast",
  }),
});
