import React from "react";
import * as ACC from "@ui/components";
import { PartnerDto, PCRItemForAccountNameChangeDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { StepProps } from "@ui/containers/pcrs/workflow";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";

interface InnerProps {
  partners: PartnerDto[];
}

const InnerContainer = (props: StepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForAccountNameChangeDto>();
  const partnerOptions: ACC.SelectOption[] = props.partners.map(x => (
    {
      id: x.id,
      value: x.name
    }
  ));
  const selectedPartnerOption = partnerOptions.find(x => x.id === props.pcrItem.partnerId);

  const guidanceText = "This will change the partner's name in all projects they are claiming funding for. You must upload a change of name certificate from Companies House as evidence of the change.";

  return (
    <ACC.Section>
      <Form.Form
        qa="changePartnerNameForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <ACC.Renderers.SimpleString>{guidanceText}</ACC.Renderers.SimpleString>
        <Form.Fieldset heading="Select partner">
          <Form.Radio
            name="partnerId"
            options={partnerOptions}
            inline={false}
            value={() => selectedPartnerOption}
            update={(x, value) => x.partnerId = value && value.id}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Enter new name">
          <Form.String
            label="Enter new name"
            labelHidden={true}
            name="accountName"
            value={x => x.accountName}
            update={(x, value) => x.accountName = value}
          />
        </Form.Fieldset>
        <Form.Submit>Save and continue</Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};

export const NameChangeStep = (props: StepProps<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator>) => (
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
