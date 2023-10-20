import { DocumentDescription } from "@framework/constants/documentDescription";
import { BankDetailsTaskStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { ContainerBase, BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { useNavigate } from "react-router-dom";

export interface ProjectSetupBankStatementParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  project: ProjectDto;
  editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
  documents: DocumentSummaryDto[];
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

interface Callbacks {
  onChange: (submit: boolean, dto: PartnerDto) => void;
}

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();
const BankStatementForm = createTypedForm<PartnerDto>();
class ProjectSetupBankStatementComponent extends ContainerBase<ProjectSetupBankStatementParams, Data, Callbacks> {
  render() {
    const { project, documents, editor, documentsEditor } = this.props;
    const projectSetupParams = { projectId: this.props.projectId, partnerId: this.props.partnerId };
    const projectSetupRoute = this.props.routes.projectSetup.getLink(projectSetupParams);

    const backLinkElement = (
      <BackLink route={projectSetupRoute}>
        <Content value={x => x.pages.projectSetupBankStatement.backLink} />
      </BackLink>
    );
    return (
      <Page
        backLink={backLinkElement}
        error={editor.error}
        validator={[editor.validator, documentsEditor.validator]}
        pageTitle={<Title {...project} />}
      >
        <Messages messages={this.props.messages} />

        <Section qa="guidance">
          <Content markdown value={x => x.pages.projectSetupBankStatement.guidanceMessage} />
        </Section>

        <Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onFileChange(true, documentsEditor.data)}
            onChange={dto => this.props.onFileChange(false, dto)}
            qa="partnerDocumentUpload"
          >
            <UploadForm.Fieldset qa="documentGuidance">
              <UploadForm.Hidden name="description" value={() => DocumentDescription.BankStatement} />

              <DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={x => x.documentLabels.uploadInputLabel}
                name="attachment"
                labelHidden
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = DocumentDescription.BankStatement;
                }}
                validation={documentsEditor.validator.files}
              />
            </UploadForm.Fieldset>

            <UploadForm.Fieldset>
              <UploadForm.Button
                name="uploadFile"
                styling="Secondary"
                onClick={() => this.props.onFileChange(true, documentsEditor.data)}
              >
                <Content value={x => x.documentMessages.uploadTitle} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </Section>

        <Section>
          <DocumentEdit
            qa="setup-bank-statement-documents"
            onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </Section>

        <Section qa="submit-bank-statement">
          <BankStatementForm.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="submit-bank-statement-form"
          >
            <BankStatementForm.Fieldset>
              <BankStatementForm.Submit>
                <Content value={x => x.pages.projectSetupBankStatement.buttonSubmit} />
              </BankStatementForm.Submit>

              <Link
                styling="SecondaryButton"
                route={this.props.routes.projectSetup.getLink({
                  projectId: this.props.projectId,
                  partnerId: this.props.partnerId,
                })}
              >
                <Content value={x => x.pages.projectSetupBankStatement.buttonReturn} />
              </Link>
            </BankStatementForm.Fieldset>
          </BankStatementForm.Form>
        </Section>
      </Page>
    );
  }
}

const ProjectSetupBankStatementContainer = (props: ProjectSetupBankStatementParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    editor: stores.partners.getPartnerEditor(props.projectId, props.partnerId, dto => {
      dto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
    }),
    documents: stores.partnerDocuments.getPartnerDocuments(props.projectId, props.partnerId),
    documentsEditor: stores.partnerDocuments.getPartnerDocumentEditor(props.partnerId),
  });

  const onFileChange = (isSaving: boolean, dto: MultipleDocumentUploadDto) => {
    stores.messages.clearMessages();
    // show message if remaining on page
    const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length }));
    stores.partnerDocuments.updatePartnerDocumentsEditor(
      isSaving,
      props.projectId,
      props.partnerId,
      dto,
      successMessage,
    );
  };

  const onFileDelete = (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => {
    stores.messages.clearMessages();
    stores.partnerDocuments.deletePartnerDocumentsEditor(
      props.projectId,
      props.partnerId,
      dto,
      document,
      getContent(x => x.documentMessages.deletedDocument({ deletedFileName: document.fileName })),
    );
  };

  const onChange = (submit: boolean, dto: PartnerDto) => {
    stores.partners.updatePartner(submit, props.partnerId, dto, {
      onComplete: () => {
        navigate(props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId }).path);
      },
    });
  };

  return (
    <PageLoader
      pending={combined}
      render={x => (
        <ProjectSetupBankStatementComponent
          {...props}
          {...x}
          onFileChange={onFileChange}
          onFileDelete={onFileDelete}
          onChange={onChange}
        />
      )}
    />
  );
};

export const ProjectSetupBankStatementRoute = defineRoute<ProjectSetupBankStatementParams>({
  routeName: "projectSetupBankStatement",
  routePath: "/projects/:projectId/setup/:partnerId/bank-statement",
  container: ProjectSetupBankStatementContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectSetupBankStatement.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
