import { PCRSpendProfileOtherCostsDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROtherCostsDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { Component } from "react";
import { EditorStatus } from "@ui/redux/constants/enums";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { SpendProfileCostFormProps } from "./spendProfilePrepareCost.page";

const Form = createTypedForm<PCRSpendProfileOtherCostsDto>();

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
            <Content
              value={x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name })}
            />
          </Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    );
  }
}
