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
import { NewForecastTable } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable";
import {
  useMapToForecastTableDto,
  useNewForecastTableData,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { useUpdateForecastData } from "./ForecastTile.logic";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";
import { ForecastAgreedCostWarning } from "@ui/components/atomicDesign/molecules/forecasts/ForecastAgreedCostWarning/ForecastAgreedCostWarning";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";

export interface ViewForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ViewForecastPage = ({ projectId, partnerId }: ViewForecastParams & BaseProps) => {
  const data = useUpdateForecastData({ projectId, partnerId });
  const fragmentData = useNewForecastTableData({ fragmentRef: data.fragmentRef, isProjectSetup: false });

  const { isFc, isPmOrMo } = getAuthRoles(fragmentData.project.roles);

  const routes = useRoutes();
  const { getContent } = useContent();

  const tableData = useMapToForecastTableDto(fragmentData);

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
      <ForecastClaimAdvice isFc={isFc} />

      {tableData.isFinalClaim && <ValidationMessage messageType="info" message={x => x.forecastsMessages.finalClaim} />}

      <Section title={data.partner.name} qa="partner-forecast">
        <ForecastAgreedCostWarning
          isFc={isFc}
          costCategories={tableData.costCategories
            .filter(x => x.greaterThanAllocatedCosts)
            .map(x => x.costCategoryName)}
        />
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
        <Fieldset>
          <Link route={routes.forecastUpdate.getLink({ projectId, partnerId })}>
            <Button type="submit" styling="Primary">
              {getContent(x => x.pages.forecastsDetails.linkUpdateForecast)}
            </Button>
          </Link>
        </Fieldset>
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
