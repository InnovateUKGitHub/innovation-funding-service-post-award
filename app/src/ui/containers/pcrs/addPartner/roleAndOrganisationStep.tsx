import React from "react";
import {
  PCRProjectRole,
  PCRPartnerType,
  PCRParticipantSize,
  getPCROrganisationType,
  PCROrganisationType,
} from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/content";
import { createTypedForm, SelectOption } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { ValidationMessage } from "@ui/components/validationMessage";
import { EditorStatus } from "@ui/constants/enums";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PcrStepProps } from "../pcrWorkflow";
import { Info } from "@ui/components/layout/info";
import { Option } from "@framework/dtos/option";
import { Loader } from "@ui/components/loading";

interface InnerProps {
  pcrProjectRoles: Option<PCRProjectRole>[];
  pcrPartnerTypes: Option<PCRPartnerType>[];
}

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps
> {
  render() {
    const roleOptions = this.getOptions(this.props.pcrItem.projectRole, this.props.pcrProjectRoles);
    const typeOptions = this.getOptions(this.props.pcrItem.partnerType, this.props.pcrPartnerTypes);
    const commercialWorkOptions: SelectOption[] = [
      {
        id: "true",
        value: <Content value={x => x.pcrAddPartnerLabels.commercialWorkYes} />,
      },
      {
        id: "false",
        value: <Content value={x => x.pcrAddPartnerLabels.commercialWorkNo} />,
      },
    ];
    return (
      <Section qa="role-and-partner-type" title={x => x.pages.pcrAddPartnerRoleAndOrganisation.formSectionTitle}>
        <Form.Form
          qa="addPartnerForm"
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.onSave(this.props.pcrItem)}
          onChange={dto => this.onChange(dto)}
        >
          <ValidationMessage
            messageType="info"
            message={x => x.pages.pcrAddPartnerRoleAndOrganisation.validationMessage}
          />
          <Form.Fieldset heading={x => x.pcrAddPartnerLabels.roleHeading}>
            <Form.Radio
              name="projectRole"
              options={roleOptions.options}
              inline={false}
              value={() => roleOptions.selected}
              update={(x, option) => {
                if (!option) return (x.projectRole = PCRProjectRole.Unknown);
                x.projectRole = parseInt(option.id, 10);
              }}
              validation={this.props.validator.projectRole}
            />
          </Form.Fieldset>
          <Form.Fieldset heading={x => x.pcrAddPartnerLabels.commercialWorkHeading}>
            <Form.Radio
              name="isCommercialWork"
              label={x => x.pcrAddPartnerLabels.commercialWorkLabel}
              hint={x => x.pcrAddPartnerLabels.commercialWorkLabelHint}
              options={commercialWorkOptions}
              inline={false}
              value={dto => {
                if (dto.isCommercialWork === null || dto.isCommercialWork === undefined) return null;
                return commercialWorkOptions.find(x => x.id === dto?.isCommercialWork?.toString());
              }}
              update={(dto, option) => {
                if (!option) return (dto.isCommercialWork = null);
                dto.isCommercialWork = option.id === "true";
              }}
              validation={this.props.validator.isCommercialWork}
            />
          </Form.Fieldset>
          <Form.Fieldset heading={x => x.pcrAddPartnerLabels.organisationHeading}>
            <Info summary={<Content value={x => x.pages.pcrAddPartnerRoleAndOrganisation.infoSummary} />}>
              <Content markdown value={x => x.pages.pcrAddPartnerRoleAndOrganisation.organisationTypeInfo} />
            </Info>
            <Form.Radio
              name="partnerType"
              hint={x => x.pages.pcrAddPartnerRoleAndOrganisation.organisationTypeHint}
              options={typeOptions.options}
              inline={false}
              value={() => typeOptions.selected}
              update={(x, option) => {
                // It's not possible to come back to this page after it's submitted
                // so we can assume that the participant size hasn't explicitly been set by the user yet
                // and it's safe for us to reset it
                x.participantSize = PCRParticipantSize.Unknown;
                if (!option) {
                  return (x.partnerType = PCRPartnerType.Unknown);
                }
                const selectedOption = parseInt(option.id, 10);
                // If the partner type is academic then the organisation step is skipped and the participant size is set to "Academic"
                const organisationType = getPCROrganisationType(selectedOption);
                if (organisationType === PCROrganisationType.Academic) {
                  x.participantSize = PCRParticipantSize.Academic;
                }
                x.organisationType = organisationType;
                x.partnerType = selectedOption;
              }}
              validation={this.props.validator.partnerType}
            />
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-continue">
            <Form.Submit>
              <Content value={x => x.pcrItem.submitButton} />
            </Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => this.onSave(this.props.pcrItem, true)}>
              <Content value={x => x.pcrItem.returnToSummaryButton} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </Section>
    );
  }

  private onSave(dto: PCRItemForPartnerAdditionDto, skipToSummary?: boolean) {
    this.onChange(dto);
    this.props.onSave(!!skipToSummary);
  }

  private onChange(dto: PCRItemForPartnerAdditionDto) {
    dto.isProjectRoleAndPartnerTypeRequired = true;
    this.props.onChange(dto);
  }

  private getOptions<T extends number>(selected: T, options: Option<T>[]) {
    const filteredOptions: SelectOption[] = options
      .filter(x => x.active)
      .map(x => ({ id: x.value.toString(), value: x.label }));

    const selectedOption = selected && filteredOptions.find(x => parseInt(x.id, 10) === selected);

    return { options: filteredOptions, selected: selectedOption };
  }
}

export const RoleAndOrganisationStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  const pcrProjectRoles = stores.projectChangeRequests.getPcrProjectRoles();
  const pcrPartnerTypes = stores.projectChangeRequests.getPcrPartnerTypes();

  return (
    <Loader
      pending={Pending.combine({ pcrProjectRoles, pcrPartnerTypes })}
      render={x => <Component pcrProjectRoles={x.pcrProjectRoles} pcrPartnerTypes={x.pcrPartnerTypes} {...props} />}
    />
  );
};
