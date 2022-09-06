import { useNavigate } from "react-router-dom";
import { useStores } from "@ui/redux";
import { useContent } from "@ui/hooks";
import * as ACC from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator, claimCommentsMaxLength } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import {
  ClaimDto,
  ClaimStatus,
  ClaimStatusChangeDto,
  CostsSummaryForPeriodDto,
  getAuthRoles,
  ILinkInfo,
  PartnerDto,
  ProjectDto,
  ProjectRole,
  TotalCosts,
} from "@framework/types";
import { roundCurrency } from "@framework/util";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

export interface ClaimSummaryParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
  statusChanges: ClaimStatusChangeDto[];
  documents: DocumentSummaryDto[];
  totalCosts: TotalCosts;
}

interface ClaimSummaryComponentProps extends ClaimSummaryParams, BaseProps {
  projectId: string;
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claim: Pending<ClaimDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  totalCosts: Pending<TotalCosts>;
  onUpdate: (saving: boolean, dto: ClaimDto, next: ILinkInfo, isSubmitting: boolean) => void;
}

function ClaimSummaryComponent(props: ClaimSummaryComponentProps) {
  const getClaimLinkProps = (data: Pick<CombinedData, "project" | "partner">) => ({
    projectId: data.project.id,
    partnerId: data.partner.id,
    periodId: props.periodId,
  });

  const renderContents = ({ totalCosts, ...data }: CombinedData) => {
    const { isLoans } = checkProjectCompetition(data.project.competitionType);
    const linkProps = getClaimLinkProps(data);

    return (
      <ACC.Page
        backLink={renderBackLink(data)}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title {...data.project} />}
      >
        {totalCosts.totalCostsClaimed < 0 && (
          <ACC.ValidationMessage
            qa="summary-warning"
            messageType="info"
            message={x => x.claimPrepareSummary.messages.claimSummaryWarning}
          />
        )}

        <ACC.Section qa="claimSummaryForm" title={<ACC.Claims.ClaimPeriodDate claim={data.claim} />}>
          {data.claim.isFinalClaim && (
            <ACC.ValidationMessage
              messageType="info"
              message={<ACC.Content value={x => x.claimPrepareSummary.messages.finalClaimMessage} />}
            />
          )}

          <ACC.Section
            title={<ACC.Content value={x => x.claimPrepareSummary.costsTitle} />}
            qa="costs-to-be-claimed-summary"
          >
            {data.project.isNonFec && (
              <ACC.Renderers.SimpleString>
                <ACC.Content value={x => x.claimPrepareSummary.nonFecCalculationMessage} />
              </ACC.Renderers.SimpleString>
            )}
            <ACC.SummaryList qa="costs-to-be-claimed-summary-list">
              <ACC.SummaryListItem
                label={x => x.claimPrepareSummary.costClaimedLabel}
                content={<ACC.Renderers.Currency value={totalCosts.totalCostsClaimed} />}
                qa="totalCostsClaimed"
              />

              <ACC.SummaryListItem
                label={x => x.claimPrepareSummary.fundingLevelLabel}
                content={<ACC.Renderers.Percentage value={data.partner.awardRate} />}
                qa="fundingLevel"
              />

              {!isLoans && (
                <ACC.SummaryListItem
                  label={x => x.claimPrepareSummary.costsToBePaidLabel}
                  content={<ACC.Renderers.Currency value={totalCosts.totalCostsPaid} />}
                  qa="totalCostsPaid"
                />
              )}
            </ACC.SummaryList>

            <ACC.Renderers.SimpleString>
              <ACC.Link id="editCostsToBeClaimedLink" route={props.routes.prepareClaim.getLink(linkProps)}>
                <ACC.Content value={x => x.claimPrepareSummary.editCostsMessage} />
              </ACC.Link>
            </ACC.Renderers.SimpleString>
          </ACC.Section>

          <ACC.Section
            title={<ACC.Content value={x => x.claimPrepareSummary.claimDocumentsTitle} />}
            qa="claim-documents-summary"
          >
            {renderDocumentValidation(data)}
          </ACC.Section>

          {!data.claim.isFinalClaim && renderForecastSummary(data)}

          {renderClaimForm(data)}
        </ACC.Section>
      </ACC.Page>
    );
  };

  const renderDocumentValidation = (data: Pick<CombinedData, "claim" | "documents" | "partner" | "project">) => {
    const linkProps = getClaimLinkProps(data);
    const displayDocumentError = data.claim.isIarRequired && !data.documents.length;

    const editDocumentLink = (
      <ACC.Renderers.SimpleString>
        <ACC.Link id="claimDocumentsLink" route={props.routes.claimDocuments.getLink(linkProps)}>
          <ACC.Content value={x => x.claimPrepareSummary.editClaimDocuments} />
        </ACC.Link>
      </ACC.Renderers.SimpleString>
    );

    return displayDocumentError ? (
      <ACC.ValidationMessage
        messageType="error"
        message={
          <>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.claimPrepareSummary.finalClaimSupportingDocumentMessage} />
            </ACC.Renderers.SimpleString>

            {editDocumentLink}
          </>
        }
      />
    ) : (
      // TODO: Speak with business about refactoring to document table UI
      <>
        {data.documents.length ? (
          <ACC.Section subtitle={<ACC.Content value={x => x.claimPrepareSummary.documentMessages.newWindow} />}>
            <ACC.DocumentList documents={data.documents} qa="claim-documents-list" />
          </ACC.Section>
        ) : (
          <ACC.DocumentsUnavailable />
        )}

        {editDocumentLink}
      </>
    );
  };

  const renderBackLink = (data: Pick<CombinedData, "claim" | "project" | "partner">) => {
    const linkProps = getClaimLinkProps(data);

    return data.claim.isFinalClaim ? (
      <ACC.BackLink route={props.routes.claimDocuments.getLink(linkProps)}>
        <ACC.Content value={x => x.claimPrepareSummary.backToDocuments} />
      </ACC.BackLink>
    ) : (
      <ACC.BackLink route={props.routes.claimForecast.getLink(linkProps)}>
        <ACC.Content value={x => x.claimPrepareSummary.backToForecast} />
      </ACC.BackLink>
    );
  };

  const renderClaimForm = ({ editor, claim, project }: Pick<CombinedData, "editor" | "claim" | "project">) => {
    const Form = ACC.TypedForm<ClaimDto>();

    return (
      <Form.Form editor={editor} onSubmit={() => onSave(claim, editor, true, project)} qa="summary-form">
        <Form.Fieldset heading={x => x.claimPrepareSummary.addCommentsHeading}>
          <Form.MultilineString
            name="comments"
            hint={x => x.claimPrepareSummary.addCommentsHint}
            value={x => x.comments}
            update={(m, v) => (m.comments = v || "")}
            validation={editor.validator.comments}
            characterCountOptions={{ type: "descending", maxValue: claimCommentsMaxLength }}
            qa="info-text-area"
          />
        </Form.Fieldset>

        <Form.Fieldset qa="save-buttons">
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.claimPrepareSummary.messages.submitClaimConfirmation} />
          </ACC.Renderers.SimpleString>

          <Form.Submit>{<ACC.Content value={x => x.claimPrepareSummary.submitClaimMessage} />}</Form.Submit>

          <Form.Button name="save" onClick={() => onSave(claim, editor, false, project)}>
            <ACC.Content value={x => x.claimPrepareSummary.saveAndReturn} />
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
          dto.status = ClaimStatus.SUBMITTED;
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
    const editForecastMessage = <ACC.Content value={x => x.claimPrepareSummary.editForecastMessage} />;
    const forecastTitle = <ACC.Content value={x => x.claimPrepareSummary.forecastTitle} />;

    return (
      <ACC.Section title={forecastTitle} qa="forecast-summary">
        <ACC.SummaryList qa="forecast-summary-list">
          <ACC.SummaryListItem
            label={x => x.claimPrepareSummary.eligibleCostsLabel}
            content={<ACC.Renderers.Currency value={totalEligibleCosts} />}
            qa="totalEligibleCosts"
          />

          <ACC.SummaryListItem
            label={x => x.claimPrepareSummary.forecastLabel}
            content={<ACC.Renderers.Currency value={totalForecastsAndCosts} />}
            qa="totalForecastsAndCosts"
          />

          <ACC.SummaryListItem
            label={x => x.claimPrepareSummary.differenceLabel}
            content={
              <>
                <ACC.Renderers.Currency value={difference} /> (<ACC.Renderers.Percentage value={differencePercentage} />
                )
              </>
            }
            qa="differenceEligibleAndForecast"
          />
        </ACC.SummaryList>

        <ACC.Renderers.SimpleString>
          <ACC.Link id="editForecastLink" route={props.routes.claimForecast.getLink(linkProps)}>
            {editForecastMessage}
          </ACC.Link>
        </ACC.Renderers.SimpleString>
      </ACC.Section>
    );
  };

  const combined = Pending.combine({
    project: props.project,
    partner: props.partner,
    claim: props.claim,
    claimDetails: props.costsSummaryForPeriod,
    editor: props.editor,
    statusChanges: props.statusChanges,
    documents: props.documents,
    totalCosts: props.totalCosts,
  });

  return <ACC.PageLoader pending={combined} render={renderContents} />;
}

const ClaimSummaryContainer = (props: ClaimSummaryParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const { getContent } = useContent();
  const claimSavedMessage = getContent(x => x.claimPrepareSummary.messages.claimSavedMessage);
  const claimSubmittedMessage = getContent(x => x.claimPrepareSummary.messages.claimSubmittedMessage);
  return (
    <ClaimSummaryComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      claim={stores.claims.get(props.partnerId, props.periodId)}
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

export const ClaimSummaryRoute = defineRoute({
  routeName: "claimSummary",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/summary",
  container: ClaimSummaryContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.claimSummary.title(),
});
