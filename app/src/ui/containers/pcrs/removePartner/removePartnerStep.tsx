import React from "react";
import * as ACC from "@ui/components";
import { PartnerDto, PCRItemForPartnerWithdrawalDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { periodInProject } from "@framework/util";
import { PartnerName } from "@ui/components";

interface InnerProps {
  partners: PartnerDto[];
}

const InnerContainer = (props: PcrStepProps<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForPartnerWithdrawalDto>();
  const partnerOptions: ACC.SelectOption[] = props.partners.map(x => (
    {
      id: x.id,
      value: <PartnerName partner={x}/>
    }
  ));
  const selectedPartnerOption = partnerOptions.find(x => x.id === props.pcrItem.partnerId);

  const renderRemovalPeriodText = (removalPeriod: number | null) => {
    if (!removalPeriod) return null;

    return <ACC.Renderers.SimpleString>{`This will happen in period ${removalPeriod}`}</ACC.Renderers.SimpleString>;
  };

  return (
    <ACC.Section>
      <Form.Form
        qa="withdrawPartnerForm"
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
        <Form.Fieldset heading="Removal date">
          <Form.Date
            label="Removal date"
            hint={props.getRequiredToCompleteMessage()}
            labelHidden={true}
            name="withdrawalDate"
            value={x => x.withdrawalDate}
            update={(x, value) => x.withdrawalDate = value}
            validation={props.validator.withdrawalDate}
          />
        </Form.Fieldset>
        {props.isClient && renderRemovalPeriodText(periodInProject(props.pcrItem.withdrawalDate, props.project))}
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
