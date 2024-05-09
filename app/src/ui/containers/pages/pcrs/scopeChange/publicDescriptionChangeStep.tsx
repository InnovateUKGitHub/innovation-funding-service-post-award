import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { useContent } from "@ui/hooks/content.hook";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PcrPage } from "../pcrPage";
import { useNextLink } from "../utils/useNextLink";
import { useScopeChangeWorkflowQuery } from "./scopeChange.logic";
import {
  PcrScopeChangePublicDescriptionSchemaType,
  getPcrScopeChangePublicDescriptionSchema,
  scopeChangeErrorMap,
} from "./scopeChange.zod";

export const PublicDescriptionChangeStep = () => {
  const {
    projectId,
    pcrId,
    itemId,
    fetchKey,
    isFetching,
    getRequiredToCompleteMessage,
    onSave,
    markedAsCompleteHasBeenChecked,
  } = usePcrWorkflowContext();
  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);
  const { getContent } = useContent();
  const defaults = useServerInput<z.output<PcrScopeChangePublicDescriptionSchemaType>>();
  const { register, handleSubmit, watch, setError, formState, trigger } = useForm<
    z.output<PcrScopeChangePublicDescriptionSchemaType>
  >({
    defaultValues: {
      form: FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue,
      projectId,
      pcrId,
      pcrItemId: itemId,
      publicDescription: defaults?.publicDescription ?? pcrItem.publicDescription ?? "",
    },
    resolver: zodResolver(getPcrScopeChangePublicDescriptionSchema(markedAsCompleteHasBeenChecked), {
      errorMap: scopeChangeErrorMap,
    }),
  });

  const hint = getRequiredToCompleteMessage();

  const publicDescriptionLength = watch("publicDescription")?.length ?? 0;
  const validationErrors = useZodErrors<z.output<PcrScopeChangePublicDescriptionSchemaType>>(
    setError,
    formState.errors,
  );
  const nextLink = useNextLink();

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section data-qa="newDescriptionSection">
        <Form
          onSubmit={handleSubmit(data => {
            onSave({ data, context: { link: nextLink } });
          })}
        >
          <input
            type="hidden"
            value={FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue}
            {...register("form")}
          />
          <input type="hidden" value={projectId} {...register("projectId")} />
          <input type="hidden" value={pcrId} {...register("pcrId")} />
          <input type="hidden" value={itemId} {...register("pcrItemId")} />

          <Fieldset>
            <Legend>{getContent(x => x.pages.pcrScopeChangePublicDescriptionChange.headingPublicDescription)}</Legend>
            <Info summary={<Content value={x => x.pages.pcrScopeChangePublicDescriptionChange.publishedDescription} />}>
              <SimpleString multiline>
                {pcrItem.publicDescriptionSnapshot || (
                  <Content value={x => x.pages.pcrScopeChangePublicDescriptionChange.noAvailableDescription} />
                )}
              </SimpleString>
            </Info>
            <TextAreaField
              {...register("publicDescription")}
              id="description"
              error={validationErrors?.publicDescription as RhfError}
              hint={hint}
              disabled={isFetching}
              characterCount={publicDescriptionLength}
              data-qa="newDescription"
              characterCountType="descending"
              rows={15}
              characterCountMax={32_000}
              defaultValue={defaults?.publicDescription ?? pcrItem.publicDescription ?? ""}
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
