import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/constants/enums";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators/pcrDtoValidator";

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
export const FinanceDetailsStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  return (
    <Section title={x => x.pages.pcrAddPartnerFinanceDetails.sectionTitle}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.financialYearEndHeading} qa="endOfFinancialYear">
          <Form.MonthYear
            name="financialYearEndDate"
            hint={x => x.pages.pcrAddPartnerFinanceDetails.hintYearEnd}
            value={dto => dto.financialYearEndDate}
            update={(x, val) => {
              x.financialYearEndDate = val;
            }}
            startOrEnd="end"
            validation={props.validator.financialYearEndDate}
          />
        </Form.Fieldset>
        <Form.Fieldset heading={x => x.pages.pcrAddPartnerFinanceDetails.headingTurnover} qa="turnover">
          <Form.Numeric
            width="one-third"
            name="financialYearEndTurnover"
            value={dto => dto.financialYearEndTurnover}
            update={(x, val) => {
              x.financialYearEndTurnover = val;
            }}
            validation={props.validator.financialYearEndTurnover}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>
            <Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </Section>
  );
};
