import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRSpendProfileTravelAndSubsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRTravelAndSubsCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import React, { Component } from "react";
import { SpendProfileCostFormProps } from "@ui/containers";

export class TravelAndSubsFormComponent extends Component<SpendProfileCostFormProps<PCRSpendProfileTravelAndSubsCostDto, PCRTravelAndSubsCostDtoValidator>> {
  render() {
    const { editor, validator, data, costCategory } = this.props;
    const Form = ACC.TypedForm<PCRSpendProfileTravelAndSubsCostDto>();

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={dto => this.onChange(dto)}
      >
        <Form.Fieldset qa="travel-and-subs-costs">
          <Form.Hidden
            name="id"
            value={dto => dto.id}
          />
          <Form.String
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.description()}
            width={"one-half"}
            name="description"
            value={dto => dto.description}
            update={(x, val) => x.description = val}
            validation={validator && validator.description}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.numberOfTimes()}
            name="numberOfTimes"
            width={"one-third"}
            value={dto => dto.numberOfTimes}
            update={(dto, val) => dto.numberOfTimes = val}
            validation={validator && validator.numberOfTimes}
          />
          <Form.Numeric
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.costOfEach()}
            name="costOfEach"
            width={"one-third"}
            value={dto => dto.costOfEach}
            update={(dto, val) => dto.costOfEach = val}
            validation={validator && validator.costOfEach}
          />
          {this.props.isClient && <Form.Custom
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.totalCost()}
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

  private onChange(dto: PCRSpendProfileTravelAndSubsCostDto) {
    dto.value = dto.numberOfTimes && dto.costOfEach ? dto.numberOfTimes * dto.costOfEach : 0;
    this.props.onChange(this.props.editor.data);
  }
}
