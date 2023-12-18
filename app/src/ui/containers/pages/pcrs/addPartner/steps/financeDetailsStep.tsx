import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useLinks } from "../../utils/useNextLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
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

export const FinanceDetailsStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey, markedAsCompleteHasBeenChecked, useFormValidate, onSave, isFetching } =
    usePcrWorkflowContext();

  const { pcrItem } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);

  const link = useLinks();

  const { handleSubmit, register, formState, trigger, setValue } = useForm<FinanceDetailsSchema>({
    defaultValues: {
      button_submit: "submit",
      financialYearEndTurnover: pcrItem.financialYearEndTurnover,
      financialYearEndDate_month: getMonth(pcrItem.financialYearEndDate),
      financialYearEndDate_year: getYear(pcrItem.financialYearEndDate),
    },
    resolver: zodResolver(getFinanceDetailsSchema(markedAsCompleteHasBeenChecked), {
      errorMap: addPartnerErrorMap,
    }),
  });

  const validationErrors = useRhfErrors(formState.errors);
  useFormValidate(trigger);

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
                financialYearEndTurnover: data.financialYearEndTurnover,
              },
              context: link(data),
            }),
          )}
        >
          <Fieldset data-qa="endOfFinancialYear">
            <Legend>{getContent(x => x.pcrAddPartnerLabels.financialYearEndHeading)}</Legend>

            <DateInputGroup
              id="suspensionStartDate"
              error={validationErrors?.financialYearEndDate as RhfError}
              hint={
                <Hint id="hint-for-suspensionStartDate">
                  {getContent(x => x.pages.pcrAddPartnerFinanceDetails.hintYearEnd)}
                </Hint>
              }
            >
              <DateInput type="month" {...register("financialYearEndDate_month")} disabled={isFetching} />

              <DateInput type="year" {...register("financialYearEndDate_year")} disabled={isFetching} />
            </DateInputGroup>
          </Fieldset>

          <Fieldset data-qa="turnover">
            <Legend>{getContent(x => x.pages.pcrAddPartnerFinanceDetails.headingTurnover)}</Legend>
            <FormGroup hasError={!!validationErrors?.financialYearEndTurnover}>
              <ValidationError error={validationErrors?.financialYearEndTurnover as RhfError} />

              <NumberInput
                hasError={!!validationErrors?.financialYearEndTurnover}
                inputWidth="one-third"
                {...register("financialYearEndTurnover")}
                disabled={isFetching}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <Button type="submit" {...registerButton("submit")} disabled={isFetching}>
              {getContent(x => x.pcrItem.submitButton)}
            </Button>

            <Button type="submit" secondary {...registerButton("returnToSummary")} disabled={isFetching}>
              {getContent(x => x.pcrItem.returnToSummaryButton)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </PcrPage>
  );
};
