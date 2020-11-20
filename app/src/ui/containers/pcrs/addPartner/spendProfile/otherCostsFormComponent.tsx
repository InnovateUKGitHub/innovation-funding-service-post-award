import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRSpendProfileOtherCostsDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROtherCostsDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import React, { Component } from "react";
import { SpendProfileCostFormProps } from "@ui/containers";

export class OtherCostsFormComponent extends Component<SpendProfileCostFormProps<PCRSpendProfileOtherCostsDto, PCROtherCostsDtoValidator>> {
  render() {
    const { editor, validator, data, costCategory } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileOtherCostsDto>();

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={() => this.props.onChange(editor.data)}
      >
        <Form.Fieldset qa="other-costs">
          <Form.Hidden
            name="id"
            value={dto => dto.id}
          />
          <Form.MultilineString
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.otherCosts.description}
            name="description"
            value={dto => dto.description}
            update={(x, val) => x.description = val}
            validation={validator && validator.description}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.otherCosts.totalCost}
            width="one-quarter"
            name="value"
            value={dto => dto.value}
            update={(dto, val) => dto.value = val}
            validation={validator && validator.value}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save">
          <Form.Submit><ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.submitButton(costCategory.name)}/></Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    );
  }
}
