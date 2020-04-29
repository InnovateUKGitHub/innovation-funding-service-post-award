import React from "react";
import * as ACC from "@ui/components";
import { Option, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PCRProjectLocation } from "@framework/types";

interface InnerProps {
  pcrProjectLocation: Option<PCRProjectLocation>[];
}

const InnerContainer = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  const projectLocationOptions: ACC.SelectOption[] = props.pcrProjectLocation
    .filter(x => x.active)
    .map(x => ({ id: x.value.toString(), value: x.label }));
  const defaultOption = props.pcrProjectLocation.find(x => x.defaultValue === true);
  const selectedProjectLocationOption =
    props.pcrItem.projectLocation && projectLocationOptions.find(x => parseInt(x.id, 10) === props.pcrItem.projectLocation)
    || defaultOption && projectLocationOptions.find(x => x.id === defaultOption.value.toString());

  return (
    <ACC.Section title="Project location">
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset>
          <Form.Radio
            name="projectLocation"
            hint="Indicate where the majority of the work being done by this partner will take place."
            options={projectLocationOptions}
            inline={false}
            value={() => selectedProjectLocationOption}
            update={(x, option) => {
              if (!option) return x.projectLocation === PCRProjectLocation.Unknown;
              x.projectLocation = parseInt(option.id, 10);
            }}
            validation={props.validator.projectLocation}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Name of town or city">
          <Form.String
            name="projectCity"
            value={dto => dto.projectCity}
            update={(x, val) => {
              x.projectCity = val;
            }}
            validation={props.validator.projectCity}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Postcode, postal code or zip code">
          <Form.String
            name="projectPostcode"
            hint="If this is not available, leave this blank."
            value={dto => dto.projectPostcode}
            update={(x, val) => {
              x.projectPostcode = val;
            }}
            validation={props.validator.projectPostcode}
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

export const ProjectLocationStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.projectChangeRequests.getPcrProjectLocations()}
          render={x => <InnerContainer pcrProjectLocation={x} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
