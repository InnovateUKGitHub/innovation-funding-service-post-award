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

export const PublicDescriptionChangeStep = () => {
  const {
    projectId,
    itemId,
    fetchKey,
    isFetching,
    getRequiredToCompleteMessage,
    onSave,
    useClearPcrValidationError,
    useErrorSubset,
    pcrValidationErrors,
  } = usePcrWorkflowContext();
  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);
  const { getContent } = useContent();
  const { register, handleSubmit, watch } = useForm<{ publicDescription: string }>({
    defaultValues: {
      publicDescription: pcrItem.publicDescription ?? "",
    },
  });

  const hint = getRequiredToCompleteMessage();

  const publicDescriptionLength = watch("publicDescription")?.length ?? 0;

  useErrorSubset(["publicDescription"]);
  useClearPcrValidationError("publicDescription", publicDescriptionLength > 0);

  return (
    <Section data-qa="newDescriptionSection">
      <Form
        onSubmit={handleSubmit(data => {
          onSave({ data });
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
            error={pcrValidationErrors?.publicDescription as RhfError}
            hint={hint}
            disabled={isFetching}
            characterCount={publicDescriptionLength}
            data-qa="newDescription"
            characterCountType="descending"
            rows={15}
            characterCountMax={32_000}
          />
        </Fieldset>
        <Button type="submit" disabled={isFetching}>
          <Content value={x => x.pcrItem.submitButton} />
        </Button>
      </Form>
    </Section>
  );
};
