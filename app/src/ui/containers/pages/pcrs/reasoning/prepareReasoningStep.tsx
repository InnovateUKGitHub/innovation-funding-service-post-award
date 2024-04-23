import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { useContent } from "@ui/hooks/content.hook";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { useForm } from "react-hook-form";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useGetBackLink, useNextReasoningLink } from "./pcrReasoningWorkflow.logic";
import {
  PcrReasoningSchema,
  PcrReasoningSchemaType,
  pcrReasoningErrorMap,
  pcrReasoningSchema,
} from "./pcrReasoning.zod";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { PcrItemListSection } from "./pcrReasoningWorkflow.page";
import { zodResolver } from "@hookform/resolvers/zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { usePcrReasoningContext } from "./pcrReasoningContext";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { z } from "zod";

export const PCRPrepareReasoningStep = () => {
  const { pcr, isFetching, onUpdate, messages, fragmentRef, apiError, markedAsCompleteHasBeenChecked } =
    usePcrReasoningContext();

  const { register, watch, handleSubmit, formState, trigger, setError } = useForm<PcrReasoningSchemaType>({
    defaultValues: {
      reasoningComments: pcr.reasoningComments ?? "",
      markedAsComplete: markedAsCompleteHasBeenChecked,
      form: FormTypes.PcrPrepareReasoningStep,
    },
    resolver: zodResolver(pcrReasoningSchema, {
      errorMap: pcrReasoningErrorMap,
    }),
  });

  const { getContent } = useContent();

  const nextLink = useNextReasoningLink();

  const backLink = useGetBackLink();

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const validationErrors = useZodErrors<z.output<PcrReasoningSchema>>(setError, formState.errors);

  return (
    <Page validationErrors={validationErrors} backLink={backLink} fragmentRef={fragmentRef} apiError={apiError}>
      <Messages messages={messages} />
      <PcrItemListSection />
      <Section data-qa="reasoning-save-and-return">
        <Form
          onSubmit={handleSubmit(data =>
            onUpdate({ data: { ...data, reasoningStatus: PCRItemStatus.Incomplete }, context: { link: nextLink } }),
          )}
        >
          <input type="hidden" value={FormTypes.PcrPrepareReasoningStep} {...register("form")} />
          <input type="hidden" value={String(markedAsCompleteHasBeenChecked)} {...register("markedAsComplete")} />
          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrReasoningPrepareReasoning.headingReasoning)}</Legend>
            <TextAreaField
              {...register("reasoningComments")}
              id="reasoning_comments"
              hint={getContent(x => x.pages.pcrReasoningPrepareReasoning.hint)}
              disabled={isFetching}
              characterCount={watch("reasoningComments")?.length ?? 0}
              data-qa="reason"
              characterCountType="descending"
              characterCountMax={32_000}
              aria-label={getContent(x => x.pages.pcrReasoningPrepareReasoning.headingReasoning)}
              rows={15}
              defaultValue={pcr.reasoningComments ?? ""}
            />
          </Fieldset>

          <Fieldset>
            <Button type="submit" name="reasoningStep" disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};
