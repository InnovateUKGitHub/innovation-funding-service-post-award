import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/atoms/Section/Section";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useForm } from "react-hook-form";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorMap, LoanDrawdownExtensionSchema, loanDrawdownExtensionSchema } from "./loanDrawdownExtension.zod";
import { PcrPage } from "../pcrPage";
import {
  LoanDrawdownExtensionErrors,
  useLoanDrawdownExtensionQuery,
  useOnUpdateLoanDrawdownExtension,
} from "./loanDrawdownExtension.logic";
import { LoanDrawdownTable } from "./loanDrawdownTable";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const LoanDrawdownExtensionSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem } = useLoanDrawdownExtensionQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch, setError } = useForm<LoanDrawdownExtensionSchema>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      availabilityPeriodChange: pcrItem.availabilityPeriodChange ?? 0,
      extensionPeriodChange: pcrItem.extensionPeriodChange ?? 0,
      repaymentPeriodChange: pcrItem.repaymentPeriodChange ?? 0,
      availabilityPeriod: pcrItem.availabilityPeriod ?? 0,
      extensionPeriod: pcrItem.extensionPeriod ?? 0,
      repaymentPeriod: pcrItem.repaymentPeriod ?? 0,
      form: FormTypes.PcrLoanDurationChangeSummary,
    },
    resolver: zodResolver(loanDrawdownExtensionSchema, {
      errorMap,
    }),
  });

  const { onUpdate, apiError, isFetching } = useOnUpdateLoanDrawdownExtension();

  const validationErrors = useZodErrors(setError, formState?.errors) as LoanDrawdownExtensionErrors;

  return (
    <PcrPage validationErrors={validationErrors} apiError={apiError}>
      <Section>
        <Section>
          <LoanDrawdownTable
            pcrItem={pcrItem}
            register={register}
            watch={watch}
            isFetching={isFetching}
            readonlyTable
            validationErrors={validationErrors}
          />
        </Section>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<LoanDrawdownExtensionSchema>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
          onUpdate={onUpdate}
          isFetching={isFetching}
        >
          <input type="hidden" name="availabilityPeriod" value={pcrItem.availabilityPeriod ?? 0} />
          <input type="hidden" name="extensionPeriod" value={pcrItem.extensionPeriod ?? 0} />
          <input type="hidden" name="repaymentPeriod" value={pcrItem.repaymentPeriod ?? 0} />
          <input type="hidden" name="availabilityPeriodChange" value={pcrItem.availabilityPeriodChange ?? 0} />
          <input type="hidden" name="extensionPeriodChange" value={pcrItem.extensionPeriodChange ?? 0} />
          <input type="hidden" name="repaymentPeriodChange" value={pcrItem.repaymentPeriodChange ?? 0} />
          <input type="hidden" name="form" value={FormTypes.PcrLoanDurationChangeSummary} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};
