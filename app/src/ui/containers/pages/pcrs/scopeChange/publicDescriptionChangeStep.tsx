import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useForm } from "react-hook-form";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { useContent } from "@ui/hooks/content.hook";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { useScopeChangeWorkflowQuery } from "./scopeChange.logic";
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrScopeChangePublicDescriptionSchema, scopeChangeErrorMap } from "./scopeChange.zod";
import { useNextLink } from "../utils/useNextLink";
import { z } from "zod";
import { PcrPage } from "../pcrPage";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

export const PublicDescriptionChangeStep = () => {
  const {
    projectId,
    itemId,
    fetchKey,
    isFetching,
    getRequiredToCompleteMessage,
    onSave,
    markedAsCompleteHasBeenChecked,
  } = usePcrWorkflowContext();
  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);
  const { getContent } = useContent();
  const { register, handleSubmit, watch, formState, trigger } = useForm<
    z.output<typeof pcrScopeChangePublicDescriptionSchema>
  >({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      publicDescription: pcrItem.publicDescription ?? "",
    },
    resolver: zodResolver(pcrScopeChangePublicDescriptionSchema, {
      errorMap: scopeChangeErrorMap,
    }),
  });

  const hint = getRequiredToCompleteMessage();

  const publicDescriptionLength = watch("publicDescription")?.length ?? 0;
  const validationErrors = useRhfErrors(formState.errors);
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
              defaultValue={pcrItem.publicDescription ?? ""}
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
