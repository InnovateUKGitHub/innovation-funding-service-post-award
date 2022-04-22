import * as ACC from "@ui/components";
import { PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Component } from "react";
import { PCRMaterialsCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { SpendProfileCostFormProps } from "@ui/containers";
import { EditorStatus } from "@ui/constants/enums";
import { MountedHoc } from "@ui/features";

export class MaterialsFormComponent extends Component<
  SpendProfileCostFormProps<PCRSpendProfileMaterialsCostDto, PCRMaterialsCostDtoValidator>
> {
  render() {
    const { editor, validator, data, costCategory } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileMaterialsCostDto>();

    return (
      <MountedHoc>
        {({ isClient }) => (
          <Form.Form
            qa="addPartnerForm"
            data={data}
            isSaving={editor.status === EditorStatus.Saving}
            onSubmit={() => this.props.onSave(editor.data)}
            onChange={dto => this.onChange(dto)}
          >
            <Form.Fieldset qa="materials-costs">
              <Form.Hidden name="id" value={dto => dto.id} />
              <Form.String
                label={x => x.pcrSpendProfilePrepareCostContent.labels.materials.item}
                width={"one-third"}
                name="description"
                value={dto => dto.description}
                update={(x, val) => (x.description = val)}
                validation={validator && validator.description}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfilePrepareCostContent.labels.materials.quantity}
                name="quantity"
                width={"one-third"}
                value={dto => dto.quantity}
                update={(dto, val) => (dto.quantity = val)}
                validation={validator && validator.quantity}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfilePrepareCostContent.labels.materials.costPerItem}
                name="costPerItem"
                width={"one-third"}
                value={dto => dto.costPerItem}
                update={(dto, val) => (dto.costPerItem = val)}
                validation={validator && validator.costPerItem}
              />

              {isClient && (
                <Form.Custom
                  label={x => x.pcrSpendProfilePrepareCostContent.labels.materials.totalCost}
                  labelBold
                  name="totalCost"
                  value={dto => (
                    <ACC.Renderers.SimpleString>
                      <ACC.Renderers.Currency value={dto.value} />
                    </ACC.Renderers.SimpleString>
                  )}
                  update={() => null}
                />
              )}
            </Form.Fieldset>
            <Form.Fieldset qa="save">
              <Form.Submit>
                <ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.submitButton(costCategory.name)} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        )}
      </MountedHoc>
    );
  }

  private onChange(dto: PCRSpendProfileMaterialsCostDto) {
    dto.value = dto.quantity && dto.costPerItem ? dto.quantity * dto.costPerItem : 0;
    this.props.onChange(this.props.editor.data);
  }
}
