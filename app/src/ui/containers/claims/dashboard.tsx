import { IEditorStore } from "../../redux/reducers";
import React from "react";
import * as Acc from "../../components";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "../containerBase";
import { ClaimDto, ClaimStatus, DocumentDescription, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "../../../shared/pending";
import { DocumentUploadDtoValidator } from "../../validators/documentUploadValidator";
import { DateTime } from "luxon";
import { getFileSize } from "@framework/util/filesize";
import { getClaimDetailsLinkType } from "@ui/components/claims/claimDetailsLink";
import { StoresConsumer } from "@ui/redux";

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
  editor: Pending<IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator> | null>;
}

interface Callbacks {
  onIarChange: (saving: boolean, periodId: number, dto: DocumentUploadDto, onSucess?: () => void) => void;
  onIarDelete: (periodId: number, dto: DocumentUploadDto, document: DocumentSummaryDto, onSucess?: () => void) => void;
}

interface State {
  showIarMessage: boolean;
}

class Component extends ContainerBaseWithState<ClaimDashboardPageParams, Data, Callbacks, State> {
  constructor(props: ContainerProps<ClaimDashboardPageParams, Data, Callbacks>) {
    super(props);

    this.state = {
      showIarMessage: false
    };
  }

  public render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partner: this.props.partnerDetails,
      previousClaims: this.props.previousClaims,
      currentClaim: this.props.currentClaim,
    });

    return <Acc.PageLoader pending={combined} render={(x) => this.renderContents(x.project, x.partner, x.currentClaim, x.previousClaims)} />;
  }

  private renderIarDocument(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator>, document: DocumentSummaryDto) {
    const button = () => {
      const Form = Acc.TypedForm<DocumentUploadDto>();
      return (
        <Form.Form editor={editor} qa="iar-delete-form">
          <Form.Hidden name="periodId" value={() => claim.periodId} />
          <Form.Button name="delete" value={document.id} onClick={() => this.onDelete(claim, editor.data, document, this.props.projectId)}>Remove</Form.Button>
        </Form.Form>
      );
    };

    return (
      <React.Fragment>
        {this.state.showIarMessage ? <Acc.ValidationMessage messageType="success" message="You have attached an independent accountant's report (IAR)." /> : null}
        <Acc.DocumentSingle document={document} openNewWindow={true} renderRemove={() => claim.allowIarEdit && button()} />
      </React.Fragment>
    );
  }

  private onChange(dto: DocumentUploadDto, periodId: number) {
    this.setState({ showIarMessage: false });
    this.props.onIarChange(false, periodId, dto);
  }

  private onSave(dto: DocumentUploadDto, periodId: number) {
    this.props.onIarChange(true, periodId, dto, () => this.setState({ showIarMessage: true }));
  }

  private onDelete(claim: ClaimDto, dto: DocumentUploadDto, document: DocumentSummaryDto, projectId: string) {
    this.props.onIarDelete(claim.periodId, dto, document, () => this.setState({ showIarMessage: false }));
  }

  private renderIarDocumentUpload(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator>) {
    if (!claim.allowIarEdit) {
      return null;
    }
    const UploadForm = Acc.TypedForm<{ file: IFileWrapper | null }>();
    const isAwaitingIAR = claim.status === ClaimStatus.AWAITING_IAR;
    const message = isAwaitingIAR
      ? "Your most recent claim cannot be sent to us. You must attach an independent accountant's report (IAR)."
      : "You must attach an independent accountant's report (IAR) for your most recent claim to receive your payment.";
    const messageType = isAwaitingIAR ? "alert" : "warning";
    return (
      <React.Fragment>
        <Acc.ValidationMessage messageType={messageType} message={message} />
        <UploadForm.Form enctype="multipart" editor={editor} onChange={(dto) => this.onChange(dto, claim.periodId)} qa="iar-upload-form">
          <UploadForm.Fieldset>
            <Acc.Info summary="What should I include?">
              <p>You must upload a single document from an independent accountant auditing the costs spent by you on this project. Your claim will not be sent to Innovate UK until this has been uploaded.</p>
              <p>There is no restriction on the type of file you can upload.</p>
              <p>The document must be:</p>
              <ul>
                <li>less than {getFileSize(this.props.config.maxFileSize)} in file size</li>
              </ul>
            </Acc.Info>
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

  private renderIarDocumentSectionLoader() {
    const combined = Pending.combine({
      claim: this.props.currentClaim,
      document: this.props.document,
      editor: this.props.editor
    });

    return (
      <Acc.Loader pending={combined} render={data => this.renderIarDocumentSection(data.claim, data.editor, data.document)} />
    );
  }

  private renderIarDocumentSection(claim: ClaimDto | null, editor: IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator> | null, document: DocumentSummaryDto | null) {
    if (!claim || !claim.isIarRequired || !editor) {
      return null;
    }
    return (
      <Acc.Section qa="current-claim-iar" title="Independent accountant's report">
        {document ? this.renderIarDocument(claim, editor, document) : this.renderIarDocumentUpload(claim, editor)}
      </Acc.Section>
    );
  }

  private renderContents(project: ProjectDto, partner: PartnerDto, currentClaim: ClaimDto | null, previousClaims: ClaimDto[], ) {
    const claimsWindow = !!currentClaim && currentClaim.status === ClaimStatus.DRAFT ? <Acc.Claims.ClaimWindow periodEnd={currentClaim.periodEndDate} /> : null;
    const editor = this.props.editor.data;

    return (
      <Acc.Page
        pageTitle={<Acc.Projects.Title project={project} />}
        backLink={<Acc.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        error={editor && editor.error}
        validator={editor && editor.validator}
        project={project}
      >
        <Acc.Renderers.Messages messages={this.props.messages} />
        <Acc.Section qa="current-claims-section" title={"Open"} badge={claimsWindow}>
          {this.renderCurrentClaims(currentClaim ? [currentClaim] : [], "current-claims-table", project, partner, previousClaims)}
        </Acc.Section>
        {this.renderIarDocumentSectionLoader()}
        <Acc.Section qa="previous-claims-section" title="Closed">
          {this.renderPreviousClaims(previousClaims, "previous-claims-table", project, partner)}
        </Acc.Section>
      </Acc.Page>
    );
  }

  private renderNextPeriodStartDate(endDate: Date) {
    const date = DateTime.fromJSDate(endDate).plus({ days: 1 }).toJSDate();
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
        bodyRowFlag={x => getClaimDetailsLinkType({ claim: x, project, partner }) === "edit" ? "edit" : null}
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
        <ClaimTable.Custom header="Status" qa="status" value={(x) => x.statusLabel} />
        <ClaimTable.ShortDate
          header="Date of last update"
          qa="date"
          value={(x) => (x.paidDate || x.approvedDate || x.lastModifiedDate)}
        />
        <ClaimTable.Custom header="Action" hideHeader={true} qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} routes={this.props.routes} />} />
      </ClaimTable.Table>
    );
  }
}

const Container = (props: ClaimDashboardPageParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <Component
        projectDetails={stores.projects.getById(props.projectId)}
        partnerDetails={stores.partners.getById(props.partnerId)}
        previousClaims={stores.claims.getInactiveClaimsForPartner(props.partnerId)}
        currentClaim={stores.claims.getActiveClaimForPartner(props.partnerId)}
        document={stores.claimDocuments.getCurrentClaimIarForPartner(props.projectId, props.partnerId)}
        editor={stores.claimDocuments.getIarEditorForCurrentPartnerClaim(props.projectId, props.partnerId)}
        onIarChange={(saving, periodId, dto, onSuccess) => stores.claimDocuments.updateIAREditor(saving, props.projectId, props.partnerId, periodId, dto, undefined, onSuccess)}
        onIarDelete={(periodId, dto, document, onSuccess) => stores.claimDocuments.deleteIARDocument(props.projectId, props.partnerId, periodId, dto, document, undefined, onSuccess)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ClaimsDashboardRoute = defineRoute({
  routeName: "claimsDashboard",
  routePath: "/projects/:projectId/claims/?partnerId",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId
  }),
  accessControl: (auth, params) => {
    const isFC = auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact);
    const isMoOrPm = auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);

    return isFC && !isMoOrPm;
  },
  getTitle: () => ({
    displayTitle: "Claims",
    htmlTitle: "Claims - View project"
  })
});
