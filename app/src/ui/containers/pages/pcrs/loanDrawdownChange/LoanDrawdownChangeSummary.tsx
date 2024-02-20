import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { PcrPage } from "../pcrPage";
import { useLoanDrawdownChangeQuery } from "./loanDrawdownChange.logic";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorMap, loanDrawdownChangeSummarySchema, LoanDrawdownChangeSummarySchema } from "./loanDrawdownChange.zod";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { useForm } from "react-hook-form";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { LoanDrawdownChangeReviewTable, LoanDrawdownErrors } from "./LoanDrawdownChangeReviewTable";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";

export const LoanDrawdownChangeSummary = () => {
  const { itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, loans } = useLoanDrawdownChangeQuery(itemId, fetchKey);

  const { register, handleSubmit, formState, watch } = useForm<LoanDrawdownChangeSummarySchema>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      loans,
    },
    resolver: zodResolver(loanDrawdownChangeSummarySchema, {
      errorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors) as LoanDrawdownErrors;

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <LoanDrawdownChangeReviewTable loans={loans} errors={validationErrors} />
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<LoanDrawdownChangeSummarySchema>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        />
      )}
    </PcrPage>
  );
};
