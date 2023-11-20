import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Pending } from "@shared/pending";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { BaseProps, defineRoute } from "../../containerBase";
import { useStores } from "@ui/redux/storesProvider";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";

export interface ClaimDetailDocumentsPageParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  costCategoryId: CostCategoryId;
  periodId: PeriodId;
}

interface CombinedData {
  project: Pick<ProjectDto, "competitionType" | "id" | "title" | "projectNumber">;
  costCategories: Pick<CostCategoryDto, "id" | "name">[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

export const ClaimDetailDocumentsComponent = (
  props: ClaimDetailDocumentsPageParams & CombinedData & Callbacks & BaseProps,
) => {
  const { project, costCategories, documents, editor } = props;
  const back = props.routes.prepareClaimLineItems.getLink({
    projectId: project.id,
    partnerId: props.partnerId,
    periodId: props.periodId,
    costCategoryId: props.costCategoryId,
  });
  const costCategory = costCategories.find(x => x.id === props.costCategoryId) || ({} as CostCategoryDto);
  const { isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);

  return (
    <Page
      backLink={
        <BackLink route={back}>
          <Content value={x => x.documentMessages.backLink({ previousPage: costCategory.name })} />
        </BackLink>
      }
      error={editor.error}
      validator={editor.validator}
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
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

      <Section title={x => x.documentMessages.uploadTitle}>
        <UploadForm.Form
          enctype="multipart"
          editor={editor}
          onSubmit={() => props.onChange(true, editor.data)}
          onChange={dto => props.onChange(false, dto)}
          qa="claimDetailDocuments"
        >
          <UploadForm.Fieldset>
            <DocumentGuidance />

            <UploadForm.Hidden name="description" value={() => DocumentDescription.Evidence} />

            <UploadForm.MultipleFileUpload
              label={x => x.documentMessages.uploadDocuments}
              labelHidden
              name="attachment"
              validation={editor.validator.files}
              value={data => data.files}
              update={(dto, files) => (dto.files = files || [])}
            />
          </UploadForm.Fieldset>

          <UploadForm.Submit>
            <Content value={x => x.documentMessages.uploadDocuments} />
          </UploadForm.Submit>
        </UploadForm.Form>
      </Section>

      <Section className="govuk-!-margin-bottom-4">
        <DocumentEdit
          qa="supporting-documents"
          onRemove={document => props.onDelete(editor.data, document)}
          documents={documents}
        />
      </Section>
    </Page>
  );
};

const ClaimDetailDocumentsContainer = (props: ClaimDetailDocumentsPageParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const handleOnChange: Callbacks["onChange"] = (saving, dto) => {
    stores.messages.clearMessages();
    const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length }));
    dto.description = DocumentDescription.Evidence;
    stores.claimDetailDocuments.updateClaimDetailDocumentsEditor(
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
      dto,
      successMessage,
    );
  };

  const handleOnDelete: Callbacks["onDelete"] = (dto, document) => {
    stores.messages.clearMessages();
    stores.claimDetailDocuments.deleteClaimDetailDocumentsEditor(
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
      dto,
      document,
      getContent(x => x.documentMessages.deletedDocument({ deletedFileName: document.fileName })),
    );
  };

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    costCategories: stores.costCategories.getAllFiltered(props.partnerId),
    documents: stores.claimDetailDocuments.getClaimDetailDocuments(
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
    ),
    editor: stores.claimDetailDocuments.getClaimDetailDocumentsEditor(
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
      dto => (dto.description = DocumentDescription.Evidence),
    ),
  });

  return (
    <PageLoader
      pending={combined}
      render={data => (
        <ClaimDetailDocumentsComponent onChange={handleOnChange} onDelete={handleOnDelete} {...data} {...props} />
      )}
    />
  );
};

export const ClaimDetailDocumentsRoute = defineRoute({
  routeName: "claimDetailDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId/documents",
  container: ClaimDetailDocumentsContainer,
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
