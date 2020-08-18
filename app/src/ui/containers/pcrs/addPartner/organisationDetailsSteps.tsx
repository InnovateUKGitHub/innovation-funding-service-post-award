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
    .filter(x => x.active && x.value !== PCRParticipantSize.Academic)
    .map(x => ({ id: x.value.toString(), value: x.label }));

  const selectedSizeOption = props.pcrItem.participantSize && sizeOptions.find(x => parseInt(x.id, 10) === props.pcrItem.participantSize);

  return (
    <ACC.Section titleContent={x => x.pcrAddPartnerOrganisationDetails.sectionTitle()}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset headingContent={x => x.pcrAddPartnerOrganisationDetails.labels.organisationSizeHeading()}>
          <React.Fragment>
            <SimpleString><ACC.Content value={x => x.pcrAddPartnerOrganisationDetails.guidance()}/></SimpleString>
          </React.Fragment>
          <Form.Radio
            name="participantSize"
            options={sizeOptions}
            inline={false}
            value={() => selectedSizeOption || undefined}
            update={(x, option) => {
              if (!option) return x.participantSize = PCRParticipantSize.Unknown;
              x.participantSize = parseInt(option.id, 10);
            }}
            validation={props.validator.participantSize}
          />
        </Form.Fieldset>
        <Form.Fieldset headingContent={x => x.pcrAddPartnerOrganisationDetails.labels.employeeCountHeading()}>
          <Form.Numeric
            name="numberOfEmployees"
            width={4}
            value={m => m.numberOfEmployees }
            update={(m, val) => m.numberOfEmployees = val}
            validation={props.validator.numberOfEmployees}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit><ACC.Content value={x => x.pcrAddPartnerOrganisationDetails.pcrItem.submitButton()}/></Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}><ACC.Content value={x => x.pcrAddPartnerOrganisationDetails.pcrItem.returnToSummaryButton()}/></Form.Button>
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
