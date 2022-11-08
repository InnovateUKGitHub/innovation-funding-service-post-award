import * as ACC from "@ui/components";
import { PCRSpendProfileOtherCostsDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROtherCostsDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { Component } from "react";
import { SpendProfileCostFormProps } from "@ui/containers";
import { EditorStatus } from "@ui/constants/enums";

const Form = ACC.createTypedForm<PCRSpendProfileOtherCostsDto>();

export class OtherCostsFormComponent extends Component<
  SpendProfileCostFormProps<PCRSpendProfileOtherCostsDto, PCROtherCostsDtoValidator>
> {
  render() {
    const { editor, validator, data, costCategory } = this.props;

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={() => this.props.onChange(editor.data)}
      >
        <Form.Fieldset qa="other-costs">
          <Form.Hidden name="id" value={dto => dto.id} />
          <Form.MultilineString
            label={x => x.pcrSpendProfileLabels.otherCosts.description}
            name="description"
            value={dto => dto.description}
            update={(x, val) => (x.description = val)}
            validation={validator && validator.description}
          />
          <Form.Numeric
            label={x => x.pcrSpendProfileLabels.otherCosts.totalCost}
            width="one-quarter"
            name="value"
            value={dto => dto.value}
            update={(dto, val) => (dto.value = val)}
            validation={validator && validator.value}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save">
          <Form.Submit>
            <ACC.Content
              value={x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name })}
            />
          </Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    );
  }
}
