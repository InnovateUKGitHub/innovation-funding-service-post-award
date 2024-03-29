import { PCRSpendProfileCostDto, PCRSpendProfileOverheadsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROverheadsCostDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { EditorStatus } from "@ui/redux/constants/enums";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Pending } from "@shared/pending";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileOverheadRate, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { roundCurrency } from "@framework/util/numberHelper";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useStores } from "@ui/redux/storesProvider";
import { SpendProfileCostFormProps } from "./spendProfilePrepareCost.page";
import { Option } from "@framework/dtos/option";
import { Loader } from "@ui/components/bjss/loading";

interface InnerProps {
  rateOptions: Option<PCRSpendProfileOverheadRate>[];
  documents: DocumentSummaryDto[];
}

const Form = createTypedForm<PCRSpendProfileOverheadsCostDto>();

const SpendProfileCostForm = ({
  editor,
  validator,
  data,
  documents,
  params,
  ...props
}: SpendProfileCostFormProps<PCRSpendProfileOverheadsCostDto, PCROverheadsCostDtoValidator> & InnerProps) => {
  const { isClient } = useMounted();

  const getOptions = <T extends number>(selected: T, options: Option<T>[]) => {
    const filteredOptions: SelectOption[] = options
      .filter(x => x.active)
      .map(x => ({ id: x.value.toString(), value: x.label }));

    const selectedOption = selected && filteredOptions.find(x => parseInt(x.id, 10) === selected);

    return { options: filteredOptions, selected: selectedOption };
  };

  const getOverheadsCostValue = (
    overheadsCostDto: PCRSpendProfileOverheadsCostDto,
    costs: PCRSpendProfileCostDto[],
  ) => {
    const labourCosts = costs
      .filter(x => x.costCategory === CostCategoryType.Labour)
      .reduce((acc, item) => acc + (item.value || 0), 0);

    switch (overheadsCostDto.overheadRate) {
      case PCRSpendProfileOverheadRate.Unknown:
        return null;
      case PCRSpendProfileOverheadRate.Calculated:
        return overheadsCostDto.value;
      case PCRSpendProfileOverheadRate.Zero:
        return 0;
      case PCRSpendProfileOverheadRate.Twenty:
        return roundCurrency((labourCosts * 20) / 100);
      default:
        return null;
    }
  };

  const onChange = (dto: PCRSpendProfileOverheadsCostDto) => {
    const pcrItem = editor.data.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
    const value = getOverheadsCostValue(dto, pcrItem.spendProfile.costs);

    dto.value = value;

    props.onChange(editor.data);
  };

  const getUploadDocumentsLink = () => {
    return props.routes.pcrSpendProfileOverheadDocument.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    });
  };

  // If server rendering then always show hidden section
  const displayHiddenForm = !isClient || data.overheadRate === PCRSpendProfileOverheadRate.Calculated;

  const rateOptions = getOptions(data.overheadRate, props.rateOptions);

  return (
    <Form.Form
      qa="addPartnerForm"
      data={data}
      isSaving={editor.status === EditorStatus.Saving}
      onSubmit={() => props.onSave(editor.data)}
      onChange={dto => onChange(dto)}
    >
      <Form.Fieldset qa="overheads-costs">
        <Form.Hidden name="id" value={dto => dto.id} />
        <Form.Radio
          name="overheadRate"
          options={rateOptions.options}
          inline={false}
          value={() => rateOptions.selected}
          update={(x, option) => {
            if (!option) {
              return (x.overheadRate = PCRSpendProfileOverheadRate.Unknown);
            }
            x.overheadRate = parseInt(option.id, 10);
            // As we need to save the cost before moving to document upload page if overhead rate is calculated,
            // value is set to 0 here to prevent validation errors.
            if (x.overheadRate === PCRSpendProfileOverheadRate.Calculated && x.value === null) {
              x.value = 0;
            }
          }}
          validation={validator.overheadRate}
        />

        {displayHiddenForm && (
          <Form.Fieldset>
            <SimpleString>
              <Content value={x => x.spendProfileMessages.calculatedGuidanceOverheads} />
            </SimpleString>
            <Form.Button
              name="calculateOverheadsDocuments"
              onClick={() => props.onSave(editor.data, getUploadDocumentsLink())}
            >
              <Content value={x => x.pcrSpendProfileLabels.overheads.linkDocumentsUpload} />
            </Form.Button>

            <Section qa="overheads-form-section">
              <DocumentView hideHeader qa="overheads-documents" documents={documents} />
            </Section>

            <Form.Numeric
              label={x => x.pcrSpendProfileLabels.overheads.calculatedCost}
              width="one-quarter"
              name="value"
              value={dto => dto.value}
              update={(dto, val) => (dto.value = val)}
              validation={validator && validator.value}
            />
          </Form.Fieldset>
        )}

        {isClient && (
          <Form.Custom
            label={x => x.pcrSpendProfileLabels.overheads.totalCost}
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
          <Content value={x => x.pages.pcrSpendProfilePrepareCost.overheads.buttonSubmit} />
        </Form.Submit>
      </Form.Fieldset>
    </Form.Form>
  );
};

export const OverheadsFormComponent = (
  props: SpendProfileCostFormProps<PCRSpendProfileOverheadsCostDto, PCROverheadsCostDtoValidator>,
) => {
  const { projectChangeRequests, projectChangeRequestDocuments } = useStores();

  const rateOptions = projectChangeRequests.getPcrSpendProfileOverheadRateOptions();
  const documents = projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.params.projectId, props.params.itemId);

  return (
    <Loader
      pending={Pending.combine({ rateOptions, documents })}
      render={x => <SpendProfileCostForm {...props} rateOptions={x.rateOptions} documents={x.documents} />}
    />
  );
};
