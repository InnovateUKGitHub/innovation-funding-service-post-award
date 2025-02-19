import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PcrPage } from "../pcrPage";
import { useLoanDrawdownChangeQuery, useOnUpdateLoanChange } from "./loanDrawdownChange.logic";
import { useForm } from "react-hook-form";
import { loanDrawdownChangeSchema, errorMap, InferredLoanDrawdownChangeSchema } from "./loanDrawdownChange.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNextLink } from "../utils/useNextLink";
import { Section } from "@ui/components/atoms/Section/Section";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { LoanDrawdownChangeEditTable, LoanDrawdownEditErrors } from "./LoanDrawdownChangeEditTable";
import { getDay, getMonth, getYear } from "@ui/components/atoms/Date";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const LoanDrawdownChangeStep = () => {
  const { getContent } = useContent();
  const { itemId, fetchKey, markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();

  const { loans } = useLoanDrawdownChangeQuery(itemId, fetchKey);

  const { handleSubmit, register, formState, trigger, watch, setError } = useForm<InferredLoanDrawdownChangeSchema>({
    defaultValues: {
      markedAsComplete: markedAsCompleteHasBeenChecked,
      form: FormTypes.PcrLoanDrawdownChange,
      loans: loans.map(x => ({
        id: x.id,
        period: x.period,
        currentDate: x.currentDate,
        currentValue: x.currentValue,
        newDate: x.newDate,
        newDate_day: getDay(x.newDate),
        newDate_month: getMonth(x.newDate),
        newDate_year: getYear(x.newDate),
        newValue: String(x.newValue),
        isEditable: x.isEditable,
      })),
    },
    resolver: zodResolver(loanDrawdownChangeSchema, {
      errorMap,
    }),
  });

  const { isFetching, onUpdate, apiError } = useOnUpdateLoanChange();

  const validationErrors = useZodErrors(setError, formState.errors) as LoanDrawdownEditErrors;
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const nextLink = useNextLink();
  return (
    <PcrPage validationErrors={validationErrors} apiError={apiError}>
      <Section data-qa="uploadFileSection">
        <Form
          data-qa="loanEditForm"
          onSubmit={handleSubmit(data =>
            onUpdate({
              data,
              context: { link: nextLink },
            }),
          )}
        >
          <input type="hidden" name="form" value={FormTypes.PcrLoanDrawdownChange} />
          <LoanDrawdownChangeEditTable
            loans={loans}
            register={register}
            watch={watch}
            disabled={isFetching}
            errors={validationErrors}
          />

          <Fieldset>
            <Button disabled={isFetching} type="submit">
              {getContent(x => x.pcrItem.continueToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
