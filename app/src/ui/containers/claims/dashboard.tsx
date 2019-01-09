import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import { getCurrentClaim, getCurrentClaimIarDocument, getCurrentClaimIarDocumentsDeleteEditor, getCurrentClaimIarDocumentsEditor, getPartner, getPreviousClaims, getProject } from "../../redux/selectors";
import * as Acc from "../../components";
import { PrepareClaimRoute } from "./prepare";
import { ClaimsDetailsRoute } from "./details";
import { ReviewClaimRoute } from "./review";
import { ClaimDto, ClaimStatus, DocumentDescription, ProjectDto } from "../../../types";
import { IEditorStore } from "../../redux/reducers";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";
import { DateTime } from "luxon";
import { Results } from "../../validation/results";

export interface ClaimDashboardPageParams {
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
  deleteEditor: Pending<IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> | null>;
}

interface CombinedData {
  document: DocumentSummaryDto | null;
  project: ProjectDto;
  partner: PartnerDto;
  previousClaims: ClaimDto[];
  currentClaim: ClaimDto | null;
  editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null;
  deleteEditor: IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> | null;
}

interface Callbacks {
  validate: (key: ClaimKey, dto: DocumentUploadDto) => void;
  uploadFile: (key: ClaimKey, dto: DocumentUploadDto) => void;
  deleteFile: (key: ClaimKey, dto: DocumentSummaryDto) => void;
}

class Component extends ContainerBase<ClaimDashboardPageParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine(
      this.props.document,
      this.props.projectDetails,
      this.props.partnerDetails,
      this.props.previousClaims,
      this.props.currentClaim,
      this.props.editor,
      this.props.deleteEditor,
      (document, project, partner, previousClaims, currentClaim, editor, deleteEditor) => ({ project, partner, previousClaims, currentClaim, editor, document, deleteEditor })
    );

    return <Acc.PageLoader pending={combined} render={(x) => this.renderContents(x)} />;
  }

  private renderIarDocument(claim: ClaimDto, document: DocumentSummaryDto) {
    const button = () => {
      const Form = Acc.TypedForm<DocumentSummaryDto>();
      return (
        <Form.Form data={document}>
          <Form.Button name="delete" value={document.id} onClick={() => this.onDelete(claim, document)}>Remove</Form.Button>
        </Form.Form>
      );
    };

    return (
      <Acc.DocumentSingle message={"An IAR has been added to this claim"} document={document} openNewWindow={true} renderRemove={() => claim.allowIarEdit && button()} />
    );
  }

  private onChange(dto: DocumentUploadDto, periodId: number) {
    const key = { partnerId: this.props.partnerId, periodId };
    this.props.validate(key, dto);
  }

  private onSave(dto: DocumentUploadDto, periodId: number) {
    const key = { partnerId: this.props.partnerId, periodId };
    this.props.uploadFile(key, dto);
  }

  private onDelete(claim: ClaimDto, dto: DocumentSummaryDto) {
    this.props.deleteFile({ partnerId: claim.partnerId, periodId: claim.periodId }, dto);
  }

  private renderIarDocumentUpload(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>) {
    if (!claim.allowIarEdit) {
      return null;
    }
    const UploadForm = Acc.TypedForm<{ file: File | null }>();
    const isAwaitingIAR = claim.status === ClaimStatus.AWAITING_IAR;
    const message = isAwaitingIAR
      ? "Your most recent claim cannot be sent to us. You must attach an independent audit report (IAR)."
      : "You must attach an independent audit report (IAR) for this claim to receive your payment.";
    const messageType = isAwaitingIAR ? "error" : "info";
    return (
      <React.Fragment>
        <Acc.ValidationMessage messageType={messageType} message={message} />
        <UploadForm.Form enctype="multipart/form-data" data={editor.data} onChange={(dto) => this.onChange(dto, claim.periodId)} qa="iar-upload-form" >
          <UploadForm.Fieldset>
            <UploadForm.FileUpload
              label="document"
              labelHidden={true}
              name="attachment"
              validation={editor.validator.file}
              value={(data) => data.file}
              update={(dto, file) => dto.file = file}
            />
            <UploadForm.Hidden name="periodId" value={() => claim.periodId} />
            <UploadForm.Hidden name="description" value={() => DocumentDescription.IAR} />
          </UploadForm.Fieldset>
          <UploadForm.Button name="upload" onClick={() => this.onSave(editor.data, claim.periodId)} qa="iar-upload-button">Upload</UploadForm.Button>
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

  private renderContents({ currentClaim, partner, previousClaims, project, editor, document, deleteEditor }: CombinedData) {
    const Details = Acc.TypedDetails<PartnerDto>();

    const claimsWindow = !!currentClaim && ([ClaimStatus.DRAFT, ClaimStatus.REVIEWING_FORECASTS].indexOf(currentClaim.status) >= 0) ? <Acc.Claims.ClaimWindow periodEnd={currentClaim.periodEndDate} /> : null;

    const error = (editor && editor.error) || (deleteEditor && deleteEditor.error);
    const validator = (editor && editor.validator) || (deleteEditor && deleteEditor.validator);

    return (
      <Acc.ProjectOverviewPage
        selectedTab={ClaimsDashboardRoute.routeName}
        project={project}
        partnerId={partner.id}
        partners={[partner]}
        error={error}
        validator={validator}
      >
        <Acc.Section>
          <Acc.SectionPanel qa="claims-totals" title="History">
            <Acc.DualDetails displayDensity="Compact">
              <Details.Details qa="claims-totals-col-0" data={partner}>
                <Details.Currency label="Grant offered" qa="gol-costs" value={x => x.totalParticipantGrant} />
                <Details.Currency label="Costs claimed" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed} />
                <Details.Percentage label="Percentage claimed" qa="percentage-costs" value={x => x.percentageParticipantCostsClaimed} />
              </Details.Details>
              <Details.Details qa="claims-totals-col-1" data={partner}>
                <Details.Percentage label="Funding level" value={x => x.awardRate} qa="award-rate" fractionDigits={0} />
                <Details.Percentage label="Cap limit" value={x => x.capLimit} fractionDigits={0} qa="cap-limit" />
              </Details.Details>
            </Acc.DualDetails>
          </Acc.SectionPanel>
        </Acc.Section>
        <Acc.Section qa="current-claims-section" title={"Open"} badge={claimsWindow}>
          {this.renderCurrentClaims(currentClaim ? [currentClaim] : [], "current-claims-table", project, previousClaims)}
        </Acc.Section>
        {currentClaim && editor && this.renderIarDocumentSection(currentClaim, editor, document)}
        <Acc.Section qa="previous-claims-section" title="Closed">
          {this.renderPreviousClaims(previousClaims, "previous-claims-table", project)}
        </Acc.Section>
      </Acc.ProjectOverviewPage>
    );
  }

  private getLink(claim: ClaimDto, projectId: string) {
    if (claim.status === "Draft") {
      return <Acc.Link route={PrepareClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Edit claim</Acc.Link>;
    }
    if (claim.status === "Submitted") {
      return <Acc.Link route={ReviewClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Review claim</Acc.Link>;
    }
    return <Acc.Link route={ClaimsDetailsRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>View claim</Acc.Link>;
  }

  private renderNextPeriodStartDate(endDate: Date) {
    const date = DateTime.fromJSDate(endDate).plus({days: 1}).toJSDate();
    return (
      <Acc.Renderers.SimpleString>
        You have no open claims. The next claim period begins <Acc.Renderers.FullDate value={date} />.
      </Acc.Renderers.SimpleString>
    );
  }

  private renderCurrentClaims(data: ClaimDto[], tableQa: string, project: ProjectDto, previousClaims?: ClaimDto[]) {
    if (data.length) {
      return this.renderClaimsTable(data, tableQa, project);
    }

    if (!!project.periodEndDate) {
      return this.renderNextPeriodStartDate(project.periodEndDate);
    }

    if (!!previousClaims) {
      return this.renderNextPeriodStartDate(previousClaims[0].periodEndDate);
    }

    return null;

  }

  private renderPreviousClaims(data: ClaimDto[], tableQa: string, project: ProjectDto) {
    if (data.length) {
      return this.renderClaimsTable(data, tableQa, project);
    }

    return <Acc.Renderers.SimpleString>You have not made any claims.</Acc.Renderers.SimpleString>;
  }

  private renderClaimsTable(data: ClaimDto[], tableQa: string, project: ProjectDto) {
    const ClaimTable = Acc.TypedTable<ClaimDto>();

    const editableStatuses = [ClaimStatus.DRAFT, ClaimStatus.MO_QUERIED, ClaimStatus.INNOVATE_QUERIED];
    const isClaimEditable = editableStatuses.indexOf(data[0].status) > -1;

    return (
      <ClaimTable.Table qa={tableQa} data={data} bodyRowClass={() => isClaimEditable ? "table__row--edit" : ""}>
        <ClaimTable.Custom
          paddingRight="0px"
          header=""
          qa="edit-icon"
          value={() => isClaimEditable ? <img src="/assets/images/icon-edit.png"/> : null}
        />
        <ClaimTable.Custom
          header=""
          qa="period"
          value={x => <Acc.Claims.ClaimPeriodDate claim={x} />}
        />
        <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
        <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
        <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
        <ClaimTable.Custom header="Status" qa="status" value={(x) => x.status} />
        <ClaimTable.Custom
          header="Date of last update"
          qa="date"
          value={(x) => <Acc.Renderers.ShortDate value={(x.paidDate || x.approvedDate || x.lastModifiedDate)} />}
        />
        <ClaimTable.Custom header="" qa="link" value={(x) => this.getLink(x, project.id)} />
      </ClaimTable.Table>
    );
  }
}

const definition = ReduxContainer.for<ClaimDashboardPageParams, Data, Callbacks>(Component);

export const ClaimsDashboard = definition.connect({
  withData: (state, props) => {
    return ({
      document: getCurrentClaimIarDocument(state, props.partnerId),
      editor: getCurrentClaimIarDocumentsEditor(state, props.partnerId),
      deleteEditor: getCurrentClaimIarDocumentsDeleteEditor(state, props.partnerId),
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
        dispatch(Actions.loadIarDocumentsForCurrentClaim(claimKey.partnerId)))),
    deleteFile: (claimKey, file) =>
      dispatch(Actions.deleteClaimDocument(claimKey, file, () =>
        dispatch(Actions.loadIarDocumentsForCurrentClaim(claimKey.partnerId))))
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
    Actions.loadClaimsForPartner(params.partnerId),
    Actions.loadIarDocumentsForCurrentClaim(params.partnerId)
  ],
  container: ClaimsDashboard
});
