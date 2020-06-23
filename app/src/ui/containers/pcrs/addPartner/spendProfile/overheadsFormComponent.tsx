import * as ACC from "@ui/components";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { Option, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRSpendProfileCostDto, PCRSpendProfileOverheadsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROverheadsCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import React from "react";
import { SpendProfileCostFormProps } from "@ui/containers";
import { PCRItemType, PCRSpendProfileOverheadRate } from "@framework/types";
import { roundCurrency } from "@framework/util";
import { CostCategoryType } from "@framework/entities";

interface InnerProps {
  rateOptions: Option<PCRSpendProfileOverheadRate>[];
}

class Component extends React.Component<SpendProfileCostFormProps<PCRSpendProfileOverheadsCostDto, PCROverheadsCostDtoValidator> & InnerProps> {
  render() {
    const { editor, validator, data, costCategory } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileOverheadsCostDto>();
    const rateOptions = this.getOptions(this.props.data.overheadRate, this.props.rateOptions);

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={dto => this.onChange(dto)}
      >
        <Form.Fieldset qa="overheads-costs">
          <Form.Hidden
            name="id"
            value={dto => dto.id}
          />
          <Form.Radio
              name="overheadRate"
              options={rateOptions.options}
              inline={false}
              value={() => rateOptions.selected}
              update={(x, option) => {
                if (!option) {
                  return x.overheadRate = PCRSpendProfileOverheadRate.Unknown;
                }
                x.overheadRate = parseInt(option.id, 10);
              }}
              validation={validator.overheadRate}
          />
          {this.renderFormHiddenSection(data, Form, validator)}
          {this.props.isClient && <Form.Custom
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.overheads.totalCost()}
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

  private getOptions<T extends number>(selected: T, options: Option<T>[]) {
    const filteredOptions: ACC.SelectOption[] = options
      .filter(x => x.active)
      .map(x => ({ id: x.value.toString(), value: x.label }));

    const selectedOption = selected && filteredOptions.find(x => parseInt(x.id, 10) === selected);

    return {options: filteredOptions, selected: selectedOption};
  }

  private renderFormHiddenSection(data: PCRSpendProfileOverheadsCostDto, form: ACC.FormBuilder<PCRSpendProfileOverheadsCostDto>, validator: PCROverheadsCostDtoValidator) {
    // If server rendering then always show hidden section
    if (this.props.isClient && data.overheadRate !== PCRSpendProfileOverheadRate.Calculated) return null;
    return (
      <form.Numeric
        labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.overheads.calculatedCost()}
        width="one-quarter"
        name="value"
        value={dto => dto.value}
        update={(dto, val) => dto.value = val}
        validation={validator && validator.value}
      />
    );
  }

  private getOverheadsCostValue(overheadsCostDto: PCRSpendProfileOverheadsCostDto, costs: PCRSpendProfileCostDto[]) {
    switch (overheadsCostDto.overheadRate) {
      case PCRSpendProfileOverheadRate.Unknown:
        return null;
      case PCRSpendProfileOverheadRate.Calculated:
        return overheadsCostDto.value;
      case PCRSpendProfileOverheadRate.Zero:
        return 0;
      case PCRSpendProfileOverheadRate.Twenty:
        const labourCosts = costs
          .filter(x => x.costCategory === CostCategoryType.Labour)
          .reduce((acc, item) => acc + (item.value || 0), 0);
        return roundCurrency(labourCosts * 20 / 100);
      default:
        return null;
    }
  }

  private onChange(dto: PCRSpendProfileOverheadsCostDto) {
    const pcrItem = this.props.editor.data.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
    const value = this.getOverheadsCostValue(dto, pcrItem.spendProfile.costs);
    dto.value = value;
    this.props.onChange(this.props.editor.data);
  }
}

export const OverheadsFormComponent = (props: SpendProfileCostFormProps<PCRSpendProfileOverheadsCostDto, PCROverheadsCostDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.projectChangeRequests.getPcrSpendProfileOverheadRateOptions()}
          render={x => <Component rateOptions={x} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
