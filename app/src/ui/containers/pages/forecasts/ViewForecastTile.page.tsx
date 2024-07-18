import { PartnerStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { FullDateTime } from "@ui/components/atomicDesign/atoms/Date";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ForecastAgreedCostWarning } from "@ui/components/atomicDesign/molecules/forecasts/ForecastAgreedCostWarning/ForecastAgreedCostWarning";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { NewForecastTable } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable";
import { useMapToForecastTableDto } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import {
  ClaimStatusGroup,
  getClaimStatusGroup,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import { useForecastTableFragment } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/useForecastTableFragment";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { useUpdateForecastData } from "./ForecastTile.logic";
import { FinalClaimMessage } from "./components/FinalClaimMessage";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";
import { ForecastHiddenCostWarning } from "@ui/components/atomicDesign/molecules/forecasts/ForecastHiddenClaimWarning/ForecastHiddenClaimWarning";

export interface ViewForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ViewForecastPage = ({ projectId, partnerId }: ViewForecastParams & BaseProps) => {
  const data = useUpdateForecastData({ projectId, partnerId });
  const fragmentData = useForecastTableFragment({ fragmentRef: data.fragmentRef, isProjectSetup: false, partnerId });

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
            .filter(x => x.greaterThanAllocatedCosts && x.costCategoryName)
            .map(x => x.costCategoryName as string)}
        />
        {isPartnerFc && data.partner.newForecastNeeded && (
          <ValidationMessage
            qa="period-change-warning"
            messageType="info"
            message={x => x.forecastsMessages.warningPeriodChange}
          />
        )}
        <ForecastHiddenCostWarning costCategories={tableData.costCategories} />
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
