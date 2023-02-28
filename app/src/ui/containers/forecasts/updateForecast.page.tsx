import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import {
  ClaimDetailsSummaryDto,
  ClaimDto,
  CostCategoryDto,
  ForecastDetailsDTO,
  GOLCostDto,
  PartnerDtoGql,
  ProjectDtoGql,
  ProjectRole,
} from "@framework/types";
import { getArrayExcludingPeriods, isNumber } from "@framework/util";
import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { useContent } from "@ui/hooks";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";
import { useUpdateForecastData } from "./updateForecast.logic";
import {
  PageLoader,
  Page,
  BackLink,
  Content,
  Projects,
  createTypedForm,
  Renderers,
  ValidationMessage,
  Section,
  Forecasts,
  Claims,
} from "@ui/components";

export interface UpdateForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: number;
}

interface UpdateForecastProps {
  data: {
    project: Pick<
      ProjectDtoGql,
      "id" | "title" | "isActive" | "projectNumber" | "periodId" | "numberOfPeriods" | "competitionType"
    >;
    partner: Pick<
      PartnerDtoGql,
      "id" | "name" | "overheadRate" | "forecastLastModifiedDate" | "roles" | "organisationType" | "partnerStatus"
    >;
    claims: Pick<ClaimDto, "isApproved" | "periodId" | "isFinalClaim">[];
    claim: Pick<ClaimDto, "id" | "isApproved" | "periodId" | "isFinalClaim" | "paidDate"> | null;
    costCategories: Pick<
      CostCategoryDto,
      "id" | "competitionType" | "name" | "isCalculated" | "organisationType" | "type"
    >[];
    claimDetails: Pick<ClaimDetailsSummaryDto, "costCategoryId" | "periodId" | "value" | "periodEnd" | "periodStart">[];
    forecastDetails: ForecastDetailsDTO[];
    golCosts: Pick<GOLCostDto, "value" | "costCategoryId">[];
    IARDueOnClaimPeriods: string[];
  };

  editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
  onChange: (saving: boolean, dto: ForecastDetailsDTO[]) => void;
}

const Form = createTypedForm<ForecastDetailsDTO[]>();

const UpdateForecastComponent = ({
  data,
  editor,
  routes,
  partnerId,
  projectId,
  onChange,
}: UpdateForecastParams & UpdateForecastProps & BaseProps) => {
  const { isActive } = data.project;

  const handleSubmit = () => {
    if (!isActive) return;
    // Get a set of periods that we have ALREADY claimed.
    const periodsClaimed = new Set(data.claims.map(x => x.periodId));
    // Get a DTO array of periods that we have not yet claimed.
    const arrayExcludingClaimedPeriods = getArrayExcludingPeriods(editor.data, periodsClaimed);
    return onChange(true, arrayExcludingClaimedPeriods);
  };

  const renderOverheadsRate = (overheadRate: number | null) => {
    if (!isNumber(overheadRate)) return null;
    return (
      <Renderers.SimpleString qa="overhead-costs">
        <Content value={x => x.forecastsLabels.overheadCosts} />
        <Renderers.Percentage value={overheadRate} />
      </Renderers.SimpleString>
    );
  };

  const allClaimsDashboardLink = routes.allClaimsDashboard.getLink({ projectId });

  return (
    <Page
      backLink={
        <BackLink route={routes.viewForecast.getLink({ projectId, partnerId })}>
          <Content value={x => x.pages.forecastsUpdate.backLink} />
        </BackLink>
      }
      error={editor.error}
      validator={editor.validator}
      pageTitle={<Projects.Title projectNumber={data.project.projectNumber} title={data.project.title} />}
    >
      <ForecastClaimAdvice claimLink={allClaimsDashboardLink} />
      {data.claim && data.claim.isFinalClaim && (
        <ValidationMessage messageType="info" message={x => x.forecastsMessages.finalClaim} />
      )}
      <Section title="" qa="partner-forecast">
        <Forecasts.Warning {...data} editor={editor} />
        {renderOverheadsRate(data.partner.overheadRate)}
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
              <Claims.ForecastTable onChange={onChange} data={data} editor={editor} allowRetroactiveForecastEdit />
            )}
          />
          <Form.Fieldset>
            {data.partner.forecastLastModifiedDate && (
              <Claims.ClaimLastModified modifiedDate={data.partner.forecastLastModifiedDate} />
            )}
            <Form.Submit>
              <Content value={x => x.pages.forecastsUpdate.buttonSubmit} />
            </Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </Section>
    </Page>
  );
};

const UpdateForecastContainer = (props: UpdateForecastParams & BaseProps) => {
  const { getContent } = useContent();
  const stores = useStores();

  const navigate = useNavigate();
  const forecastUpdatedMessage = getContent(x => x.forecastsMessages.forecastUpdated);
  const data = useUpdateForecastData(props.projectId, props.partnerId, undefined);

  const pending = Pending.combine({
    editor: stores.forecastDetails.getForecastEditor(props.partnerId),
  });

  const onChange = (saving: boolean, dto: ForecastDetailsDTO[]) => {
    stores.forecastDetails.updateForecastEditor(
      saving,
      props.projectId,
      props.partnerId,
      dto,
      false,
      forecastUpdatedMessage,
      () => {
        navigate(props.routes.viewForecast.getLink({ projectId: props.projectId, partnerId: props.partnerId }).path);
      },
    );
  };
  return (
    <PageLoader
      pending={pending}
      render={x => <UpdateForecastComponent data={data} onChange={onChange} {...Object.assign({}, props, x)} />}
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
