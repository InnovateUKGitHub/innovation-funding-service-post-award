import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentDescriptionDto, DocumentSummaryDto } from "@framework/dtos/documentDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { useContent } from "@ui/hooks/content.hook";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import {
  DocumentDescription,
  allowedClaimDocuments,
  getDocumentDescriptionContentSelector,
} from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm, DropdownOption } from "@ui/components/bjss/form/form";
import { UL, OL } from "@ui/components/atomicDesign/atoms/List/list";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";

type ClaimDocumentContent = ReturnType<typeof useClaimDocumentContent>;

/**
 * @returns {ClaimDocumentContent} content for the claim document page
 */
export function useClaimDocumentContent() {
  const { getContent } = useContent();

  return {
    backLink: getContent(x => x.pages.claimDocuments.backLink),
    descriptionLabel: getContent(x => x.pages.claimDocuments.descriptionLabel),
    buttonSaveAndReturn: getContent(x => x.pages.claimDocuments.buttonSaveAndReturn),
    documentsListSectionTitle: getContent(x => x.pages.claimDocuments.sectionTitleDocumentList),
    buttonSaveAndContinueToSummary: getContent(x => x.pages.claimDocuments.buttonSaveAndContinueToSummary),
    buttonSaveAndContinueToForecast: getContent(x => x.pages.claimDocuments.buttonSaveAndContinueToForecast),
    sbriDocumentAdvice: getContent(x => x.claimsMessages.sbriDocumentAdvice),
    sbriInvoiceBullet1: getContent(x => x.claimsMessages.sbriInvoiceBullet1),
    sbriInvoiceBullet2: getContent(x => x.claimsMessages.sbriInvoiceBullet2),
    sbriInvoiceBullet3: getContent(x => x.claimsMessages.sbriInvoiceBullet3),
    sbriMoAdvice: getContent(x => x.claimsMessages.sbriMoAdvice),
    finalClaim: getContent(x => x.claimsMessages.finalClaim),
    finalClaimGuidanceContent1: getContent(x => x.claimsMessages.finalClaimGuidanceContent1),
    finalClaimStep1: getContent(x => x.claimsMessages.finalClaimStep1),
    finalClaimStep2: getContent(x => x.claimsMessages.finalClaimStep2),
    iarRequired: getContent(x => x.claimsMessages.iarRequired),
    iarRequiredPara2: getContent(x => x.claimsMessages.iarRequiredPara2),
    iarRequiredAdvice: getContent(x => x.claimsMessages.iarRequiredAdvice),
    finalClaimIarAdvice: getContent(x => x.claimsMessages.finalClaimIarAdvice),
    finalClaimNonIarAdvice: getContent(x => x.claimsMessages.finalClaimNonIarAdvice),
    usefulTip: getContent(x => x.claimsMessages.usefulTip),
    requiredUploadAdvice: getContent(x => x.claimsMessages.requiredUploadAdvice),
    requiredUploadStep1: getContent(x => x.claimsMessages.requiredUploadStep1),
    requiredUploadStep2: getContent(x => x.claimsMessages.requiredUploadStep2),
    uploadTitle: getContent(x => x.documentMessages.uploadTitle),
    uploadDocuments: getContent(x => x.documentMessages.uploadDocuments),
    noDocumentsUploaded: getContent(x => x.documentMessages.noDocumentsUploaded),
  };
}

export interface ClaimDocumentsPageParams {
  projectId: ProjectId;
  periodId: PeriodId;
  partnerId: PartnerId;
}

interface ClaimDocumentsComponentProps extends ClaimDocumentsPageParams, BaseProps {
  projectId: ProjectId;
  content: ClaimDocumentContent;
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  claim: Pending<ClaimDto>;
  documentDescriptions: Pending<DocumentDescriptionDto[]>;
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

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
    const { isMo } = getAuthRoles(project.roles);

    // Disable completing the form if impact management and not received PCF
    const impMgmtPcfNotSubmittedForFinalClaim =
      project.impactManagementParticipation === ImpactManagementParticipation.Yes
        ? claim.isFinalClaim && claim.pcfStatus !== "Received"
        : false;

    const documentTypeOptions: DropdownOption[] = documentDescriptions
      .filter(x => {
        // Disallow uploading PCF if impact management
        if (
          claim.impactManagementParticipation === ImpactManagementParticipation.Yes &&
          x.id === DocumentDescription.ProjectCompletionForm
        )
          return false;
        if (isLoans && x.id === DocumentDescription.ProofOfSatisfiedConditions) return true;

        return allowedClaimDocuments.includes(x.id);
      })
      .map(x => ({ id: `${x.id}`, value: x.label }));

    const claimLinkParams = { projectId, partnerId, periodId };

    const prepareClaimLink = (
      <BackLink route={props.routes.prepareClaim.getLink(claimLinkParams)}>{content.backLink}</BackLink>
    );

    return (
      <Page
        pageTitle={<Title {...project} />}
        error={editor.error}
        validator={editor.validator}
        backLink={prepareClaimLink}
      >
        <Messages messages={props.messages} />

        {impMgmtPcfNotSubmittedForFinalClaim &&
          (isMo ? (
            <ValidationMessage
              messageType="info"
              message={<Content value={x => x.claimsMessages.moIarPcfMissingFinalClaim} markdown />}
            />
          ) : (
            <ValidationMessage
              messageType="info"
              message={<Content value={x => x.claimsMessages.applicantIarPcfMissingFinalClaim} markdown />}
            />
          ))}
        {claim.isFinalClaim && <ValidationMessage messageType="info" message={content.finalClaim} />}

        <Section>
          <ClaimDocumentAdvice {...claim} content={content} competitionType={project.competitionType} />
        </Section>

        <Section title={content.uploadTitle}>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            qa="claimDocumentsForm"
            onChange={dto => props.onChange(false, dto)}
          >
            <UploadForm.Fieldset>
              <DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={content.uploadDocuments}
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
                  data.description ? documentTypeOptions.find(x => x.id === data.description?.toString()) : undefined
                }
                update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
              />
            </UploadForm.Fieldset>

            {/* TODO: @documents-content make button label consistent*/}
            <UploadForm.Button styling="Secondary" name="upload" onClick={() => props.onChange(true, editor.data)}>
              {content.uploadDocuments}
            </UploadForm.Button>
          </UploadForm.Form>
        </Section>

        <Section title={content.documentsListSectionTitle}>
          <DocumentEdit
            hideHeader
            qa="claim-supporting-documents"
            documents={documents}
            onRemove={document => props.onDelete(editor.data, document)}
          />
        </Section>

        <Section qa="buttons">
          {claim.isFinalClaim ? (
            <Link
              styling="PrimaryButton"
              id="continue-claim"
              route={props.routes.claimSummary.getLink(claimLinkParams)}
            >
              {content.buttonSaveAndContinueToSummary}
            </Link>
          ) : (
            <Link
              styling="PrimaryButton"
              id="continue-claim"
              route={props.routes.claimForecast.getLink(claimLinkParams)}
            >
              {content.buttonSaveAndContinueToForecast}
            </Link>
          )}

          <Link styling="SecondaryButton" id="save-claim" route={getDashboardLink(project)}>
            {content.buttonSaveAndReturn}
          </Link>
        </Section>
      </Page>
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
    <PageLoader
      pending={combined}
      render={x => renderContents(x.project, x.editor, x.documents, x.claim, x.documentDescriptions)}
    />
  );
};

/**
 * ### useClaimDocumentDescriptions
 *
 * gets the claim document descriptions
 *
 * TODO Refactor and consume this via an api from SF
 */
function useClaimDocumentDescriptions(): Pending<DocumentDescriptionDto[]> {
  const { getContent } = useContent();
  const documentValues = getAllNumericalEnumValues(DocumentDescription);

  const claimDocumentDescriptions = documentValues.map(description => ({
    id: description,
    label: getContent(getDocumentDescriptionContentSelector(description)),
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
          x.documentMessages.uploadedDocuments({ count: dto.files.length }),
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
        stores.claimDocuments.deleteClaimDocument(
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          document,
          getContent(x => x.documentMessages.deletedDocument({ deletedFileName: document.fileName })),
        );
      }}
    />
  );
};

export const ClaimDocumentsRoute = defineRoute({
  routeName: "claimDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/documents",
  container: ClaimDocumentsContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId ?? "", 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimDocuments.title),
});

export interface ClaimDocumentAdviceProps
  extends Pick<ClaimDto, "isIarRequired" | "isFinalClaim" | "impactManagementParticipation"> {
  content: Pick<
    ClaimDocumentContent,
    | "iarRequiredAdvice"
    | "finalClaimIarAdvice"
    | "usefulTip"
    | "requiredUploadAdvice"
    | "requiredUploadStep1"
    | "requiredUploadStep2"
    | "finalClaimGuidanceContent1"
    | "finalClaimStep1"
    | "finalClaimStep2"
    | "iarRequired"
    | "iarRequiredPara2"
    | "sbriDocumentAdvice"
    | "sbriInvoiceBullet1"
    | "sbriInvoiceBullet2"
    | "sbriInvoiceBullet3"
    | "sbriMoAdvice"
  >;
  competitionType: string;
}

// Note: Consider refactoring to an object loop based on competitionType if this grows in complexity
/**
 * Displays claim document advice
 */
export function ClaimDocumentAdvice({
  content,
  isFinalClaim,
  isIarRequired,
  impactManagementParticipation,
  competitionType,
}: ClaimDocumentAdviceProps) {
  const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(competitionType);

  const getAdvice = () => {
    if (isKTP) {
      return (
        <>
          {isIarRequired && <SimpleString>{content.iarRequiredAdvice}</SimpleString>}
          {isFinalClaim && <SimpleString>{content.finalClaimIarAdvice}</SimpleString>}

          <SimpleString>{content.usefulTip}</SimpleString>

          <SimpleString>{content.requiredUploadAdvice}</SimpleString>

          <UL>
            <li>{content.requiredUploadStep1}</li>
            <li>{content.requiredUploadStep2}</li>
          </UL>
        </>
      );
    }

    if (isCombinationOfSBRI) {
      const competition = competitionType.replace(" ", "-").toLowerCase();

      return (
        <>
          {impactManagementParticipation !== ImpactManagementParticipation.Yes && (
            <>
              <SimpleString>{content.finalClaimGuidanceContent1}</SimpleString>
              <OL>
                <li>{content.finalClaimStep1}</li>
                <li>{content.finalClaimStep2}</li>
              </OL>
            </>
          )}

          {isIarRequired && <SimpleString>{content.iarRequired}</SimpleString>}

          <SimpleString qa={`${competition}-document-advice`}>{content.sbriDocumentAdvice}</SimpleString>

          <UL>
            <li>{content.sbriInvoiceBullet1}</li>
            <li>{content.sbriInvoiceBullet2}</li>
            <li>{content.sbriInvoiceBullet3}</li>
          </UL>

          <SimpleString qa={`${competition}-mo-advice`}>{content.sbriMoAdvice}</SimpleString>
        </>
      );
    }

    // Note: Final claim message is irrelevant if no iar is required - bail out early
    if (!isIarRequired && !isFinalClaim) return null;

    return (
      <>
        {isFinalClaim ? (
          <>
            {impactManagementParticipation !== ImpactManagementParticipation.Yes && (
              <>
                <SimpleString>{content.finalClaimGuidanceContent1}</SimpleString>
                <OL>
                  <li>{content.finalClaimStep1}</li>
                  <li>{content.finalClaimStep2}</li>
                </OL>
              </>
            )}

            {isIarRequired && (
              <>
                <SimpleString>{content.iarRequired}</SimpleString>
                <SimpleString>{content.iarRequiredPara2}</SimpleString>
              </>
            )}
          </>
        ) : (
          <>
            <SimpleString qa="iarText">{content.iarRequired}</SimpleString>
            <SimpleString>{content.iarRequiredPara2}</SimpleString>
          </>
        )}
      </>
    );
  };

  const adviceContent = getAdvice();

  return adviceContent ? <div data-qa="iarText">{adviceContent}</div> : null;
}
