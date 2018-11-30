import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import {
  getCurrentClaim,
  getCurrentClaimIarDocument,
  getCurrentClaimIarDocumentsEditor, getPartner,
  getPreviousClaims, getProject
} from "../../redux/selectors";
import * as Acc from "../../components";
import { DayAndLongMonth, FullDate, LongYear, ShortDate, ShortMonth, SimpleString } from "../../components/renderers";
import { PrepareClaimRoute } from "./prepare";
import { ClaimsDetailsRoute } from "./details";
import { ReviewClaimRoute } from "./review";
import { ClaimDto, ClaimStatus, ProjectDto } from "../../../types";
import { IEditorStore } from "../../redux/reducers";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";

interface Params {
  projectId: string;
  partnerId: string;
}

interface Data {
  document: Pending<DocumentSummaryDto | null>;
  projectDetails: Pending<ProjectDto>;
  partnerDetails: Pending<PartnerDto>;
  previousClaims: Pending<ClaimDto[]>;
  currentClaim: Pending<ClaimDto | null>;
  editor: Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null>;
}

interface CombinedData {
  document: DocumentSummaryDto | null;
  project: ProjectDto;
  partner: PartnerDto;
  previousClaims: ClaimDto[];
  currentClaim: ClaimDto | null;
  editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null;
}

interface Callbacks {
  validate: (key: ClaimKey, dto: DocumentUploadDto) => void;
  uploadFile: (key: ClaimKey, dto: DocumentUploadDto) => void;
  deleteFile: (key: ClaimKey, dto: DocumentSummaryDto) => void;
}

class Component extends ContainerBase<Params, Data, Callbacks> {
  public render() {
    const combined = Pending.combine(
      this.props.document,
      this.props.projectDetails,
      this.props.partnerDetails,
      this.props.previousClaims,
      this.props.currentClaim,
      this.props.editor,
      (document, project, partner, previousClaims, currentClaim, editor) => ({ project, partner, previousClaims, currentClaim, editor, document })
    );

    const Loader = Acc.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(x) => this.renderContents(x)} />;
  }

  private renderIarDocument(claim: ClaimDto, document: DocumentSummaryDto) {
    const button = () => {
      const Form = Acc.TypedForm<DocumentSummaryDto>();
      return (
        <Form.Form data={document}>
          <Form.Button name="default" onClick={() => this.onDelete(claim, document)}>Remove</Form.Button>
        </Form.Form>
      );
    };

    return (
      <Acc.DocumentSingle message={"An IAR has been added to this claim"} document={document} openNewWindow={true} renderRemove={() => claim.allowIarEdit && button()}/>
    );
  }

  private onChange(dto: DocumentUploadDto, periodId: number) {
    const key = {partnerId: this.props.partnerId, periodId};
    this.props.validate(key, dto);
  }

  private onSave(dto: DocumentUploadDto, periodId: number) {
    const key = {partnerId: this.props.partnerId, periodId};
    this.props.uploadFile(key, dto);
  }

  private onDelete(claim: ClaimDto, dto: DocumentSummaryDto) {
    this.props.deleteFile({partnerId: claim.partnerId, periodId: claim.periodId}, dto);
  }

  private renderIarDocumentUpload(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>) {
    if (!claim.allowIarEdit) {
      return null;
    }
    const UploadForm = Acc.TypedForm<{file: File | null }>();
    const isAwaitingIAR = claim.status === ClaimStatus.AWAITING_IAR;
    const message = isAwaitingIAR
      ? "Your most recent claim cannot be sent to us. You must attach an independent audit report (IAR)."
      : "You must attach an independent audit report (IAR) for this claim to receive your payment.";
    const messageType = isAwaitingIAR ? "error" : "info";
    return (
      <React.Fragment>
        <Acc.ValidationMessage messageType={messageType} message={message}/>
        <UploadForm.Form data={editor.data} onChange={(dto) => this.onChange(dto, claim.periodId)}>
          <UploadForm.Fieldset>
            <UploadForm.FileUpload validation={editor.validator.file} value={(data) => data.file} name="Upload documents" update={(dto, file) => dto.file = file}/>
          </UploadForm.Fieldset>
          <UploadForm.Button name="default" onClick={() => this.onSave(editor.data, claim.periodId)}>Upload</UploadForm.Button>
        </UploadForm.Form>
      </React.Fragment>
    );
  }

  private renderIarDocumentSection(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>, document: DocumentSummaryDto | null) {
    if (!claim.isIarRequired) {
      return null;
    }

    return (
      <Acc.Section qa="current-claim-iar" title="Independent audit report">
        {document ? this.renderIarDocument(claim, document) : this.renderIarDocumentUpload(claim, editor)}
      </Acc.Section>
    );
  }

  private renderContents({currentClaim, partner, previousClaims, project, editor, document}: CombinedData) {
    const Details = Acc.TypedDetails<PartnerDto>();
    const currentClaimsSectionTitle = (
      currentClaim && <React.Fragment>Claim for P{currentClaim.periodId} - <DayAndLongMonth value={currentClaim.periodStartDate} /> to <FullDate value={currentClaim.periodEndDate} /></React.Fragment>
    );

    const validationMessage = editor && <Acc.ValidationSummary validation={editor && editor.validator} compressed={false} />;

    return (
      <Acc.ProjectOverviewPage selectedTab={ClaimsDashboardRoute.routeName} project={project} partnerId={partner.id} partners={[partner]} validationMessage={validationMessage}>
        <Acc.Section>
          <Acc.SectionPanel qa="claims-totals" title="Project claims history">
            <Acc.DualDetails displayDensity="Compact">
              <Details.Details qa="claims-totals-col-0" data={partner}>
                <Details.Currency label="Grant offer letter costs" qa="gol-costs" value={x => x.totalParticipantGrant} />
                <Details.Currency label="Costs claimed to date" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed} />
                <Details.Percentage label="Percentage claimed to date" qa="percentage-costs" value={x => x.percentageParticipantCostsClaimed} />
              </Details.Details>
              <Details.Details qa="claims-totals-col-1" data={partner}>
                <Details.Percentage label="Award offer rate" value={x => x.awardRate} qa="award-rate" fractionDigits={0} />
                <Details.Percentage label="Cap limit" value={x => x.capLimit} fractionDigits={0} qa="cap-limit" />
              </Details.Details>
            </Acc.DualDetails>
          </Acc.SectionPanel>
        </Acc.Section>
        <Acc.Section qa="current-claims-section" title={currentClaimsSectionTitle} badge={!!currentClaim ? <Acc.Claims.ClaimWindow periodEnd={currentClaim.periodEndDate} /> : null }>
          {this.renderClaims(currentClaim ? [currentClaim] : [], "current-claims-table", project.id, true)}
        </Acc.Section>
        {currentClaim && editor && this.renderIarDocumentSection(currentClaim, editor, document)}
        <Acc.Section qa="previous-claims-section" title="Previous claims">
          {this.renderClaims(previousClaims, "previous-claims-table", project.id, false)}
        </Acc.Section>
      </Acc.ProjectOverviewPage>
    );
  }

  private getLink(claim: ClaimDto, projectId: string) {
    if (claim.status === "New" || claim.status === "Draft") {
      return <Acc.Link route={PrepareClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Edit claim</Acc.Link>;
    }
    if (claim.status === "Submitted") {
      return <Acc.Link route={ReviewClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Review claim</Acc.Link>;
    }
    return <Acc.Link route={ClaimsDetailsRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>View claim</Acc.Link>;
  }

  private renderClaims(data: ClaimDto[], tableQa: string, projectId: string, isCurrentClaim: boolean) {
    const ClaimTable = Acc.TypedTable<ClaimDto>();

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
  withData: (state, props) => {
    return ({
      document: getCurrentClaimIarDocument(state, props.partnerId),
      editor: getCurrentClaimIarDocumentsEditor(state, props.partnerId),
      projectDetails: getProject(props.projectId).getPending(state),
      partnerDetails: getPartner(props.partnerId).getPending(state),
      currentClaim: getCurrentClaim(state, props.partnerId),
      previousClaims: getPreviousClaims(state, props.partnerId)
    });
  },
  withCallbacks: (dispatch) => ({
    validate: (claimKey, dto) =>
      dispatch(Actions.updateClaimDocumentEditor(claimKey, dto)),
    uploadFile: (claimKey, file) =>
      dispatch(Actions.uploadClaimDocument(claimKey, file, () =>
        dispatch(Actions.loadClaimsAndIarDocuments(claimKey.partnerId)))),
    deleteFile: (claimKey, file) =>
      dispatch(Actions.deleteClaimDocument(claimKey, file, () =>
        dispatch(Actions.loadIarDocuments(claimKey.partnerId, claimKey.periodId))))
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
    Actions.loadClaimsAndIarDocuments(params.partnerId)
  ],
  container: ClaimsDashboard
});
