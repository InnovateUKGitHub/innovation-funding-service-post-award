import React from "react";
import * as ACC from "@ui/components";
import { Option, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { PCRPartnerType, PCRProjectRole } from "@framework/constants";
import { SimpleString } from "@ui/components/renderers";

interface InnerProps {
  pcrProjectRoles: Option<PCRProjectRole>[];
  pcrPartnerTypes: Option<PCRPartnerType>[];
}

const InnerContainer = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  const roleOptions: ACC.SelectOption[] = props.pcrProjectRoles
    .filter(x => x.active)
    .map(x => ({ id: x.value.toString(), value: x.label }));

  const defaultRole = props.pcrProjectRoles.find(x => x.defaultValue === true);
  const selectedRoleOption =
    props.pcrItem.projectRole && roleOptions.find(x => parseInt(x.id, 10) === props.pcrItem.projectRole)
    || defaultRole && roleOptions.find(x => x.id === defaultRole.value.toString());

  const typeOptions: ACC.SelectOption[] = props.pcrPartnerTypes
    .filter(x => x.active)
    .map(x => ({ id: x.value.toString(), value: x.label }));

  const defaultType = props.pcrPartnerTypes.find(x => x.defaultValue === true);
  const selectedTypeOption = props.pcrItem.partnerType && typeOptions.find(x => parseInt(x.id, 10) === props.pcrItem.partnerType)
    || defaultType && typeOptions.find(x => x.id === defaultType.value.toString());

  return (
    <ACC.Section qa="role-and-partner-type" title={"New partner information"}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave()}
        onChange={dto => props.onChange(dto)}
      >
        <ACC.ValidationMessage messageType="info" message="You cannot change this information after you continue."/>
        <Form.Fieldset heading="Project role">
          <Form.Radio
            name="projectRole"
            options={roleOptions}
            inline={false}
            value={() => selectedRoleOption}
            update={(x, option) => {
              if (!option) return x.projectRole === PCRProjectRole.Unknown;
              x.projectRole = parseInt(option.id, 10);
            }}
            validation={props.validator.projectRole}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Organisation type">
          <ACC.Info summary="What are the different types?">
            {/* tslint:disable-next-line:no-duplicate-string TODO move this to content (so hardcoding class here doesn't matter)*/}
            <SimpleString><span className={"govuk-!-font-weight-bold"}>Business</span> - a business based in the UK or overseas.</SimpleString>
            <SimpleString><span className={"govuk-!-font-weight-bold"}>Research</span> - higher education and organisations registered with Je-S.</SimpleString>
            <SimpleString><span className={"govuk-!-font-weight-bold"}>Research and technology organisation (RTO)</span> - organisations which solely promote and conduct collaborative research and innovation.</SimpleString>
            <SimpleString><span className={"govuk-!-font-weight-bold"}>Public sector, charity or non Je-S registered research organisation</span> - a not-for-profit public sector body or charity working on innovation, not registered with Je-S.</SimpleString>
          </ACC.Info>
          <Form.Radio
            name="partnerType"
            hint="If the new partner's organisation type is not listed, contact your monitoring officer."
            options={typeOptions}
            inline={false}
            value={() => selectedTypeOption}
            update={(x, option) => {
              if (!option) return x.partnerType === PCRPartnerType.Unknown;
              x.partnerType = parseInt(option.id, 10);
            }}
            validation={props.validator.partnerType}
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

export const RoleAndOrganisationStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        const pcrProjectRoles = stores.projectChangeRequests.getPcrProjectRoles();
        const pcrPartnerTypes = stores.projectChangeRequests.getPcrPartnerTypes();
        return <ACC.Loader
          pending={Pending.combine({pcrProjectRoles, pcrPartnerTypes})}
          render={x => <InnerContainer pcrProjectRoles={x.pcrProjectRoles} pcrPartnerTypes={x.pcrPartnerTypes} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
