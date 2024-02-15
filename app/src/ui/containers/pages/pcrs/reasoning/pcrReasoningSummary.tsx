import { NavigationArrowsForPCRs } from "@ui/containers/pages/pcrs/navigationArrows";
import { PCRStepType, PCRItemStatus } from "@framework/constants/pcrConstants";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { useGetPcrTypeName } from "../utils/useGetPcrTypeName";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { useGetBackLink } from "./pcrReasoningWorkflow.logic";
import { getStepLink } from "./pcrReasoningWorkflow.page";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Checkbox, CheckboxList } from "@ui/components/atomicDesign/atoms/form/Checkbox/Checkbox";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { useContent } from "@ui/hooks/content.hook";
import { PcrReasoningSummarySchemaType, pcrReasoningErrorMap, pcrReasoningSummarySchema } from "./pcrReasoning.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { usePcrReasoningContext } from "./pcrReasoningContext";

export const PCRReasoningSummary = () => {
  const getPcrTypeName = useGetPcrTypeName();

  const {
    pcrId,
    projectId,
    project,
    messages,
    pcr,
    isFetching,
    apiError,
    onUpdate,
    mode,
    documents,
    routes,
    editableItemTypes,
    setMarkedAsCompleteHasBeenChecked,
  } = usePcrReasoningContext();

  const backLink = useGetBackLink();

  const { register, handleSubmit, watch, formState } = useForm<PcrReasoningSummarySchemaType>({
    defaultValues: {
      reasoningComments: pcr.reasoningComments,
      reasoningStatus: pcr.reasoningStatus === PCRItemStatus.Complete,
    },
    resolver: zodResolver(pcrReasoningSummarySchema, {
      errorMap: pcrReasoningErrorMap,
    }),
  });

  const { getContent } = useContent();

  const watchedCheckbox = watch("reasoningStatus");

  const validationErrors = useRhfErrors(formState?.errors);

  useEffect(() => {
    setMarkedAsCompleteHasBeenChecked(watchedCheckbox);
  }, [watchedCheckbox]);

  return (
    <Page
      apiError={apiError}
      validationErrors={validationErrors}
      backLink={backLink}
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
    >
      <Messages messages={messages} />
      <Section qa="reasoning-save-and-return">
        <Section>
          <SummaryList qa="pcr_reasoning">
            <SummaryListItem label={x => x.pcrLabels.requestNumber} content={pcr.requestNumber} qa="numberRow" />
            <SummaryListItem
              label={x => x.pcrLabels.types}
              content={<LineBreakList items={pcr.items.map(x => getPcrTypeName(x.shortName))} />}
              qa="typesRow"
            />
            <SummaryListItem
              id="reasoningComments"
              hasError={!!validationErrors?.reasoningComments}
              label={x => x.pcrReasoningLabels.comments}
              content={
                <SimpleString multiline verticalScrollbar>
                  {pcr.reasoningComments}
                </SimpleString>
              }
              qa="comments"
              // validation={editor.validator.reasoningComments}
              action={
                mode === "prepare" && (
                  <Link route={getStepLink(PCRStepType.reasoningStep, projectId, pcrId, routes)}>
                    <Content value={x => x.pages.pcrReasoningSummary.edit} />
                  </Link>
                )
              }
            />
            <SummaryListItem
              label={x => x.pcrReasoningLabels.files}
              content={
                documents.length ? (
                  <DocumentList documents={documents} qa="docs" />
                ) : (
                  <Content value={x => x.pages.pcrReasoningSummary.noDocuments} />
                )
              }
              qa="files"
              action={
                mode === "prepare" && (
                  <Link route={getStepLink(PCRStepType.filesStep, projectId, pcrId, routes)}>
                    <Content value={x => x.pages.pcrReasoningSummary.edit} />
                  </Link>
                )
              }
            />
          </SummaryList>
        </Section>

        {mode === "prepare" && (
          <Form
            onSubmit={handleSubmit(data => {
              return onUpdate({
                data: {
                  reasoningStatus: data.reasoningStatus ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
                },
                context: {
                  link: routes.pcrPrepare.getLink({
                    projectId,
                    pcrId,
                  }),
                },
              });
            })}
          >
            <Fieldset>
              <Legend>{getContent(x => x.pages.pcrWorkflowSummary.markAsCompleteLabel)}</Legend>
              <FormGroup>
                <CheckboxList name="reasoningStatus" register={register} disabled={isFetching}>
                  <Checkbox
                    defaultChecked={pcr.reasoningStatus === PCRItemStatus.Complete}
                    id="reasoning-status"
                    label={getContent(x => x.pages.pcrWorkflowSummary.agreeToChangeLabel)}
                  />
                </CheckboxList>
              </FormGroup>

              <FormGroup>
                <Button type="submit" disabled={isFetching}>
                  {getContent(x => x.pages.pcrWorkflowSummary.buttonSaveAndReturn)}
                </Button>
              </FormGroup>
            </Fieldset>
          </Form>
        )}
        {(mode === "review" || mode === "view") && (
          <NavigationArrowsForPCRs
            pcr={pcr}
            currentItem={null}
            isReviewing={mode === "review"}
            editableItemTypes={editableItemTypes}
            routes={routes}
          />
        )}
      </Section>
    </Page>
  );
};
