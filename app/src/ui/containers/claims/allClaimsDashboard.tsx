import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import React from "react";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "@ui/containers/containerBase";
import * as Acc from "@ui/components";
import { Pending } from "@shared/pending";
import { DateTime } from "luxon";
import { ClaimStatus, DocumentDescription } from "@framework/types";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { DocumentUploadDtoValidator } from "@ui/validators";
import { getFileSize } from "@framework/util/filesize";
import { getClaimDetailsLinkType } from "@ui/components/claims/claimDetailsLink";

export interface AllClaimsDashboardParams {
  projectId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  currentClaims: Pending<ClaimDto[]>;
  previousClaims: Pending<ClaimDto[]>;
  document: Pending<DocumentSummaryDto | null>;
  documentEditor: Pending<IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator> | null>;
}

interface Callbacks {
  onIarChange: (isSaving: boolean, partnerId: string, periodId: number, dto: DocumentUploadDto, onSucess?: () => void) => void;
  onIarDelete: (partnerId: string, periodId: number, dto: DocumentUploadDto, document: DocumentSummaryDto, onSucess?: () => void) => void;
}

interface State {
  showIarMessage: boolean;
}

class Component extends ContainerBaseWithState<AllClaimsDashboardParams, Data, Callbacks, State> {

  constructor(props: ContainerProps<AllClaimsDashboardParams, Data, Callbacks>) {
    super(props);

    this.state = {
      showIarMessage: false
    };
  }

  render() {
    const combined = Pending.combine({
      projectDetails: this.props.projectDetails,
      partners: this.props.partners,
      currentClaims: this.props.currentClaims,
      previousClaims: this.props.previousClaims
    });

    return <Acc.PageLoader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners, x.currentClaims, x.previousClaims)} />;
  }

  renderContents(projectDetails: ProjectDto, partners: PartnerDto[], currentClaims: ClaimDto[], previousClaims: ClaimDto[]) {
    const leadPartner = partners.find(x => x.isLead);

    const editor = this.props.documentEditor && this.props.documentEditor.data;

    const isFC = (projectDetails.roles & ProjectRole.FinancialContact) !== ProjectRole.Unknown;

    return (
      <Acc.Page
        pageTitle={<Acc.Projects.Title project={projectDetails} />}
        backLink={<Acc.Projects.ProjectBackLink project={projectDetails} routes={this.props.routes} />}
        validator={editor && editor.validator}
        error={editor && editor.error}
        project={projectDetails}
      >
        <Acc.Renderers.Messages messages={this.props.messages} />
        <Acc.Section qa="current-claims-section" title="Open">
          {this.renderCurrentClaimsPerPeriod(currentClaims, projectDetails, partners)}
          {isFC && leadPartner && this.renderIarDocumentSectionLoader(currentClaims.find(x => x.partnerId === leadPartner.id))}
        </Acc.Section>
        <Acc.Section qa="closed-claims-section" title="Closed">
          {this.renderPreviousClaimsSections(projectDetails, partners, previousClaims)}
        </Acc.Section>
      </Acc.Page>
    );
  }

  groupClaimsByPeriod(claims: ClaimDto[]) {
    const distinctPeriods = [...new Set(claims.map(x => x.periodId))].sort((a, b) => a - b);
    return distinctPeriods.map((period) => {
      const periodClaims = claims.filter(x => x.periodId === period);
      return {
        periodId: period,
        claims: periodClaims,
        start: periodClaims[0].periodStartDate,
        end: periodClaims[0].periodEndDate
      };
    });
  }

  private renderCurrentClaimsPerPeriod(claims: ClaimDto[], project: ProjectDto, partners: PartnerDto[]) {
    const groupedClaims = this.groupClaimsByPeriod(claims);
    if (groupedClaims.length === 0) {
      if (!project.periodEndDate) return null;
      const date = DateTime.fromJSDate(project.periodEndDate).plus({ days: 1 }).toJSDate();

      return (
        <Acc.Renderers.SimpleString qa="notificationMessage">
          There are no open claims. The next claim period begins <Acc.Renderers.FullDate value={date} />.
        </Acc.Renderers.SimpleString>
      );
    }
    return groupedClaims.map((x, i) => this.renderCurrentClaims(x.periodId, x.start, x.end, x.claims, project, partners, i));
  }

  private claimHasNotBeenSubmittedToInnovate(x: ClaimDto) {
    return [
      ClaimStatus.INNOVATE_QUERIED,
      ClaimStatus.AWAITING_IUK_APPROVAL,
      ClaimStatus.APPROVED,
      ClaimStatus.PAID
    ].indexOf(x.status) < 0;
  }

  private renderCurrentClaims(periodId: number, start: Date, end: Date, claims: ClaimDto[], project: ProjectDto, partners: PartnerDto[], index: number) {
    const title = <React.Fragment>Period {periodId}: <Acc.Renderers.ShortDateRange start={start} end={end} /></React.Fragment>;
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    const renderPartnerName = (x: ClaimDto) => {
      const p = partners.filter(y => y.id === x.partnerId)[0];
      if (p && p.isLead) return `${p.name} (Lead)`;
      if (p) return p.name;
      return null;
    };

    const hasClaimNotYetSubmittedToInnovate = claims.find(this.claimHasNotBeenSubmittedToInnovate);
    const badge = hasClaimNotYetSubmittedToInnovate && <Acc.Claims.ClaimWindow periodEnd={end} />;

    return (
      <Acc.Section title={title} qa="current-claims-section" badge={badge} key={index} >
        <ClaimTable.Table
          data={claims}
          bodyRowFlag={x => this.getBodyRowFlag(x, project, partners) ? "edit" : null}
          caption="Open"
          qa="current-claims-table"
        >
          <ClaimTable.String header="Partner" qa="partner" value={renderPartnerName} />
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String header="Status" qa="status" value={(x) => x.statusLabel} />
          <ClaimTable.ShortDate header="Date of last update" qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate} />
          <ClaimTable.Custom header="Action" hideHeader={true} qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partners.find(p => p.id === x.partnerId)!} routes={this.props.routes} />} />
        </ClaimTable.Table>
      </Acc.Section>
    );
  }

  getBodyRowFlag(claim: ClaimDto, project: ProjectDto, partners: PartnerDto[]) {
    const partner = partners.find(x => x.id === claim.partnerId);
    if (!partner) return false;

    const linkType = getClaimDetailsLinkType({ claim, project, partner });
    return linkType === "edit" || linkType === "review";
  }

  private renderPreviousClaimsSections(project: ProjectDto, partners: PartnerDto[], previousClaims: ClaimDto[]) {
    const grouped = partners.map(x => ({ partner: x, claims: previousClaims.filter(y => y.partnerId === x.id) }));

    return (
      <Acc.Accordion qa="previous-claims">
        {grouped.map((x, i) => (
          <Acc.AccordionItem title={`${x.partner.name} ${x.partner.isLead ? "(Lead)" : ""}`} key={i} qa={`accordion-item-${i}`}>
            {this.previousClaimsSection(project, x.partner, x.claims)}
          </Acc.AccordionItem>
        ))}
      </Acc.Accordion>
    );
  }

  private previousClaimsSection(project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) {
    if (previousClaims.length === 0) {
      return (
        <Acc.Renderers.SimpleString qa={`noClosedClaims-${partner.accountId}`}>There are no closed claims for this partner.</Acc.Renderers.SimpleString>
      );
    }
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    return (
      <div>
        <ClaimTable.Table data={previousClaims} caption={partner.name} qa={`previousClaims-${partner.accountId}`}>
          <ClaimTable.Custom header="" qa="period" value={(x) => this.renderClosedPeriodColumn(x)} />
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String header="Status" qa="status" value={(x) => x.statusLabel} />
          <ClaimTable.ShortDate header="Date of last update" qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate} />
          <ClaimTable.Custom header="Action" hideHeader={true} qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} routes={this.props.routes} />} />
        </ClaimTable.Table>
      </div>
    );
  }

  private renderClosedPeriodColumn(claim: ClaimDto) {
    return (
      <Acc.Claims.ClaimPeriodDate claim={claim} />
    );
  }

  private renderIarDocumentSectionLoader(claim: ClaimDto | undefined) {
    if (!claim || !claim.isIarRequired) {
      return null;
    }

    const combined = Pending.combine({
      document: this.props.document,
      editor: this.props.documentEditor,
    });

    return (<Acc.Loader pending={combined} render={({ editor, document }) => this.renderIarDocumentSection(claim, editor, document)} />);
  }

  private renderIarDocumentSection(claim: ClaimDto, editor: IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator> | null, document: DocumentSummaryDto | null) {
    if (!editor) return null;
    return (
      <Acc.Section qa="current-claim-iar" title="Independent accountant's report">
        {document ? this.renderIarDocument(editor, claim, document) : this.renderIarDocumentUpload(claim, editor)}
      </Acc.Section>
    );
  }

  private renderIarDocument(editor: IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator>, claim: ClaimDto, document: DocumentSummaryDto) {
    if (!document) return null;
    const button = () => {
      const Form = Acc.TypedForm<DocumentUploadDto>();
      return (
        <Form.Form editor={editor} qa="iar-delete-form">
          <Form.Hidden name="periodId" value={() => claim.periodId} />
          <Form.Hidden name="partnerId" value={() => claim.partnerId} />
          <Form.Button name="delete" value={document.id} onClick={() => this.onDelete(claim, editor.data, document)}>Remove</Form.Button>
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
        <UploadForm.Form
          enctype="multipart"
          editor={editor}
          onChange={(dto) => this.props.onIarChange(false, claim.partnerId, claim.periodId, dto)}
          onSubmit={() => this.onSave(claim, editor.data)}
          qa="iar-upload-form"
        >
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
            <UploadForm.Hidden name="partnerId" value={() => claim.partnerId} />
            <UploadForm.Hidden name="periodId" value={() => claim.periodId} />
            <UploadForm.Hidden name="description" value={() => DocumentDescription.IAR} />
          </UploadForm.Fieldset>
          <UploadForm.Button name="upload" onClick={() => this.onSave(claim, editor.data)}>Upload</UploadForm.Button>
        </UploadForm.Form>
      </React.Fragment>
    );
  }

  private onSave(claim: ClaimDto, dto: DocumentUploadDto) {
    this.props.onIarChange(true, claim.partnerId, claim.periodId, dto, () => this.setState({ showIarMessage: true }));
  }

  private onDelete(claim: ClaimDto, dto: DocumentUploadDto, document: DocumentSummaryDto) {
    this.props.onIarDelete(claim.partnerId, claim.periodId, dto, document, () => this.setState({ showIarMessage: false }));
  }

}

const Container = (props: AllClaimsDashboardParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => {
        const isFC = stores.users.getCurrentUserAuthorisation().forProject(props.projectId).hasRole(ProjectRole.FinancialContact);
        return (
          <Component
            projectDetails={stores.projects.getById(props.projectId)}
            partners={stores.partners.getPartnersForProject(props.projectId)}
            currentClaims={stores.claims.getActiveClaimsForProject(props.projectId)}
            previousClaims={stores.claims.getInactiveClaimsForProject(props.projectId)}
            document={isFC ? stores.claimDocuments.getCurrentClaimIarForLeadPartner(props.projectId) : Pending.done(null)}
            documentEditor={isFC ? stores.claimDocuments.getCurrentClaimIarEditorForLeadPartner(props.projectId) : Pending.done(null)}
            onIarChange={(saving, partnerId, periodId, dto, onSuccess) => stores.claimDocuments.updateIAREditor(saving, props.projectId, partnerId, periodId, dto, undefined, onSuccess)}
            onIarDelete={(partnerId, periodId, dto, document, onSuccess) => stores.claimDocuments.deleteIARDocument(props.projectId, partnerId, periodId, dto, document, undefined, onSuccess)}
            {...props}
          />
        );
      }
    }
  </StoresConsumer>
);

export const AllClaimsDashboardRoute = defineRoute({
  routeName: "allClaimsDashboard",
  routePath: "/projects/:projectId/claims/dashboard",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getTitle: (store) => {
    return {
      displayTitle: "Claims",
      htmlTitle: "Claims - View project"
    };
  },
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
});
