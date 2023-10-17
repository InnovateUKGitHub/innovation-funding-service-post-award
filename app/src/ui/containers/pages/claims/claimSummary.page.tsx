import { useNavigate } from "react-router-dom";
import { useContent } from "@ui/hooks/content.hook";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator, claimCommentsMaxLength } from "@ui/validation/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { TotalCosts } from "@framework/constants/claims";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectMonitoringLevel, ProjectRole } from "@framework/constants/project";
import { ClaimDto, ClaimStatusChangeDto } from "@framework/dtos/claimDto";
// import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
// import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { roundCurrency } from "@framework/util/numberHelper";
// import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { DocumentsUnavailable } from "@ui/components/atomicDesign/organisms/documents/DocumentsUnavailable/DocumentsUnavailable";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useStores } from "@ui/redux/storesProvider";
import { ClaimPeriodDate } from "@ui/components/atomicDesign/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { checkImpactManagementPcfNotSubmittedForFinalClaim } from "@ui/helpers/checkImpPcfNotSubmittedForFinalClaim";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";

export interface ClaimSummaryParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

type OnUpdate = (saving: boolean, dto: Pick<ClaimDto, "comments">, link: ILinkInfo, isSubmitting: boolean) => void;

interface CombinedData {
  project: Pick<
    ProjectDto,
    | "id"
    | "competitionType"
    | "roles"
    | "impactManagementParticipation"
    | "projectNumber"
    | "title"
    | "isNonFec"
    | "monitoringLevel"
  >;
  partner: Pick<
    PartnerDto,
    | "id"
    | "awardRate"
    | "totalParticipantGrant"
    | "totalFutureForecastsForParticipants"
    | "totalParticipantCostsClaimed"
  >;
  claim: Pick<
    ClaimDto,
    | "id"
    | "isFinalClaim"
    | "pcfStatus"
    | "periodEndDate"
    | "periodId"
    | "periodStartDate"
    | "isIarRequired"
    | "comments"
    | "totalCost"
    | "status"
  >;
  //   claimOverrides: Pick<ClaimOverrideRateDto, "">;
  //   claimDetails: Pick<CostsSummaryForPeriodDto, "">[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
  statusChanges: ClaimStatusChangeDto[];
  documents: DocumentSummaryDto[];
  totalCosts: TotalCosts;
}

type LinkProps = {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
};

const Form = createTypedForm<ClaimDto>();

const ClaimSummaryComponent = (
  props: CombinedData &
    BaseProps &
    ClaimSummaryParams & {
      onUpdate: OnUpdate;
    },
) => {
  const { isLoans } = checkProjectCompetition(props.project.competitionType);

  const linkProps: LinkProps = {
    projectId: props.projectId,
    partnerId: props.partnerId,
    periodId: props.periodId,
  };

  const { isMo } = getAuthRoles(props.project.roles);

  // Disable completing the form if impact management and not received PCF
  const impMgmtPcfNotSubmittedForFinalClaim =
    props.project.impactManagementParticipation === ImpactManagementParticipation.Yes
      ? props.claim.isFinalClaim && props.claim.pcfStatus !== "Received"
      : false;

  return (
    <Page
      backLink={
        <BackLink
          route={
            props.claim.isFinalClaim
              ? props.routes.claimDocuments.getLink(linkProps)
              : props.routes.claimForecast.getLink(linkProps)
          }
        >
          <Content value={x => x.pages.claimPrepareSummary.backToDocuments} />
        </BackLink>
      }
      error={props.editor.error}
      validator={props.editor.validator}
      pageTitle={<Title projectNumber={props.project.projectNumber} title={props.project.title} />}
    >
      {props.totalCosts.totalCostsClaimed < 0 && (
        <ValidationMessage
          qa="summary-warning"
          messageType="info"
          message={x => x.claimsMessages.claimSummaryWarning}
        />
      )}

      <Section qa="claimSummaryForm" title={<ClaimPeriodDate claim={props.claim} />}>
        {impMgmtPcfNotSubmittedForFinalClaim &&
          (isMo ? (
            <ValidationMessage
              messageType="info"
              message={<Content value={x => x.claimsMessages.moIarPcfMissingFinalClaim} markdown />}
            />
          ) : (
            <ValidationMessage
              messageType="info"
              message={<Content value={x => x.claimsMessages.applicantIarPcfMissingFinalClaim} markdown />}
            />
          ))}
        {props.claim.isFinalClaim && (
          <ValidationMessage messageType="info" message={<Content value={x => x.claimsMessages.finalClaim} />} />
        )}

        <Section
          title={<Content value={x => x.pages.claimPrepareSummary.costsTitle} />}
          qa="costs-to-be-claimed-summary"
        >
          {/* <AwardRateOverridesMessage claimOverrides={props.claimOverrides} isNonFec={props.project.isNonFec} /> */}
          <SummaryList qa="costs-to-be-claimed-summary-list">
            <SummaryListItem
              label={x => x.pages.claimPrepareSummary.costsClaimedLabel}
              content={<Currency value={props.totalCosts.totalCostsClaimed} />}
              qa="totalCostsClaimed"
            />

            <SummaryListItem
              label={x => x.pages.claimPrepareSummary.fundingLevelLabel}
              content={<Percentage value={props.partner.awardRate} />}
              qa="fundingLevel"
            />

            {!isLoans && (
              <SummaryListItem
                label={x => x.pages.claimPrepareSummary.costsToBePaidLabel}
                content={<Currency value={props.totalCosts.totalCostsPaid} />}
                qa="totalCostsPaid"
              />
            )}
          </SummaryList>

          <SimpleString>
            <Link id="editCostsToBeClaimedLink" route={props.routes.prepareClaim.getLink(linkProps)}>
              <Content value={x => x.pages.claimPrepareSummary.editCostsMessage} />
            </Link>
          </SimpleString>
        </Section>

        <Section
          title={<Content value={x => x.pages.claimPrepareSummary.claimDocumentsTitle} />}
          qa="claim-documents-summary"
        >
          <DocumentValidation {...props} linkProps={linkProps} />
        </Section>

        {!props.claim.isFinalClaim && <ForecastSummary linkProps={linkProps} {...props} />}

        <ClaimForm {...props} disabled={impMgmtPcfNotSubmittedForFinalClaim} />
      </Section>
    </Page>
  );
};

const DocumentValidation = (
  props: { claim: Pick<ClaimDto, "isIarRequired">; documents: DocumentSummaryDto[] } & {
    linkProps: LinkProps;
    routes: BaseProps["routes"];
  },
) => {
  const displayDocumentError = props.claim.isIarRequired && !props.documents.length;

  const editDocumentLink = (
    <SimpleString>
      <Link id="claimDocumentsLink" route={props.routes.claimDocuments.getLink(props.linkProps)}>
        <Content value={x => x.pages.claimPrepareSummary.editClaimDocuments} />
      </Link>
    </SimpleString>
  );

  return displayDocumentError ? (
    <ValidationMessage
      messageType="error"
      message={
        <>
          <SimpleString>
            <Content value={x => x.pages.claimPrepareSummary.finalClaimSupportingDocumentMessage} />
          </SimpleString>

          {editDocumentLink}
        </>
      }
    />
  ) : (
    // TODO: Speak with business about refactoring to document table UI
    <>
      {props.documents.length ? (
        <Section subtitle={<Content value={x => x.documentMessages.newWindow} />}>
          <DocumentList documents={props.documents} qa="claim-documents-list" />
        </Section>
      ) : (
        <DocumentsUnavailable />
      )}

      {editDocumentLink}
    </>
  );
};

const ClaimForm = ({
  editor,
  claim,
  project,
  disabled,
  routes,
  projectId,
  partnerId,
  onUpdate,
}: {
  editor: CombinedData["editor"];
  claim: Pick<ClaimDto, "status" | "id">;
  project: Pick<ProjectDto, "monitoringLevel" | "roles">;
  disabled: boolean;
  routes: BaseProps["routes"];
  projectId: ProjectId;
  partnerId: PartnerId;
  onUpdate: OnUpdate;
}) => {
  return (
    <Form.Form
      editor={editor}
      onSubmit={() => onSave(claim, editor, true, project, routes, projectId, partnerId, onUpdate)}
      qa="summary-form"
    >
      <Form.Fieldset heading={x => x.pages.claimPrepareSummary.addCommentsHeading}>
        <Form.MultilineString
          name="comments"
          hint={x => x.pages.claimPrepareSummary.addCommentsHint}
          value={x => x.comments}
          update={(m, v) => (m.comments = v || "")}
          validation={editor.validator.comments}
          characterCountOptions={{ type: "descending", maxValue: claimCommentsMaxLength }}
          qa="info-text-area"
        />
      </Form.Fieldset>

      <Form.Fieldset qa="save-buttons">
        <SimpleString>
          <Content value={x => x.claimsMessages.submitClaimConfirmation} />
        </SimpleString>

        <Form.Submit disabled={disabled}>
          <Content value={x => x.pages.claimPrepareSummary.submitClaimMessage} />
        </Form.Submit>

        <Form.Button
          name="save"
          onClick={() => onSave(claim, editor, false, project, routes, projectId, partnerId, onUpdate)}
        >
          <Content value={x => x.pages.claimPrepareSummary.saveAndReturnMessage} />
        </Form.Button>
      </Form.Fieldset>
    </Form.Form>
  );
};

const onSave = (
  original: Pick<ClaimDto, "id" | "status">,
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>,
  submit: boolean,
  project: Pick<ProjectDto, "roles" | "monitoringLevel">,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  partnerId: PartnerId,
  onUpdate: OnUpdate,
) => {
  const { isPmOrMo } = getAuthRoles(project.roles);

  const updateLink = isPmOrMo
    ? routes.allClaimsDashboard.getLink({ projectId })
    : routes.claimsDashboard.getLink({ projectId, partnerId });

  const dto = editor.data;

  // Note: We set the default claim status, then update only if user wants to submit.
  dto.status = original.status;

  if (submit) {
    switch (original.status) {
      case ClaimStatus.DRAFT:
      case ClaimStatus.MO_QUERIED:
        if (project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
          dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        } else {
          dto.status = ClaimStatus.SUBMITTED;
        }
        break;

      case ClaimStatus.AWAITING_IAR:
      case ClaimStatus.INNOVATE_QUERIED:
        dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        break;
    }
  }

  onUpdate(true, dto, updateLink, submit);
};

const ForecastSummary = ({
  linkProps,
  partner,
  claim,
  routes,
}: {
  linkProps: LinkProps;
  claim: Pick<ClaimDto, "totalCost">;
  routes: BaseProps["routes"];
  partner: Pick<
    PartnerDto,
    "totalParticipantGrant" | "totalFutureForecastsForParticipants" | "totalParticipantCostsClaimed"
  >;
}) => {
  const totalEligibleCosts = partner.totalParticipantGrant || 0;
  const totalForecastsAndCosts =
    (partner.totalFutureForecastsForParticipants || 0) +
    (partner.totalParticipantCostsClaimed || 0) +
    (claim.totalCost || 0);

  const difference = roundCurrency(totalEligibleCosts - totalForecastsAndCosts);
  const differencePercentage = totalEligibleCosts > 0 ? (difference * 100) / totalEligibleCosts : 0;
  const editForecastMessage = <Content value={x => x.pages.claimPrepareSummary.editForecastMessage} />;
  const forecastTitle = <Content value={x => x.pages.claimPrepareSummary.forecastTitle} />;

  return (
    <Section title={forecastTitle} qa="forecast-summary">
      <SummaryList qa="forecast-summary-list">
        <SummaryListItem
          label={x => x.pages.claimPrepareSummary.eligibleCostsLabel}
          content={<Currency value={totalEligibleCosts} />}
          qa="totalEligibleCosts"
        />

        <SummaryListItem
          label={x => x.pages.claimPrepareSummary.forecastLabel}
          content={<Currency value={totalForecastsAndCosts} />}
          qa="totalForecastsAndCosts"
        />

        <SummaryListItem
          label={x => x.pages.claimPrepareSummary.differenceLabel}
          content={
            <>
              <Currency value={difference} /> (<Percentage value={differencePercentage} />)
            </>
          }
          qa="differenceEligibleAndForecast"
        />
      </SummaryList>

      <SimpleString>
        <Link id="editForecastLink" route={routes.claimForecast.getLink(linkProps)}>
          {editForecastMessage}
        </Link>
      </SimpleString>
    </Section>
  );
};

const ClaimSummaryContainer = (props: ClaimSummaryParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const { getContent } = useContent();
  const claimSavedMessage = getContent(x => x.claimsMessages.claimSavedMessage);
  const claimSubmittedMessage = getContent(x => x.claimsMessages.claimSubmittedMessage);

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partner: stores.partners.getById(props.partnerId),
    claim: stores.claims.get(props.partnerId, props.periodId),
    // claimOverrides: stores.claimOverrides.getAllByPartner(props.partnerId),
    // claimDetails: stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId), // costsSummaryForPeriod
    statusChanges: stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId),
    documents: stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId),
    editor: stores.claims.getClaimEditor(true, props.projectId, props.partnerId, props.periodId),
    totalCosts: stores.claims.getTotalCosts(props.projectId, props.partnerId, props.periodId),
  });

  const onUpdate = (saving: boolean, dto: Pick<ClaimDto, "comments">, link: ILinkInfo, isSubmitting: boolean) =>
    stores.claims.updateClaimEditor(
      true,
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      dto as ClaimDto,
      isSubmitting ? claimSubmittedMessage : claimSavedMessage,
      () => navigate(link.path),
    );

  return (
    <PageLoader
      pending={combined}
      render={data => <ClaimSummaryComponent {...data} onUpdate={onUpdate} {...props} />}
    />
  );
};

export const ClaimSummaryRoute = defineRoute({
  routeName: "claimSummary",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/summary",
  container: ClaimSummaryContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimSummary.title),
});
