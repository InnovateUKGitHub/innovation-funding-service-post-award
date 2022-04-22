import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { EditorStatus } from "@ui/constants/enums";

export const FinanceDetailsStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <ACC.Section title={x => x.pcrAddPartnerFinanceDetails.sectionTitle}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading={x => x.pcrAddPartnerFinanceDetails.labels.financialYearEndHeading} qa="endOfFinancialYear">
          <Form.MonthYear
            name="financialYearEndDate"
            hint={x => x.pcrAddPartnerFinanceDetails.yearEndHint}
            value={dto => dto.financialYearEndDate}
            update={(x, val) => {
              x.financialYearEndDate = val;
            }}
            startOrEnd="end"
            validation={props.validator.financialYearEndDate}
          />
        </Form.Fieldset>
        <Form.Fieldset heading={x => x.pcrAddPartnerFinanceDetails.turnoverHeading} qa="turnover">
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
            <ACC.Content value={x => x.pcrAddPartnerFinanceDetails.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <ACC.Content value={x => x.pcrAddPartnerFinanceDetails.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
