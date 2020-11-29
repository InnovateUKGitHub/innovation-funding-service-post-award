import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import {
  ClaimDto,
  ClaimStatus,
  ClaimStatusChangeDto,
  CostsSummaryForPeriodDto,
  ILinkInfo,
  PartnerDto,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import { StoresConsumer } from "@ui/redux";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { useContent } from "@ui/hooks";

export interface ClaimSummaryParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claim: Pending<ClaimDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ClaimDto, next: ILinkInfo) => void;
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

class ClaimSummaryComponent extends ContainerBase<ClaimSummaryParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
      editor: this.props.editor,
      statusChanges: this.props.statusChanges,
      documents: this.props.documents
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    const totalCostsClaimed: number = data.claimDetails.reduce((totalCost, claimDetail) => totalCost + claimDetail.costsClaimedThisPeriod, 0);

    return (
      <ACC.Page
        backLink={this.renderBackLink(data)}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title {...data.project} />}
      >
        {this.renderWarningMessage(totalCostsClaimed)}
        <ACC.Section qa="claimSummaryForm" title={<ACC.Claims.ClaimPeriodDate claim={data.claim} />}>
          {data.claim.isFinalClaim && (
            <ACC.ValidationMessage
              messageType="info"
              message={<ACC.Content value={(x) => x.claimPrepareSummary.messages.finalClaim} />}
            />
          )}
          {this.renderCostsPaidSummary(data, totalCostsClaimed)}
          {this.renderDocumentsSummary(data)}
          {!data.claim.isFinalClaim && this.renderForecastSummary(data)}
          {this.renderClaimForm(data)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderWarningMessage(totalCostsClaimed: number) {
    const displayWarning: boolean = totalCostsClaimed < 0;

    return displayWarning? (
      <ACC.ValidationMessage
        qa="summary-warning"
        messageType="info"
        message={x => x.claimPrepareSummary.messages.claimSummaryWarning}
      />
    ): null;
  }

  private renderBackLink(data: CombinedData) {
    const backToDocumentLink = <ACC.Content value={x => x.claimPrepareSummary.backToDocuments}/>;
    const backToForecastLink = <ACC.Content value={x => x.claimPrepareSummary.backToForecast}/>;

    if (data.claim.isFinalClaim) {
      return <ACC.BackLink route={this.props.routes.claimDocuments.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>{backToDocumentLink}</ACC.BackLink>;
    }
    return <ACC.BackLink route={this.props.routes.claimForecast.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>{backToForecastLink}</ACC.BackLink>;
  }

  private renderClaimForm(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();
    const { editor, claim } = data;
    const commentHint = <ACC.Content value={x => x.claimPrepareSummary.addCommentsHint}/>;
    const addCommentsHeading = <ACC.Content value={x => x.claimPrepareSummary.addCommentsHeading}/>;
    const submitClaimMessage = <ACC.Content value={x => x.claimPrepareSummary.submitClaimMessage}/>;
    const saveAndReturn = <ACC.Content value={x => x.claimPrepareSummary.saveAndReturn}/>;

    return (
      <Form.Form
        editor={editor}
        onSubmit={() => this.onSave(claim, editor, true, data.project)}
        qa="summary-form"
      >
        <Form.Fieldset heading={addCommentsHeading}>
          <Form.MultilineString
            name="comments"
            hint={commentHint}
            value={x => x.comments}
            update={(m, v) => m.comments = v || ""}
            validation={editor.validator.comments}
            qa="info-text-area"
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-buttons">
          <ACC.Renderers.SimpleString><ACC.Content value={x => x.claimPrepareSummary.messages.submitClaimConfirmation}/></ACC.Renderers.SimpleString>
          <Form.Submit>{submitClaimMessage}</Form.Submit>
          <Form.Button name="save" onClick={() => this.onSave(claim, editor, false, data.project)}>{saveAndReturn}</Form.Button>
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private onSave(original: ClaimDto, editor: IEditorStore<ClaimDto, ClaimDtoValidator>, submit: boolean, project: ProjectDto) {
    const dto = editor.data;

    if (submit && (original.status === ClaimStatus.DRAFT || original.status === ClaimStatus.MO_QUERIED)) {
      dto.status = ClaimStatus.SUBMITTED;
    } else if (submit && original.status === ClaimStatus.INNOVATE_QUERIED) {
      dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;
    } else {
      // not submitting so set status to the original status
      dto.status = original.status;
    }

    this.props.onUpdate(true, dto, this.getBackLink(project));
  }

  private renderCostsPaidSummary(data: CombinedData, totalCostsClaimed: number) {
    const totalCostsPaid = totalCostsClaimed * (data.partner.awardRate! / 100);
    const costClaimedLabel = <ACC.Content value={x => x.claimPrepareSummary.costClaimedLabel}/>;
    const fundingLevelLabel = <ACC.Content value={x => x.claimPrepareSummary.fundingLevelLabel}/>;
    const costsToBePaidLabel = <ACC.Content value={x => x.claimPrepareSummary.costsToBePaidLabel}/>;
    const editCostsMessage = <ACC.Content value={x => x.claimPrepareSummary.editCostsMessage}/>;
    const costsTitle = <ACC.Content value={x => x.claimPrepareSummary.costsTitle}/>;

    return (
      <ACC.Section title={costsTitle} qa="costs-to-be-claimed-summary">
        <ACC.SummaryList qa="costs-to-be-claimed-summary-list">
          <ACC.SummaryListItem
            label={costClaimedLabel}
            content={<ACC.Renderers.Currency value={totalCostsClaimed} />}
            qa="totalCostsClaimed"
          />
          <ACC.SummaryListItem
            label={fundingLevelLabel}
            content={<ACC.Renderers.Percentage value={data.partner.awardRate} />}
            qa="fundingLevel"
          />
          <ACC.SummaryListItem
            label={costsToBePaidLabel}
            content={<ACC.Renderers.Currency value={totalCostsPaid} />}
            qa="totalCostsPaid"
          />
        </ACC.SummaryList>
        <ACC.Renderers.SimpleString>
          <ACC.Link id="editCostsToBeClaimedLink" route={this.props.routes.prepareClaim.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>{editCostsMessage}</ACC.Link>
        </ACC.Renderers.SimpleString>

      </ACC.Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return (
      <React.Fragment>
        {documents.length ?
          <ACC.Section subtitle={<ACC.Content value={x => x.claimPrepareSummary.documentsNewWindowSubtitle}/>} >
            <ACC.DocumentList documents={documents} qa="claim-documents-list" />
          </ACC.Section>
          : <ACC.ValidationMessage message={<ACC.Content value={x => x.claimPrepareSummary.noDocumentsUploadedMessage}/>} messageType="info" />
        }
      </React.Fragment>
    );
  }

  private renderDocumentsSummary(data: CombinedData) {
    const claimDocumentsTitle = <ACC.Content value={x => x.claimPrepareSummary.claimDocumentsTitle}/>;
    const editClaimDocuments = <ACC.Content value={x => x.claimPrepareSummary.editClaimDocuments}/>;
    return (
      <ACC.Section title={claimDocumentsTitle} qa="claim-documents-summary">
        {this.renderDocuments(data.documents)}
        <ACC.Renderers.SimpleString>
          <ACC.Link id="claimDocumentsLink" route={this.props.routes.claimDocuments.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>{editClaimDocuments}</ACC.Link>
        </ACC.Renderers.SimpleString>
      </ACC.Section>
    );
  }

  private renderForecastSummary(data: CombinedData) {
    const totalEligibleCosts = (data.partner.totalParticipantGrant || 0);
    const totalForecastsAndCosts = (data.partner.totalFutureForecastsForParticipants || 0) + (data.partner.totalParticipantCostsClaimed || 0) + (data.claim.totalCost || 0);
    const difference = totalEligibleCosts - totalForecastsAndCosts;
    const differencePercentage = (totalEligibleCosts > 0) ? (difference * 100) / totalEligibleCosts : 0;
    const eligibleCostsLabel = <ACC.Content value={x => x.claimPrepareSummary.eligibleCostsLabel}/>;
    const forecastLabel = <ACC.Content value={x => x.claimPrepareSummary.forecastLabel}/>;
    const differenceLabel = <ACC.Content value={x => x.claimPrepareSummary.differenceLabel}/>;
    const editForecastMessage = <ACC.Content value={x => x.claimPrepareSummary.editForecastMessage}/>;
    const forecastTitle = <ACC.Content value={x => x.claimPrepareSummary.forecastTitle}/>;

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
              <React.Fragment>
                <ACC.Renderers.Currency value={difference} /> (<ACC.Renderers.Percentage value={differencePercentage} />)
              </React.Fragment>
            }
            qa="differenceEligibleAndForecast"
          />
        </ACC.SummaryList>
        <ACC.Renderers.SimpleString>
          <ACC.Link id="editForecastLink" route={this.props.routes.claimForecast.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>{editForecastMessage}</ACC.Link>
        </ACC.Renderers.SimpleString>
      </ACC.Section>
    );
  }
  private getBackLink(project: ProjectDto) {
    const isPmOrMo = (project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    // tslint:disable-next-line: prefer-immediate-return
    const backLink = isPmOrMo ? this.props.routes.allClaimsDashboard.getLink({ projectId: project.id }) : this.props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: this.props.partnerId });
    return backLink;
  }
}

const ClaimSummaryContainer = (props: ClaimSummaryParams & BaseProps) => {
  const { getContent } = useContent();
  const claimedSavedMessage = getContent(x => x.claimPrepareSummary.messages.claimSavedMessage);

  return (
  <StoresConsumer>
    {
      stores => (
        <ClaimSummaryComponent
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          claim={stores.claims.get(props.partnerId, props.periodId)}
          costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
          statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
          documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
          editor={stores.claims.getClaimEditor(props.projectId, props.partnerId, props.periodId)}
          onUpdate={(saving, dto, link) =>
            stores.claims.updateClaimEditor(saving, props.projectId, props.partnerId, props.periodId, dto, claimedSavedMessage, () =>
              stores.navigation.navigateTo(link))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);
};

export const ClaimSummaryRoute = defineRoute({
  routeName: "claimSummary",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/summary",
  container: ClaimSummaryContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: () => ({
    htmlTitle: "Claim summary",
    displayTitle: "Claim summary"
  })
});
