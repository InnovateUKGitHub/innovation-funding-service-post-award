import { DateFormat } from "@framework/constants/enums";
import { formatDate } from "@framework/util/dateHelpers";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { useContent } from "@ui/hooks/content.hook";
import { PcrPage } from "../pcrPage";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { LoanDrawdownExtensionErrors, useLoanDrawdownExtensionQuery } from "./loanDrawdownExtension.logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { useNextLink } from "../utils/useNextLink";
import { loanDrawdownExtensionSchema, errorMap, LoanDrawdownExtensionSchema } from "./loanDrawdownExtension.zod";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { LoanDrawdownTable } from "./loanDrawdownTable";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

export const LoanDrawdownExtensionStep = () => {
  const { getContent } = useContent();

  const { projectId, itemId, fetchKey, onSave, isFetching, markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();

  const { pcrItem } = useLoanDrawdownExtensionQuery(projectId, itemId, fetchKey);

  const formattedStartDate = formatDate(pcrItem.projectStartDate, DateFormat.SHORT_DATE);

  const { handleSubmit, register, formState, trigger, watch } = useForm<LoanDrawdownExtensionSchema>({
    defaultValues: {
      availabilityPeriodChange: String(pcrItem.availabilityPeriodChange ?? 0),
      extensionPeriodChange: String(pcrItem.extensionPeriodChange ?? 0),
      repaymentPeriodChange: String(pcrItem.repaymentPeriodChange ?? 0),
      markedAsComplete: markedAsCompleteHasBeenChecked,
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

  const validationErrors = useRhfErrors(formState.errors) as LoanDrawdownExtensionErrors;
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const nextLink = useNextLink();

  return (
    <PcrPage validationErrors={validationErrors}>
      <P>{getContent(x => x.forms.pcr.loanDrawdownExtension.information)}</P>

      <P>{getContent(x => x.forms.pcr.loanDrawdownExtension.startDate({ startDate: formattedStartDate }))}</P>

      <Section>
        <Form
          data-qa="loanEditForm"
          onSubmit={handleSubmit(data =>
            onSave({
              data: {
                ...data,
                availabilityPeriodChange: Number(data.availabilityPeriodChange),
                extensionPeriodChange: Number(data.extensionPeriodChange),
                repaymentPeriodChange: Number(data.repaymentPeriodChange),
              },
              context: { link: nextLink },
            }),
          )}
        >
          <Section>
            <LoanDrawdownTable
              pcrItem={pcrItem}
              register={register}
              watch={watch}
              isFetching={isFetching}
              validationErrors={validationErrors}
            />
          </Section>
          <Section>
            <Button type="submit" disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>
          </Section>
        </Form>
      </Section>
    </PcrPage>
  );
};
