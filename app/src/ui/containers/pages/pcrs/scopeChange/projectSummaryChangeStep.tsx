import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useContent } from "@ui/hooks/content.hook";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";

import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { useForm } from "react-hook-form";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useScopeChangeWorkflowQuery } from "./scopeChange.logic";

// projectSummary: string | null;
// projectSummarySnapshot: string | null;
// publicDescription: string | null;
// publicDescriptionSnapshot: string | null;
// type: PCRItemType.ScopeChange;

export const ProjectSummaryChangeStep = () => {
  const { getContent } = useContent();

  const { projectId, itemId, onSave, isFetching, fetchKey, getRequiredToCompleteMessage } = usePcrWorkflowContext();

  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, watch } = useForm<{ projectSummary: string }>({
    defaultValues: {
      projectSummary: "",
    },
  });

  const hint = getRequiredToCompleteMessage();

  return (
    <Section data-qa="newSummarySection">
      <Form
        onSubmit={handleSubmit(data => {
          onSave({ data });
        })}
      >
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
            id="summary"
            hint={hint}
            disabled={isFetching}
            characterCount={watch("projectSummary")?.length ?? 0}
            data-qa="newSummary"
            characterCountType="descending"
            rows={15}
            characterCountMax={32_000}
          />
        </Fieldset>
        <Button type="submit">
          <Content value={x => x.pcrItem.submitButton} />
        </Button>
      </Form>
    </Section>
  );
};
