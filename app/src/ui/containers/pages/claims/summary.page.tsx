import { useNavigate } from "react-router-dom";
import { useContent } from "@ui/hooks/content.hook";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator, claimCommentsMaxLength } from "@ui/validation/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { TotalCosts } from "@framework/constants/claims";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectMonitoringLevel, ProjectRole } from "@framework/constants/project";
import { ClaimDto, ClaimStatusChangeDto } from "@framework/dtos/claimDto";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { roundCurrency } from "@framework/util/numberHelper";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
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

export interface ClaimSummaryParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  claim: ClaimDto;
  claimOverrides: ClaimOverrideRateDto;
  claimDetails: CostsSummaryForPeriodDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
  statusChanges: ClaimStatusChangeDto[];
  documents: DocumentSummaryDto[];
  totalCosts: TotalCosts;
}

interface ClaimSummaryComponentProps extends ClaimSummaryParams, BaseProps {
  projectId: ProjectId;
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claim: Pending<ClaimDto>;
  claimOverrides: Pending<ClaimOverrideRateDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  totalCosts: Pending<TotalCosts>;
  onUpdate: (saving: boolean, dto: ClaimDto, next: ILinkInfo, isSubmitting: boolean) => void;
}

const Form = createTypedForm<ClaimDto>();

const ClaimSummaryComponent = (props: ClaimSummaryComponentProps) => {
  const getClaimLinkProps = (data: Pick<CombinedData, "project" | "partner">) => ({
    projectId: data.project.id,
    partnerId: data.partner.id,
    periodId: props.periodId,
  });

  const renderContents = ({ totalCosts, ...data }: CombinedData) => {
    const { isLoans } = checkProjectCompetition(data.project.competitionType);
    const linkProps = getClaimLinkProps(data);
    const { isMo } = getAuthRoles(data.project.roles);

    // Disable completing the form if impact management and not received PCF
    const impMgmtPcfNotSubmittedForFinalClaim =
      data.project.impactManagementParticipation === ImpactManagementParticipation.Yes
        ? data.claim.isFinalClaim && data.claim.pcfStatus !== "Received"
        : false;

    return (
      <Page
        backLink={renderBackLink(data)}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<Title {...data.project} />}
      >
        {totalCosts.totalCostsClaimed < 0 && (
          <ValidationMessage
            qa="summary-warning"
            messageType="info"
            message={x => x.claimsMessages.claimSummaryWarning}
          />
        )}

        <Section qa="claimSummaryForm" title={<ClaimPeriodDate claim={data.claim} />}>
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
          {data.claim.isFinalClaim && (
            <ValidationMessage messageType="info" message={<Content value={x => x.claimsMessages.finalClaim} />} />
          )}

          <Section
            title={<Content value={x => x.pages.claimPrepareSummary.costsTitle} />}
            qa="costs-to-be-claimed-summary"
          >
            <AwardRateOverridesMessage claimOverrides={data.claimOverrides} isNonFec={data.project.isNonFec} />
            <SummaryList qa="costs-to-be-claimed-summary-list">
              <SummaryListItem
                label={x => x.pages.claimPrepareSummary.costsClaimedLabel}
                content={<Currency value={totalCosts.totalCostsClaimed} />}
                qa="totalCostsClaimed"
              />

              <SummaryListItem
                label={x => x.pages.claimPrepareSummary.fundingLevelLabel}
                content={<Percentage value={data.partner.awardRate} />}
                qa="fundingLevel"
              />

              {!isLoans && (
                <SummaryListItem
                  label={x => x.pages.claimPrepareSummary.costsToBePaidLabel}
                  content={<Currency value={totalCosts.totalCostsPaid} />}
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
            {renderDocumentValidation(data)}
          </Section>

          {!data.claim.isFinalClaim && renderForecastSummary(data)}

          <ClaimForm {...data} disabled={impMgmtPcfNotSubmittedForFinalClaim} />
        </Section>
      </Page>
    );
  };

  const renderDocumentValidation = (data: Pick<CombinedData, "claim" | "documents" | "partner" | "project">) => {
    const linkProps = getClaimLinkProps(data);
    const displayDocumentError = data.claim.isIarRequired && !data.documents.length;

    const editDocumentLink = (
      <SimpleString>
        <Link id="claimDocumentsLink" route={props.routes.claimDocuments.getLink(linkProps)}>
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
        {data.documents.length ? (
          <Section subtitle={<Content value={x => x.documentMessages.newWindow} />}>
            <DocumentList documents={data.documents} qa="claim-documents-list" />
          </Section>
        ) : (
          <DocumentsUnavailable />
        )}

        {editDocumentLink}
      </>
    );
  };

  const renderBackLink = (data: Pick<CombinedData, "claim" | "project" | "partner">) => {
    const linkProps = getClaimLinkProps(data);

    return data.claim.isFinalClaim ? (
      <BackLink route={props.routes.claimDocuments.getLink(linkProps)}>
        <Content value={x => x.pages.claimPrepareSummary.backToDocuments} />
      </BackLink>
    ) : (
      <BackLink route={props.routes.claimForecast.getLink(linkProps)}>
        <Content value={x => x.pages.claimPrepareSummary.backToForecast} />
      </BackLink>
    );
  };

  const ClaimForm = ({
    editor,
    claim,
    project,
    disabled,
  }: Pick<CombinedData, "editor" | "claim" | "project"> & { disabled: boolean }) => {
    return (
      <Form.Form editor={editor} onSubmit={() => onSave(claim, editor, true, project)} qa="summary-form">
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

          <Form.Button name="save" onClick={() => onSave(claim, editor, false, project)}>
            <Content value={x => x.pages.claimPrepareSummary.saveAndReturnMessage} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    );
  };

  const onSave = (
    original: ClaimDto,
    editor: IEditorStore<ClaimDto, ClaimDtoValidator>,
    submit: boolean,
    project: ProjectDto,
  ) => {
    const { isPmOrMo } = getAuthRoles(project.roles);

    const updateLink = isPmOrMo
      ? props.routes.allClaimsDashboard.getLink({ projectId: project.id })
      : props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: props.partnerId });

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

    props.onUpdate(true, dto, updateLink, submit);
  };

  const renderForecastSummary = (data: Pick<CombinedData, "project" | "partner" | "claim">) => {
    const linkProps = getClaimLinkProps(data);
    const totalEligibleCosts = data.partner.totalParticipantGrant || 0;
    const totalForecastsAndCosts =
      (data.partner.totalFutureForecastsForParticipants || 0) +
      (data.partner.totalParticipantCostsClaimed || 0) +
      (data.claim.totalCost || 0);

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
          <Link id="editForecastLink" route={props.routes.claimForecast.getLink(linkProps)}>
            {editForecastMessage}
          </Link>
        </SimpleString>
      </Section>
    );
  };

  const combined = Pending.combine({
    project: props.project,
    partner: props.partner,
    claim: props.claim,
    claimOverrides: props.claimOverrides,
    claimDetails: props.costsSummaryForPeriod,
    editor: props.editor,
    statusChanges: props.statusChanges,
    documents: props.documents,
    totalCosts: props.totalCosts,
  });

  return <PageLoader pending={combined} render={renderContents} />;
};

const ClaimSummaryContainer = (props: ClaimSummaryParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const { getContent } = useContent();
  const claimSavedMessage = getContent(x => x.claimsMessages.claimSavedMessage);
  const claimSubmittedMessage = getContent(x => x.claimsMessages.claimSubmittedMessage);
  return (
    <ClaimSummaryComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      claimOverrides={stores.claimOverrides.getAllByPartner(props.partnerId)}
      costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
      statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
      documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
      editor={stores.claims.getClaimEditor(true, props.projectId, props.partnerId, props.periodId)}
      totalCosts={stores.claims.getTotalCosts(props.projectId, props.partnerId, props.periodId)}
      onUpdate={(saving, dto, link, isSubmitting) =>
        stores.claims.updateClaimEditor(
          true,
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          isSubmitting ? claimSubmittedMessage : claimSavedMessage,
          () => navigate(link.path),
        )
      }
    />
  );
};

/**
 * `/projects/:projectId/claims/:partnerId/prepare/:periodId/summary`
 */
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
