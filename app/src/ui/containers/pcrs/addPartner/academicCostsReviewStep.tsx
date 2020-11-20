import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import React from "react";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import * as ACC from "@ui/components";
import { sum } from "@framework/util";
import { StoresConsumer } from "@ui/redux";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROrganisationType } from "@framework/constants";
import { Pending } from "@shared/pending";
import { SimpleString } from "@ui/components/renderers";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface Data {
  costCategory: CostCategoryDto;
  costDto: PCRSpendProfileAcademicCostDto;
}

class Component extends React.Component<PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps, Data> {
  render() {
    const { costCategories, pcrItem } = this.props;
    const data = costCategories.map(
      costCategory => {
        return {
          costCategory,
          costDto: this.props.pcrItem.spendProfile.costs.find(x => x.costCategoryId === costCategory.id) as PCRSpendProfileAcademicCostDto
        };
      }).filter(x => !!x);
    const total = sum(data, x => (!!x.costDto ? x.costDto.value : 0) || 0);

    const Table = ACC.TypedTable<Data>();

    return (
      <ACC.Section titleContent={x => x.pcrAddPartnerAcademicCosts.labels.projectCostsHeading}>
        <ACC.Section titleContent={x => x.pcrAddPartnerAcademicCosts.labels.tsbReferenceHeading}>
          <SimpleString qa="tsbReference">{pcrItem.tsbReference}</SimpleString>
        </ACC.Section>
        <ACC.Section titleContent={x => x.pcrAddPartnerAcademicCosts.costsSectionTitle()}>
          <Table.Table qa="costsTable" data={data}>
            <Table.String
              headerContent={x => x.pcrAddPartnerAcademicCosts.categoryHeading()}
              qa="category"
              value={x => x.costCategory.name}
              footer={this.props.isClient &&
              <ACC.Renderers.SimpleString className={"govuk-!-font-weight-bold"}>
                <ACC.Content value={x => x.pcrAddPartnerAcademicCosts.totalCosts()}/>
              </ACC.Renderers.SimpleString>}
            />
            <Table.Currency
              headerContent={x => x.pcrAddPartnerAcademicCosts.costHeading()}
              qa="cost"
              value={x => x.costDto? x.costDto.value : 0}
              width={30}
              footer={this.props.isClient && <ACC.Renderers.Currency value={total}/>}
            />
          </Table.Table>
        </ACC.Section>
        <ACC.Link styling="SecondaryButton" route={this.props.routes.pcrReviewItem.getLink({ itemId: this.props.pcrItem.id, pcrId: this.props.pcr.id, projectId: this.props.project.id })}>Return to summary</ACC.Link>
      </ACC.Section>
    );
  }
}

export const AcademicCostsReviewStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => (
  <StoresConsumer>
    {
      stores => {
        const costCategories = stores.costCategories.getAll().then(allCostCategories => allCostCategories.filter(costCategory =>
          costCategory.organisationType === PCROrganisationType.Academic
          && costCategory.competitionType === props.project.competitionType));

        return <ACC.Loader
          pending={Pending.combine({ costCategories })}
          render={x => <Component {...x} {...props} />}
        />;
      }
    }
  </StoresConsumer>
);
