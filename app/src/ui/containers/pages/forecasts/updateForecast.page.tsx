import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { useContent } from "@ui/hooks/content.hook";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";
import { useUpdateForecastData } from "./updateForecast.logic";
import { ProjectRole } from "@framework/constants/project";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { getArrayExcludingPeriods } from "@framework/util/arrayHelpers";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { isNumber } from "@framework/util/numberHelper";
import { ClaimLastModified } from "@ui/components/atomicDesign/organisms/claims/ClaimLastModified/claimLastModified";
import { ForecastTable } from "@ui/components/atomicDesign/organisms/claims/ForecastTable/forecastTable.standalone";
import { Warning } from "@ui/components/atomicDesign/organisms/forecasts/Warning/warning.withFragment";

export interface UpdateForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: number;
}

interface UpdateForecastProps {
  editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
  onChange: (saving: boolean, dto: ForecastDetailsDTO[]) => void;
}

const Form = createTypedForm<ForecastDetailsDTO[]>();

const UpdateForecastComponent = ({
  editor,
  routes,
  partnerId,
  projectId,
  onChange,
}: UpdateForecastParams & UpdateForecastProps & BaseProps) => {
  const data = useUpdateForecastData(projectId, partnerId, undefined);

  const {
    isActive,
    roles: { isFc },
  } = data.project;

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
      <SimpleString qa="overhead-costs">
        <Content value={x => x.forecastsLabels.overheadCosts} />
        <Percentage value={overheadRate} />
      </SimpleString>
    );
  };

  return (
    <Page
      backLink={
        <BackLink route={routes.viewForecast.getLink({ projectId, partnerId })}>
          <Content value={x => x.pages.forecastsUpdate.backLink} />
        </BackLink>
      }
      error={editor.error}
      validator={editor.validator}
      pageTitle={<Title />}
      fragmentRef={data.fragmentRef}
    >
      <ForecastClaimAdvice isFc={isFc} />
      {data.claim && data.claim.isFinalClaim && (
        <ValidationMessage messageType="info" message={x => x.forecastsMessages.finalClaim} />
      )}
      <Section title="" qa="partner-forecast">
        <Warning editor={editor} />
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
              <ForecastTable
                projectId={projectId}
                partnerId={partnerId}
                onChange={onChange}
                selectCurrentClaimByApprovedStatus
                editor={editor}
                allowRetroactiveForecastEdit
              />
            )}
          />
          <Form.Fieldset>
            {data.partner.forecastLastModifiedDate && (
              <ClaimLastModified modifiedDate={data.partner.forecastLastModifiedDate} />
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
      render={x => <UpdateForecastComponent onChange={onChange} {...Object.assign({}, props, x)} />}
    />
  );
};

export const UpdateForecastRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast/:periodId",
  container: UpdateForecastContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsUpdate.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
