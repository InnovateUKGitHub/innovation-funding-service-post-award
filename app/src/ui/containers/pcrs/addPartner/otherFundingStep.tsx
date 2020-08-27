import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { Content } from "@ui/components";

export const OtherFundingStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();

  const options: ACC.SelectOption[] = [{
    id: "true", value: <Content value={x => x.pcrAddPartnerOtherFunding.labels.otherFundsYes()}/>
  }, {
    id: "false", value: <Content value={x => x.pcrAddPartnerOtherFunding.labels.otherFundsNo()}/>
  }];

  return (
    <ACC.Section titleContent={x => x.pcrAddPartnerOtherFunding.formSectionTitle()}>
      <Content value={x => x.pcrAddPartnerOtherFunding.guidance()} />
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset>
          <Form.Radio
            name="hasOtherFunding"
            labelContent={x => x.pcrAddPartnerOtherFunding.questionLabel()}
            labelHidden={true}
            options={options}
            inline={false}
            value={(dto) => {
              if (dto.hasOtherFunding === null || dto.hasOtherFunding === undefined) return null;
              return options.find(x => x.id === dto.hasOtherFunding!.toString());
            }}
            update={(dto, option) => {
              if (!option) return dto.hasOtherFunding = null;
              dto.hasOtherFunding = option.id === "true";
            }}
            validation={props.validator.hasOtherFunding}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>
            <ACC.Content value={x => x.pcrAddPartnerOtherFunding.pcrItem.submitButton()}/>
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <Content value={x => x.pcrAddPartnerOtherFunding.pcrItem.returnToSummaryButton()} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
