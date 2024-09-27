import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Button } from "@ui/components/atoms/Button/Button";
import { FullDateTime } from "@ui/components/atoms/Date";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { ForecastAgreedCostWarning } from "@ui/components/molecules/forecasts/ForecastAgreedCostWarning/ForecastAgreedCostWarning";
import { NewForecastTable } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable";
import {
  useMapToForecastTableDto,
  useNewForecastTableData,
} from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { useUpdateForecastData } from "./ForecastTile.logic";
import { FinalClaimMessage } from "./components/FinalClaimMessage";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";
import {
  ClaimStatusGroup,
  getClaimStatusGroup,
} from "@ui/components/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { PartnerStatus } from "@framework/constants/partner";

export interface ViewForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ViewForecastPage = ({ projectId, partnerId }: ViewForecastParams & BaseProps) => {
  const data = useUpdateForecastData({ projectId, partnerId });
  const fragmentData = useNewForecastTableData({ fragmentRef: data.fragmentRef, isProjectSetup: false, partnerId });

  const { isPmOrMo } = getAuthRoles(fragmentData.project.roles);
  const { isFc: isPartnerFc } = getAuthRoles(fragmentData.partner.roles);

  const routes = useRoutes();
  const { getContent } = useContent();

  const tableData = useMapToForecastTableDto(fragmentData);

  const finalClaimStatusGroup = tableData.finalClaim ? getClaimStatusGroup(tableData.finalClaim.status) : null;

  const showUpdateSection =
    data.project.isActive &&
    isPartnerFc &&
    !data.partner.isWithdrawn &&
    data.partner.partnerStatus !== PartnerStatus.OnHold;

  const disableUpdateSection =
    finalClaimStatusGroup === ClaimStatusGroup.EDITABLE_CLAIMING ||
    finalClaimStatusGroup === ClaimStatusGroup.SUBMITTED_CLAIMING ||
    finalClaimStatusGroup === ClaimStatusGroup.CLAIMED;

  return (
    <Page
      backLink={
        isPmOrMo ? (
          <BackLink route={routes.forecastDashboard.getLink({ projectId })}>
            <Content value={x => x.pages.forecastsDetails.backLinkMoOrPm} />
          </BackLink>
        ) : (
          <BackLink route={routes.projectOverview.getLink({ projectId })}>
            <Content value={x => x.pages.forecastsDetails.backLink} />
          </BackLink>
        )
      }
      fragmentRef={data.fragmentRef}
    >
      <ForecastClaimAdvice isFc={isPartnerFc} />
      <FinalClaimMessage
        isFc={isPartnerFc}
        projectId={projectId}
        partnerId={partnerId}
        finalClaim={tableData.finalClaim}
        finalClaimStatusGroup={finalClaimStatusGroup}
      />

      <Section title={data.partner.name} qa="partner-forecast">
        <ForecastAgreedCostWarning
          isFc={isPartnerFc}
          costCategories={tableData.costCategories
            .filter(x => x.greaterThanAllocatedCosts)
            .map(x => x.costCategoryName)}
        />
        {isPartnerFc && data.partner.newForecastNeeded && (
          <ValidationMessage
            qa="period-change-warning"
            messageType="info"
            message={x => x.forecastsMessages.warningPeriodChange}
          />
        )}
        {fragmentData.partner.overheadRate !== null && (
          <P>
            {getContent(x => x.pages.claimForecast.overheadsCosts({ percentage: fragmentData.partner.overheadRate }))}
          </P>
        )}
        <NewForecastTable tableData={tableData} isProjectSetup={false} />
        <P>
          {getContent(x => x.components.claimLastModified.message)}
          {": "}
          <FullDateTime
            value={fragmentData.partner.forecastLastModifiedDate}
            nullDisplay={getContent(x => x.components.claimLastModified.never)}
          />
        </P>
        {showUpdateSection && (
          <Fieldset>
            <Link route={routes.forecastUpdate.getLink({ projectId, partnerId })} disabled={disableUpdateSection}>
              <Button type="submit" styling="Primary" disabled={disableUpdateSection}>
                {getContent(x => x.pages.forecastsDetails.linkUpdateForecast)}
              </Button>
            </Link>
          </Fieldset>
        )}
      </Section>
    </Page>
  );
};

export const ViewForecastRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "viewForecast",
  routePath: "/projects/:projectId/claims/:partnerId/viewForecast",
  container: ViewForecastPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  accessControl: (auth, { projectId, partnerId }) => {
    const isMOOrPM = auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
    const isFC = auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact);
    return isMOOrPM || isFC;
  },
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsDetails.title),
});
