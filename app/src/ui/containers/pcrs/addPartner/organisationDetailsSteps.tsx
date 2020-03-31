import React from "react";
import * as ACC from "@ui/components";
import { Option, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PCRParticipantSize } from "@framework/constants";
import { SimpleString } from "@ui/components/renderers";

interface InnerProps {
  pcrParticipantSize: Option<PCRParticipantSize>[];
}

const InnerContainer = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  const sizeOptions: ACC.SelectOption[] = props.pcrParticipantSize
    .filter(x => x.active)
    .map(x => ({ id: x.value.toString(), value: x.label }));

  const defaultSize = props.pcrParticipantSize.find(x => x.defaultValue === true);
  const selectedSizeOption =
    props.pcrItem.participantSize && sizeOptions.find(x => parseInt(x.id, 10) === props.pcrItem.participantSize)
    || defaultSize && sizeOptions.find(x => x.id === defaultSize.value.toString());

  return (
    <ACC.Section title={"Organisation details"}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading="Size">
          <React.Fragment>
            <SimpleString>This definition must include organisations that are part of the new partner organisation. That is, where the new partner organisation owns shares in another organisation or has shares owned by another organisation.</SimpleString>
            <SimpleString>Use the European Commission (EC) <a href="https://ec.europa.eu/growth/smes/business-friendly-environment/sme-definition_en"> small to medium enterprise (SME) definition</a> (opens in new window) for guidance.</SimpleString>
          </React.Fragment>
          <Form.Radio
            name="participantSize"
            options={sizeOptions}
            inline={false}
            value={() => selectedSizeOption}
            update={(x, option) => {
              if (!option) return x.participantSize === PCRParticipantSize.Unknown;
              x.participantSize = parseInt(option.id, 10);
            }}
            validation={props.validator.participantSize}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Number of full time employees">
          <Form.Numeric
            name="numberOfEmployees"
            width={4}
            value={m => m.numberOfEmployees }
            update={(m, val) => m.numberOfEmployees = val}
            validation={props.validator.numberOfEmployees}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>Save and continue</Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>Save and return to summary</Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};

export const OrganisationDetailsStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.projectChangeRequests.getPcrParticipantSizes()}
          render={x => <InnerContainer pcrParticipantSize={x} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
