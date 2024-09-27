import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useClearMessagesOnBlurOrChange } from "@framework/api-helpers/useClearMessagesOnBlurOrChange";
import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { allowedClaimDocuments, allowedImpactManagementClaimDocuments } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atoms/Button/Button";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atoms/form/FileInput/FileInput";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { Select } from "@ui/components/atoms/form/Select/Select";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { Content } from "@ui/components/molecules/Content/content";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { DocumentGuidance } from "@ui/components/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/organisms/documents/DocumentView/DocumentView";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useValidDocumentDropdownOptions } from "@ui/hooks/useValidDocumentDropdownOptions.hook";
import { getClaimDetailsStatusType } from "@ui/components/organisms/claims/ClaimDetailsLink/claimDetailsLink";
import { FormTypes } from "@ui/zod/FormTypes";
import { ClaimLevelUploadSchemaType, documentsErrorMap, getClaimLevelUpload } from "@ui/zod/documentValidators.zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ClaimDocumentAdvice } from "./ClaimDocumentAdvice";
import { useClaimDocumentsQuery } from "./ClaimDocuments.logic";
import { claimDocumentsQuery } from "./ClaimDocuments.query";

export interface ClaimDocumentsPageParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

const ClaimDocumentsPage = (props: ClaimDocumentsPageParams & BaseProps) => {
  const { projectId, partnerId, periodId } = props;
  const { getContent } = useContent();
  const onBlurOrChange = useClearMessagesOnBlurOrChange();
  const config = useClientConfig();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(claimDocumentsQuery, {
    projectId,
    partnerId,
    periodId,
  });

  const { claim, project, partner, claimDocuments, fragmentRef } = useClaimDocumentsQuery(
    { projectId, partnerId, periodId },
    refreshedQueryOptions,
  );

  const isNonEditable = getClaimDetailsStatusType({ project, partner, claim }) !== "edit";

  // Form
  const { register, handleSubmit, formState, getFieldState, reset, setError } = useForm<
    z.output<ClaimLevelUploadSchemaType>
  >({
    resolver: zodResolver(getClaimLevelUpload({ config: config.options, project }), {
      errorMap: documentsErrorMap,
    }),
  });

  const {
    onUpdate: onUploadUpdate,
    apiError: onUploadApiError,
    isProcessing: onUploadProcessing,
  } = useOnUpload({
    async onSuccess() {
      await refresh();
      reset();
    },
  });
  const {
    onUpdate: onDeleteUpdate,
    apiError: onDeleteApiError,
    isProcessing: onDeleteProcessing,
  } = useOnDelete({ onSuccess: refresh });

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<ClaimLevelUploadSchemaType>>(setError, formState.errors);
  const defaults = useServerInput<z.output<ClaimLevelUploadSchemaType>>();

  const onChange = (dto: z.output<ClaimLevelUploadSchemaType>) =>
    onUploadUpdate({
      data: dto,
      context: dto,
    });

  const onDelete = (doc: DocumentSummaryDto) =>
    onDeleteUpdate({
      data: { form: FormTypes.ClaimLevelDelete, documentId: doc.id, projectId, partnerId, periodId },
      context: doc,
    });

  // If Impact Management is enabled, change the set of document upload options
  const documentDropdownOptions = useValidDocumentDropdownOptions(
    project.impactManagementParticipation === ImpactManagementParticipation.Yes
      ? allowedImpactManagementClaimDocuments
      : allowedClaimDocuments,
  );

  // Disable completing the form if impact management and not received PCF
  const impMgmtPcfNotSubmittedForFinalClaim =
    project.impactManagementParticipation === ImpactManagementParticipation.Yes &&
    claim.isFinalClaim &&
    claim.pcfStatus !== "Received";

  const disabled = onUploadProcessing || onDeleteProcessing || isNonEditable;

  return (
    <Page
      backLink={
        <BackLink route={props.routes.prepareClaim.getLink({ partnerId, periodId, projectId })} disabled={disabled}>
          {getContent(x => x.pages.claimDocuments.backLink)}
        </BackLink>
      }
      partnerId={partnerId}
      validationErrors={allErrors}
      apiError={onUploadApiError ?? onDeleteApiError}
      fragmentRef={fragmentRef}
    >
      <Messages messages={props.messages} />
      {isNonEditable && (
        <ValidationMessage message={getContent(x => x.pages.claimPrepare.readonlyMessage)} messageType="info" />
      )}

      {impMgmtPcfNotSubmittedForFinalClaim &&
        (project.roles.isMo ? (
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

      {claim.isFinalClaim && (
        <ValidationMessage messageType="info" message={getContent(x => x.claimsMessages.finalClaim)} />
      )}

      <ClaimDocumentAdvice {...claim} competitionType={project.competitionType} />

      <Section title={getContent(x => x.documentMessages.uploadTitle)}>
        <DocumentGuidance />
        <Form
          onBlur={onBlurOrChange}
          onChange={onBlurOrChange}
          onSubmit={handleSubmit(onChange)}
          method="POST"
          encType="multipart/form-data"
          aria-disabled={disabled}
        >
          <Fieldset>
            {/* Discriminate between upload button/delete button */}
            <input type="hidden" value={FormTypes.ClaimLevelUpload} {...register("form")} />
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={partnerId} {...register("partnerId")} />
            <input type="hidden" value={periodId} {...register("periodId")} />

            {/* File uploads */}
            <FormGroup hasError={!!getFieldState("files").error}>
              <ValidationError error={getFieldState("files").error} />
              <FileInput
                disabled={disabled}
                id="files"
                hasError={!!getFieldState("files").error}
                multiple
                {...register("files")}
              />
            </FormGroup>

            {/* Description selection */}
            <FormGroup hasError={!!getFieldState("description").error}>
              <Label htmlFor="description">{getContent(x => x.documentLabels.descriptionLabel)}</Label>
              <ValidationError error={getFieldState("description").error} />
              <Select
                disabled={disabled}
                id="description"
                defaultValue={defaults?.description}
                {...register("description")}
              >
                {documentDropdownOptions.map(x => (
                  <option value={x.value} key={x.id} data-qa={x.qa}>
                    {x.displayName}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </Fieldset>
          <Fieldset>
            <Button disabled={disabled} name="button_default" styling="Secondary" type="submit">
              {getContent(x => x.documentMessages.uploadDocuments)}
            </Button>
          </Fieldset>
        </Form>
      </Section>

      <Section
        title={getContent(x => x.documentLabels.documentDisplayTitle)}
        subtitle={getContent(x => x.documentLabels.documentDisplaySubTitle)}
      >
        <DocumentEdit
          hideHeader
          hideSubtitle
          qa="claim-documents"
          onRemove={onDelete}
          documents={claimDocuments}
          formType={FormTypes.ClaimLevelDelete}
          disabled={disabled}
        />
      </Section>

      <Section qa="buttons">
        {claim.isFinalClaim ? (
          <Link
            disabled={disabled}
            styling="PrimaryButton"
            id="continue-claim"
            route={props.routes.claimSummary.getLink({ projectId, partnerId, periodId })}
          >
            {getContent(x => x.pages.claimDocuments.buttonSaveAndContinueToSummary)}
          </Link>
        ) : (
          <Link
            disabled={disabled}
            styling="PrimaryButton"
            id="continue-claim"
            route={props.routes.claimForecast.getLink({ projectId, partnerId, periodId })}
          >
            {getContent(x => x.pages.claimDocuments.buttonSaveAndContinueToForecast)}
          </Link>
        )}

        <Link
          disabled={disabled}
          styling="SecondaryButton"
          id="save-claim"
          route={
            project.roles.isPm || project.roles.isMo
              ? props.routes.allClaimsDashboard.getLink({ projectId })
              : props.routes.claimsDashboard.getLink({ projectId, partnerId })
          }
        >
          {getContent(x => x.pages.claimDocuments.buttonSaveAndReturn)}
        </Link>
      </Section>
    </Page>
  );
};

export const ClaimDocumentsRoute = defineRoute({
  routeName: "claimDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/documents",
  container: ClaimDocumentsPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId ?? "", 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimDocuments.title),
});
