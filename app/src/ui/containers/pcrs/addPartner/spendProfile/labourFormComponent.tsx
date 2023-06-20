import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRLabourCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { EditorStatus } from "@ui/constants/enums";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Currency } from "@ui/components/renderers/currency";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { useMounted } from "@ui/features/has-mounted/Mounted";
import { SpendProfileCostFormProps } from "./spendProfilePrepareCost.page";

const Form = createTypedForm<PCRSpendProfileLabourCostDto>();

export const LabourFormComponent = ({
  onSave,
  onChange,
  editor,
  validator,
  data,
  costCategory,
}: SpendProfileCostFormProps<PCRSpendProfileLabourCostDto, PCRLabourCostDtoValidator>) => {
  const { isClient } = useMounted();

  const handleOnChange = (dto: PCRSpendProfileLabourCostDto) => {
    const newValue = dto.daysSpentOnProject && dto.ratePerDay ? dto.daysSpentOnProject * dto.ratePerDay : 0;

    dto.value = newValue;

    onChange(editor.data);
  };

  return (
    <Form.Form
      qa="addPartnerForm"
      data={data}
      isSaving={editor.status === EditorStatus.Saving}
      onSubmit={() => onSave(editor.data)}
      onChange={handleOnChange}
    >
      <Form.Fieldset qa="labour-costs">
        <Form.Hidden name="id" value={dto => dto.id} />

        <Form.String
          label={x => x.pcrSpendProfileLabels.labour.role}
          width="one-third"
          name="description"
          value={dto => dto.description}
          update={(x, val) => (x.description = val)}
          validation={validator?.description}
        />

        <Form.Numeric
          label={x => x.pcrSpendProfileLabels.labour.grossCost}
          name="grossCostOfRole"
          width="one-third"
          value={dto => dto.grossCostOfRole}
          update={(dto, val) => (dto.grossCostOfRole = val)}
          validation={validator?.grossCostOfRole}
        />

        <Form.Numeric
          label={x => x.pcrSpendProfileLabels.labour.rate}
          hint={x => x.pcrSpendProfileLabels.labour.rateHint}
          name="ratePerDay"
          width="one-third"
          value={dto => dto.ratePerDay}
          update={(dto, val) => (dto.ratePerDay = val)}
          validation={validator?.ratePerDay}
        />

        <Form.Numeric
          label={x => x.pcrSpendProfileLabels.labour.daysSpentOnProject}
          name="daysSpentOnProject"
          width="one-third"
          value={dto => dto.daysSpentOnProject}
          update={(dto, val) => (dto.daysSpentOnProject = val)}
          validation={validator?.daysSpentOnProject}
        />

        {isClient && (
          <Form.Custom
            label={x => x.pcrSpendProfileLabels.labour.totalCost}
            hint={x => x.pcrSpendProfileLabels.labour.totalCostHint}
            labelBold
            name="totalCost"
            value={({ formData }) => (
              <SimpleString>
                <Currency value={formData.value} />
              </SimpleString>
            )}
            update={() => null}
          />
        )}
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
};
