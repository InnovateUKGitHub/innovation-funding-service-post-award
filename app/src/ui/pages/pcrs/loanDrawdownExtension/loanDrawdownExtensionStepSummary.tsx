import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { Section } from "@ui/components/atoms/Section/Section";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useForm } from "react-hook-form";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoanDrawdownExtensionSchema, errorMap } from "./loanDrawdownExtension.zod";
import { PcrPage } from "../pcrPage";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { LoanDrawdownExtensionErrors, useLoanDrawdownExtensionQuery } from "./loanDrawdownExtension.logic";
import { loanDrawdownExtensionSchema } from "./loanDrawdownExtension.zod";
import { LoanDrawdownTable } from "./loanDrawdownTable";

export const LoanDrawdownExtensionSummary = () => {
  const { projectId, itemId, fetchKey, displayCompleteForm, isFetching } = usePcrWorkflowContext();

  const { pcrItem } = useLoanDrawdownExtensionQuery(projectId, itemId, fetchKey);

  const { register, handleSubmit, formState, watch } = useForm<LoanDrawdownExtensionSchema>({
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      availabilityPeriodChange: String(pcrItem.availabilityPeriodChange ?? 0),
      extensionPeriodChange: String(pcrItem.extensionPeriodChange ?? 0),
      repaymentPeriodChange: String(pcrItem.repaymentPeriodChange ?? 0),
    },
    resolver: zodResolver(
      loanDrawdownExtensionSchema({
        availabilityPeriod: pcrItem.availabilityPeriod ?? 0,
        extensionPeriod: pcrItem.extensionPeriod ?? 0,
        repaymentPeriod: pcrItem.repaymentPeriod ?? 0,
      }),
      {
        errorMap,
      },
    ),
  });

  const validationErrors = useRhfErrors(formState?.errors) as LoanDrawdownExtensionErrors;

  return (
    <PcrPage validationErrors={validationErrors}>
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
        />
      )}
    </PcrPage>
  );
};
