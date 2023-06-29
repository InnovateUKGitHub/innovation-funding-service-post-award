import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Pending } from "@shared/pending";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { BaseProps, ContainerBase, defineRoute } from "../../containerBase";
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
  costCategoryId: string;
  periodId: PeriodId;
}

interface Data {
  project: Pending<ProjectDto>;
  costCategories: Pending<CostCategoryDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
}

interface CombinedData {
  project: ProjectDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

export class ClaimDetailDocumentsComponent extends ContainerBase<ClaimDetailDocumentsPageParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategories: this.props.costCategories,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents({ project, costCategories, documents, editor }: CombinedData) {
    const back = this.props.routes.prepareClaimLineItems.getLink({
      projectId: project.id,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId,
    });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId) || ({} as CostCategoryDto);
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
        pageTitle={<Title {...project} />}
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

        <Messages messages={this.props.messages} />

        <Section title={x => x.documentMessages.uploadTitle}>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            onSubmit={() => this.props.onChange(true, editor.data)}
            onChange={dto => this.props.onChange(false, dto)}
            qa="claimDetailDocuments"
          >
            <UploadForm.Fieldset>
              <DocumentGuidance />

              <UploadForm.Hidden name="description" value={dto => dto.description} />

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
            onRemove={document => this.props.onDelete(editor.data, document)}
            documents={documents}
          />
        </Section>
      </Page>
    );
  }
}

const ClaimDetailDocumentsContainer = (props: ClaimDetailDocumentsPageParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const handleOnChange: Callbacks["onChange"] = (saving, dto) => {
    stores.messages.clearMessages();
    const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length }));

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

  return (
    <ClaimDetailDocumentsComponent
      project={stores.projects.getById(props.projectId)}
      costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
      documents={stores.claimDetailDocuments.getClaimDetailDocuments(
        props.projectId,
        props.partnerId,
        props.periodId,
        props.costCategoryId,
      )}
      editor={stores.claimDetailDocuments.getClaimDetailDocumentsEditor(
        props.projectId,
        props.partnerId,
        props.periodId,
        props.costCategoryId,
        dto => (dto.description = DocumentDescription.Evidence),
      )}
      onChange={handleOnChange}
      onDelete={handleOnDelete}
      {...props}
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
    costCategoryId: route.params.costCategoryId,
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
