import * as ACC from "@ui/components";
import { getAuthRoles, PartnerStatus, ProjectRole } from "@framework/types";
import { ClaimDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { PrepareClaimRoute } from "@ui/containers";
import { useStores } from "@ui/redux";
import { IRoutes } from "@ui/routing";
import { useProjectStatus } from "@ui/hooks";
import { BaseProps, defineRoute } from "../containerBase";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";

interface ViewForecastParams {
  projectId: string;
  partnerId: string;
}

interface ViewForecastData {
  data: Pending<ACC.Claims.ForecastData>;
  routes: IRoutes;
  messages: string[];
}

function ViewForecastComponent(props: ViewForecastParams & ViewForecastData & BaseProps) {
  const { isActive: isProjectActive } = useProjectStatus();

  const renderContents = (data: ACC.Claims.ForecastData) => {
    const { isFc: isPartnerFc } = getAuthRoles(data.partner.roles);
    // MO, PM & FC/PM should see partner name

    const { isPmOrMo: isProjectPmOrMo } = getAuthRoles(data.project.roles);
    const partnerName = isProjectPmOrMo ? ACC.getPartnerName(data.partner) : undefined;
    const backLink = isProjectPmOrMo
      ? props.routes.forecastDashboard.getLink({ projectId: data.project.id })
      : props.routes.projectOverview.getLink({ projectId: data.project.id });
    const backText = isProjectPmOrMo ? (
      <ACC.Content value={x => x.pages.forecastsDetails.backLinkMoOrPm} />
    ) : (
      <ACC.Content value={x => x.pages.forecastsDetails.backLink} />
    );

    const allClaimsDashboardLink = props.routes.allClaimsDashboard.getLink({ projectId: props.projectId });

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title {...data.project} />}
        backLink={<ACC.BackLink route={backLink}>{backText}</ACC.BackLink>}
        project={data.project}
        partner={data.partner}
      >
        {data.partner.isWithdrawn ? (
          <ACC.ValidationMessage messageType="info" message={x => x.forecastsMessages.partnerHasWithdrawn} />
        ) : (
          <ForecastClaimAdvice claimLink={allClaimsDashboardLink} />
        )}

        {renderFinalClaimMessage(data, isPartnerFc)}

        <ACC.Section title={partnerName} qa="partner-name" className="govuk-!-padding-bottom-3">
          <ACC.Renderers.Messages messages={props.messages} />

          <ACC.Forecasts.Warning {...data} />

          {isPartnerFc && data.partner.newForecastNeeded && (
            <ACC.ValidationMessage
              qa="period-change-warning"
              messageType="info"
              message={x => x.forecastsMessages.warningPeriodChange}
            />
          )}

          {renderOverheadsRate(data.partner.overheadRate)}

          <ACC.Claims.ForecastTable data={data} hideValidation={isProjectPmOrMo} />
        </ACC.Section>

        <ACC.Section qa="viewForecastUpdate">
          {data.partner.forecastLastModifiedDate && (
            <ACC.Claims.ClaimLastModified modifiedDate={data.partner.forecastLastModifiedDate} />
          )}

          {renderUpdateSection(data.project, data.partner, data.claims)}
        </ACC.Section>
      </ACC.Page>
    );
  };

  const renderFinalClaimMessage = (data: ACC.Claims.ForecastData, isFc: boolean) => {
    const finalClaim = data.claims.find(x => x.isFinalClaim);

    if (!finalClaim) return null;

    const claimPageLink = PrepareClaimRoute.getLink({
      projectId: data.project.id,
      partnerId: data.partner.id,
      periodId: data.project.periodId,
    });
    const isClaimApprovedOrPaid = finalClaim.isApproved || finalClaim.paidDate;

    if (isFc) {
      return isClaimApprovedOrPaid || data.partner.isWithdrawn ? (
        <ACC.ValidationMessage
          qa="final-claim-message-FC"
          messageType="info"
          message={x => x.forecastsMessages.projectEnded}
        />
      ) : (
        <ACC.ValidationMessage
          qa="final-claim-message-FC"
          messageType="info"
          message={
            <span>
              <ACC.Content value={x => x.components.forecastDetails.finalClaimMessageFc} />
              <ACC.Link route={claimPageLink} styling="Link">
                <ACC.Content value={x => x.components.forecastDetails.submitLink} />
              </ACC.Link>
              .
            </span>
          }
        />
      );
    }

    const { isPm } = getAuthRoles(data.project.roles);

    if (isPm) return null;

    return finalClaim.isApproved ? (
      <ACC.ValidationMessage
        qa="final-claim-message-MO"
        messageType="info"
        message={
          <>
            {ACC.getPartnerName(data.partner)}
            <ACC.Content value={x => x.components.forecastDetails.finalClaimMessageMo} />
          </>
        }
      />
    ) : (
      <ACC.ValidationMessage
        qa="final-claim-message-MO"
        messageType="info"
        message={
          <>
            {ACC.getPartnerName(data.partner)}
            <ACC.Content value={x => x.components.forecastDetails.finalClaimDueMessageMo} />
          </>
        }
      />
    );
  };

  const renderOverheadsRate = (overheadRate: number | null) => {
    if (overheadRate === null || overheadRate === undefined) return null;

    return (
      <ACC.Renderers.SimpleString qa="overhead-costs">
        <ACC.Content value={x => x.forecastsLabels.overheadCosts} />
        <ACC.Renderers.Percentage value={overheadRate} />
      </ACC.Renderers.SimpleString>
    );
  };

  const renderUpdateSection = (project: ProjectDto, partner: PartnerDto, claims: ClaimDto[]) => {
    const { isFc: isPartnerFc } = getAuthRoles(partner.roles);

    if (!isProjectActive) return null;
    if (!isPartnerFc) return null;
    if (partner.isWithdrawn) return null;
    const finalClaim = claims.find(x => x.isFinalClaim);
    if (finalClaim) return null;
    if (partner.partnerStatus === PartnerStatus.OnHold) return null;

    return (
      <ACC.Link
        id="update-forecast"
        styling="PrimaryButton"
        route={props.routes.forecastUpdate.getLink({
          projectId: project.id,
          partnerId: partner.id,
          periodId: project.periodId,
        })}
      >
        <ACC.Content value={x => x.pages.forecastsDetails.linkUpdateForecast} />
      </ACC.Link>
    );
  };

  return <ACC.PageLoader pending={props.data} render={data => renderContents(data)} />;
}

const ViewForecastContainer = (props: ViewForecastParams & BaseProps) => {
  const stores = useStores();
  return (
    <ViewForecastComponent
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
    />
  );
};

export const ForecastDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "viewForecast",
  routePath: "/projects/:projectId/claims/:partnerId/viewForecast",
  container: ViewForecastContainer,
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
