import React from "react";
import * as ACC from "@ui/components";
import { PartnerDto, PCRItemForPartnerWithdrawalDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { PartnerName } from "@ui/components";

interface InnerProps {
  partners: PartnerDto[];
}

const InnerContainer = (props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForPartnerWithdrawalDto>();
  const partnerOptions: ACC.SelectOption[] = props.partners.filter(x => !x.isWithdrawn).map(x => (
    {
      id: x.id,
      value: <PartnerName partner={x}/>
    }
  ));
  const selectedPartnerOption = partnerOptions.find(x => x.id === props.pcrItem.partnerId);

  return (
    <ACC.Section>
      <Form.Form
        qa="withdrawPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset headingContent={x => x.pcrRemovePartner.selectPartnerHeading}>
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
        <Form.Fieldset headingContent={x => x.pcrRemovePartner.removalPeriodHeading}>
          <Form.Numeric
            labelContent={x => x.pcrRemovePartner.labels.removalPeriod}
            hintContent={x => x.pcrRemovePartner.removalPeriodHint}
            labelHidden={true}
            width={3}
            name="removalPeriod"
            value={x => x.removalPeriod}
            update={(x, value) => x.removalPeriod = value}
            validation={props.validator.removalPeriod}
          />
        </Form.Fieldset>
        <Form.Submit><ACC.Content value={x => x.pcrRemovePartner.pcrItem.submitButton()}/></Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};

export const RemovePartnerStep = (props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator>) => (
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
