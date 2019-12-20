import React from "react";
import * as ACC from "@ui/components";
import { PartnerDto, PCRItemForAccountNameChangeDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";

interface InnerProps {
  partners: PartnerDto[];
}

const InnerContainer = (props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForAccountNameChangeDto>();
  const partnerOptions: ACC.SelectOption[] = props.partners.map(x => (
    {
      id: x.id,
      value: x.name
    }
  ));
  const selectedPartnerOption = partnerOptions.find(x => x.id === props.pcrItem.partnerId);

  return (
    <ACC.Section>
      <Form.Form
        qa="changePartnerNameForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading="Select partner">
          <Form.Radio
            name="partnerId"
            hint={props.getRequiredToCompleteMessage()}
            options={partnerOptions}
            inline={false}
            value={() => selectedPartnerOption}
            update={(x, value) => x.partnerId = value && value.id}
            validation={props.validator.partnerId}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Enter new name">
          <Form.String
            label="Enter new name"
            hint={props.getRequiredToCompleteMessage()}
            labelHidden={true}
            name="accountName"
            value={x => x.accountName}
            update={(x, value) => x.accountName = value}
            validation={props.validator.accountName}
          />
        </Form.Fieldset>
        <Form.Submit>Save and continue</Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};

export const NameChangeStep = (props: PcrStepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.partners.getPartnersForProject(props.project.id)}
          render={x => <InnerContainer partners={x} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
