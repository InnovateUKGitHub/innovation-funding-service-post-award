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
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrScopeChangeProjectSummarySchema, errorMap } from "./scopeChange.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { useNextLink } from "../utils/useNextLink";
import { z } from "zod";

export const ProjectSummaryChangeStep = () => {
  const { getContent } = useContent();

  const {
    projectId,
    itemId,
    onSave,
    isFetching,
    fetchKey,
    getRequiredToCompleteMessage,
    useClearPcrValidationError,
    useSetPcrValidationErrors,
    pcrValidationErrors,
    useErrorSubset,
  } = usePcrWorkflowContext();

  const { pcrItem } = useScopeChangeWorkflowQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, watch, formState } = useForm<z.output<typeof pcrScopeChangeProjectSummarySchema>>({
    defaultValues: {
      projectSummary: pcrItem.projectSummary ?? "",
    },
    resolver: zodResolver(pcrScopeChangeProjectSummarySchema, {
      errorMap,
    }),
  });

  const projectSummaryLength = watch("projectSummary")?.length ?? 0;

  useSetPcrValidationErrors(formState.errors);
  useErrorSubset(["projectSummary"]);
  useClearPcrValidationError("projectSummary", projectSummaryLength > 0);

  const hint = getRequiredToCompleteMessage();

  const nextLink = useNextLink();

  return (
    <Section data-qa="newSummarySection">
      <Form
        onSubmit={handleSubmit(data => {
          onSave({ data: { ...data, status: PCRItemStatus.Incomplete }, context: { link: nextLink } });
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
            error={pcrValidationErrors?.projectSummary as RhfError}
            id="summary"
            hint={hint}
            disabled={isFetching}
            characterCount={projectSummaryLength}
            data-qa="newSummary"
            characterCountType="descending"
            rows={15}
            characterCountMax={32_000}
            defaultValue={pcrItem.projectSummary ?? ""}
          />
        </Fieldset>
        <Button type="submit" disabled={isFetching}>
          <Content value={x => x.pcrItem.submitButton} />
        </Button>
      </Form>
    </Section>
  );
};
