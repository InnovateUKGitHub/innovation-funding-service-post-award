import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRLabourCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import React, { Component } from "react";
import { SpendProfileCostFormProps } from "@ui/containers";

export class LabourFormComponent extends Component<SpendProfileCostFormProps<PCRSpendProfileLabourCostDto, PCRLabourCostDtoValidator>> {
  render() {
    const { editor, validator, data, costCategory } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileLabourCostDto>();

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={dto => this.onChange(dto)}
      >
        <Form.Fieldset qa="labour-costs">
          <Form.Hidden
            name="id"
            value={dto => dto.id}
          />
          <Form.String
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.labour.role}
            width={"one-third"}
            name="description"
            value={dto => dto.description}
            update={(x, val) => x.description = val}
            validation={validator && validator.description}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.labour.grossCost}
            name="grossCostOfRole"
            width={"one-third"}
            value={dto => dto.grossCostOfRole}
            update={(dto, val) => dto.grossCostOfRole = val}
            validation={validator && validator.grossCostOfRole}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.labour.rate}
            hintContent={x => x.pcrSpendProfilePrepareCostContent.labels.labour.rateHint}
            name="ratePerDay"
            width={"one-third"}
            value={dto => dto.ratePerDay}
            update={(dto, val) => dto.ratePerDay = val}
            validation={validator && validator.ratePerDay}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.labour.daysOnProject}
            name="daysSpentOnProject"
            width={"one-third"}
            value={dto => dto.daysSpentOnProject}
            update={(dto, val) => dto.daysSpentOnProject = val}
            validation={validator && validator.daysSpentOnProject}
          />
          {this.props.isClient && <Form.Custom
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.labour.totalCost}
            hintContent={x => x.pcrSpendProfilePrepareCostContent.labels.labour.totalCostHint}
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

  private onChange(dto: PCRSpendProfileLabourCostDto) {
    dto.value = dto.daysSpentOnProject && dto.ratePerDay ? dto.daysSpentOnProject * dto.ratePerDay : 0;
    this.props.onChange(this.props.editor.data);
  }
}
