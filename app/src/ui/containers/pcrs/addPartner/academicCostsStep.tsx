import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import React from "react";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import * as ACC from "@ui/components";
import { sum } from "@framework/util";
import { EditorStatus, StoresConsumer } from "@ui/redux";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryType } from "@framework/entities";
import { PCROrganisationType } from "@framework/constants";
import { Pending } from "@shared/pending";
import { PCRAcademicCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { Content, FormBuilder } from "@ui/components";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface Data {
  costCategory: CostCategoryDto;
  costDto: PCRSpendProfileAcademicCostDto;
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps, Data> {
  render() {
    const {costCategories} = this.props;
    const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
    return (
      <ACC.Section titleContent={x => x.pcrAddPartnerAcademicCosts.labels.projectCostsHeading}>
        <ACC.Renderers.SimpleString><ACC.Content value={x => x.pcrAddPartnerAcademicCosts.stepGuidance}/></ACC.Renderers.SimpleString>
        <Form.Form
          data={this.props.pcrItem}
          isSaving={this.props.status === EditorStatus.Saving}
          onSubmit={() => this.props.onSave()}
          onChange={dto => this.props.onChange(dto)}
          qa="academic-costs-form"
        >
          {this.renderTsb(Form)}
          {this.renderCosts(Form, costCategories)}
          {this.renderSaveButtons(Form)}
        </Form.Form>
      </ACC.Section>
    );
  }

  private renderTsb(Form: FormBuilder<PCRItemForPartnerAdditionDto>) {
    return (
      <Form.Fieldset headingContent={x => x.pcrAddPartnerAcademicCosts.labels.tsbReferenceHeading}>
        <Form.String
          labelContent={x => x.pcrAddPartnerAcademicCosts.tsbLabel}
          width={"one-third"}
          name="tsbReference"
          value={dto => dto.tsbReference}
          update={(x, val) => x.tsbReference = val}
          validation={this.props.validator.tsbReference}
        />
      </Form.Fieldset>
    );
  }

  private renderCosts(Form: FormBuilder<PCRItemForPartnerAdditionDto>, costCategories: CostCategoryDto[]) {
    const data = costCategories.map(
      costCategory => {
        return {
          costCategory,
          costDto: this.props.pcrItem.spendProfile.costs.find(x => x.costCategoryId === costCategory.id) as PCRSpendProfileAcademicCostDto
        };
      }).filter(x => !!x);
    const total = sum(data, x => x.costDto.value || 0);

    const Table = ACC.TypedTable<Data>();

    return (
      <Form.Fieldset headingContent={x => x.pcrAddPartnerAcademicCosts.costsSectionTitle}>
        <ACC.Renderers.SimpleString><ACC.Content value={x => x.pcrAddPartnerAcademicCosts.costsGuidance}/></ACC.Renderers.SimpleString>
        <Table.Table qa="costsTable" data={data}>
          <Table.String
            headerContent={x => x.pcrAddPartnerAcademicCosts.categoryHeading}
            qa="category"
            value={x => x.costCategory.name}
            footer={this.props.isClient && <ACC.Renderers.SimpleString className={"govuk-!-font-weight-bold"}><ACC.Content value={x => x.pcrAddPartnerAcademicCosts.totalCosts}/></ACC.Renderers.SimpleString>}
          />
          <Table.Custom
            headerContent={x => x.pcrAddPartnerAcademicCosts.costHeading}
            qa="cost-value"
            classSuffix="numeric"
            value={x => this.renderCost(x)}
            width={30}
            footer={this.props.isClient && <ACC.Renderers.Currency value={total}/>}
          />
        </Table.Table>
      </Form.Fieldset>
    );
  }

  private renderSaveButtons(Form: FormBuilder<PCRItemForPartnerAdditionDto>) {
    return (
      <Form.Fieldset qa="save-and-continue">
        <Form.Submit>
          <ACC.Content value={x => x.pcrAddPartnerAcademicCosts.pcrItem.submitButton}/>
        </Form.Submit>
        <Form.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(true)}>
          <Content value={x => x.pcrAddPartnerAcademicCosts.pcrItem.returnToSummaryButton}/>
        </Form.Button>
      </Form.Fieldset>
    );
  }

  private renderCost(item: Data) {
    const error = this.getCostValidationResult(item);
    return (
      <span>
        <ACC.ValidationError error={error}/>
        <ACC.Inputs.NumberInput
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
    const validator = this.props.validator.spendProfile.results[0].costs.results.find(x =>
      x.model.costCategoryId === item.costCategory.id) as PCRAcademicCostDtoValidator;

    return validator && validator.value;
  }
}

export const AcademicCostsStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        // Get list of academic cost categories, and add a cost item for each one (if not already there).
        const costCategories = stores.costCategories.getAll().then(allCostCategories => {
          const academicCostCategories = allCostCategories.filter(costCategory =>
            costCategory.organisationType === PCROrganisationType.Academic
            && costCategory.competitionType === props.project.competitionType);

          academicCostCategories.forEach(costCategory => {
              if (props.pcrItem.spendProfile.costs.every(x => x.costCategoryId !== costCategory.id)) {
                const cost: PCRSpendProfileAcademicCostDto = {
                  id: "",
                  costCategoryId: costCategory.id,
                  costCategory: CostCategoryType.Academic,
                  description: costCategory.name,
                  value: 0
                };
                props.pcrItem.spendProfile.costs.push(cost);
              }
            }
          );
          return academicCostCategories;
        });

        return <ACC.Loader
          pending={Pending.combine({costCategories})}
          render={x => <Component {...x} {...props} />}
        />;
      }
    }
  </StoresConsumer>
);
