import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { getPending } from "@ui/helpers/get-pending";
import { useContent } from "@ui/hooks/content.hook";
import { LoanDtoValidator } from "@ui/validators/loanValidator";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { LoanRequestTable } from "./components/LoanTable";
import { getAuthRoles } from "@framework/types/authorisation";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { LoanDto } from "@framework/dtos/loanDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/content";
import { DocumentGuidance } from "@ui/components/documents/DocumentGuidance";
import { DocumentEdit, DocumentView } from "@ui/components/documents/DocumentView";
import { createTypedForm } from "@ui/components/form";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { TextHint } from "@ui/components/layout/textHint";
import { BackLink, Link } from "@ui/components/links";
import { Title } from "@ui/components/projects/title";
import { Messages } from "@ui/components/renderers/messages";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

export interface LoansRequestParams {
  projectId: ProjectId;
  loanId: LoanId;
}

interface LoansRequestPageProps extends LoansRequestParams, BaseProps {
  projectId: ProjectId;
  project: ProjectDto;
  loan: Required<LoanDto>;
  documents: DocumentSummaryDto[];
  loanEditor: IEditorStore<LoanDto, LoanDtoValidator>;
  loanDocsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onDocsChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDocsDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
  onLoanUpdate: (dto: LoanDto) => void;
}

const RequestForm = createTypedForm<MultipleDocumentUploadDto>();
const CommentsForm = createTypedForm<LoanDto>();

const LoansRequestPage = ({
  project,
  loan,
  loanEditor,
  loanDocsEditor,
  documents,
  ...props
}: LoansRequestPageProps) => {
  const { getContent } = useContent();
  const { isFc, isPm } = getAuthRoles(project.roles);

  const createPcrLink = <Link route={props.routes.pcrCreate.getLink({ projectId: props.projectId })}> </Link>;

  return (
    <>
      <Messages messages={props.messages} />

      <Section>
        <SimpleString>
          {isFc && <Content value={x => x.pages.loansRequest.financeContactIntroduction} />}
          {isPm && (
            <Content value={x => x.pages.loansRequest.projectManagerIntroduction} components={[createPcrLink]} />
          )}
        </SimpleString>

        <LoanRequestTable {...loan} />
      </Section>

      {isFc && (
        <Section title={getContent(x => x.pages.loansRequest.uploadTitle)}>
          <SimpleString>{getContent(x => x.pages.loansRequest.uploadIntro)}</SimpleString>

          <RequestForm.Form
            qa="loanDocumentsForm"
            enctype="multipart"
            editor={loanDocsEditor}
            onChange={dto => props.onDocsChange(false, dto)}
            onSubmit={() => props.onDocsChange(true, loanDocsEditor.data)}
          >
            <RequestForm.Fieldset>
              <DocumentGuidance />

              <RequestForm.MultipleFileUpload
                name="attachment"
                labelHidden
                label={getContent(x => x.pages.loansRequest.uploadFormLabel)}
                validation={loanDocsEditor.validator.files}
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = DocumentDescription.Loan;
                }}
              />
            </RequestForm.Fieldset>

            <RequestForm.Button
              styling="Secondary"
              name="loan-document-upload"
              onClick={() => props.onDocsChange(true, loanDocsEditor.data)}
            >
              {getContent(x => x.pages.loansRequest.uploadFormButton)}
            </RequestForm.Button>
          </RequestForm.Form>
        </Section>
      )}

      <Section>
        {isFc ? (
          <DocumentEdit
            qa="loan-documents-editor"
            documents={documents}
            onRemove={document => props.onDocsDelete(loanDocsEditor.data, document)}
          />
        ) : (
          <DocumentView qa="loan-documents-viewer" documents={documents} />
        )}
      </Section>

      {isFc && (
        <>
          <Section>
            <CommentsForm.Form
              qa="summary-form"
              editor={loanEditor}
              onSubmit={() => props.onLoanUpdate(loanEditor.data)}
            >
              <CommentsForm.Fieldset heading={getContent(x => x.pages.loansRequest.commentTitle)}>
                <TextHint>{getContent(x => x.pages.loansRequest.commentHint)}</TextHint>

                <CommentsForm.MultilineString
                  qa="info-text-area"
                  name="comments"
                  value={x => x.comments}
                  update={(m, v) => (m.comments = v || "")}
                  validation={loanEditor.validator.comments}
                />
              </CommentsForm.Fieldset>

              <CommentsForm.Fieldset heading={getContent(x => x.pages.loansRequest.loanDeclarationTitle)}>
                <SimpleString>{getContent(x => x.pages.loansRequest.loanDeclaration)}</SimpleString>
              </CommentsForm.Fieldset>

              <CommentsForm.Fieldset qa="save-buttons">
                <CommentsForm.Submit>{getContent(x => x.pages.loansRequest.loanSubmitButton)}</CommentsForm.Submit>
              </CommentsForm.Fieldset>
            </CommentsForm.Form>
          </Section>
        </>
      )}
    </>
  );
};

const LoansRequestContainer = (props: BaseProps & LoansRequestParams) => {
  const stores = useStores();
  const { getContent } = useContent();

  const projectPending = stores.projects.getById(props.projectId);
  const loanPending = stores.loans.get(props.projectId, props.loanId);
  const loanEditorPending = stores.loans.getLoanEditor(props.projectId, props.loanId);
  const loanDocsEditorPending = stores.loanDocuments.getLoanDocumentsEditor(props.projectId, props.loanId);
  const documentsPending = stores.loanDocuments.getLoanDocuments(props.projectId, props.loanId);

  const loanRequestPendings = Pending.combine({
    project: projectPending,
    loan: loanPending,
    loanEditor: loanEditorPending,
    loanDocsEditor: loanDocsEditorPending,
    documents: documentsPending,
  });

  const { isLoading, isRejected, payload } = getPending(loanRequestPendings);
  const navigate = useNavigate();

  const backLinkElement = (
    <BackLink route={props.routes.loansSummary.getLink({ projectId: props.projectId })}>
      {getContent(x => x.pages.loansRequest.backToLoanOverview)}
    </BackLink>
  );

  const pageTitleValue =
    !isLoading && payload ? (
      <Title {...payload.project} />
    ) : (
      <SimpleString>{getContent(x => x.pages.loansRequest.loadingDrawdown)}</SimpleString>
    );

  return (
    <Page
      pageTitle={pageTitleValue}
      backLink={isRejected ? undefined : backLinkElement}
      error={payload?.loanEditor.error ?? payload?.loanDocsEditor.error}
      validator={[payload?.loanEditor.validator, payload?.loanDocsEditor.validator]}
    >
      {isRejected && <SimpleString>{getContent(x => x.pages.loansRequest.errorDrawdown)}</SimpleString>}

      {payload?.loan.totals && (
        <LoansRequestPage
          {...props}
          project={payload.project}
          loan={payload.loan as Required<LoanDto>}
          loanEditor={payload.loanEditor}
          loanDocsEditor={payload.loanDocsEditor}
          documents={payload.documents}
          onLoanUpdate={dto => {
            stores.loans.updateLoanEditor(props.projectId, props.loanId, dto, undefined, () => {
              const loansOverviewLink = props.routes.loansSummary.getLink({ projectId: props.projectId });
              navigate(loansOverviewLink.path);
            });
          }}
          onDocsDelete={(dto, document) => {
            const removedMessage = getContent(x =>
              x.pages.loansRequest.loanDocumentsRemoved({ fileName: document.fileName }),
            );

            stores.loanDocuments.deleteLoanDocument(props.projectId, props.loanId, dto, document, removedMessage);
          }}
          onDocsChange={(saving, dto) => {
            stores.messages.clearMessages();

            const uploadedMessage = getContent(x =>
              x.pages.loansRequest.loanDocumentsUploaded({
                firstFileName: dto.files[0]?.fileName,
                count: dto.files.length,
              }),
            );

            stores.loanDocuments.updateLoanDocumentsEditor(saving, props.projectId, props.loanId, dto, uploadedMessage);
          }}
        />
      )}
    </Page>
  );
};

export const LoansRequestRoute = defineRoute<LoansRequestParams>({
  routeName: "loansRequest",
  routePath: "/loans/:projectId/:loanId",
  container: LoansRequestContainer,
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    loanId: r.params.loanId as LoanId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.loansRequest.title),
});
