import { PCRSpendProfileTravelAndSubsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRTravelAndSubsCostDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { EditorStatus } from "@ui/redux/constants/enums";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { SpendProfileCostFormProps } from "./spendProfilePrepareCost.page";

const Form = createTypedForm<PCRSpendProfileTravelAndSubsCostDto>();

export const TravelAndSubsFormComponent = ({
  onSave,
  onChange,
  editor,
  validator,
  data,
  costCategory,
}: SpendProfileCostFormProps<PCRSpendProfileTravelAndSubsCostDto, PCRTravelAndSubsCostDtoValidator>) => {
  const { isClient } = useMounted();

  const handleOnChange = (dto: PCRSpendProfileTravelAndSubsCostDto) => {
    const newValue = dto.numberOfTimes && dto.costOfEach ? dto.numberOfTimes * dto.costOfEach : 0;

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
      <Form.Fieldset qa="travel-and-subs-costs">
        <Form.Hidden name="id" value={dto => dto.id} />

        <Form.String
          label={x => x.pcrSpendProfileLabels.travelAndSubs.description}
          width="one-half"
          name="description"
          value={dto => dto.description}
          update={(x, val) => (x.description = val)}
          validation={validator && validator.description}
        />

        <Form.Numeric
          label={x => x.pcrSpendProfileLabels.travelAndSubs.numberOfTimes}
          name="numberOfTimes"
          width="one-third"
          value={dto => dto.numberOfTimes}
          update={(dto, val) => (dto.numberOfTimes = val)}
          validation={validator && validator.numberOfTimes}
        />

        <Form.Numeric
          label={x => x.pcrSpendProfileLabels.travelAndSubs.costOfEach}
          name="costOfEach"
          width="one-third"
          value={dto => dto.costOfEach}
          update={(dto, val) => (dto.costOfEach = val)}
          validation={validator && validator.costOfEach}
        />
        {isClient && (
          <Form.Custom
            label={x => x.pcrSpendProfileLabels.travelAndSubs.totalCost}
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
