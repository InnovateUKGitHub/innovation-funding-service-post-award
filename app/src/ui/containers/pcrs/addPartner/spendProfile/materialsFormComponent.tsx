import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import React, { Component } from "react";
import { PCRMaterialsCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { SpendProfileCostFormProps } from "@ui/containers";

export class MaterialsFormComponent extends Component<SpendProfileCostFormProps<PCRSpendProfileMaterialsCostDto, PCRMaterialsCostDtoValidator>> {
  render() {
    const { editor, validator, data, costCategory } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileMaterialsCostDto>();

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={dto => this.onChange(dto)}
      >
        <Form.Fieldset qa="materials-costs">
          <Form.Hidden
            name="id"
            value={dto => dto.id}
          />
          <Form.String
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.materials.item}
            width={"one-third"}
            name="description"
            value={dto => dto.description}
            update={(x, val) => x.description = val}
            validation={validator && validator.description}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.materials.quantity}
            name="quantity"
            width={"one-third"}
            value={dto => dto.quantity}
            update={(dto, val) => dto.quantity = val}
            validation={validator && validator.quantity}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.materials.costPerItem}
            name="costPerItem"
            width={"one-third"}
            value={dto => dto.costPerItem}
            update={(dto, val) => dto.costPerItem = val}
            validation={validator && validator.costPerItem}
          />
          {this.props.isClient && <Form.Custom
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.materials.totalCost}
            labelBold={true}
            name="totalCost"
            value={dto => <ACC.Renderers.SimpleString><ACC.Renderers.Currency value={dto.value}/></ACC.Renderers.SimpleString>}
            update={() => null}
          />}
        </Form.Fieldset>
        <Form.Fieldset qa="save">
          <Form.Submit><ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.submitButton(costCategory.name)}/></Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private onChange(dto: PCRSpendProfileMaterialsCostDto) {
    dto.value = dto.quantity && dto.costPerItem ? dto.quantity * dto.costPerItem : 0;
    this.props.onChange(this.props.editor.data);
  }
}
