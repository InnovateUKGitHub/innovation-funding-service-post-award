import { useZodErrors, useServerInput } from "@framework/api-helpers/useZodErrors";
import { allowedProjectLevelDocuments } from "@framework/constants/documentDescription";
import { DocumentSummaryDto, PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentsErrorMap, getProjectLevelUpload, ProjectLevelUploadSchemaType } from "@ui/zod/documentValidators.zod";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Select } from "@ui/components/atomicDesign/atoms/form/Select/Select";
import { H2, H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import {
  DocumentEdit,
  PartnerDocumentEdit,
} from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getCurrentPartnerName } from "@ui/helpers/getCurrentPartnerName";
import { useContent } from "@ui/hooks/content.hook";
import { useForm } from "react-hook-form";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { useProjectDocumentsQuery, useValidPartnerDropdownOptions } from "./projectDocuments.logic";
import { projectDocumentsQuery } from "./ProjectDocuments.query";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useClearMessagesOnBlurOrChange } from "@framework/api-helpers/useClearMessagesOnBlurOrChange";
import { z } from "zod";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { useValidDocumentDropdownOptions } from "@ui/hooks/useValidDocumentDropdownOptions.hook";
import { ProjectRole } from "@framework/constants/project";

export interface ProjectDocumentPageParams {
  projectId: ProjectId;
}

const ProjectDocumentsPage = (props: ProjectDocumentPageParams & BaseProps) => {
  const [refreshedQueryOptions, refresh] = useRefreshQuery(projectDocumentsQuery, { projectId: props.projectId });
  const { getContent } = useContent();
  const onBlurOrChange = useClearMessagesOnBlurOrChange();
  const config = useClientConfig();

  // GraphQL data loading
  const { project, partners, partnerDocuments, projectDocuments, fragmentRef } = useProjectDocumentsQuery(
    props.projectId,
    refreshedQueryOptions,
  );

  // Form
  const { register, handleSubmit, formState, getFieldState, reset, setError } = useForm<
    z.output<ProjectLevelUploadSchemaType>
  >({
    resolver: zodResolver(getProjectLevelUpload(config.options), {
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
  const allErrors = useZodErrors<z.output<ProjectLevelUploadSchemaType>>(setError, formState.errors);
  const defaults = useServerInput<z.output<ProjectLevelUploadSchemaType>>();

  const onChange = (dto: z.output<ProjectLevelUploadSchemaType>) =>
    onUploadUpdate({
      data: dto,
      context: dto,
    });

  const onDelete = (doc: DocumentSummaryDto | PartnerDocumentSummaryDtoGql) => {
    if ("partnerId" in doc) {
      onDeleteUpdate({
        data: {
          form: FormTypes.PartnerLevelDelete,
          documentId: doc.id,
          projectId: project.id,
          partnerId: doc.partnerId,
        },
        context: doc,
      });
    } else {
      onDeleteUpdate({
        data: { form: FormTypes.ProjectLevelDelete, documentId: doc.id, projectId: project.id },
        context: doc,
      });
    }
  };

  const { isMo: isProjectMo } = getAuthRoles(project.roles);
  const partnerName = getCurrentPartnerName(partners);
  const validUploadPartners = isProjectMo
    ? partners
    : partners.filter(partner => partner.roles.isFc || partner.roles.isMo || partner.roles.isPm);

  const documentDropdownOptions = useValidDocumentDropdownOptions(allowedProjectLevelDocuments);
  const partnerOptions = useValidPartnerDropdownOptions(partners);

  const canSelectMultiplePartners = isProjectMo || validUploadPartners.length > 1;
  const disabled = onUploadProcessing || onDeleteProcessing;

  return (
    <Page
      backLink={<ProjectBackLink projectId={project.id} disabled={disabled} />}
      validationErrors={allErrors}
      apiError={onUploadApiError ?? onDeleteApiError}
      fragmentRef={fragmentRef}
    >
      <Messages messages={props.messages} />

      <Section>
        {isProjectMo ? (
          <Content markdown value={x => x.documentMessages.monitoringOfficerDocumentsIntroMessage} />
        ) : (
          <Content markdown value={x => x.documentMessages.otherRoleDocumentsIntroMessage({ partnerName })} />
        )}
      </Section>

      <Section>
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
            <input type="hidden" value={FormTypes.ProjectLevelUpload} {...register("form")} />
            <input type="hidden" value={project.id} {...register("projectId")} />

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

            {/* Monitoring officers or FC/PMs that are assigned to more than one partner */}
            {canSelectMultiplePartners && (
              <FormGroup hasError={!!getFieldState("partnerId").error}>
                <Label htmlFor="partnerId">{getContent(x => x.documentLabels.participantLabel)}</Label>
                <ValidationError error={getFieldState("partnerId").error} />
                <Select
                  disabled={disabled}
                  id="partnerId"
                  defaultValue={defaults?.partnerId}
                  {...register("partnerId")}
                >
                  {partnerOptions.map(x => (
                    <option value={x.value} key={x.id} data-qa={x.qa}>
                      {x.displayName}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            )}

            {/* FC/PMs that are only allowed to select a single partner */}
            {!canSelectMultiplePartners && (
              <input type="hidden" value={validUploadPartners[0]?.id} {...register("partnerId")} />
            )}

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
      <Section>
        <H2>
          <Content value={x => x.documentLabels.documentDisplayTitle} />
        </H2>

        <SimpleString>
          <Content value={x => x.documentLabels.documentDisplaySubTitle} />
        </SimpleString>

        {isProjectMo && (
          <>
            <H3>
              <Content value={x => x.pages.projectDocuments.projectLevelSubtitle} />
            </H3>

            <DocumentEdit
              hideHeader
              hideSubtitle
              qa="project-documents"
              onRemove={document => onDelete(document)}
              documents={projectDocuments}
              formType={FormTypes.ProjectLevelDelete}
              disabled={disabled}
            />
          </>
        )}

        <H3>
          {isProjectMo ? (
            <Content value={x => x.pages.projectDocuments.partnerLevelSubtitle} />
          ) : (
            <Content
              value={x =>
                x.pages.projectDocuments.partnerSelfLevelSubtitle({
                  partnerName: getCurrentPartnerName(partners),
                })
              }
            />
          )}
        </H3>

        <PartnerDocumentEdit
          hideHeader
          hideSubtitle
          qa="partner-documents"
          onRemove={document => onDelete(document)}
          documents={partnerDocuments}
          project={project}
          disabled={disabled}
          formType={FormTypes.PartnerLevelDelete}
        />
      </Section>
    </Page>
  );
};

export const ProjectDocumentsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocumentsPage,
  getParams: route => ({ projectId: route.params.projectId as ProjectId }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectDocuments.title),
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
