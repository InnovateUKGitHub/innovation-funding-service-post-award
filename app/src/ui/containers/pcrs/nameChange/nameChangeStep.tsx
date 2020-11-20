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
  const partnerOptions: ACC.SelectOption[] = props.partners.filter(x => !x.isWithdrawn).map(x => (
    {
      id: x.id,
      value: <ACC.PartnerName partner={x}/>
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
        <Form.Fieldset headingContent={x => x.pcrNameChange.selectPartnerHeading}>
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
        <Form.Fieldset headingContent={x => x.pcrNameChange.enterNameHeading}>
          <Form.String
            labelContent={x => x.pcrNameChange.labels.enterName}
            hint={props.getRequiredToCompleteMessage()}
            labelHidden={true}
            name="accountName"
            value={x => x.accountName}
            update={(x, value) => x.accountName = value}
            validation={props.validator.accountName}
          />
        </Form.Fieldset>
        <Form.Submit><ACC.Content value={x => x.pcrNameChange.pcrItem.submitButton()}/></Form.Submit>
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
