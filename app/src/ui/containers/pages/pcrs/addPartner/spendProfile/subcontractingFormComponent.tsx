import { PCRSpendProfileSubcontractingCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { Component } from "react";
import { PCRSubcontractingCostDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { EditorStatus } from "@ui/redux/constants/enums";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { SpendProfileCostFormProps } from "./spendProfilePrepareCost.page";

const Form = createTypedForm<PCRSpendProfileSubcontractingCostDto>();

export class SubcontractingFormComponent extends Component<
  SpendProfileCostFormProps<PCRSpendProfileSubcontractingCostDto, PCRSubcontractingCostDtoValidator>
> {
  render() {
    const { editor, validator, data, costCategory } = this.props;

    return (
      <Form.Form
        qa="addPartnerForm"
        data={data}
        isSaving={editor.status === EditorStatus.Saving}
        onSubmit={() => this.props.onSave(editor.data)}
        onChange={() => this.props.onChange(editor.data)}
      >
        <Form.Fieldset qa="subcontracting-costs">
          <Form.Hidden name="id" value={dto => dto.id} />
          <Form.String
            label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorName}
            width={"one-half"}
            name="description"
            value={dto => dto.description}
            update={(x, val) => (x.description = val)}
            validation={validator && validator.description}
          />
          <Form.String
            label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorCountry}
            width={"one-half"}
            name="subcontractorCountry"
            value={dto => dto.subcontractorCountry}
            update={(x, val) => (x.subcontractorCountry = val)}
            validation={validator && validator.subcontractorCountry}
          />
          <Form.MultilineString
            label={x => x.pcrSpendProfileLabels.subcontracting.subcontractorRoleAndDescription}
            name="subcontractorRoleAndDescription"
            value={dto => dto.subcontractorRoleAndDescription}
            update={(x, val) => (x.subcontractorRoleAndDescription = val)}
            validation={validator && validator.subcontractorRoleAndDescription}
          />
          <Form.Numeric
            label={x => x.pcrSpendProfileLabels.subcontracting.cost}
            name="value"
            width={"one-quarter"}
            value={dto => dto.value}
            update={(dto, val) => (dto.value = val)}
            validation={validator && validator.value}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save">
          <Form.Submit>
            <Content
              value={x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name })}
            />
          </Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    );
  }
}
