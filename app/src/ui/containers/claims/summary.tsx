import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { ClaimDto, ClaimStatus, ClaimStatusChangeDto, ILinkInfo, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { StoresConsumer } from "@ui/redux";

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

    return (
      <ACC.Page
        backLink={this.renderBackLink(data)}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title project={data.project} />}
      >
        <ACC.Section title={<ACC.Claims.ClaimPeriodDate claim={data.claim} />}>
          {this.renderCostsPaidSummary(data)}
          {this.renderDocumentsSummary(data)}
          {!data.claim.isFinalClaim && this.renderForecastSummary(data)}
          {this.renderClaimForm(data)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderBackLink(data: CombinedData) {
    if(data.claim.isFinalClaim) {
      return <ACC.BackLink route={this.props.routes.claimDocuments.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>Back to claim documents</ACC.BackLink>;
    }
    return <ACC.BackLink route={this.props.routes.claimForecast.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>Back to update forecast</ACC.BackLink>;
  }

  private renderClaimForm(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();
    const { editor, claim } = data;

    return (
      <Form.Form
        editor={editor}
        onSubmit={() => this.onSave(claim, editor, true, data.project)}
      >
        <Form.Fieldset heading="Add comments">
          <Form.MultilineString
            name="comments"
            hint="If you want to explain anything to your monitoring officer or to Innovate UK, add it here."
            value={x => x.comments}
            update={(m, v) => m.comments = v || ""}
            validation={editor.validator.comments}
            qa="info-text-area"
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-buttons">
          <Form.Submit>Submit claim</Form.Submit>
          <Form.Button name="save" onClick={() => this.onSave(claim, editor, false, data.project)}>Save and return to claims</Form.Button>
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private onSave(original: ClaimDto, editor: IEditorStore<ClaimDto, ClaimDtoValidator>, submit: boolean,  project: ProjectDto) {
    const dto = editor.data;
    if (submit && original.status === ClaimStatus.DRAFT) {
      dto.status = ClaimStatus.SUBMITTED;
    } else {
      // not submitting so set status to the original status
      dto.status = original.status;
    }

    this.props.onUpdate(true, dto, this.getBackLink(project));
  }

  private renderCostsPaidSummary(data: CombinedData) {
    const totalCostsClaimed = data.claimDetails.map((x) => x.costsClaimedThisPeriod).reduce((res, x) => res + x);
    const fundingLevel = data.partner.awardRate;
    const totalCostsPaid = (totalCostsClaimed * fundingLevel!) / 100;

    return (
      <ACC.Section title={"Costs to be claimed"} qa="costs-to-be-claimed-summary">
        <ACC.SummaryList qa="costs-to-be-claimed-summary-list">
          <ACC.SummaryListItem
            label="Total costs to be claimed"
            content={<ACC.Renderers.Currency value={totalCostsClaimed} />}
            qa="totalCostsClaimed"
          />
          <ACC.SummaryListItem
            label="Funding level"
            content={<ACC.Renderers.Percentage value={fundingLevel} />}
            qa="fundingLevel"
          />
          <ACC.SummaryListItem
            label="Total costs to be paid"
            content={<ACC.Renderers.Currency value={totalCostsPaid} />}
            qa="totalCostsPaid"
          />
        </ACC.SummaryList>
        <ACC.Renderers.SimpleString>
          <ACC.Link route={this.props.routes.prepareClaim.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>Edit costs to be claimed</ACC.Link>
        </ACC.Renderers.SimpleString>

      </ACC.Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return (
      <React.Fragment>
        {documents.length ?
          <ACC.Section subtitle="All documents open in a new window" >
            <ACC.DocumentList documents={documents} qa="claim-documents-summary-list" />
          </ACC.Section>
          : <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
        }
      </React.Fragment>
    );
  }

  private renderDocumentsSummary(data: CombinedData) {
    return (
      <ACC.Section title={"Claim documents"} qa="claim-documents-summary">
        {this.renderDocuments(data.documents)}
        <ACC.Renderers.SimpleString>
          <ACC.Link route={this.props.routes.claimDocuments.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>Edit claim documents</ACC.Link>
        </ACC.Renderers.SimpleString>
      </ACC.Section>
    );
  }

  private renderForecastSummary(data: CombinedData) {
    const totalEligibleCosts = (data.partner.totalParticipantGrant || 0);
    const totalForecastsAndCosts = (data.partner.totalFutureForecastsForParticipants || 0) + (data.partner.totalCostsSubmitted || 0);
    const difference = totalEligibleCosts - totalForecastsAndCosts;
    const differencePercentage = (totalEligibleCosts > 0) ? (difference * 100) / totalEligibleCosts : 0;

    return (
      <ACC.Section title={"Forecast"} qa="forecast-summary">
        <ACC.SummaryList qa="forecast-summary-list">
          <ACC.SummaryListItem
            label="Total eligible costs"
            content={<ACC.Renderers.Currency value={totalEligibleCosts} />}
            qa="totalEligibleCosts"
          />
          <ACC.SummaryListItem
            label="Total of forecasts and costs"
            content={<ACC.Renderers.Currency value={totalForecastsAndCosts} />}
            qa="totalForecastsAndCosts"
          />
          <ACC.SummaryListItem
            label="Difference"
            content={
              <React.Fragment>
                <ACC.Renderers.Currency value={difference} /> (<ACC.Renderers.Percentage value={differencePercentage} />)
              </React.Fragment>
            }
            qa="differenceEligibleAndForecast"
          />
        </ACC.SummaryList>
        <ACC.Renderers.SimpleString>
          <ACC.Link route={this.props.routes.claimForecast.getLink({ projectId: data.project.id, partnerId: data.partner.id, periodId: this.props.periodId })}>Edit forecast</ACC.Link>
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

const ClaimSummaryContainer = (props: ClaimSummaryParams & BaseProps) => (
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
            stores.claims.updateClaimEditor(saving, props.projectId, props.partnerId, props.periodId, dto, "You have saved your claim.", () =>
              stores.navigation.navigateTo(link))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

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
    displayTitle: "Claim Summary"
  })
});
