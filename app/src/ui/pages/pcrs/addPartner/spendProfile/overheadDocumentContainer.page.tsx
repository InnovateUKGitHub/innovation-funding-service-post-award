import { DocumentDescription } from "@framework/constants/documentDescription";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { DocumentGuidance } from "@ui/components/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/organisms/documents/DocumentView/DocumentView";
import { useContent } from "@ui/hooks/content.hook";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atoms/form/FileInput/FileInput";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { useForm } from "react-hook-form";
import { PcrLevelUploadSchemaType, documentsErrorMap, getPcrLevelUpload } from "@ui/zod/documentValidators.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { usePcrFilesQuery } from "../../filesStep/filesStep.logic";
import { pcrFilesQuery } from "../../filesStep/PcrFiles.query";
import { z } from "zod";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { FormTypes } from "@ui/zod/FormTypes";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { useMessages } from "@framework/api-helpers/useMessages";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { useSpendProfileCostsQuery } from "./spendProfileCosts.logic";
import { BackLink } from "@ui/components/atoms/Links/links";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useOnSavePcrItem } from "../../pcrItemWorkflow.logic";
import { noop } from "lodash";
import { ProjectRole } from "@framework/constants/project";
import { H2, H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { LinksList } from "@ui/components/atoms/LinksList/linksList";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { Messages } from "@ui/components/molecules/Messages/messages";

export interface OverheadDocumentsPageParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  costCategoryId: CostCategoryId;
}

const OverheadDocumentsComponent = (props: OverheadDocumentsPageParams & BaseProps) => {
  const { getContent } = useContent();
  const { pcrId, itemId, projectId, routes, costCategoryId } = props;

  const { spendProfile, fragmentRef } = useSpendProfileCostsQuery(
    projectId,
    itemId,
    costCategoryId,
    undefined,
    undefined,
  );

  const cost = spendProfile.costs.find(x => x.costCategoryId === costCategoryId);
  if (!cost) throw new Error(`Cannot find cost matching ${costCategoryId}`);
  const back = routes.pcrPrepareSpendProfileEditCost.getLink({
    projectId,
    pcrId,
    itemId,
    costCategoryId,
    costId: cost.id,
  });

  const [refreshedQueryOptions, refresh] = useRefreshQuery(pcrFilesQuery, {
    projectId,
    pcrItemId: itemId,
  });

  const { documents } = usePcrFilesQuery(projectId, itemId, refreshedQueryOptions);

  const {
    register,
    handleSubmit: handleDocumentSubmit,
    formState,
    getFieldState,
    reset,
  } = useForm<z.output<PcrLevelUploadSchemaType>>({
    resolver: zodResolver(getPcrLevelUpload({ config: props.config.options }), {
      errorMap: documentsErrorMap,
    }),
  });

  const { onUpdate: onFileDelete, isProcessing: isDeleting } = useOnDelete({
    async onSuccess() {
      await refresh();
      reset();
    },
  });

  const { onUpdate: onFileUpload, isProcessing: isUploading } = useOnUpload({
    async onSuccess() {
      await refresh();
      reset();
    },
  });

  const { handleSubmit: handleFormSubmit } = useForm<{}>({
    defaultValues: {},
  });

  const { onUpdate, isFetching } = useOnSavePcrItem(
    projectId,
    pcrId,
    itemId,
    noop,
    undefined,
    undefined,
    PCRItemType.PartnerAddition,
  );

  const validationErrors = useRhfErrors(formState?.errors);

  const disabled = isFetching || isDeleting || isUploading;

  const { clearMessages } = useMessages();

  return (
    <Page
      backLink={
        <BackLink route={back}>
          <Content value={x => x.pages.pcrSpendProfileCostsSummary.backLink} />
        </BackLink>
      }
      validationErrors={validationErrors}
      fragmentRef={fragmentRef}
    >
      <Messages messages={props.messages} />
      <Section>
        <H2>{getContent(x => x.pages.pcrSpendProfileOverheadDocuments.guidanceHeading)}</H2>
        <Content markdown value={x => x.pages.pcrSpendProfileOverheadDocuments.guidanceDocumentUpload} />
      </Section>
      <Section>
        <H3>{getContent(x => x.pages.pcrSpendProfileOverheadDocuments.headingTemplate)}</H3>
        <LinksList
          data-qa="template-link"
          links={[{ text: "Overhead calculation spreadsheet", url: "/ifspa-assets/pcr_templates/overheads.ods" }]}
        />
      </Section>
      <Section>
        <Form
          encType="multipart/form-data"
          onSubmit={handleDocumentSubmit(data => onFileUpload({ data }), clearMessages)}
          aria-disabled={disabled}
        >
          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrSpendProfileOverheadDocuments.documentUploadHeading)}</Legend>
            <input
              type="hidden"
              value={DocumentDescription.OverheadCalculationSpreadsheet}
              {...register("description")}
            ></input>
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={itemId} {...register("projectChangeRequestIdOrItemId")} />
            <input type="hidden" value={FormTypes.PcrLevelUpload} {...register("form")} />

            <DocumentGuidance />
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
          </Fieldset>

          <Fieldset>
            <FormGroup>
              <Button type="submit" secondary disabled={disabled}>
                {getContent(x => x.pcrItem.uploadDocumentsButton)}
              </Button>
            </FormGroup>
          </Fieldset>
        </Form>
      </Section>

      <Section>
        <DocumentEdit
          qa="prepare-item-file-for-partner-documents"
          onRemove={doc =>
            onFileDelete({
              data: {
                form: FormTypes.PcrLevelDelete,
                documentId: doc.id,
                projectId,
                projectChangeRequestIdOrItemId: itemId,
              },
              context: doc,
            })
          }
          documents={documents}
          formType={FormTypes.PcrLevelDelete}
          disabled={disabled}
        />
      </Section>
      <Form
        onSubmit={handleFormSubmit(data =>
          onUpdate({
            data,
            context: { link: back },
          }),
        )}
      >
        <Fieldset>
          <Button disabled={disabled} type="submit">
            {getContent(x => x.pages.pcrSpendProfileOverheadDocuments.buttonSubmit)}
          </Button>
        </Fieldset>
      </Form>
    </Page>
  );
};

export const PCRSpendProfileOverheadDocumentRoute = defineRoute<OverheadDocumentsPageParams>({
  routeName: "pcrSpendProfileOverheadDocument",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/documents",
  container: OverheadDocumentsComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileOverheadDocuments.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
