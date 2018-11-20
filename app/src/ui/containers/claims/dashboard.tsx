import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectOverviewPage } from "../../components/projectOverview";
import {
  DualDetails,
  Link,
  Section,
  SectionPanel,
  TypedDetails,
  TypedLoader,
  TypedTable,
  ValidationMessage
} from "../../components";
import { DayAndLongMonth, FullDate, LongYear, ShortDate, ShortMonth } from "../../components/renderers";
import { PrepareClaimRoute } from "./prepare";
import { ClaimsDetailsRoute } from "./details";
import { SimpleString } from "../../components/renderers";
import { ReviewClaimRoute } from "./review";
import { ClaimDto, ProjectDto } from "../../../types";
import * as ACC from "../../components";
import { IEditorStore } from "../../redux/reducers";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";
import { getCurrentClaim, getCurrentClaimDocumentsEditor, getPreviousClaims } from "../../redux/selectors";

interface Params {
  projectId: string;
  partnerId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partnerDetails: Pending<PartnerDto>;
  previousClaims: Pending<ClaimDto[]>;
  currentClaim: Pending<ClaimDto | null>;
  editor: Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null>;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  previousClaims: ClaimDto[];
  currentClaim: ClaimDto | null;
  editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null;
}

interface Callbacks {
  validate: (key: ClaimKey, dto: DocumentUploadDto) => void;
  uploadFile: (key: ClaimKey, dto: DocumentUploadDto) => void;
}

class Component extends ContainerBase<Params, Data, Callbacks> {
  public render() {
    const combined = Pending.combine(
      this.props.projectDetails,
      this.props.partnerDetails,
      this.props.previousClaims,
      this.props.currentClaim,
      this.props.editor,
      (project, partner, previousClaims, currentClaim, editor) => ({ project, partner, previousClaims, currentClaim, editor })
    );

    const Loader = TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(x) => this.renderContents(x)} />;
  }

  private renderIarDocument(claim: ClaimDto, document: DocumentSummaryDto) {
    // TODO
    return null;
  }

  private onChange(dto: DocumentUploadDto, periodId: number) {
    const key = {partnerId: this.props.partnerId, periodId};
    this.props.validate(key, dto);
  }

  private onSave(dto: DocumentUploadDto, periodId: number) {
    const claimKey = {
      partnerId: this.props.partnerId,
      periodId
    };
    this.props.uploadFile(claimKey, dto);
  }

  private renderIarDocumentUpload(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>) {
    const UploadForm = ACC.TypedForm<{file: File | null }>();
    return (
      <React.Fragment>
        <ValidationMessage messageType="info" message="You must attach an independent audit report (IAR) for this claim to receive your payment."/>
        <UploadForm.Form data={editor.data} onChange={(dto) => this.onChange(dto, claim.periodId)}>
          <UploadForm.Fieldset>
            <UploadForm.FileUpload validation={editor.validator.file} value={(data) => data.file} name="Upload documents" update={(dto, file) => dto.file = file}/>
          </UploadForm.Fieldset>
          <UploadForm.Button name="Upload IAR" onClick={() => this.onSave(editor.data, claim.periodId)}>Upload</UploadForm.Button>
        </UploadForm.Form>
      </React.Fragment>
    );
  }

  private renderIarDocumentSection(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>, document?: DocumentSummaryDto | null) {
    // TODO handle case where IAR required bu upload is not possible
    if (!claim.isIarRequired) {
      return null;
    }
    return (
      <Section qa="current-claim-iar" title="Independent audit report">
        {document ? this.renderIarDocument(claim, document) : this.renderIarDocumentUpload(claim, editor)}
      </Section>
    );
  }

  private renderContents({currentClaim, partner, previousClaims, project, editor}: CombinedData) {
    const Details = TypedDetails<PartnerDto>();
    const currentClaimsSectionTitle = (
      currentClaim && <React.Fragment>Claim for P{currentClaim.periodId} - <DayAndLongMonth value={currentClaim.periodStartDate} /> to <FullDate value={currentClaim.periodEndDate} /></React.Fragment>
    );

    // TODO get from store
    const document: DocumentSummaryDto | null = null;

    return (
      <ProjectOverviewPage selectedTab={ClaimsDashboardRoute.routeName} project={project} partnerId={partner.id} partners={[partner]} editor={editor}>
        <Section>
          <SectionPanel qa="claims-totals" title="Project claims history">
            <DualDetails displayDensity="Compact">
              <Details.Details qa="claims-totals-col-0" data={partner}>
                <Details.Currency label="Grant offer letter costs" qa="gol-costs" value={x => x.totalParticipantGrant} />
                <Details.Currency label="Costs claimed to date" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed} />
                <Details.Percentage label="Percentage claimed to date" qa="percentage-costs" value={x => x.percentageParticipantCostsClaimed} />
              </Details.Details>
              <Details.Details qa="claims-totals-col-1" data={partner}>
                <Details.Percentage label="Award offer rate" value={x => x.awardRate} qa="award-rate" fractionDigits={0} />
                <Details.Percentage label="Cap limit" value={x => x.capLimit} fractionDigits={0} qa="cap-limit" />
              </Details.Details>
            </DualDetails>
          </SectionPanel>
        </Section>
        <Section qa="current-claims-section" title={currentClaimsSectionTitle}>
          {this.renderClaims(currentClaim ? [currentClaim] : [], "current-claims-table", project.id, true)}
        </Section>
        {currentClaim && editor && this.renderIarDocumentSection(currentClaim, editor, document)}
        <Section qa="previous-claims-section" title="Previous claims">
          {this.renderClaims(previousClaims, "previous-claims-table", project.id, false)}
        </Section>
      </ProjectOverviewPage>
    );
  }

  private getLink(claim: ClaimDto, projectId: string) {
    if (claim.status === "New" || claim.status === "Draft") {
      return <Link route={PrepareClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Edit claim</Link>;
    }
    if (claim.status === "Submitted") {
      return <Link route={ReviewClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Review claim</Link>;
    }
    return <Link route={ClaimsDetailsRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>View claim</Link>;
  }

  private renderClaims(data: ClaimDto[], tableQa: string, projectId: string, isCurrentClaim: boolean) {
    const ClaimTable = TypedTable<ClaimDto>();

    if (isCurrentClaim && !data.length) {
      return <SimpleString>The next open claim period will be...</SimpleString>;
    }

    if (!isCurrentClaim && !data.length) {
      return <SimpleString>You do not have any previous claims for this project</SimpleString>;
    }

    return (
      <ClaimTable.Table qa={tableQa} data={data}>
        <ClaimTable.Custom
          header="Period"
          qa="period"
          value={(x) => (
            <span>P{x.periodId}<br />
              <ShortMonth value={x.periodStartDate} /> to <ShortMonth value={x.periodEndDate} /> <LongYear value={x.periodEndDate} />
            </span>)}
        />
        <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
        <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
        <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
        <ClaimTable.Custom
          header="Status"
          qa="status"
          value={(x) => (
            <span>
              {x.status}
              <br />
              <ShortDate value={(x.paidDate || x.approvedDate || x.lastModifiedDate)} />
            </span>)}
        />
        <ClaimTable.Custom header="" qa="link" value={(x) => this.getLink(x, projectId)} />
      </ClaimTable.Table>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(Component);

export const ClaimsDashboard = definition.connect({
  withData: (state, props) => ({
    editor: getCurrentClaimDocumentsEditor(state, props.partnerId),
    projectDetails: Selectors.getProject(props.projectId).getPending(state),
    partnerDetails: Selectors.getPartner(props.partnerId).getPending(state),
    currentClaim: getCurrentClaim(state, props.partnerId),
    previousClaims: getPreviousClaims(state, props.partnerId)
  }),
  withCallbacks: (dispatch) => ({
    validate: (claimKey, dto) =>
      dispatch(Actions.updateClaimDocumentEditor(claimKey, dto)),
    uploadFile: (claimKey, file) =>
      dispatch(Actions.uploadClaimDocument(claimKey, file, () =>
        console.log("TODO")))
        // dispatch(Actions.loadClaimDocuments(claimKey, dto))))
  })
});

export const ClaimsDashboardRoute = definition.route({
  routeName: "claimsDashboard",
  routePath: "/projects/:projectId/claims/?partnerId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartner(params.partnerId),
    Actions.loadClaimsForPartner(params.partnerId)
  ],
  container: ClaimsDashboard
});
