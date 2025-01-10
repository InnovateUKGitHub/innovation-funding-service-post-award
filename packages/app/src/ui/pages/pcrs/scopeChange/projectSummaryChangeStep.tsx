import { Info } from "@ui/components/atoms/Details/Details";
import { Section } from "@ui/components/atoms/Section/Section";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { Content } from "@ui/components/molecules/Content/content";
import { useContent } from "@ui/hooks/content.hook";
import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextAreaField } from "@ui/components/molecules/form/TextFieldArea/TextAreaField";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PcrPage } from "../pcrPage";
import { useNextLink } from "../utils/useNextLink";
import { useOnUpdateScopeChange, useScopeChangeWorkflowQuery } from "./scopeChange.logic";
import {
  PcrScopeChangeProjectSummarySchemaType,
  getPcrScopeChangeProjectSummarySchema,
  scopeChangeErrorMap,
} from "./scopeChange.zod";

export const ProjectSummaryChangeStep = () => {
  const { projectId, itemId, fetchKey, getRequiredToCompleteMessage, markedAsCompleteHasBeenChecked } =
    usePcrWorkflowContext();
  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);
  const { getContent } = useContent();

  const defaults = useServerInput<z.output<PcrScopeChangeProjectSummarySchemaType>>();
  const { register, handleSubmit, watch, setError, formState, trigger } = useForm<
    z.output<PcrScopeChangeProjectSummarySchemaType>
  >({
    defaultValues: {
      form: FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue,
      projectSummary: defaults?.projectSummary ?? pcrItem.projectSummary ?? "",
    },
    resolver: zodResolver(getPcrScopeChangeProjectSummarySchema(markedAsCompleteHasBeenChecked), {
      errorMap: scopeChangeErrorMap,
    }),
  });

  const hint = getRequiredToCompleteMessage();

  const projectSummaryLength = watch("projectSummary")?.length ?? 0;
  const validationErrors = useZodErrors<z.output<PcrScopeChangeProjectSummarySchemaType>>(setError, formState.errors);
  const nextLink = useNextLink();

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);
  const { onUpdate, isFetching } = useOnUpdateScopeChange<"projectSummary">();

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section data-qa="newSummarySection">
        <Form
          onSubmit={handleSubmit(data => {
            onUpdate({ data, context: { link: nextLink } });
          })}
        >
          <input
            type="hidden"
            value={FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue}
            {...register("form")}
          />

          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrScopeChangeProjectSummaryChange.headingProjectSummary)}</Legend>
            <Info summary={getContent(x => x.pages.pcrScopeChangeProjectSummaryChange.publishedSummary)}>
              <SimpleString multiline>
                {pcrItem.projectSummarySnapshot ||
                  getContent(x => x.pages.pcrScopeChangeProjectSummaryChange.noAvailableSummary)}
              </SimpleString>
            </Info>
            <TextAreaField
              {...register("projectSummary")}
              error={validationErrors?.projectSummary as RhfError}
              id="summary"
              hint={hint}
              disabled={isFetching}
              characterCount={projectSummaryLength}
              data-qa="newSummary"
              characterCountType="descending"
              rows={15}
              characterCountMax={32_000}
              defaultValue={defaults?.projectSummary ?? pcrItem.projectSummary ?? ""}
            />
          </Fieldset>
          <Button type="submit" disabled={isFetching}>
            <Content value={x => x.pcrItem.submitButton} />
          </Button>
        </Form>
      </Section>
    </PcrPage>
  );
};
