import { BaseProps, defineRoute } from "../containerBase";
import { getAuthRoles, PartnerStatus, ProjectRole } from "@framework/types";
import {
  Page,
  Projects,
  BackLink,
  Content,
  Claims,
  Link,
  ValidationMessage,
  Section,
  Renderers,
  Forecasts,
  getPartnerName,
} from "@ui/components";
import { PrepareClaimRoute } from "@ui/containers";
import { useViewForecastData, Data } from "./viewForecast.logic";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";

interface ViewForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ViewForecastPage = (props: ViewForecastParams & BaseProps) => {
  const data = useViewForecastData(props.projectId, props.partnerId);

  const { isFc: isPartnerFc } = getAuthRoles(data.partner.roles);

  // MO, PM & FC/PM should see partner name
  const { isPmOrMo: isProjectPmOrMo, isFc } = getAuthRoles(data.project.roles);

  const backLink = isProjectPmOrMo
    ? props.routes.forecastDashboard.getLink({ projectId: props.projectId })
    : props.routes.projectOverview.getLink({ projectId: props.projectId });

  const backText = isProjectPmOrMo ? (
    <Content value={x => x.pages.forecastsDetails.backLinkMoOrPm} />
  ) : (
    <Content value={x => x.pages.forecastsDetails.backLink} />
  );

  const claimsLink = isFc
    ? props.routes.claimsDashboard.getLink({ projectId: props.projectId, partnerId: props.partnerId })
    : props.routes.allClaimsDashboard.getLink({ projectId: props.projectId });

  const partnerName = isProjectPmOrMo ? getPartnerName(data.partner) : undefined;

  const showUpdateSection =
    data.project.isActive &&
    isPartnerFc &&
    !data.partner.isWithdrawn &&
    !data.claims.some(x => x.isFinalClaim) &&
    data.partner.partnerStatus !== PartnerStatus.OnHold;

  const updateLink = props.routes.forecastUpdate.getLink({
    projectId: data.project.id,
    partnerId: data.partner.id,
    periodId: data.project.periodId,
  });

  return (
    <Page
      pageTitle={<Projects.Title title={data.project.title} projectNumber={data.project.projectNumber} />}
      projectStatus={data.project.status}
      partnerStatus={data.partner.partnerStatus}
      backLink={<BackLink route={backLink}>{backText}</BackLink>}
    >
      {!data.partner.isWithdrawn && (
        <>
          <ForecastClaimAdvice claimLink={claimsLink} />
          <FinalClaimMessage data={data} isFc={isPartnerFc} />
        </>
      )}

      <Section title={partnerName} qa="partner-name" className="govuk-!-padding-bottom-3">
        <Renderers.Messages messages={props.messages} />

        <Forecasts.Warning {...data} />

        {isPartnerFc && data.partner.newForecastNeeded && (
          <ValidationMessage
            qa="period-change-warning"
            messageType="info"
            message={x => x.forecastsMessages.warningPeriodChange}
          />
        )}

        {data.partner.overheadRate !== null && (
          <Renderers.SimpleString qa="overhead-costs">
            <Content value={x => x.forecastsLabels.overheadCosts} />
            <Renderers.Percentage value={data.partner.overheadRate} />
          </Renderers.SimpleString>
        )}

        <Claims.ForecastTable data={data} hideValidation={isProjectPmOrMo} />
      </Section>

      <Section qa="viewForecastUpdate">
        {data.partner.forecastLastModifiedDate && (
          <Claims.ClaimLastModified modifiedDate={data.partner.forecastLastModifiedDate} />
        )}

        {showUpdateSection && (
          <Link id="update-forecast" styling="PrimaryButton" route={updateLink}>
            <Content value={x => x.pages.forecastsDetails.linkUpdateForecast} />
          </Link>
        )}
      </Section>
    </Page>
  );
};

const FinalClaimMessage = ({ data, isFc }: { data: Data; isFc: boolean }) => {
  const finalClaim = data.claims.find(x => x.isFinalClaim);

  if (!finalClaim) return null;

  const claimPageLink = PrepareClaimRoute.getLink({
    projectId: data.project.id,
    partnerId: data.partner.id,
    periodId: data.project.periodId,
  });
  const isClaimApprovedOrPaid = !!(finalClaim.isApproved || finalClaim.paidDate);

  if (isFc) {
    return isClaimApprovedOrPaid || data.partner.isWithdrawn ? (
      <ValidationMessage
        qa="final-claim-message-FC"
        messageType="info"
        message={x => x.forecastsMessages.projectEnded}
      />
    ) : (
      <ValidationMessage
        qa="final-claim-message-FC"
        messageType="info"
        message={
          <span>
            <Content value={x => x.components.forecastDetails.finalClaimMessageFc} />
            <Link route={claimPageLink} styling="Link">
              <Content value={x => x.components.forecastDetails.submitLink} />
            </Link>
            .
          </span>
        }
      />
    );
  } else {
    return null;
  }
};

export const ViewForecastRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "viewForecast",
  routePath: "/projects/:projectId/claims/:partnerId/viewForecast",
  container: ViewForecastPage,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  accessControl: (auth, { projectId, partnerId }) => {
    const isMOOrPM = auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
    const isFC = auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact);
    return isMOOrPM || isFC;
  },
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsDetails.title),
});
