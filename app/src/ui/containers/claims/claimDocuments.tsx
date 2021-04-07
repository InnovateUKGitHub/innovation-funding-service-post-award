import * as ACC from "@ui/components";
import { ClaimDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { DocumentDescription } from "@framework/constants";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentDescriptionDto, DocumentSummaryDto } from "@framework/dtos/documentDto";
import { getAuthRoles } from "@framework/types";
import { DropdownOption } from "@ui/components";
import { getAllEnumValues } from "@shared/enumHelper";
import { projectCompetition, useContent } from "@ui/hooks";
import { OL } from "@ui/components";

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

export interface ClaimDocumentsPageParams {
  projectId: string;
  periodId: number;
  partnerId: string;
}

interface ClaimDocumentsComponentProps extends ClaimDocumentsPageParams, BaseProps {
  content: ClaimDocumentContent;
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  claim: Pending<ClaimDto>;
  documentDescriptions: Pending<DocumentDescriptionDto[]>;
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const allowedClaimDocuments: Readonly<DocumentDescription[]> = [
  DocumentDescription.Evidence,
  DocumentDescription.EndOfProjectSurvey,
  DocumentDescription.IAR,
  DocumentDescription.LMCMinutes,
  DocumentDescription.ScheduleThree,
  DocumentDescription.StatementOfExpenditure,
];

const ClaimDocumentsComponent = ({
  content,
  projectId,
  partnerId,
  periodId,
  ...props
}: ClaimDocumentsComponentProps) => {
  const getIntroMessage = (competitionType: string) => {
    const ktpContent = content.getCompetitionContent(competitionType);

    if (!ktpContent) return null;

    const introList = [ktpContent.lmcMinutesMessage, ktpContent.virtualApprovalMessage];

    return (
      <>
        <ACC.Renderers.SimpleString>{ktpContent.uploadAndStoreMessage}</ACC.Renderers.SimpleString>

        <ACC.Renderers.SimpleString>{ktpContent.uploadGuidanceMessage}</ACC.Renderers.SimpleString>

        <OL className="govuk-!-margin-bottom-10">
          {introList.map(item => (
            <li key={item}>{item}</li>
          ))}
        </OL>

        <ACC.Renderers.SimpleString>{ktpContent.schedule3ReminderMessage}</ACC.Renderers.SimpleString>
      </>
    );
  };

  const renderContents = (
    project: ProjectDto,
    editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>,
    documents: DocumentSummaryDto[],
    claim: ClaimDto,
    documentDescriptions: DocumentDescriptionDto[],
  ) => {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    const ktpIntroContent = getIntroMessage(project.competitionType);

    const documentTypeOptions: DropdownOption[] = documentDescriptions
      .filter(x => allowedClaimDocuments.indexOf(x.id) >= 0)
      .map(x => ({ id: `${x.id}`, value: x.label }));

    const claimLinkParams = { projectId, partnerId, periodId };

    const prepareClaimLink = (
      <ACC.BackLink route={props.routes.prepareClaim.getLink(claimLinkParams)}>{content.default.backLink}</ACC.BackLink>
    );
    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title {...project} />}
        error={editor.error}
        validator={editor.validator}
        backLink={prepareClaimLink}
      >
        <ACC.Renderers.Messages messages={props.messages} />

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
            onChange={dto => props.onChange(false, dto)}
          >
            <UploadForm.Fieldset>
              <ACC.DocumentGuidance />

              <UploadForm.MulipleFileUpload
                label={content.default.uploadDocumentsLabel}
                labelHidden
                name="attachment"
                validation={editor.validator.files}
                value={data => data.files}
                update={(dto, files) => (dto.files = files || [])}
              />

              <UploadForm.DropdownList
                label={content.default.descriptionLabel}
                labelHidden={false}
                hasEmptyOption
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

            {/* TODO: @documents-content make button label consistent*/}
            <UploadForm.Button styling="Secondary" name="upload" onClick={() => props.onChange(true, editor.data)}>
              {content.default.uploadDocumentsLabel}
            </UploadForm.Button>
          </UploadForm.Form>
        </ACC.Section>

        <ACC.Section title={content.default.documentsListSectionTitle}>
          {documents.length ? (
            <ACC.Section subtitle={content.default.newWindow}>
              <ACC.DocumentTableWithDelete
                qa="claim-supporting-documents"
                documents={documents}
                onRemove={document => props.onDelete(editor.data, document)}
              />
            </ACC.Section>
          ) : (
            <ACC.Section>
              <ACC.ValidationMessage message={content.default.noDocumentsUploaded} messageType="info" />
            </ACC.Section>
          )}
        </ACC.Section>

        <ACC.Section qa="buttons">
          {claim.isFinalClaim ? (
            <ACC.Link
              styling="PrimaryButton"
              id="continue-claim"
              route={props.routes.claimSummary.getLink(claimLinkParams)}
            >
              {content.default.saveAndContinueToSummaryButton}
            </ACC.Link>
          ) : (
            <ACC.Link
              styling="PrimaryButton"
              id="continue-claim"
              route={props.routes.claimForecast.getLink(claimLinkParams)}
            >
              {content.default.saveAndContinueToForecastButton}
            </ACC.Link>
          )}

          <ACC.Link styling="SecondaryButton" id="save-claim" route={getDashboardLink(project)}>
            {content.default.saveAndReturnButton}
          </ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  };

  const getDashboardLink = (project: ProjectDto) => {
    const { isPmOrMo } = getAuthRoles(project.roles);

    return isPmOrMo
      ? props.routes.allClaimsDashboard.getLink({ projectId })
      : props.routes.claimsDashboard.getLink({ projectId, partnerId });
  };

  const combined = Pending.combine({
    project: props.project,
    editor: props.editor,
    documents: props.documents,
    claim: props.claim,
    documentDescriptions: props.documentDescriptions,
  });

  return (
    <ACC.PageLoader
      pending={combined}
      render={x => renderContents(x.project, x.editor, x.documents, x.claim, x.documentDescriptions)}
    />
  );
};

const ClaimDocumentsContainer = (props: ClaimDocumentsPageParams & BaseProps) => {
  const stores = useStores();
  const claimDocumentContent = useClaimDocumentContent();
  const { getContent } = useContent();

  return (
    <ClaimDocumentsComponent
      {...props}
      content={claimDocumentContent}
      project={stores.projects.getById(props.projectId)}
      editor={stores.claimDocuments.getClaimDocumentsEditor(props.projectId, props.partnerId, props.periodId)}
      documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
      // TODO temporary measure until we get the description types from SF
      documentDescriptions={Pending.done(
        getAllEnumValues(DocumentDescription).map(description => ({
          id: description,
          label: getContent(x => x.claimDocuments.documents.labels.documentDescriptionLabel(description)),
        })),
      )}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      onChange={(saving, dto) => {
        stores.messages.clearMessages();

        const successfullyUploadedMessage = getContent(x =>
          x.claimDocuments.documentMessages.getDocumentUploadedMessage(dto.files.length),
        );

        stores.claimDocuments.updateClaimDocumentsEditor(
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          successfullyUploadedMessage,
        );
      }}
      onDelete={(dto, document) => {
        stores.messages.clearMessages();
        stores.claimDocuments.deleteClaimDocument(props.projectId, props.partnerId, props.periodId, dto, document);
      }}
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
