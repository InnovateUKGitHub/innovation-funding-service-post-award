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
        <Form.Fieldset heading="Select partner to remove">
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
        <Form.Fieldset heading="When is their last period?">
          <Form.Numeric
            label="Removal period"
            hint="The partner can make a claim for this period before being removed. If they have a claim in progress, they will be removed once that claim has been paid."
            labelHidden={true}
            width={3}
            name="removalPeriod"
            value={x => x.removalPeriod}
            update={(x, value) => x.removalPeriod = value}
            validation={props.validator.removalPeriod}
          />
        </Form.Fieldset>
        <Form.Submit>Save and continue</Form.Submit>
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
