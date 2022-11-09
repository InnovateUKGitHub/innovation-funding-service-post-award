import React from "react";
import * as ACC from "@ui/components";
import { useStores } from "@ui/redux";
import { Option } from "@framework/dtos";
import { PCRSpendProfileCapitalUsageCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRCapitalUsageCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { SpendProfileCostFormProps } from "@ui/containers";
import { PCRSpendProfileCapitalUsageType } from "@framework/types";
import { EditorStatus } from "@ui/constants/enums";
import { roundCurrency } from "@framework/util";
import { MountedHoc } from "@ui/features";

interface InnerProps {
  types: Option<PCRSpendProfileCapitalUsageType>[];
}

const Form = ACC.createTypedForm<PCRSpendProfileCapitalUsageCostDto>();

class Component extends React.Component<
  SpendProfileCostFormProps<PCRSpendProfileCapitalUsageCostDto, PCRCapitalUsageCostDtoValidator> & InnerProps
> {
  render() {
    const { editor, validator, data, costCategory } = this.props;
    const typeOptions = this.getOptions(this.props.data.type, this.props.types);

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
            <Form.Fieldset qa="capital-usage-costs">
              <Form.Hidden name="id" value={dto => dto.id} />
              <Form.MultilineString
                label={x => x.pcrSpendProfileLabels.capitalUsage.description}
                name="description"
                value={dto => dto.description}
                update={(x, val) => (x.description = val)}
                validation={validator && validator.description}
              />
              <Form.Radio
                label={x => x.pcrSpendProfileLabels.capitalUsage.type}
                name="type"
                options={typeOptions.options}
                inline={false}
                value={() => typeOptions.selected}
                update={(x, option) => {
                  if (!option) return (x.type = PCRSpendProfileCapitalUsageType.Unknown);
                  x.type = parseInt(option.id, 10);
                }}
                validation={this.props.validator.type}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfileLabels.capitalUsage.depreciationPeriod}
                name="depreciationPeriod"
                width={"one-third"}
                value={dto => dto.depreciationPeriod}
                update={(dto, val) => (dto.depreciationPeriod = val)}
                validation={validator && validator.depreciationPeriod}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfileLabels.capitalUsage.netPresentValue}
                hint={x => x.pcrSpendProfileLabels.capitalUsage.netPresentValueHint}
                name="netPresentValue"
                width={"one-third"}
                value={dto => dto.netPresentValue}
                update={(dto, val) => (dto.netPresentValue = val)}
                validation={validator && validator.netPresentValue}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfileLabels.capitalUsage.residualValue}
                name="residualValue"
                width={"one-third"}
                value={dto => dto.residualValue}
                update={(dto, val) => (dto.residualValue = val)}
                validation={validator && validator.residualValue}
              />
              <Form.Numeric
                label={x => x.pcrSpendProfileLabels.capitalUsage.utilisation}
                name="utilisation"
                width={"one-third"}
                value={dto => dto.utilisation}
                update={(dto, val) => (dto.utilisation = val)}
                validation={validator && validator.utilisation}
              />
              {isClient && (
                <Form.Custom
                  label={x => x.pcrSpendProfileLabels.capitalUsage.netCost}
                  labelBold
                  name="netCost"
                  value={({ formData }) => (
                    <ACC.Renderers.SimpleString>
                      <ACC.Renderers.Currency value={formData.value} />
                    </ACC.Renderers.SimpleString>
                  )}
                />
              )}
            </Form.Fieldset>
            <Form.Fieldset qa="save">
              <Form.Submit>
                <ACC.Content
                  value={x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name })}
                />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        )}
      </MountedHoc>
    );
  }

  private getOptions<T extends number>(selected: T, options: Option<T>[]) {
    const filteredOptions: ACC.SelectOption[] = options
      .filter(x => x.active)
      .map(x => ({ id: x.value.toString(), value: x.label }));

    const selectedOption = selected && filteredOptions.find(x => parseInt(x.id, 10) === selected);

    return { options: filteredOptions, selected: selectedOption };
  }

  private onChange(dto: PCRSpendProfileCapitalUsageCostDto) {
    dto.value =
      dto.utilisation && dto.netPresentValue && dto.residualValue
        ? roundCurrency((dto.utilisation / 100) * (dto.netPresentValue - dto.residualValue))
        : 0;
    this.props.onChange(this.props.editor.data);
  }
}

export const CapitalUsageFormComponent = (
  props: SpendProfileCostFormProps<PCRSpendProfileCapitalUsageCostDto, PCRCapitalUsageCostDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequests.getPcrSpendProfileCapitalUsageType()}
      render={x => <Component types={x} {...props} />}
    />
  );
};
