import React from "react";
import * as ACC from "@ui/components";
import { Option, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { PCRPartnerType, PCRProjectRole } from "@framework/constants";

interface InnerProps {
  pcrProjectRoles: Option<PCRProjectRole>[];
  pcrPartnerTypes: Option<PCRPartnerType>[];
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps> {

  render() {
    const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();

    const roleOptions = this.getOptions(this.props.pcrItem.projectRole, this.props.pcrProjectRoles);
    const typeOptions = this.getOptions(this.props.pcrItem.partnerType, this.props.pcrPartnerTypes);

    return (
      <ACC.Section qa="role-and-partner-type" titleContent={x => x.pcrAddPartnerRoleAndOrganisation.formSectionTitle()}>
        <Form.Form
          qa="addPartnerForm"
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.onSave(this.props.pcrItem)}
          onChange={dto => this.onChange(dto)}
        >
          <ACC.ValidationMessage messageType="info" messageContent={x => x.pcrAddPartnerRoleAndOrganisation.validationMessage()}/>
          <Form.Fieldset headingContent={x => x.pcrAddPartnerRoleAndOrganisation.labels.roleHeading()}>
            <Form.Radio
              name="projectRole"
              options={roleOptions.options}
              inline={false}
              value={() => roleOptions.selected}
              update={(x, option) => {
                if (!option) return x.projectRole === PCRProjectRole.Unknown;
                x.projectRole = parseInt(option.id, 10);
              }}
              validation={this.props.validator.projectRole}
            />
          </Form.Fieldset>
          <Form.Fieldset headingContent={x => x.pcrAddPartnerRoleAndOrganisation.labels.organisationHeading()}>
            <ACC.Info summary={<ACC.Content value={x => x.pcrAddPartnerRoleAndOrganisation.infoSummary()}/>}>
              <ACC.Content value={x => x.pcrAddPartnerRoleAndOrganisation.organisationTypeInfo()}/>
            </ACC.Info>
            <Form.Radio
              name="partnerType"
              hintContent={x => x.pcrAddPartnerRoleAndOrganisation.organisationTypeHint()}
              options={typeOptions.options}
              inline={false}
              value={() => typeOptions.selected}
              update={(x, option) => {
                if (!option) return x.partnerType === PCRPartnerType.Unknown;
                x.partnerType = parseInt(option.id, 10);
              }}
              validation={this.props.validator.partnerType}
            />
        </Form.Fieldset>
          <Form.Fieldset qa="save-and-continue">
            <Form.Submit><ACC.Content value={x => x.pcrAddPartnerRoleAndOrganisation.pcrItem.submitButton()}/></Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => this.onSave(this.props.pcrItem, true)}><ACC.Content value={x => x.pcrAddPartnerRoleAndOrganisation.pcrItem.returnToSummaryButton()}/></Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private onSave(dto: PCRItemForPartnerAdditionDto, skipToSummary?: boolean) {
    this.onChange(dto);
    this.props.onSave(skipToSummary);
  }

  private onChange(dto: PCRItemForPartnerAdditionDto) {
    dto.isProjectRoleAndPartnerTypeRequired = true;
    this.props.onChange(dto);
  }

  private getOptions<T extends number>(selected: T, options: Option<T>[]) {
    const filteredOptions: ACC.SelectOption[] = options
      .filter(x => x.active)
      .map(x => ({ id: x.value.toString(), value: x.label }));

    const defaultSelection = options.find(x => x.defaultValue === true);
    const selectedOption = selected && filteredOptions.find(x => parseInt(x.id, 10) === selected)
      || defaultSelection && filteredOptions.find(x => x.id === defaultSelection.value.toString());

    return {options: filteredOptions, selected: selectedOption};
  }
}

export const RoleAndOrganisationStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        const pcrProjectRoles = stores.projectChangeRequests.getPcrProjectRoles();
        const pcrPartnerTypes = stores.projectChangeRequests.getPcrPartnerTypes();
        return <ACC.Loader
          pending={Pending.combine({pcrProjectRoles, pcrPartnerTypes})}
          render={x => <Component pcrProjectRoles={x.pcrProjectRoles} pcrPartnerTypes={x.pcrPartnerTypes} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);
