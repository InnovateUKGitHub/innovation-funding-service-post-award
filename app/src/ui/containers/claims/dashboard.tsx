import React from "react";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import {
  getCurrentClaim,
  getCurrentClaimIarDocument,
  getCurrentClaimIarDocumentsDeleteEditor,
  getCurrentClaimIarDocumentsEditor,
  getPartner,
  getPreviousClaims,
  getProject
} from "../../redux/selectors";
import * as Acc from "../../components";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ClaimDto, ClaimStatus, DocumentDescription, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { IEditorStore } from "../../redux/reducers";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";
import { DateTime } from "luxon";
import { Results } from "../../validation/results";
import { ProjectDashboardRoute } from "@ui/containers";

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
    const combined = Pending.combine({
      document: this.props.document,
      project: this.props.projectDetails,
      partner: this.props.partnerDetails,
      previousClaims: this.props.previousClaims,
      currentClaim: this.props.currentClaim,
      editor: this.props.editor,
      deleteEditor: this.props.deleteEditor,
    });

    return <Acc.PageLoader pending={combined} render={(x) => this.renderContents(x)} />;
  }

  private renderIarDocument(claim: ClaimDto, document: DocumentSummaryDto) {
    const button = () => {
      const Form = Acc.TypedForm<DocumentSummaryDto>();
      return (
        <Form.Form data={document} qa="iar-delete-form">
          <Form.Button name="delete" value={document.id} onClick={() => this.onDelete(claim, document)}>Remove</Form.Button>
        </Form.Form>
      );
    };

    return (
      <Acc.DocumentSingle message={"An IAR has been added to this claim."} document={document} openNewWindow={true} renderRemove={() => claim.allowIarEdit && button()} />
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
      ? "Your most recent claim cannot be sent to us. You must attach an independent accountant's report (IAR)."
      : "You must attach an independent accountant's report (IAR) for your most recent claim to receive your payment.";
    const messageType = isAwaitingIAR ? "error" : "declare";
    return (
      <React.Fragment>
        <Acc.ValidationMessage messageType={messageType} message={message} />
        <UploadForm.Form enctype="multipart" editor={editor} onChange={(dto) => this.onChange(dto, claim.periodId)} qa="iar-upload-form">
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
          <UploadForm.Button name="upload" onClick={() => this.onSave(editor.data, claim.periodId)}>Upload</UploadForm.Button>
        </UploadForm.Form>
      </React.Fragment>
    );
  }

  private renderIarDocumentSection(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>, document: DocumentSummaryDto | null) {
    if (!claim.isIarRequired) {
      return null;
    }

    return (
      <Acc.Section qa="current-claim-iar" title="Independent accountant's report">
        {document ? this.renderIarDocument(claim, document) : this.renderIarDocumentUpload(claim, editor)}
      </Acc.Section>
    );
  }

  private renderContents({ currentClaim, partner, previousClaims, project, editor, document, deleteEditor }: CombinedData) {
    const Details = Acc.TypedDetails<PartnerDto>();

    const claimsWindow = !!currentClaim && currentClaim.status === ClaimStatus.DRAFT ? <Acc.Claims.ClaimWindow periodEnd={currentClaim.periodEndDate} /> : null;

    const error = (editor && editor.error) || (deleteEditor && deleteEditor.error);
    const validator = (editor && editor.validator) || (deleteEditor && deleteEditor.validator);

    return (
      <Acc.Page
        pageTitle={<Acc.Projects.Title project={project}/>}
        error={error}
        tabs={<Acc.Projects.ProjectNavigation project={project} currentRoute={ClaimsDashboardRoute.routeName} partners={[partner]}/>}
        validator={validator}
        messages={this.props.messages}
        backLink={<Acc.BackLink route={ProjectDashboardRoute.getLink({})}>Back to all projects</Acc.BackLink>}
      >
        <Acc.Section>
          <Acc.SectionPanel qa="claims-totals" title="History">
            <Acc.DualDetails displayDensity="Compact">
              <Details.Details qa="claims-totals-col-0" data={partner}>
                <Details.Currency label="Total eligible costs" qa="gol-costs" value={x => x.totalParticipantGrant} />
                <Details.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
                <Details.Percentage label="Percentage of eligible costs claimed to date" qa="percentage-costs" value={x => x.percentageParticipantCostsClaimed} />
                <Details.Currency label="Costs paid to date" qa="paid-costs" value={x => x.totalPaidCosts || 0} />
              </Details.Details>
              <Details.Details qa="claims-totals-col-1" data={partner}>
                <Details.Percentage label="Funding level" value={x => x.awardRate} qa="award-rate" fractionDigits={0} />
                <Details.Percentage label="Cap limit" value={x => x.capLimit} fractionDigits={0} qa="cap-limit" />
              </Details.Details>
            </Acc.DualDetails>
          </Acc.SectionPanel>
        </Acc.Section>
        <Acc.Section qa="current-claims-section" title={"Open"} badge={claimsWindow}>
          {this.renderCurrentClaims(currentClaim ? [currentClaim] : [], "current-claims-table", project, partner, previousClaims)}
        </Acc.Section>
        {currentClaim && editor && this.renderIarDocumentSection(currentClaim, editor, document)}
        <Acc.Section qa="previous-claims-section" title="Closed">
          {this.renderPreviousClaims(previousClaims, "previous-claims-table", project, partner)}
        </Acc.Section>
      </Acc.Page>
    );
  }

  private renderNextPeriodStartDate(endDate: Date) {
    const date = DateTime.fromJSDate(endDate).plus({days: 1}).toJSDate();
    return (
      <Acc.Renderers.SimpleString>
        You have no open claims. The next claim period begins <Acc.Renderers.FullDate value={date} />.
      </Acc.Renderers.SimpleString>
    );
  }

  private renderCurrentClaims(data: ClaimDto[], tableQa: string, project: ProjectDto, partner: PartnerDto, previousClaims?: ClaimDto[]) {
    if (data.length) {
      return this.renderClaimsTable(data, tableQa, project, partner, "Open");
    }

    if (!!project.periodEndDate) {
      return this.renderNextPeriodStartDate(project.periodEndDate);
    }

    if (!!previousClaims) {
      return this.renderNextPeriodStartDate(previousClaims[0].periodEndDate);
    }

    return null;

  }

  private renderPreviousClaims(data: ClaimDto[], tableQa: string, project: ProjectDto, partner: PartnerDto) {
    if (data.length) {
      return this.renderClaimsTable(data, tableQa, project, partner, "Closed");
    }

    return <Acc.Renderers.SimpleString>You have not made any claims.</Acc.Renderers.SimpleString>;
  }

  private renderClaimsTable(data: ClaimDto[], tableQa: string, project: ProjectDto, partner: PartnerDto, tableCaption?: string) {
    const ClaimTable = Acc.TypedTable<ClaimDto>();

    return (
      <ClaimTable.Table
        data={data}
        className="govuk-!-font-size-16"
        bodyRowFlag={x => Acc.Claims.getClaimDetailsLinkType({ claim: x, project, partner }) === "edit" ? "edit" : null}
        qa={tableQa}
        caption={tableCaption}
      >
        <ClaimTable.Custom
          header="Period"
          qa="period"
          value={x => <Acc.Claims.ClaimPeriodDate claim={x} />}
        />
        <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
        <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
        <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
        <ClaimTable.Custom header="Status" qa="status" value={(x) => x.status} />
        <ClaimTable.ShortDate
          header="Date of last update"
          qa="date"
          value={(x) => (x.paidDate || x.approvedDate || x.lastModifiedDate)}
        />
        <ClaimTable.Custom header="Action" hideHeader={true} qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} />} />
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
  accessControl: (auth, {projectId, partnerId}) => {
    const isFC = auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact);
    const isMoOrPm = auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);

    return isFC && !isMoOrPm;
  },
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartner(params.partnerId),
    Actions.loadClaimsForPartner(params.partnerId),
    Actions.loadIarDocumentsForCurrentClaim(params.partnerId)
  ],
  getTitle: (store) => {
    return {
      displayTitle: "View project",
      htmlTitle: "Claims - View project"
    };
  },
  container: ClaimsDashboard
});
