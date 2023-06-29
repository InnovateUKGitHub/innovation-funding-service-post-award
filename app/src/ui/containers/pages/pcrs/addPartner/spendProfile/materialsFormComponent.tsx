import { PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Component } from "react";
import { PCRMaterialsCostDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { EditorStatus } from "@ui/redux/constants/enums";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { MountedHoc } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { SpendProfileCostFormProps } from "./spendProfilePrepareCost.page";

const Form = createTypedForm<PCRSpendProfileMaterialsCostDto>();

export class MaterialsFormComponent extends Component<
  SpendProfileCostFormProps<PCRSpendProfileMaterialsCostDto, PCRMaterialsCostDtoValidator>
> {
  render() {
    const { editor, validator, data, costCategory } = this.props;

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
                label={x => x.pcrSpendProfileLabels.materials.item}
                width={"one-third"}
                name="description"
                value={dto => dto.description}
                update={(x, val) => (x.description = val)}
                validation={validator && validator.description}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfileLabels.materials.quantity}
                name="quantity"
                width={"one-third"}
                value={dto => dto.quantity}
                update={(dto, val) => (dto.quantity = val)}
                validation={validator && validator.quantity}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfileLabels.materials.costPerItem}
                name="costPerItem"
                width={"one-third"}
                value={dto => dto.costPerItem}
                update={(dto, val) => (dto.costPerItem = val)}
                validation={validator && validator.costPerItem}
              />

              {isClient && (
                <Form.Custom
                  label={x => x.pcrSpendProfileLabels.materials.totalCost}
                  labelBold
                  name="totalCost"
                  value={({ formData }) => (
                    <SimpleString>
                      <Currency value={formData.value} />
                    </SimpleString>
                  )}
                  update={() => null}
                />
              )}
            </Form.Fieldset>
            <Form.Fieldset qa="save">
              <Form.Submit>
                <Content
                  value={x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name })}
                />
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
