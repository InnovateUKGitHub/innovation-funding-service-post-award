import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { ShortDateRangeFromDuration, Months } from "@ui/components/atomicDesign/atoms/Date";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import React from "react";
import { usePcrTimeExtensionWorkflowQuery, generateOptions } from "./timeExtension.logic";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { DropdownSelect } from "@ui/components/atomicDesign/atoms/form/Dropdown/Dropdown";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useNextLink } from "../utils/useNextLink";
import { PcrPage } from "../pcrPage";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrTimeExtensionSchema, errorMap } from "./timeExtension.zod";

export const TimeExtensionStep = () => {
  const { getContent } = useContent();
  const { isClient } = useMounted();

  const { projectId, itemId, onSave, config, isFetching, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate } =
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

  const { register, handleSubmit, watch, formState, trigger } = useForm<{
    timeExtension: string;
    offsetMonths: number;
    markedAsComplete: boolean;
  }>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      timeExtension: String(pcrItem.offsetMonths),
      offsetMonths: pcrItem.offsetMonths,
    },
    resolver: zodResolver(pcrTimeExtensionSchema, {
      errorMap,
    }),
  });

  const newOffset = Number(watch("timeExtension"));

  useFormValidate(trigger);

  const newProjectDuration = (newOffset ?? 0) + pcrItem.projectDurationSnapshot;

  const validationErrors = useRhfErrors(formState.errors);

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
          onSave({ data: { offsetMonths: newOffset, status: PCRItemStatus.Incomplete }, context: { link: nextLink } });
        })}
      >
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
