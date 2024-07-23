import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { addPartnerErrorMap } from "../addPartnerSummary.zod";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { PcrPage } from "../../pcrPage";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { DateInputGroup } from "@ui/components/atomicDesign/atoms/DateInputs/DateInputGroup";
import { DateInput } from "@ui/components/atomicDesign/atoms/DateInputs/DateInput";
import { combineDate, getMonth, getYear } from "@ui/components/atomicDesign/atoms/Date";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { FinanceDetailsSchema, getFinanceDetailsSchema } from "./schemas/financialDetails.zod";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { parseCurrency } from "@framework/util/numberHelper";
import { FormTypes } from "@ui/zod/FormTypes";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export const FinanceDetailsStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, onSave, isFetching } = usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue, watch, setError } = useForm<FinanceDetailsSchema>({
    defaultValues: {
      form: FormTypes.PcrAddPartnerFinancialDetailsStep,
      markedAsComplete: String(markedAsCompleteHasBeenChecked),
      button_submit: "submit",
      financialYearEndTurnover: String(pcrItem.financialYearEndTurnover ?? ""),
      financialYearEndDate_month: getMonth(pcrItem.financialYearEndDate),
      financialYearEndDate_year: getYear(pcrItem.financialYearEndDate),
    },
    resolver: zodResolver(getFinanceDetailsSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);
  useFormRevalidate(watch, trigger, markedAsCompleteHasBeenChecked);

  const registerButton = createRegisterButton(setValue, "button_submit");

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section>
        <H2>{getContent(x => x.pages.pcrAddPartnerFinanceDetails.sectionTitle)}</H2>
        <Form
          data-qa="addPartnerForm"
          onSubmit={handleSubmit(data =>
            onSave({
              data: {
                financialYearEndDate: combineDate(
                  data.financialYearEndDate_month,
                  data.financialYearEndDate_year,
                  false,
                ),
                financialYearEndTurnover: parseCurrency(data.financialYearEndTurnover),
              },
              context: link(data),
            }),
          )}
        >
          <input type="hidden" {...register("form")} value={FormTypes.PcrAddPartnerFinancialDetailsStep} />
          <input type="hidden" {...register("markedAsComplete")} value={String(markedAsCompleteHasBeenChecked)} />

          <Fieldset data-qa="endOfFinancialYear">
            <Legend>{getContent(x => x.pcrAddPartnerLabels.financialYearEndHeading)}</Legend>

            <DateInputGroup
              id="financialYearEndDate"
              error={validationErrors?.financialYearEndDate as RhfError}
              hint={
                <Hint id="hint-for-financialYearEndDate">
                  {getContent(x => x.pages.pcrAddPartnerFinanceDetails.hintYearEnd)}
                </Hint>
              }
            >
              <DateInput
                type="month"
                {...register("financialYearEndDate_month")}
                disabled={isFetching}
                defaultValue={String(getMonth(pcrItem.financialYearEndDate) ?? "")}
              />

              <DateInput
                type="year"
                {...register("financialYearEndDate_year")}
                disabled={isFetching}
                defaultValue={String(getYear(pcrItem.financialYearEndDate) ?? "")}
              />
            </DateInputGroup>
          </Fieldset>

          <Fieldset data-qa="turnover">
            <Legend>{getContent(x => x.pages.pcrAddPartnerFinanceDetails.headingTurnover)}</Legend>
            <FormGroup hasError={!!validationErrors?.financialYearEndTurnover}>
              <ValidationError error={validationErrors?.financialYearEndTurnover as RhfError} />

              <NumberInput
                hasError={!!validationErrors?.financialYearEndTurnover}
                inputWidth="one-third"
                defaultValue={String(pcrItem.financialYearEndTurnover ?? "")}
                {...register("financialYearEndTurnover")}
                disabled={isFetching}
                prefix={getContent(x => x.forms.prefix.gbp)}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>

            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
              {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
