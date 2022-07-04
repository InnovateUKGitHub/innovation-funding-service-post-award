import * as ACC from "@ui/components";
import { ClaimDto, ProjectDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { allowedClaimDocuments, DocumentDescription, ProjectRole } from "@framework/constants";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentDescriptionDto, DocumentSummaryDto } from "@framework/dtos/documentDto";
import { getAuthRoles } from "@framework/types";
import { DocumentEdit, DropdownOption } from "@ui/components";
import { getAllEnumValues } from "@shared/enumHelper";
import { useContent } from "@ui/hooks";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

type ClaimDocumentContentKeys =
  | "backLink"
  | "finalClaimMessage"
  | "uploadDocumentsLabel"
  | "descriptionLabel"
  | "documentsListSectionTitle"
  | "saveAndReturnButton"
  | "saveAndContinueToSummaryButton"
  | "finalClaimGuidanceParagraph1"
  | "finalClaimStep1"
  | "finalClaimStep2"
  | "iarRequiredAdvice"
  | "finalClaimIarAdvice"
  | "finalClaimNonIarAdvice"
  | "usefulTip"
  | "requiredUploadAdvice"
  | "requiredUploadStep1"
  | "requiredUploadStep2"
  | "iarRequired"
  | "sbriDocumentAdvice"
  | "sbriInvoiceBullet1"
  | "sbriInvoiceBullet2"
  | "sbriInvoiceBullet3"
  | "sbriMoAdvice"
  | "noDocumentsUploaded"
  | "saveAndContinueToForecastButton"
  | "uploadTitle";

type ClaimDocumentContent = Record<ClaimDocumentContentKeys, string>;

export function useClaimDocumentContent(): ClaimDocumentContent {
  const { getContent } = useContent();

  return {
    backLink: getContent(x => x.claimDocuments.backLink),
    descriptionLabel: getContent(x => x.claimDocuments.descriptionLabel),
    saveAndReturnButton: getContent(x => x.claimDocuments.saveAndReturnButton),
    documentsListSectionTitle: getContent(x => x.claimDocuments.documentsListSectionTitle),
    saveAndContinueToSummaryButton: getContent(x => x.claimDocuments.saveAndContinueToSummaryButton),
    saveAndContinueToForecastButton: getContent(x => x.claimDocuments.saveAndContinueToForecastButton),

    sbriDocumentAdvice: getContent(x => x.claimDocuments.messages.sbriDocumentAdvice),
    sbriInvoiceBullet1: getContent(x => x.claimDocuments.messages.sbriInvoiceBullet1),
    sbriInvoiceBullet2: getContent(x => x.claimDocuments.messages.sbriInvoiceBullet2),
    sbriInvoiceBullet3: getContent(x => x.claimDocuments.messages.sbriInvoiceBullet3),
    sbriMoAdvice: getContent(x => x.claimDocuments.messages.sbriMoAdvice),
    finalClaimMessage: getContent(x => x.claimDocuments.messages.finalClaimMessage),

    finalClaimGuidanceParagraph1: getContent(x => x.claimDocuments.messages.finalClaimGuidanceParagraph1),
    finalClaimStep1: getContent(x => x.claimDocuments.messages.finalClaimStep1),
    finalClaimStep2: getContent(x => x.claimDocuments.messages.finalClaimStep2),
    iarRequired: getContent(x => x.claimDocuments.messages.iarRequired),

    iarRequiredAdvice: getContent(x => x.claimDocuments.messages.iarRequiredAdvice),
    finalClaimIarAdvice: getContent(x => x.claimDocuments.messages.finalClaimIarAdvice),
    finalClaimNonIarAdvice: getContent(x => x.claimDocuments.messages.finalClaimNonIarAdvice),
    usefulTip: getContent(x => x.claimDocuments.messages.usefulTip),
    requiredUploadAdvice: getContent(x => x.claimDocuments.messages.requiredUploadAdvice),
    requiredUploadStep1: getContent(x => x.claimDocuments.messages.requiredUploadStep1),
    requiredUploadStep2: getContent(x => x.claimDocuments.messages.requiredUploadStep2),

    uploadTitle: getContent(x => x.claimDocuments.documentMessages.uploadTitle),
    uploadDocumentsLabel: getContent(x => x.claimDocuments.documentMessages.uploadDocumentsLabel),
    noDocumentsUploaded: getContent(x => x.claimDocuments.documentMessages.noDocumentsUploaded),
  };
}

export interface ClaimDocumentsPageParams {
  projectId: string;
  periodId: number;
  partnerId: string;
}

interface ClaimDocumentsComponentProps extends ClaimDocumentsPageParams, BaseProps {
  projectId: string;
  content: ClaimDocumentContent;
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  claim: Pending<ClaimDto>;
  documentDescriptions: Pending<DocumentDescriptionDto[]>;
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const ClaimDocumentsComponent = ({
  content,
  projectId,
  partnerId,
  periodId,
  ...props
}: ClaimDocumentsComponentProps) => {
  const renderContents = (
    project: ProjectDto,
    editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
    documents: DocumentSummaryDto[],
    claim: ClaimDto,
    documentDescriptions: DocumentDescriptionDto[],
  ) => {
    const { isLoans } = checkProjectCompetition(project.competitionType);
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    const documentTypeOptions: DropdownOption[] = documentDescriptions
      .filter(x => {
        const isLoanOption = isLoans && x.id === DocumentDescription.ProofOfSatisfiedConditions;
        const isAllowedClaimDocument = allowedClaimDocuments.includes(x.id);

        return isLoanOption || isAllowedClaimDocument;
      })
      .map(x => ({ id: `${x.id}`, value: x.label }));

    const claimLinkParams = { projectId, partnerId, periodId };

    const prepareClaimLink = (
      <ACC.BackLink route={props.routes.prepareClaim.getLink(claimLinkParams)}>{content.backLink}</ACC.BackLink>
    );

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title {...project} />}
        error={editor.error}
        validator={editor.validator}
        backLink={prepareClaimLink}
      >
        <ACC.Renderers.Messages messages={props.messages} />

        {claim.isFinalClaim && <ACC.ValidationMessage messageType="info" message={content.finalClaimMessage} />}

        <ACC.Section>
          <ClaimDocumentAdvice {...claim} content={content} competitionType={project.competitionType} />
        </ACC.Section>

        <ACC.Section title={content.uploadTitle}>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            qa="claimDocumentsForm"
            onChange={dto => props.onChange(false, dto)}
          >
            <UploadForm.Fieldset>
              <ACC.DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={content.uploadDocumentsLabel}
                labelHidden
                name="attachment"
                validation={editor.validator.files}
                value={data => data.files}
                update={(dto, files) => (dto.files = files || [])}
              />

              <UploadForm.DropdownList
                label={content.descriptionLabel}
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
              {content.uploadDocumentsLabel}
            </UploadForm.Button>
          </UploadForm.Form>
        </ACC.Section>

        <ACC.Section title={content.documentsListSectionTitle}>
          <DocumentEdit
            hideHeader
            qa="claim-supporting-documents"
            documents={documents}
            onRemove={document => props.onDelete(editor.data, document)}
          />
        </ACC.Section>

        <ACC.Section qa="buttons">
          {claim.isFinalClaim ? (
            <ACC.Link
              styling="PrimaryButton"
              id="continue-claim"
              route={props.routes.claimSummary.getLink(claimLinkParams)}
            >
              {content.saveAndContinueToSummaryButton}
            </ACC.Link>
          ) : (
            <ACC.Link
              styling="PrimaryButton"
              id="continue-claim"
              route={props.routes.claimForecast.getLink(claimLinkParams)}
            >
              {content.saveAndContinueToForecastButton}
            </ACC.Link>
          )}

          <ACC.Link styling="SecondaryButton" id="save-claim" route={getDashboardLink(project)}>
            {content.saveAndReturnButton}
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

// TODO Refactor and consume this via an api from SF
function useClaimDocumentDescriptions(): Pending<DocumentDescriptionDto[]> {
  const { getContent } = useContent();
  const documentValues = getAllEnumValues(DocumentDescription);

  const claimDocumentDescriptions = documentValues.map(description => ({
    id: description,
    label: getContent(x => x.claimDocuments.documents.labels.documentDescriptionLabel(description)),
  }));

  return Pending.done(claimDocumentDescriptions);
}

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
      documentDescriptions={useClaimDocumentDescriptions()}
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
    projectId: route.params.projectId ?? "",
    partnerId: route.params.partnerId ?? "",
    periodId: parseInt(route.params.periodId ?? "", 10),
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.claimDocuments.title(),
});

export interface ClaimDocumentAdviceProps extends Pick<ClaimDto, "isIarRequired" | "isFinalClaim"> {
  content: Pick<
    ClaimDocumentContent,
    | "iarRequiredAdvice"
    | "finalClaimIarAdvice"
    | "usefulTip"
    | "requiredUploadAdvice"
    | "requiredUploadStep1"
    | "requiredUploadStep2"
    | "finalClaimGuidanceParagraph1"
    | "finalClaimStep1"
    | "finalClaimStep2"
    | "iarRequired"
    | "sbriDocumentAdvice"
    | "sbriInvoiceBullet1"
    | "sbriInvoiceBullet2"
    | "sbriInvoiceBullet3"
    | "sbriMoAdvice"
  >;
  competitionType: string;
}

// Note: Consider refactoring to an object loop based on competitionType if this grows in complexity
export function ClaimDocumentAdvice({
  content,
  isFinalClaim,
  isIarRequired,
  competitionType,
}: ClaimDocumentAdviceProps) {
  const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(competitionType);

  const getAdvise = () => {
    if (isKTP) {
      return (
        <>
          {isIarRequired ? (
            <>
              <ACC.Renderers.SimpleString>{content.iarRequiredAdvice}</ACC.Renderers.SimpleString>

              {isFinalClaim && <ACC.Renderers.SimpleString>{content.finalClaimIarAdvice}</ACC.Renderers.SimpleString>}
            </>
          ) : (
            <>
              {isFinalClaim && <ACC.Renderers.SimpleString>{content.finalClaimIarAdvice}</ACC.Renderers.SimpleString>}
            </>
          )}

          <ACC.Renderers.SimpleString>{content.usefulTip}</ACC.Renderers.SimpleString>

          <ACC.Renderers.SimpleString>{content.requiredUploadAdvice}</ACC.Renderers.SimpleString>

          <ACC.UL>
            <li>{content.requiredUploadStep1}</li>
            <li>{content.requiredUploadStep2}</li>
          </ACC.UL>
        </>
      );
    }

    if (isCombinationOfSBRI) {
      const competition = competitionType.replace(" ", "-").toLowerCase();

      return (
        <>
          {isFinalClaim && (
            <>
              <ACC.Renderers.SimpleString>{content.finalClaimGuidanceParagraph1}</ACC.Renderers.SimpleString>

              <ACC.UL>
                <li>{content.finalClaimStep1}</li>
                <li>{content.finalClaimStep2}</li>
              </ACC.UL>
            </>
          )}

          {isIarRequired && <ACC.Renderers.SimpleString>{content.iarRequired}</ACC.Renderers.SimpleString>}

          <ACC.Renderers.SimpleString qa={`${competition}-document-advice`}>
            {content.sbriDocumentAdvice}
          </ACC.Renderers.SimpleString>

          <ACC.UL>
            <li>{content.sbriInvoiceBullet1}</li>
            <li>{content.sbriInvoiceBullet2}</li>
            <li>{content.sbriInvoiceBullet3}</li>
          </ACC.UL>

          <ACC.Renderers.SimpleString qa={`${competition}-mo-advice`}>
            {content.sbriMoAdvice}
          </ACC.Renderers.SimpleString>
        </>
      );
    }

    // Note: Final claim message is irrelevant if no iar is required - bail out early
    if (!isIarRequired && !isFinalClaim) return null;

    return (
      <>
        {isFinalClaim ? (
          <>
            <ACC.Renderers.SimpleString>{content.finalClaimGuidanceParagraph1}</ACC.Renderers.SimpleString>

            <ACC.OL>
              <li>{content.finalClaimStep1}</li>
              <li>{content.finalClaimStep2}</li>
            </ACC.OL>

            {isIarRequired && <ACC.Renderers.SimpleString>{content.iarRequired}</ACC.Renderers.SimpleString>}
          </>
        ) : (
          <ACC.Renderers.SimpleString qa="iarText">{content.iarRequired}</ACC.Renderers.SimpleString>
        )}
      </>
    );
  };

  const adviceContent = getAdvise();

  return adviceContent ? <div data-qa="iarText">{adviceContent}</div> : null;
}