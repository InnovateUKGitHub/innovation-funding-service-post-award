import { useContent } from "@ui/hooks/content.hook";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit, DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { useLoanRequestData, useOnUpdateLoanRequest } from "./loanRequest.logic";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { TBody, TD, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { FullNumericDate } from "@ui/components/atomicDesign/atoms/Date";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoanLevelUploadSchemaType, getLoanLevelUpload } from "@ui/zod/documentValidators.zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { loanRequestQuery } from "./LoanRequest.query";
import { FormTypes } from "@ui/zod/FormTypes";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { useMessages } from "@framework/api-helpers/useMessages";
import { useOnDelete } from "@framework/api-helpers/onFileDelete";
import { useOnUpload } from "@framework/api-helpers/onFileUpload";
import { LoanRequestSchemaType, loanRequestErrorMap, loanRequestSchema } from "./loanRequest.zod";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { head } from "lodash";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { useEffect } from "react";

export interface LoansRequestParams {
  projectId: ProjectId;
  loanId: LoanId;
}

const LoansRequestPage = (props: BaseProps & LoansRequestParams) => {
  const [refreshedQueryOptions, refresh] = useRefreshQuery(loanRequestQuery, {
    projectId: props.projectId,
    loanId: props.loanId,
  });
  const { fragmentRef, project, loans, documents } = useLoanRequestData(
    props.projectId,
    props.loanId,
    refreshedQueryOptions,
  );
  const { getContent } = useContent();
  const { isFc } = project.roles;

  const config = useClientConfig();
  const { clearMessages } = useMessages();

  const {
    register: registerDocumentForm,
    handleSubmit: handleDocumentSubmit,
    formState: documentFormState,
    getFieldState,
    // watch: watchFiles,
    reset,
  } = useForm<z.output<LoanLevelUploadSchemaType>>({
    resolver: zodResolver(getLoanLevelUpload({ config: config.options }), {
      errorMap: makeZodI18nMap({ keyPrefix: ["documents"] }),
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

  const loan = head(loans);
  if (loans.length > 1) {
    throw new Error("expected only one loan but received multiple");
  }

  if (!loan) {
    throw new Error("could not find a matching loan");
  }

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    setError,
    formState,
    trigger,
    getFieldState: getFormFieldState,
  } = useForm<z.output<LoanRequestSchemaType>>({
    defaultValues: {
      comments: loan?.comments ?? "",
      attachmentsCount: documents.length,
      form: FormTypes.LoanRequest,
    },
    resolver: zodResolver(loanRequestSchema, { errorMap: loanRequestErrorMap }),
  });

  const characterCount = watch("comments").length;

  const loansOverviewLink = props.routes.loansSummary.getLink({ projectId: props.projectId });

  const { onUpdate, isFetching } = useOnUpdateLoanRequest(props.projectId, props.loanId, loan, loansOverviewLink.path);
  const disabled = isDeleting || isUploading || isFetching;
  const documentValidationErrors = useZodErrors(setError, documentFormState?.errors);
  const formValidationErrors = useZodErrors(setError, formState?.errors);
  const validationErrors = {
    ...formValidationErrors,
    ...documentValidationErrors,
  };

  // force validation that there is at least one document uploaded, and revalidate after submitted
  useEffect(() => {
    setValue("attachmentsCount", documents.length);
    if (formState.isSubmitted) {
      trigger();
    }
  }, [documents.length]);

  return (
    <Page
      backLink={
        <BackLink route={props.routes.loansSummary.getLink({ projectId: props.projectId })}>
          {getContent(x => x.pages.loansRequest.backToLoanOverview)}{" "}
        </BackLink>
      }
      fragmentRef={fragmentRef}
      validationErrors={validationErrors}
    >
      <Messages messages={props.messages} />

      <Section>
        {project.roles.isFc && <P>{getContent(x => x.pages.loansRequest.financeContactIntroduction)}</P>}
        {project.roles.isPm && (
          <P>
            <Content
              value={x => x.pages.loansRequest.projectManagerIntroduction}
              components={[
                <Link key="link" route={props.routes.pcrCreate.getLink({ projectId: props.projectId })}>
                  {" "}
                </Link>,
              ]}
            />
          </P>
        )}
      </Section>

      <Section>
        <Table>
          <THead>
            <TR>
              <TH>{getContent(x => x.pages.loansRequest.drawdownPeriodLabel)}</TH>
              <TH>{getContent(x => x.pages.loansRequest.dueDate)}</TH>
              <TH numeric>{getContent(x => x.pages.loansRequest.drawdownForecast)}</TH>
              <TH numeric>{getContent(x => x.pages.loansRequest.totalLoan)}</TH>
              <TH numeric>{getContent(x => x.pages.loansRequest.drawdownToDate)}</TH>
              <TH numeric>{getContent(x => x.pages.loansRequest.drawdownAmount)}</TH>
              <TH numeric>{getContent(x => x.pages.loansRequest.remainingLoan)}</TH>
            </TR>
          </THead>
          <TBody>
            {loans.map(x => (
              <TR key={x.period}>
                <TD>{x.period}</TD>
                <TD>
                  <FullNumericDate value={x.requestDate} />
                </TD>
                <TD numeric>
                  <Currency value={x.forecastAmount} />
                </TD>
                <TD numeric>
                  <Currency value={x.totals.totalLoan} />
                </TD>
                <TD numeric>
                  <Currency value={x.totals.totalPaidToDate} />
                </TD>
                <TD bold numeric>
                  <Currency value={x.amount} />
                </TD>
                <TD numeric>
                  <Currency value={x.totals.remainingLoan} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Section>
      {isFc && (
        <Section>
          <H2>{getContent(x => x.pages.loansRequest.uploadTitle)}</H2>
          <P>{getContent(x => x.pages.loansRequest.uploadIntro)}</P>
          <DocumentGuidance />

          <Form
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleDocumentSubmit(data => onFileUpload({ data }), clearMessages)}
            aria-disabled={disabled}
          >
            <Fieldset>
              <input type="hidden" value={DocumentDescription.Loan} {...registerDocumentForm("description")}></input>
              <input type="hidden" value={props.projectId} {...registerDocumentForm("projectId")} />
              <input type="hidden" value={props.loanId} {...registerDocumentForm("loanId")} />
              <input type="hidden" value={FormTypes.LoanLevelUpload} {...registerDocumentForm("form")} />

              <FormGroup hasError={!!getFieldState("files").error}>
                <ValidationError error={getFieldState("files").error} />
                <ValidationError error={getFormFieldState("attachmentsCount").error} />
                <FileInput
                  disabled={disabled}
                  id="files"
                  hasError={!!getFieldState("files").error}
                  multiple
                  {...registerDocumentForm("files")}
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
      )}

      <Section>
        {isFc ? (
          <DocumentEdit
            qa="prepare-item-file-for-partner-documents"
            onRemove={doc =>
              onFileDelete({
                data: {
                  form: FormTypes.LoanLevelDelete,
                  documentId: doc.id,
                  projectId: props.projectId,
                  loanId: props.loanId,
                },
                context: doc,
              })
            }
            documents={documents}
            formType={FormTypes.LoanLevelDelete}
            disabled={disabled}
          />
        ) : (
          <DocumentView qa="loan-documents-viewer" documents={documents} />
        )}
      </Section>

      {isFc && (
        <Section>
          <Form onSubmit={handleSubmit(data => onUpdate({ data }))}>
            <input type="hidden" value={FormTypes.LoanRequest} {...register("form")} />
            <input type="hidden" value={documents.length} {...register("attachmentsCount")} />

            <Fieldset>
              <Legend>{getContent(x => x.pages.loansRequest.commentTitle)}</Legend>
              <TextAreaField
                id="comments"
                {...register("comments")}
                error={getFormFieldState("comments").error as RhfError}
                defaultValue={loan.comments ?? ""}
                characterCountMax={32768}
                characterCount={characterCount}
                characterCountType="ascending"
                hint={getContent(x => x.pages.loansRequest.commentHint)}
                disabled={disabled}
              />
            </Fieldset>

            <Fieldset>
              <Legend>{getContent(x => x.pages.loansRequest.loanDeclarationTitle)}</Legend>
              <P>{getContent(x => x.pages.loansRequest.loanDeclaration)}</P>
            </Fieldset>

            <Fieldset>
              <Button type="submit" disabled={disabled}>
                {getContent(x => x.pages.loansRequest.loanSubmitButton)}
              </Button>
            </Fieldset>
          </Form>
        </Section>
      )}
    </Page>
  );
};

export const LoansRequestRoute = defineRoute<LoansRequestParams>({
  routeName: "loansRequest",
  routePath: "/loans/:projectId/:loanId",
  container: LoansRequestPage,
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    loanId: r.params.loanId as LoanId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.loansRequest.title),
});
