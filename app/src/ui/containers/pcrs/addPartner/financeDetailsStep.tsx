import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";

export const FinanceDetailsStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <ACC.Section title="Financial details">
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading="End of financial year">
          <Form.MonthYear
            name="financialYearEndDate"
            hint="This is the end of the last financial year for which you have your turnover."
            value={dto => dto.financialYearEndDate}
            update={(x, val) => {
              x.financialYearEndDate = val;
            }}
            startOrEnd="end"
            validation={props.validator.financialYearEndDate}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Turnover (£)">
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
        <Form.Fieldset heading="State aid eligibility">
          <ACC.ValidationMessage message={"If we decide to award this organisation funding they must be eligible to receive State aid at the point of the award. If they are found to be ineligible, we will withdraw our offer."} messageType={"error"}/>
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>Save and continue</Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>Save and return to summary</Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
