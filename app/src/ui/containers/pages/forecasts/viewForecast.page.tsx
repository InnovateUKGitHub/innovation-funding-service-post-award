import { PartnerStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { ClaimLastModified } from "@ui/components/atomicDesign/organisms/claims/ClaimLastModified/claimLastModified";
import { ForecastTable } from "@ui/components/atomicDesign/organisms/claims/ForecastTable/forecastTable.standalone";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Warning } from "@ui/components/atomicDesign/organisms/forecasts/Warning/warning.withFragment";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { getPartnerName } from "@ui/components/atomicDesign/organisms/partners/utils/partnerName";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { BaseProps, defineRoute } from "../../containerBase";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";
import { useViewForecastData } from "./viewForecast.logic";
import { PrepareClaimRoute } from "@ui/containers/pages/claims/claimPrepare.page";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ClaimStatus } from "@framework/constants/claimStatus";

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
      pageTitle={<Title />}
      backLink={<BackLink route={backLink}>{backText}</BackLink>}
      isActive={data.project.isActive}
      fragmentRef={data.fragmentRef}
      projectId={props.projectId}
      partnerId={props.partnerId}
    >
      {!data.partner.isWithdrawn && (
        <>
          <ForecastClaimAdvice isFc={isFc} />
          <FinalClaimMessage data={data} isFc={isPartnerFc} />
        </>
      )}

      <Section title={partnerName} qa="partner-name" className="govuk-!-padding-bottom-3">
        <Messages messages={props.messages} />

        <Warning />

        {isPartnerFc && data.partner.newForecastNeeded && (
          <ValidationMessage
            qa="period-change-warning"
            messageType="info"
            message={x => x.forecastsMessages.warningPeriodChange}
          />
        )}

        {data.partner.overheadRate !== null && (
          <SimpleString qa="overhead-costs">
            <Content value={x => x.forecastsLabels.overheadCosts} />
            <Percentage value={data.partner.overheadRate} />
          </SimpleString>
        )}

        <ForecastTable
          selectCurrentClaimByApprovedStatus
          hideValidation={isProjectPmOrMo}
          partnerId={props.partnerId}
          projectId={props.projectId}
        />
      </Section>

      <Section qa="viewForecastUpdate">
        {data.partner.forecastLastModifiedDate && (
          <ClaimLastModified modifiedDate={data.partner.forecastLastModifiedDate} />
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

const FinalClaimMessage = ({
  data,
  isFc,
}: {
  data: {
    claims: Pick<ClaimDto, "isFinalClaim" | "isApproved" | "paidDate" | "periodId" | "status">[];
    project: Pick<ProjectDto, "id" | "periodId">;
    partner: Pick<PartnerDto, "id" | "isWithdrawn">;
  };
  isFc: boolean;
}) => {
  const finalClaim = data.claims.find(x => x.isFinalClaim);

  if (!finalClaim) return null;

  const claimPageLink = PrepareClaimRoute.getLink({
    projectId: data.project.id,
    partnerId: data.partner.id,
    periodId: finalClaim.periodId,
  });
  const isClaimApprovedOrPaid = !!(finalClaim.isApproved || finalClaim.paidDate);

  if (isFc) {
    if (isClaimApprovedOrPaid || data.partner.isWithdrawn) {
      return (
        <ValidationMessage
          qa="final-claim-message-FC"
          messageType="info"
          message={x => x.forecastsMessages.projectEnded}
        />
      );
    }

    if (
      finalClaim.status === ClaimStatus.DRAFT ||
      finalClaim.status === ClaimStatus.MO_QUERIED ||
      finalClaim.status === ClaimStatus.INNOVATE_QUERIED
    ) {
      return (
        <ValidationMessage
          qa="final-claim-message-FC"
          messageType="info"
          message={
            <span>
              <Content
                value={x => x.forecastsMessages.projectFinalClaimNotSubmitted}
                components={[
                  <Link key="0" route={claimPageLink} styling="Link">
                    {" "}
                  </Link>,
                ]}
              />
            </span>
          }
        />
      );
    }

    return (
      <ValidationMessage
        qa="final-claim-message-FC"
        messageType="info"
        message={x => x.forecastsMessages.projectFinalClaimSubmitted}
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
