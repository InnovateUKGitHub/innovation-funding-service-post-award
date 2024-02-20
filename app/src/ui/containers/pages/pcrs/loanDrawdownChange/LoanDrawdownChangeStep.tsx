import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PcrPage } from "../pcrPage";
import { useLoanDrawdownChangeQuery, useOnUpdateLoanChange } from "./loanDrawdownChange.logic";
import { useForm } from "react-hook-form";
import { loanDrawdownChangeSchema, errorMap, LoanDrawdownChangeSchema } from "./loanDrawdownChange.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useNextLink } from "../utils/useNextLink";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { LoanDrawdownChangeEditTable, LoanDrawdownEditErrors } from "./LoanDrawdownChangeEditTable";
import { getDay, getMonth, getYear } from "@ui/components/atomicDesign/atoms/Date";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

export const LoanDrawdownChangeStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, onSave, isFetching, markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();

  const { pcrItem, loans } = useLoanDrawdownChangeQuery(itemId, fetchKey);

  const { handleSubmit, register, formState, trigger, watch } = useForm<LoanDrawdownChangeSchema>({
    defaultValues: {
      // take the marked as complete state from the current checkbox state on the summary
      markedAsComplete: markedAsCompleteHasBeenChecked,
      loans: loans.map(x => ({
        period: x.period,
        currentDate: x.currentDate,
        currentValue: x.currentValue,
        newDate: x.newDate,
        newDate_day: getDay(x.newDate),
        newDate_month: getMonth(x.newDate),
        newDate_year: getYear(x.newDate),
        newValue: String(x.newValue),
      })),
    },
    resolver: zodResolver(loanDrawdownChangeSchema, {
      errorMap,
    }),
  });

  const { isFetching: isUpdatingLoans, onUpdate: onUpdateLoans } = useOnUpdateLoanChange(projectId, itemId, loans);

  const validationErrors = useRhfErrors(formState.errors) as LoanDrawdownEditErrors;
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const nextLink = useNextLink();
  return (
    <PcrPage validationErrors={validationErrors}>
      <Section data-qa="uploadFileSection">
        <Form
          data-qa="loanEditForm"
          onSubmit={handleSubmit(async data => {
            await onUpdateLoans({ data });

            onSave({
              data: pcrItem,
              context: { link: nextLink },
            });
          })}
        >
          <LoanDrawdownChangeEditTable
            loans={loans}
            register={register}
            watch={watch}
            disabled={isFetching || isUpdatingLoans}
            errors={validationErrors}
          />

          <Fieldset>
            <Button disabled={isFetching || isUpdatingLoans} type="submit">
              {getContent(x => x.pcrItem.continueToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
