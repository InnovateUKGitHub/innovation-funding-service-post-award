import * as ACC from "@ui/components";
import { PCRDto } from "@framework/dtos";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRLabourCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import React, { Component } from "react";

interface Props {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  validator: PCRLabourCostDtoValidator;
  isClient: boolean;
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto) => void;
  data: PCRSpendProfileLabourCostDto;
}

export class LabourFormComponent extends Component<Props> {
  render() {
    const { editor, validator, data } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileLabourCostDto>();

    return (
      <ACC.Section title={"New labour cost"}>
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
              label="Role within project"
              width={"one-third"}
              name="description"
              value={dto => dto.description}
              update={(x, val) => x.description = val}
              validation={validator && validator.description}
            />
            <Form.Numeric
              label={"Gross employee cost"}
              name="grossCostOfRole"
              width={"one-third"}
              value={dto => dto.grossCostOfRole}
              update={(dto, val) => dto.grossCostOfRole = val}
              validation={validator && validator.grossCostOfRole}
            />
            <Form.Numeric
              label={"Rate (£/day)"}
              hint={"This should be calculated from the number of working days for this role per year."}
              name="ratePerDay"
              width={"one-third"}
              value={dto => dto.ratePerDay}
              update={(dto, val) => dto.ratePerDay = val}
              validation={validator && validator.ratePerDay}
            />
            <Form.Numeric
              label={"Days to be spent by all staff with this role"}
              name="daysSpentOnProject"
              width={"one-third"}
              value={dto => dto.daysSpentOnProject}
              update={(dto, val) => dto.daysSpentOnProject = val}
              validation={validator && validator.daysSpentOnProject}
            />
            {this.props.isClient && <Form.Custom
              label={"Total cost:"}
              labelBold={true}
              hint={"Total cost will update when saved."}
              name="totalCost"
              validation={validator && validator.value}
              value={dto => <ACC.Renderers.SimpleString><ACC.Renderers.Currency value={dto.value}/></ACC.Renderers.SimpleString>}
              update={() => null}
            />}
          </Form.Fieldset>
          <Form.Fieldset qa="save">
            <Form.Submit>Save and return to labour costs</Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private onChange(dto: PCRSpendProfileLabourCostDto) {
    dto.value = dto.daysSpentOnProject && dto.ratePerDay ? dto.daysSpentOnProject * dto.ratePerDay : 0;
    this.props.onChange(this.props.editor.data);
  }
}
