import { Section } from "@ui/components/atoms/Section/Section";
import { PcrPage } from "../pcrPage";
import { useLoanDrawdownChangeQuery, useOnUpdateLoanChangeSummary } from "./loanDrawdownChange.logic";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  errorMap,
  loanDrawdownChangeSummarySchema,
  InferredLoanDrawdownChangeSummarySchema,
} from "./loanDrawdownChange.zod";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { useForm } from "react-hook-form";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { LoanDrawdownChangeReviewTable, LoanDrawdownErrors } from "./LoanDrawdownChangeReviewTable";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { FormTypes } from "@ui/zod/FormTypes";

export const LoanDrawdownChangeSummary = () => {
  const { itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, loans } = useLoanDrawdownChangeQuery(itemId, fetchKey);

  const { register, handleSubmit, formState, watch } = useForm<InferredLoanDrawdownChangeSummarySchema>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      loans,
      form: FormTypes.PcrLoanDrawdownChangeSummary,
    },
    resolver: zodResolver(loanDrawdownChangeSummarySchema, {
      errorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors) as LoanDrawdownErrors;
  const { isFetching, onUpdate, apiError } = useOnUpdateLoanChangeSummary();

  return (
    <PcrPage validationErrors={validationErrors} apiError={apiError}>
      <Section>
        <LoanDrawdownChangeReviewTable loans={loans} errors={validationErrors} />
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<InferredLoanDrawdownChangeSummarySchema>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
          onUpdate={onUpdate}
          isFetching={isFetching}
        >
          <input type="hidden" name="form" value={FormTypes.PcrLoanDrawdownChangeSummary} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
