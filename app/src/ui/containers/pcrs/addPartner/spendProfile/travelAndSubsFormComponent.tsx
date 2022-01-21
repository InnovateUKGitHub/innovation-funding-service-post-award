import * as ACC from "@ui/components";
import { PCRSpendProfileTravelAndSubsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRTravelAndSubsCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";

import { SpendProfileCostFormProps } from "@ui/containers";
import { EditorStatus } from "@ui/constants/enums";
import { useMounted } from "@ui/features";

export function TravelAndSubsFormComponent({
  onSave,
  onChange,
  editor,
  validator,
  data,
  costCategory,
}: SpendProfileCostFormProps<PCRSpendProfileTravelAndSubsCostDto, PCRTravelAndSubsCostDtoValidator>) {
  const { isClient } = useMounted();

  const handleOnChange = (dto: PCRSpendProfileTravelAndSubsCostDto) => {
    const newValue = dto.numberOfTimes && dto.costOfEach ? dto.numberOfTimes * dto.costOfEach : 0;

    dto.value = newValue;

    onChange(editor.data);
  };

  const Form = ACC.TypedForm<PCRSpendProfileTravelAndSubsCostDto>();

  return (
    <Form.Form
      qa="addPartnerForm"
      data={data}
      isSaving={editor.status === EditorStatus.Saving}
      onSubmit={() => onSave(editor.data)}
      onChange={handleOnChange}
    >
      <Form.Fieldset qa="travel-and-subs-costs">
        <Form.Hidden name="id" value={dto => dto.id} />

        <Form.String
          labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.description}
          width="one-half"
          name="description"
          value={dto => dto.description}
          update={(x, val) => (x.description = val)}
          validation={validator && validator.description}
        />

        <Form.Numeric
          labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.numberOfTimes}
          name="numberOfTimes"
          width="one-third"
          value={dto => dto.numberOfTimes}
          update={(dto, val) => (dto.numberOfTimes = val)}
          validation={validator && validator.numberOfTimes}
        />

        <Form.Numeric
          labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.costOfEach}
          name="costOfEach"
          width="one-third"
          value={dto => dto.costOfEach}
          update={(dto, val) => (dto.costOfEach = val)}
          validation={validator && validator.costOfEach}
        />
        {isClient && (
          <Form.Custom
            labelContent={x => x.pcrSpendProfilePrepareCostContent.labels.travelAndSubs.totalCost}
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
          <ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.submitButton(costCategory.name)} />
        </Form.Submit>
      </Form.Fieldset>
    </Form.Form>
  );
}
