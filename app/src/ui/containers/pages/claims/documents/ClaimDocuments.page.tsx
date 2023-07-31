import { ProjectRole } from "@framework/constants/project";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { claimDocumentsQuery } from "./ClaimDocuments.query";
import { useClaimDocumentsQuery } from "./ClaimDocuments.logic";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { makeZodI18nMap } from "@shared/zodi18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { claimLevelUpload } from "@ui/zod/documentValidators.zod";
import { useForm } from "react-hook-form";
import { useContent } from "@ui/hooks/content.hook";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Select } from "@ui/components/atomicDesign/atoms/form/Select/Select";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { allowedClaimDocuments, useValidDocumentDropdownOptions } from "@framework/constants/documentDescription";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useZodErrors, useServerInput } from "@framework/api-helpers/useZodErrors";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { ClaimDocumentAdvice } from "./ClaimDocumentAdvice";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { useClearMessagesOnBlurOrChange } from "@framework/api-helpers/useClearMessagesOnBlurOrChange";
import { z } from "zod";

export interface ClaimDocumentsPageParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

const ClaimDocumentsPage = (props: ClaimDocumentsPageParams & BaseProps) => {
  const { projectId, partnerId, periodId } = props;
  const { getContent } = useContent();
  const onBlurOrChange = useClearMessagesOnBlurOrChange();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(claimDocumentsQuery, {
    projectId,
    partnerId,
    periodId,
  });

  const { claim, project, claimDocuments } = useClaimDocumentsQuery(
    { projectId, partnerId, periodId },
    refreshedQueryOptions,
  );

  // Form
  const { register, handleSubmit, formState, getFieldState, reset, setError } = useForm<
    z.output<typeof claimLevelUpload>
  >({
    resolver: zodResolver(claimLevelUpload, {
      errorMap: makeZodI18nMap({ keyPrefix: ["documents"] }),
    }),
  });

  const { onUpdate: onUploadUpdate, apiError: onUploadApiError } = useOnUpload({
    refresh() {
      refresh();
      reset();
    },
  });
  const { onUpdate: onDeleteUpdate, apiError: onDeleteApiError } = useOnDelete({ refresh });

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<typeof claimLevelUpload>>(setError, formState.errors);
  const defaults = useServerInput<z.output<typeof claimLevelUpload>>();

  const onChange = (dto: z.output<typeof claimLevelUpload>) => {
    onUploadUpdate({
      data: dto,
      context: dto,
    });
  };

  const onDelete = (doc: DocumentSummaryDto) => {
    onDeleteUpdate({
      data: { form: FormTypes.ClaimLevelDelete, documentId: doc.id, projectId, partnerId, periodId },
      context: doc,
    });
  };

  const documentDropdownOptions = useValidDocumentDropdownOptions(allowedClaimDocuments);

  // Disable completing the form if impact management and not received PCF
  const impMgmtPcfNotSubmittedForFinalClaim =
    project.impactManagementParticipation === ImpactManagementParticipation.Yes
      ? claim.isFinalClaim && claim.pcfStatus !== "Received"
      : false;

  return (
    <Page
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      backLink={
        <BackLink route={props.routes.prepareClaim.getLink({ partnerId, periodId, projectId })}>
          {getContent(x => x.pages.claimDocuments.backLink)}
        </BackLink>
      }
      projectStatus={project.status}
      validationErrors={allErrors}
      apiError={onUploadApiError ?? onDeleteApiError}
    >
      <Messages messages={props.messages} />

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
              <FileInput id="files" hasError={!!getFieldState("files").error} multiple {...register("files")} />
            </FormGroup>

            {/* Description selection */}
            <FormGroup hasError={!!getFieldState("description").error}>
              <Label htmlFor="description">{getContent(x => x.documentLabels.descriptionLabel)}</Label>
              <ValidationError error={getFieldState("description").error} />
              <Select id="description" defaultValue={defaults?.description} {...register("description")}>
                {documentDropdownOptions.map(x => (
                  <option value={x.value} key={x.id} data-qa={x.qa}>
                    {x.displayName}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </Fieldset>
          <Fieldset>
            <Button name="button_default" styling="Secondary" type="submit">
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
        />
      </Section>

      <Section qa="buttons">
        {claim.isFinalClaim ? (
          <Link
            styling="PrimaryButton"
            id="continue-claim"
            route={props.routes.claimSummary.getLink({ projectId, partnerId, periodId })}
          >
            {getContent(x => x.pages.claimDocuments.buttonSaveAndContinueToSummary)}
          </Link>
        ) : (
          <Link
            styling="PrimaryButton"
            id="continue-claim"
            route={props.routes.claimForecast.getLink({ projectId, partnerId, periodId })}
          >
            {getContent(x => x.pages.claimDocuments.buttonSaveAndContinueToForecast)}
          </Link>
        )}

        <Link
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
