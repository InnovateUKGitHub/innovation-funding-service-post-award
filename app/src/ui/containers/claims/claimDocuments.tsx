import React from "react";
import * as ACC from "@ui/components";
import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { DocumentDescription } from "@framework/constants";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentDescriptionDto, DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DropdownOption } from "@ui/components";
import { getAllEnumValues } from "@shared/enumHelper";
import { projectCompetition, useContent } from "@ui/hooks";

export interface ClaimDocumentsPageParams {
  projectId: string;
  periodId: number;
  partnerId: string;
}

type DefaultIntroKeys =
  | "backLink"
  | "finalClaim"
  | "uploadDocumentsLabel"
  | "descriptionLabel"
  | "documentsListSectionTitle"
  | "saveAndReturnButton"
  | "saveAndContinueToSummaryButton"
  | "finalClaimGuidance"
  | "iarRequired"
  | "noDocumentsUploaded"
  | "newWindow"
  | "saveAndContinueToForecastButton"
  | "uploadTitle";

type IntroContentKeys =
  | "uploadAndStoreMessage"
  | "uploadGuidanceMessage"
  | "schedule3ReminderMessage"
  | "virtualApprovalMessage"
  | "lmcMinutesMessage";

interface ClaimDocumentContent {
  default: Record<DefaultIntroKeys, string>;
  getCompetitionContent: (competitionType: string) => Record<IntroContentKeys, string> | undefined;
}

export function useClaimDocumentContent(): ClaimDocumentContent {
  const { getContent } = useContent();

  const defaultContent = {
    backLink: getContent(x => x.claimDocuments.backLink),
    descriptionLabel: getContent(x => x.claimDocuments.descriptionLabel),
    documentsListSectionTitle: getContent(x => x.claimDocuments.documentsListSectionTitle),
    saveAndReturnButton: getContent(x => x.claimDocuments.saveAndReturnButton),
    saveAndContinueToSummaryButton: getContent(x => x.claimDocuments.saveAndContinueToSummaryButton),
    saveAndContinueToForecastButton: getContent(x => x.claimDocuments.saveAndContinueToForecastButton),

    finalClaim: getContent(x => x.claimDocuments.messages.finalClaim),
    finalClaimGuidance: getContent(x => x.claimDocuments.messages.finalClaimGuidance),
    iarRequired: getContent(x => x.claimDocuments.messages.iarRequired),

    uploadTitle: getContent(x => x.claimDocuments.documentMessages.uploadTitle),
    uploadDocumentsLabel: getContent(x => x.claimDocuments.documentMessages.uploadDocumentsLabel),
    noDocumentsUploaded: getContent(x => x.claimDocuments.documentMessages.noDocumentsUploaded),
    newWindow: getContent(x => x.claimDocuments.documentMessages.newWindow),
  };

  const ktpContent = {
    uploadAndStoreMessage: getContent(x => x.claimDocuments.introMessage.uploadAndStoreMessage),
    uploadGuidanceMessage: getContent(x => x.claimDocuments.introMessage.uploadGuidanceMessage),
    schedule3ReminderMessage: getContent(x => x.claimDocuments.introMessage.schedule3ReminderMessage),
    lmcMinutesMessage: getContent(x => x.claimDocuments.lmcMinutesMessage),
    virtualApprovalMessage: getContent(x => x.claimDocuments.virtualApprovalMessage),
  };

  const getCompetitionContent = (competitionType: string) => {
    const { isKTP } = projectCompetition(competitionType);

    return isKTP ? ktpContent : undefined;
  };

  return {
    default: defaultContent,
    getCompetitionContent,
  };
}

interface Data {
  content: ClaimDocumentContent;
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  claim: Pending<ClaimDto>;
  documentDescriptions: Pending<DocumentDescriptionDto[]>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

class ClaimDocumentsComponent extends ContainerBase<ClaimDocumentsPageParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
      documents: this.props.documents,
      claim: this.props.claim,
      documentDescriptions: this.props.documentDescriptions,
    });

    return (
      <ACC.PageLoader
        pending={combined}
        render={x => this.renderContents(x.project, x.editor, x.documents, x.claim, x.documentDescriptions)}
      />
    );
  }

  private readonly allowedDocuments = [
    DocumentDescription.Evidence,
    DocumentDescription.EndOfProjectSurvey,
    DocumentDescription.IAR,
    DocumentDescription.LMCMinutes,
    DocumentDescription.ScheduleThree,
    DocumentDescription.StatementOfExpenditure,
  ];

  private getIntroMessage(competitionType: string) {
    const { content } = this.props;
    const ktpContent = content.getCompetitionContent(competitionType);

    if (!ktpContent) return null;

    const introList = [ktpContent.lmcMinutesMessage, ktpContent.virtualApprovalMessage];

    return (
      <>
        <ACC.Renderers.SimpleString>{ktpContent.uploadAndStoreMessage}</ACC.Renderers.SimpleString>

        <ACC.Renderers.SimpleString>{ktpContent.uploadGuidanceMessage}</ACC.Renderers.SimpleString>

        <ol className="govuk-list gov-uk--number govuk-!-margin-bottom-10">
          {introList.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        <ACC.Renderers.SimpleString>{ktpContent.schedule3ReminderMessage}</ACC.Renderers.SimpleString>
      </>
    );
  }

  private renderContents(
    project: ProjectDto,
    editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>,
    documents: DocumentSummaryDto[],
    claim: ClaimDto,
    documentDescriptions: DocumentDescriptionDto[],
  ) {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    const { content } = this.props;
    const ktpIntroContent = this.getIntroMessage(project.competitionType);

    const documentTypeOptions: DropdownOption[] = documentDescriptions
      .filter(x => this.allowedDocuments.indexOf(x.id) >= 0)
      .map(x => ({ id: x.id.toString(), value: x.label }));

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title {...project} />}
        error={editor.error}
        validator={editor.validator}
        backLink={
          <ACC.BackLink
            route={this.props.routes.prepareClaim.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
              periodId: this.props.periodId,
            })}
          >
            {content.default.backLink}
          </ACC.BackLink>
        }
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        {claim.isFinalClaim && <ACC.ValidationMessage messageType="info" message={content.default.finalClaim} />}

        {claim.isIarRequired && (
          <ACC.Section>
            {claim.isFinalClaim ? (
              <span data-qa="iarText">
                <ACC.Content value={x => x.claimDocuments.messages.finalClaimGuidance} />
              </span>
            ) : (
              <ACC.Renderers.SimpleString qa="iarText">
                <ACC.Content value={x => x.claimDocuments.messages.iarRequired} />
              </ACC.Renderers.SimpleString>
            )}
          </ACC.Section>
        )}

        <ACC.Renderers.SimpleString>{ktpIntroContent}</ACC.Renderers.SimpleString>

        <ACC.Section title={content.default.uploadTitle}>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            qa="claimDocumentsForm"
            onChange={dto => this.props.onChange(false, dto)}
          >
            <UploadForm.Fieldset>
              <ACC.DocumentGuidance />
              <UploadForm.MulipleFileUpload
                label={content.default.uploadDocumentsLabel}
                labelHidden={true}
                name="attachment"
                validation={editor.validator.files}
                value={data => data.files}
                update={(dto, files) => (dto.files = files || [])}
              />
              <UploadForm.DropdownList
                label={content.default.descriptionLabel}
                labelHidden={false}
                hasEmptyOption={true}
                placeholder="-- No description --"
                name="description"
                validation={editor.validator.description}
                options={documentTypeOptions}
                value={data =>
                  data.description ? documentTypeOptions.find(x => x.id === data.description!.toString()) : undefined
                }
                update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
              />
            </UploadForm.Fieldset>
            {/*TODO @documents-content make button label consistent*/}
            <UploadForm.Button styling="Secondary" name="upload" onClick={() => this.props.onChange(true, editor.data)}>
              {content.default.uploadDocumentsLabel}
            </UploadForm.Button>
          </UploadForm.Form>
        </ACC.Section>
        <ACC.Section title={content.default.documentsListSectionTitle}>
          {this.renderDocuments(editor, documents)}
        </ACC.Section>
        <ACC.Section qa="buttons">
          {this.renderNextStepLink(claim)}
          <ACC.Link styling="SecondaryButton" id="save-claim" route={this.getDashboardLink(project)}>
            {content.default.saveAndReturnButton}
          </ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderNextStepLink(claim: ClaimDto) {
    const { content } = this.props;

    if (claim.isFinalClaim) {
      return (
        <ACC.Link
          styling="PrimaryButton"
          id="continue-claim"
          route={this.props.routes.claimSummary.getLink({
            projectId: this.props.projectId,
            partnerId: this.props.partnerId,
            periodId: this.props.periodId,
          })}
        >
          {content.default.saveAndContinueToSummaryButton}
        </ACC.Link>
      );
    }
    return (
      <ACC.Link
        styling="PrimaryButton"
        id="continue-claim"
        route={this.props.routes.claimForecast.getLink({
          projectId: this.props.projectId,
          partnerId: this.props.partnerId,
          periodId: this.props.periodId,
        })}
      >
        {content.default.saveAndContinueToForecastButton}
      </ACC.Link>
    );
  }

  private getDashboardLink(project: ProjectDto) {
    const isPmOrMo =
      (project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    return isPmOrMo
      ? this.props.routes.allClaimsDashboard.getLink({ projectId: project.id })
      : this.props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: this.props.partnerId });
  }

  private renderDocuments(
    editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>,
    documents: DocumentSummaryDto[],
  ) {
    const { content } = this.props;

    if (!documents.length) {
      return (
        <ACC.Section>
          <ACC.ValidationMessage message={content.default.noDocumentsUploaded} messageType="info" />
        </ACC.Section>
      );
    }

    return (
      <ACC.Section subtitle={content.default.newWindow}>
        {documents.length ? (
          <ACC.DocumentTableWithDelete
            hideRemove={x => this.allowedDocuments.indexOf(x.description!) < 0}
            onRemove={document => this.props.onDelete(editor.data, document)}
            documents={documents}
            qa="claim-supporting-documents"
          />
        ) : null}
      </ACC.Section>
    );
  }
}

const ClaimDocumentsContainer = (props: ClaimDocumentsPageParams & BaseProps) => {
  const stores = useStores();
  const { content } = useContent();
  const claimDocumentContent = useClaimDocumentContent();

  return (
    <ClaimDocumentsComponent
      content={claimDocumentContent}
      project={stores.projects.getById(props.projectId)}
      editor={stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId)}
      documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
      // TODO temporary measure until we get the description types from SF
      documentDescriptions={Pending.done(
        getAllEnumValues(DocumentDescription).map(x => ({
          id: x,
          label: content.claimDocuments.documents.labels.documentDescriptionLabel(x).content,
        })),
      )}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      onChange={(saving, dto) => {
        stores.messages.clearMessages();
        const successMessage = content.claimDocuments.documentMessages.getDocumentUploadedMessage(dto.files.length)
          .content;
        stores.claimDocuments.updateClaimDocumentsEditor(
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          successMessage,
        );
      }}
      onDelete={(dto, document) => {
        stores.messages.clearMessages();
        stores.claimDocuments.deleteClaimDocument(props.projectId, props.partnerId, props.periodId, dto, document);
      }}
      {...props}
    />
  );
};

export const ClaimDocumentsRoute = defineRoute({
  routeName: "claimDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/documents",
  container: ClaimDocumentsContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.claimDocuments.title(),
});
