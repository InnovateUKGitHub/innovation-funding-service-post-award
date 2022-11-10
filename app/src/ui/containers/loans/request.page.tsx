import { useNavigate } from "react-router-dom";
import { IEditorStore, useStores } from "@ui/redux";
import * as ACC from "@ui/components";

import { Pending } from "@shared/pending";
import { getPending } from "@ui/helpers/get-pending";
import { DocumentDescription } from "@framework/constants";
import { DocumentSummaryDto, LoanDto, MultipleDocumentUploadDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";
import { LoanDtoValidator } from "@ui/validators/loanValidator";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";

import { LoanRequestTable } from "./components/LoanTable";
import { Content } from "@ui/components";

export interface LoansRequestParams {
  projectId: string;
  loanId: string;
}

interface LoansRequestPageProps extends LoansRequestParams, BaseProps {
  projectId: string;
  loan: Required<LoanDto>;
  documents: DocumentSummaryDto[];
  loanEditor: IEditorStore<LoanDto, LoanDtoValidator>;
  loanDocsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onDocsChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDocsDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
  onLoanUpdate: (dto: LoanDto) => void;
}

const RequestForm = ACC.createTypedForm<MultipleDocumentUploadDto>();
const CommentsForm = ACC.createTypedForm<LoanDto>();

const LoansRequestPage = ({ loan, loanEditor, loanDocsEditor, documents, ...props }: LoansRequestPageProps) => {
  const { getContent } = useContent();

  const createPcrLink = <ACC.Link route={props.routes.pcrCreate.getLink({ projectId: props.projectId })}> </ACC.Link>;

  return (
    <>
      <ACC.Renderers.Messages messages={props.messages} />

      <ACC.Section>
        <ACC.Renderers.SimpleString>
          <Content value={x => x.pages.loansRequest.introduction} components={[createPcrLink]} />
        </ACC.Renderers.SimpleString>

        <LoanRequestTable {...loan} />
      </ACC.Section>

      <ACC.Section title={getContent(x => x.pages.loansRequest.uploadTitle)}>
        <ACC.Renderers.SimpleString>{getContent(x => x.pages.loansRequest.uploadIntro)}</ACC.Renderers.SimpleString>

        <RequestForm.Form
          qa="loanDocumentsForm"
          enctype="multipart"
          editor={loanDocsEditor}
          onChange={dto => props.onDocsChange(false, dto)}
          onSubmit={() => props.onDocsChange(true, loanDocsEditor.data)}
        >
          <RequestForm.Fieldset>
            <ACC.DocumentGuidance />

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
      </ACC.Section>

      <ACC.Section>
        <ACC.DocumentEdit
          qa="loan-documents"
          documents={documents}
          onRemove={document => props.onDocsDelete(loanDocsEditor.data, document)}
        />
      </ACC.Section>

      <ACC.Section>
        <CommentsForm.Form qa="summary-form" editor={loanEditor} onSubmit={() => props.onLoanUpdate(loanEditor.data)}>
          <CommentsForm.Fieldset heading={getContent(x => x.pages.loansRequest.commentTitle)}>
            <ACC.TextHint>{getContent(x => x.pages.loansRequest.commentHint)}</ACC.TextHint>

            <CommentsForm.MultilineString
              qa="info-text-area"
              name="comments"
              value={x => x.comments}
              update={(m, v) => (m.comments = v || "")}
              validation={loanEditor.validator.comments}
            />
          </CommentsForm.Fieldset>

          <CommentsForm.Fieldset heading={getContent(x => x.pages.loansRequest.loanDeclarationTitle)}>
            <ACC.Renderers.SimpleString>
              {getContent(x => x.pages.loansRequest.loanDeclaration)}
            </ACC.Renderers.SimpleString>
          </CommentsForm.Fieldset>

          <CommentsForm.Fieldset qa="save-buttons">
            <CommentsForm.Submit>{getContent(x => x.pages.loansRequest.loanSubmitButton)}</CommentsForm.Submit>
          </CommentsForm.Fieldset>
        </CommentsForm.Form>
      </ACC.Section>
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
    <ACC.BackLink route={props.routes.loansSummary.getLink({ projectId: props.projectId })}>
      {getContent(x => x.pages.loansRequest.backToLoanOverview)}
    </ACC.BackLink>
  );

  const pageTitleValue =
    !isLoading && payload ? (
      <ACC.Projects.Title {...payload.project} />
    ) : (
      <ACC.Renderers.SimpleString>{getContent(x => x.pages.loansRequest.loadingDrawdown)}</ACC.Renderers.SimpleString>
    );

  return (
    <ACC.Page
      pageTitle={pageTitleValue}
      backLink={isRejected ? undefined : backLinkElement}
      error={payload?.loanEditor.error}
      validator={payload?.loanEditor.validator}
    >
      {isRejected && (
        <ACC.Renderers.SimpleString>{getContent(x => x.pages.loansRequest.errorDrawdown)}</ACC.Renderers.SimpleString>
      )}

      {payload?.loan.totals && (
        <LoansRequestPage
          {...props}
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
              x.pages.loansRequest.loanDocumentsRemoved({ filename: document.fileName }),
            );

            stores.loanDocuments.deleteLoanDocument(props.projectId, props.loanId, dto, document, removedMessage);
          }}
          onDocsChange={(saving, dto) => {
            stores.messages.clearMessages();

            const uploadedMessage = getContent(x => x.pages.loansRequest.loanDocumentsUploaded({ count: dto.files }));

            stores.loanDocuments.updateLoanDocumentsEditor(saving, props.projectId, props.loanId, dto, uploadedMessage);
          }}
        />
      )}
    </ACC.Page>
  );
};

export const LoansRequestRoute = defineRoute<LoansRequestParams>({
  routeName: "loansRequest",
  routePath: "/loans/:projectId/:loanId",
  container: LoansRequestContainer,
  getParams: r => ({
    projectId: r.params.projectId,
    loanId: r.params.loanId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.loansRequest.title),
});
