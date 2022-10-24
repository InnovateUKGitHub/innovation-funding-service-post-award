import * as ACC from "@ui/components";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRLabourCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";

import { SpendProfileCostFormProps } from "@ui/containers";
import { EditorStatus } from "@ui/constants/enums";
import { useMounted } from "@ui/features";

export function LabourFormComponent({
  onSave,
  onChange,
  editor,
  validator,
  data,
  costCategory,
}: SpendProfileCostFormProps<PCRSpendProfileLabourCostDto, PCRLabourCostDtoValidator>) {
  const { isClient } = useMounted();

  const handleOnChange = (dto: PCRSpendProfileLabourCostDto) => {
    const newValue = dto.daysSpentOnProject && dto.ratePerDay ? dto.daysSpentOnProject * dto.ratePerDay : 0;

    dto.value = newValue;

    onChange(editor.data);
  };

  const Form = ACC.TypedForm<PCRSpendProfileLabourCostDto>();

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
            value={dto => (
              <ACC.Renderers.SimpleString>
                <ACC.Renderers.Currency value={dto.value} />
              </ACC.Renderers.SimpleString>
            )}
            update={() => null}
          />
        )}
      </Form.Fieldset>

      <Form.Fieldset qa="save">
        <Form.Submit>
          <ACC.Content
            value={x => x.pages.pcrSpendProfilePrepareCost.buttonSubmit({ costCategoryName: costCategory.name })}
          />
        </Form.Submit>
      </Form.Fieldset>
    </Form.Form>
  );
}
