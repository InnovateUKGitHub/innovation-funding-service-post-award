import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { BaseProps, defineRoute } from "../../containerBase";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";
import { useClearMessagesOnBlurOrChange } from "@framework/api-helpers/useClearMessagesOnBlurOrChange";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { useClaimDetailDocumentsQuery } from "./claimDetailDocuments.logic";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";
import { ClaimDetailLevelUploadSchemaType, getClaimDetailLevelUpload } from "@ui/zod/documentValidators.zod";
import { z } from "zod";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { claimDetailDocumentsQuery } from "./ClaimDetailDocuments.query";

export interface ClaimDetailDocumentsPageParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  costCategoryId: CostCategoryId;
  periodId: PeriodId;
}

const ClaimDetailDocumentsPage = (props: ClaimDetailDocumentsPageParams & BaseProps) => {
  const { projectId, partnerId, periodId, costCategoryId } = props;
  const { getContent } = useContent();
  const onBlurOrChange = useClearMessagesOnBlurOrChange();
  const config = useClientConfig();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(claimDetailDocumentsQuery, {
    projectId,
    projectIdStr: projectId,
    partnerId,
    periodId,
    costCategoryId,
  });

  const { project, claimDocuments, costCategories } = useClaimDetailDocumentsQuery(
    { projectId, partnerId, periodId, costCategoryId },
    refreshedQueryOptions,
  );

  const costCategory = costCategories.find(x => x.id === props.costCategoryId) || ({} as CostCategoryDto);
  const { isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);

  const { register, handleSubmit, formState, getFieldState, reset, setError } = useForm<
    z.output<ClaimDetailLevelUploadSchemaType>
  >({
    resolver: zodResolver(getClaimDetailLevelUpload({ config: config.options, project }), {
      errorMap: makeZodI18nMap({ keyPrefix: ["documents"] }),
    }),
  });

  console.log("errors", formState?.errors);

  const {
    onUpdate: onUploadUpdate,
    apiError: onUploadApiError,
    isFetching: onUploadFetching,
  } = useOnUpload({
    onSuccess() {
      refresh();
      reset();
    },
  });
  const {
    onUpdate: onDeleteUpdate,
    apiError: onDeleteApiError,
    isFetching: onDeleteFetching,
  } = useOnDelete({ onSuccess: refresh });

  const isFetching = onUploadFetching || onDeleteFetching;

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<ClaimDetailLevelUploadSchemaType>>(setError, formState.errors);

  const onChange = (dto: z.output<ClaimDetailLevelUploadSchemaType>) => {
    onUploadUpdate({
      data: dto,
      context: dto,
    });
  };

  const onDelete = (doc: DocumentSummaryDto) => {
    onDeleteUpdate({
      data: {
        form: FormTypes.ClaimDetailLevelDelete,
        documentId: doc.id,
        projectId,
        partnerId,
        periodId,
        costCategoryId,
      },
      context: doc,
    });
  };

  return (
    <Page
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      backLink={
        <BackLink
          route={props.routes.prepareClaimLineItems.getLink({
            projectId,
            partnerId,
            periodId,
            costCategoryId,
          })}
        >
          <Content value={x => x.documentMessages.backLink({ previousPage: costCategory.name })} />
        </BackLink>
      }
      projectStatus={project.status}
      validationErrors={allErrors}
      apiError={onUploadApiError ?? onDeleteApiError}
    >
      {isCombinationOfSBRI ? (
        <>
          <SimpleString qa="sbriDocumentGuidance">
            <Content
              value={x => x.claimsMessages.sbriDocumentDetailGuidance({ costCategoryName: costCategory.name })}
            />
          </SimpleString>
          <SimpleString qa="sbriSupportingDocumentGuidance">
            <Content value={x => x.claimsMessages.sbriSupportingDocumentGuidance} />
          </SimpleString>
        </>
      ) : (
        <SimpleString qa="guidanceText">
          <Content value={x => x.claimsMessages.documentDetailGuidance} />
        </SimpleString>
      )}

      <Messages messages={props.messages} />

      <Section title={getContent(x => x.documentMessages.uploadTitle)}>
        <DocumentGuidance />
        <Form
          onBlur={onBlurOrChange}
          onChange={onBlurOrChange}
          onSubmit={handleSubmit(onChange)}
          method="POST"
          encType="multipart/form-data"
          aria-disabled={isFetching}
        >
          <Fieldset>
            {/* Discriminate between upload button/delete button */}
            <input type="hidden" value={FormTypes.ClaimDetailLevelUpload} {...register("form")} />
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={partnerId} {...register("partnerId")} />
            <input type="hidden" value={periodId} {...register("periodId")} />
            <input type="hidden" value={costCategoryId} {...register("costCategoryId")} />
            <input type="hidden" value={DocumentDescription.Evidence} {...register("description")} />
            {/* File uploads */}
            <FormGroup hasError={!!getFieldState("files").error}>
              <ValidationError error={getFieldState("files").error} />
              <FileInput
                disabled={isFetching}
                id="files"
                hasError={!!getFieldState("files").error}
                multiple
                {...register("files")}
              />
            </FormGroup>
          </Fieldset>
          <Fieldset>
            <Button disabled={isFetching} name="button_default" styling="Secondary" type="submit">
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
    </Page>
  );
};

export const ClaimDetailDocumentsRoute = defineRoute({
  routeName: "claimDetailDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId/documents",
  container: ClaimDetailDocumentsPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add documents for ${costCatName}` : "Add documents",
      displayTitle: costCatName ? `${costCatName} documents` : "Claim documents",
    };
  },
});
