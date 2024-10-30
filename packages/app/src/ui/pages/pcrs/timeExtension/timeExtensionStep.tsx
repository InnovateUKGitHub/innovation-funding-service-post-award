import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { ShortDateRangeFromDuration, Months } from "@ui/components/atoms/Date";
import { useMounted } from "@ui/context/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import React from "react";
import { usePcrTimeExtensionWorkflowQuery, generateOptions } from "./timeExtension.logic";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { DropdownSelect } from "@ui/components/atoms/form/Dropdown/Dropdown";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useNextLink } from "../utils/useNextLink";
import { PcrPage } from "../pcrPage";
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrTimeExtensionSchema, errorMap, TimeExtensionSchemaType } from "./timeExtension.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const TimeExtensionStep = () => {
  const { getContent } = useContent();
  const { isClient } = useMounted();

  const { projectId, itemId, onSave, config, isFetching, fetchKey, markedAsCompleteHasBeenChecked } =
    usePcrWorkflowContext();

  const { pcrItem, project } = usePcrTimeExtensionWorkflowQuery(projectId, itemId, fetchKey);

  const nextLink = useNextLink();

  const timeExtensionOptions = generateOptions(project.endDate, config.features.futureTimeExtensionInYears);
  const existingProjectHeading = getContent(x => x.pages.pcrTimeExtensionStep.existingProjectHeading);
  const dateLabel = getContent(x => x.pages.pcrTimeExtensionStep.dateLabel);
  const durationLabel = getContent(x => x.pages.pcrTimeExtensionStep.durationLabel);
  const proposedProjectHeading = getContent(x => x.pages.pcrTimeExtensionStep.proposedProjectHeading);
  const saveAndContinue = getContent(x => x.pages.pcrTimeExtensionStep.saveAndContinue);
  const currentProjectEndDate = getContent(x => x.pages.pcrTimeExtensionStep.currentProjectEndDate);
  const timeExtensionSelectLabel = getContent(x => x.pages.pcrTimeExtensionStep.timeExtensionSelectLabel);

  const timeExtensionDropdownOptions = React.useMemo(
    () =>
      timeExtensionOptions?.map(x => {
        const isCurrent = x.offset === 0;
        return {
          id: x.offset.toString(),
          value: isCurrent ? currentProjectEndDate : x.label,
        };
      }),
    [timeExtensionOptions, currentProjectEndDate],
  );

  if (!timeExtensionDropdownOptions || timeExtensionDropdownOptions.length === 1) {
    throw new Error("You are not able to change the project duration");
  }

  const { register, handleSubmit, watch, formState, trigger, setError } = useForm<TimeExtensionSchemaType>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      timeExtension: String(pcrItem.offsetMonths),
      form: FormTypes.PcrChangeDurationStep,
    },
    resolver: zodResolver(pcrTimeExtensionSchema, {
      errorMap,
    }),
  });

  const newOffset = Number(watch("timeExtension"));

  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const newProjectDuration = (newOffset ?? 0) + pcrItem.projectDurationSnapshot;

  const validationErrors = useZodErrors(setError, formState.errors);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <Content markdown value={x => x.pages.pcrTimeExtensionStep.changeProjectDurationHint} />
      </Section>

      <Section>
        <H3 as="h2">{existingProjectHeading}</H3>
        <Label htmlFor="existing-dates">{dateLabel}</Label>
        <P id="existing-dates">
          <ShortDateRangeFromDuration startDate={project.startDate} months={pcrItem.projectDurationSnapshot} />
        </P>
        <Label htmlFor="existing-duration">{durationLabel}</Label>
        <P id="existing-duration">
          <Months months={pcrItem.projectDurationSnapshot} />
        </P>
      </Section>

      <Form
        onSubmit={handleSubmit(() => {
          onSave({ data: { offsetMonths: newOffset }, context: { link: nextLink } });
        })}
      >
        <input type="hidden" name="form" value={FormTypes.PcrChangeDurationStep} />
        <Fieldset>
          <Legend>{proposedProjectHeading}</Legend>
          <FormGroup hasError={!!validationErrors?.timeExtension}>
            <Label htmlFor="timeExtension">{timeExtensionSelectLabel}</Label>
            <ValidationError error={validationErrors?.timeExtension as RhfError} />
            <DropdownSelect
              id="timeExtension"
              options={timeExtensionDropdownOptions}
              placeholder="-- Select end date --"
              defaultValue={String(pcrItem.offsetMonths)}
              disabled={isFetching}
              {...register("timeExtension")}
            />
          </FormGroup>
        </Fieldset>

        {isClient && (
          <Section>
            <Label htmlFor="proposed-dates">{dateLabel}</Label>
            <P id="proposed-dates">
              <ShortDateRangeFromDuration startDate={project.startDate} months={newProjectDuration} />
            </P>

            <Label htmlFor="proposed-duration">{durationLabel}</Label>
            <P id="proposed-duration">
              <Months months={newProjectDuration} />
            </P>
          </Section>
        )}

        <Fieldset>
          <FormGroup>
            <Button type="submit" disabled={isFetching}>
              {saveAndContinue}
            </Button>
          </FormGroup>
        </Fieldset>
      </Form>
    </PcrPage>
  );
};
