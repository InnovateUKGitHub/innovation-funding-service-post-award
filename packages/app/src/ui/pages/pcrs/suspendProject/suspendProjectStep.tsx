import { getAuthRoles } from "@framework/types/authorisation";
import { Section } from "@ui/components/molecules/Section/section";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";
import { useForm } from "react-hook-form";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { usePcrSuspendProjectWorkflowQuery } from "./suspendProject.logic";
import { DateInputGroup } from "@ui/components/atoms/DateInputs/DateInputGroup";
import { DateInput } from "@ui/components/atoms/DateInputs/DateInput";
import { useNextLink } from "../utils/useNextLink";
import {
  getProjectSuspensionSchema,
  pcrProjectSuspensionErrorMap,
  ProjectSuspensionSchemaType,
} from "./suspendProject.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { combineDate, getMonth, getYear } from "@ui/components/atoms/Date";
import { PcrPage } from "../pcrPage";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const SuspendProjectStep = () => {
  const { getContent } = useContent();
  const {
    projectId,
    itemId,
    fetchKey,
    getRequiredToCompleteMessage,
    onSave,
    isFetching,
    markedAsCompleteHasBeenChecked,
  } = usePcrWorkflowContext();

  const { project, pcrItem } = usePcrSuspendProjectWorkflowQuery(projectId, itemId, fetchKey);
  const { isPm } = getAuthRoles(project.roles);

  const nextLink = useNextLink();

  const suspendProjectIntro = getContent(x => x.pages.pcrSuspendProjectDetails.suspendProjectIntro);
  const firstDayOfPauseTitle = getContent(x => x.pages.pcrSuspendProjectDetails.firstDayOfPauseTitle);
  const lastDayOfPauseTitle = getContent(x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseTitle);
  const lastDayOfPauseHint = getContent(x => x.pages.pcrSuspendProjectDetails.lastDayOfPauseHint);
  const saveAndContinue = getContent(x => x.pages.pcrTimeExtensionStep.saveAndContinue);

  const { handleSubmit, register, formState, watch, trigger, setError } = useForm<ProjectSuspensionSchemaType>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      form: FormTypes.PcrProjectSuspensionStep,
      suspensionStartDate_month: getMonth(pcrItem.suspensionStartDate),
      suspensionStartDate_year: getYear(pcrItem.suspensionStartDate),
      suspensionEndDate_month: getMonth(pcrItem.suspensionEndDate),
      suspensionEndDate_year: getYear(pcrItem.suspensionEndDate),
      // for the error field of this name
      suspensionStartDate: "",
      suspensionEndDate: "",
    },
    resolver: zodResolver(getProjectSuspensionSchema(project), {
      errorMap: pcrProjectSuspensionErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  return (
    <PcrPage validationErrors={validationErrors}>
      {isPm && (
        <Section>
          <SimpleString>{suspendProjectIntro}</SimpleString>
        </Section>
      )}

      <Section>
        <Form
          data-qa="projectSuspension"
          onSubmit={handleSubmit(data => {
            onSave({
              data: {
                suspensionStartDate: combineDate(data.suspensionStartDate_month, data.suspensionStartDate_year, true),
                suspensionEndDate: combineDate(data.suspensionEndDate_month, data.suspensionEndDate_year, false),
              },
              context: { link: nextLink },
            });
          })}
        >
          <input type="hidden" {...register("form")} value={FormTypes.PcrProjectSuspensionStep} />
          <Fieldset>
            <Legend>{firstDayOfPauseTitle}</Legend>
            <Hint id="hint-for-suspensionStartDate">{getRequiredToCompleteMessage()} </Hint>

            <DateInputGroup id="suspensionStartDate" error={validationErrors?.suspensionStartDate as RhfError}>
              <DateInput
                type="month"
                defaultValue={getMonth(pcrItem.suspensionStartDate)}
                {...register("suspensionStartDate_month")}
                disabled={isFetching}
              />

              <DateInput
                type="year"
                defaultValue={getYear(pcrItem.suspensionStartDate)}
                {...register("suspensionStartDate_year")}
                disabled={isFetching}
              />
            </DateInputGroup>
          </Fieldset>

          <Fieldset>
            <Legend>{lastDayOfPauseTitle}</Legend>
            <Hint id="hint-for-suspensionEndDate">{lastDayOfPauseHint} </Hint>

            <DateInputGroup id="suspensionEndDate" error={validationErrors?.suspensionEndDate as RhfError}>
              <DateInput
                type="month"
                defaultValue={getMonth(pcrItem.suspensionEndDate)}
                {...register("suspensionEndDate_month")}
              />

              <DateInput
                type="year"
                defaultValue={getYear(pcrItem.suspensionEndDate)}
                {...register("suspensionEndDate_year")}
              />
            </DateInputGroup>
          </Fieldset>

          <Fieldset>
            <FormGroup>
              <Button type="submit" disabled={isFetching}>
                {saveAndContinue}
              </Button>
            </FormGroup>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
