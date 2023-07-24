import React from "react";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { EditorStatus } from "@ui/redux/constants/enums";
import { Pending } from "@shared/pending";
import { PCRAcademicCostDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { CostCategoryType } from "@framework/constants/enums";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { sumBy } from "@framework/util/numberHelper";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm, FormBuilder } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { MountedHoc } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { ValidationError } from "@ui/components/atomicDesign/molecules/validation/ValidationError/validationError";
import { NumberInput } from "@ui/components/bjss/inputs/numberInput";
import { Loader } from "@ui/components/bjss/loading";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface Data {
  costCategory: CostCategoryDto;
  costDto: PCRSpendProfileAcademicCostDto;
}

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
const Table = createTypedTable<Data>();

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps,
  Data
> {
  render() {
    const { costCategories } = this.props;
    return (
      <Section title={x => x.pcrAddPartnerLabels.projectCostsHeading}>
        <SimpleString>
          <Content value={x => x.pages.pcrAddPartnerAcademicCosts.stepGuidance} />
        </SimpleString>
        <Form.Form
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.props.onSave(false)}
          onChange={dto => this.props.onChange(dto)}
          qa="academic-costs-form"
        >
          {this.renderTsb(Form)}
          {this.renderCosts(Form, costCategories)}
          {this.renderSaveButtons(Form)}
        </Form.Form>
      </Section>
    );
  }

  private renderTsb(form: FormBuilder<PCRItemForPartnerAdditionDto>) {
    return (
      <form.Fieldset heading={x => x.pcrAddPartnerLabels.tsbReferenceHeading}>
        <form.String
          label={x => x.pages.pcrAddPartnerAcademicCosts.tsbLabel}
          width={"one-third"}
          name="tsbReference"
          value={dto => dto.tsbReference}
          update={(x, val) => (x.tsbReference = val)}
          validation={this.props.validator.tsbReference}
        />
      </form.Fieldset>
    );
  }

  private renderCosts(form: FormBuilder<PCRItemForPartnerAdditionDto>, costCategories: CostCategoryDto[]) {
    const data = costCategories
      .map(costCategory => {
        return {
          costCategory,
          costDto: this.props.pcrItem.spendProfile.costs.find(
            x => x.costCategoryId === costCategory.id,
          ) as PCRSpendProfileAcademicCostDto,
        };
      })
      .filter(x => !!x);
    const total = sumBy(data, x => x.costDto.value || 0);

    return (
      <form.Fieldset heading={x => x.pages.pcrAddPartnerAcademicCosts.costsSectionTitle}>
        <SimpleString>
          <Content value={x => x.pages.pcrAddPartnerAcademicCosts.costsGuidance} />
        </SimpleString>

        <MountedHoc>
          {state => (
            <Table.Table qa="costsTable" data={data}>
              <Table.String
                header={x => x.pages.pcrAddPartnerAcademicCosts.categoryHeading}
                qa="category"
                value={x => x.costCategory.name}
                footer={
                  state.isClient && (
                    <SimpleString className={"govuk-!-font-weight-bold"}>
                      <Content value={x => x.pages.pcrAddPartnerAcademicCosts.totalCosts} />
                    </SimpleString>
                  )
                }
              />
              <Table.Custom
                header={x => x.pages.pcrAddPartnerAcademicCosts.costHeading}
                qa="cost-value"
                classSuffix="numeric"
                value={x => this.renderCost(x)}
                width={30}
                footer={state.isClient && <Currency value={total} />}
              />
            </Table.Table>
          )}
        </MountedHoc>
      </form.Fieldset>
    );
  }

  private renderSaveButtons(form: FormBuilder<PCRItemForPartnerAdditionDto>) {
    return (
      <form.Fieldset qa="save-and-continue">
        <form.Submit>
          <Content value={x => x.pcrItem.submitButton} />
        </form.Submit>
        <form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>
          <Content value={x => x.pcrItem.returnToSummaryButton} />
        </form.Button>
      </form.Fieldset>
    );
  }

  private renderCost(item: Data) {
    const error = this.getCostValidationResult(item);
    return (
      <span>
        <ValidationError error={error} />
        <NumberInput
          name={`value_${item.costCategory.id}`}
          value={item.costDto.value}
          onChange={val => this.updateCostValue(item, val)}
          ariaLabel={`value of academic cost item ${item.costCategory.name}`}
        />
      </span>
    );
  }

  private updateCostValue(item: Data, value: number | null) {
    item.costDto.value = value;
    this.props.onChange(this.props.pcrItem);
  }

  private getCostValidationResult(item: Data) {
    const validator = this.props.validator.spendProfile.results[0].costs.results.find(
      x => x.model.costCategoryId === item.costCategory.id,
    ) as PCRAcademicCostDtoValidator;

    return validator && validator.value;
  }
}

export const AcademicCostsStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  // Get list of academic cost categories, and add a cost item for each one (if not already there).
  const costCategories = stores.costCategories.getAllUnfiltered().then(allCostCategories => {
    const academicCostCategories = allCostCategories.filter(
      costCategory =>
        costCategory.organisationType === PCROrganisationType.Academic &&
        costCategory.competitionType === props.project.competitionType,
    );

    academicCostCategories.forEach(costCategory => {
      if (props.pcrItem.spendProfile.costs.every(x => x.costCategoryId !== costCategory.id)) {
        const cost: PCRSpendProfileAcademicCostDto = {
          id: "" as PcrId,
          costCategoryId: costCategory.id,
          costCategory: CostCategoryType.Academic,
          description: costCategory.name,
          value: 0,
        };
        props.pcrItem.spendProfile.costs.push(cost);
      }
    });

    return academicCostCategories;
  });

  return <Loader pending={Pending.combine({ costCategories })} render={x => <Component {...props} {...x} />} />;
};