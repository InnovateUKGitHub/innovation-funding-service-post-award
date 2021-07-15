import { useStores } from "@ui/redux";
import { useContent } from "@ui/hooks";
import * as ACC from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
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
} from "@framework/types";
import { roundCurrency, sum } from "@framework/util";

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
}

interface ClaimSummaryComponentProps extends ClaimSummaryParams, BaseProps {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claim: Pending<ClaimDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  onUpdate: (saving: boolean, dto: ClaimDto, next: ILinkInfo) => void;
}

function ClaimSummaryComponent(props: ClaimSummaryComponentProps) {
  const getClaimLinkProps = (data: CombinedData) => ({
    projectId: data.project.id,
    partnerId: data.partner.id,
    periodId: props.periodId,
  });

  const renderContents = (data: CombinedData) => {
    const linkProps = getClaimLinkProps(data);
    const totalCostsClaimed: number = sum(data.claimDetails, claimDetails => claimDetails.costsClaimedThisPeriod);

    const totalCostsPaid = totalCostsClaimed * (data.partner.awardRate! / 100);

    return (
      <ACC.Page
        backLink={renderBackLink(data)}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title {...data.project} />}
      >
        {totalCostsClaimed < 0 && (
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
            <ACC.SummaryList qa="costs-to-be-claimed-summary-list">
              <ACC.SummaryListItem
                label={<ACC.Content value={x => x.claimPrepareSummary.costClaimedLabel} />}
                content={<ACC.Renderers.Currency value={totalCostsClaimed} />}
                qa="totalCostsClaimed"
              />

              <ACC.SummaryListItem
                label={<ACC.Content value={x => x.claimPrepareSummary.fundingLevelLabel} />}
                content={<ACC.Renderers.Percentage value={data.partner.awardRate} />}
                qa="fundingLevel"
              />

              <ACC.SummaryListItem
                label={<ACC.Content value={x => x.claimPrepareSummary.costsToBePaidLabel} />}
                content={<ACC.Renderers.Currency value={totalCostsPaid} />}
                qa="totalCostsPaid"
              />
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

  const renderDocumentValidation = (data: CombinedData) => {
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
      // TODO: Refactor with <DocumentView />
      <>
        {data.documents.length ? (
          <ACC.Section subtitle={<ACC.Content value={x => x.claimPrepareSummary.documentMessages.newWindow} />}>
            <ACC.DocumentList documents={data.documents} qa="claim-documents-list" />
          </ACC.Section>
        ) : (
          <ACC.ValidationMessage
            message={<ACC.Content value={x => x.claimPrepareSummary.noDocumentsUploadedMessage} />}
            messageType="info"
          />
        )}

        {editDocumentLink}
      </>
    );
  };

  const renderBackLink = (data: CombinedData) => {
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

  const renderClaimForm = ({ editor, claim, project }: CombinedData) => {
    const Form = ACC.TypedForm<ClaimDto>();

    return (
      <Form.Form editor={editor} onSubmit={() => onSave(claim, editor, true, project)} qa="summary-form">
        <Form.Fieldset heading={<ACC.Content value={x => x.claimPrepareSummary.addCommentsHeading} />}>
          <Form.MultilineString
            name="comments"
            hint={<ACC.Content value={x => x.claimPrepareSummary.addCommentsHint} />}
            value={x => x.comments}
            update={(m, v) => (m.comments = v || "")}
            validation={editor.validator.comments}
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

    if (submit && (original.status === ClaimStatus.DRAFT || original.status === ClaimStatus.MO_QUERIED)) {
      dto.status = ClaimStatus.SUBMITTED;
    } else if (submit && original.status === ClaimStatus.INNOVATE_QUERIED) {
      dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;
    } else {
      // not submitting so set status to the original status
      dto.status = original.status;
    }

    props.onUpdate(true, dto, updateLink);
  };

  const renderForecastSummary = (data: CombinedData) => {
    const linkProps = getClaimLinkProps(data);
    const totalEligibleCosts = data.partner.totalParticipantGrant || 0;
    const totalForecastsAndCosts =
      (data.partner.totalFutureForecastsForParticipants || 0) +
      (data.partner.totalParticipantCostsClaimed || 0) +
      (data.claim.totalCost || 0);

    const difference = roundCurrency(totalEligibleCosts - totalForecastsAndCosts);
    const differencePercentage = totalEligibleCosts > 0 ? (difference * 100) / totalEligibleCosts : 0;
    const eligibleCostsLabel = <ACC.Content value={x => x.claimPrepareSummary.eligibleCostsLabel} />;
    const forecastLabel = <ACC.Content value={x => x.claimPrepareSummary.forecastLabel} />;
    const differenceLabel = <ACC.Content value={x => x.claimPrepareSummary.differenceLabel} />;
    const editForecastMessage = <ACC.Content value={x => x.claimPrepareSummary.editForecastMessage} />;
    const forecastTitle = <ACC.Content value={x => x.claimPrepareSummary.forecastTitle} />;

    return (
      <ACC.Section title={forecastTitle} qa="forecast-summary">
        <ACC.SummaryList qa="forecast-summary-list">
          <ACC.SummaryListItem
            label={eligibleCostsLabel}
            content={<ACC.Renderers.Currency value={totalEligibleCosts} />}
            qa="totalEligibleCosts"
          />

          <ACC.SummaryListItem
            label={forecastLabel}
            content={<ACC.Renderers.Currency value={totalForecastsAndCosts} />}
            qa="totalForecastsAndCosts"
          />

          <ACC.SummaryListItem
            label={differenceLabel}
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
  });

  return <ACC.PageLoader pending={combined} render={renderContents} />;
}

const ClaimSummaryContainer = (props: ClaimSummaryParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const claimedSavedMessage = getContent(x => x.claimPrepareSummary.messages.claimSavedMessage);

  return (
    <ClaimSummaryComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
      statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
      documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
      editor={stores.claims.getClaimEditor(props.projectId, props.partnerId, props.periodId)}
      onUpdate={(saving, dto, link) =>
        stores.claims.updateClaimEditor(
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          claimedSavedMessage,
          () => stores.navigation.navigateTo(link),
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
  getTitle: () => ({
    htmlTitle: "Claim summary",
    displayTitle: "Claim summary",
  }),
});
