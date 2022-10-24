import React from "react";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import * as ACC from "@ui/components";
import { sumBy } from "@framework/util";
import { useStores } from "@ui/redux";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCROrganisationType } from "@framework/constants";
import { Pending } from "@shared/pending";
import { SimpleString } from "@ui/components/renderers";
import { MountedHoc } from "@ui/features";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface Data {
  costCategory: CostCategoryDto;
  costDto: PCRSpendProfileAcademicCostDto;
}

class Component extends React.Component<
  PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & ContainerProps,
  Data
> {
  render() {
    const { costCategories, pcrItem } = this.props;
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
    const total = sumBy(data, x => (x.costDto ? x.costDto.value : 0) || 0);

    const Table = ACC.TypedTable<Data>();

    return (
      <MountedHoc>
        {state => (
          <ACC.Section title={x => x.pcrAddPartnerLabels.projectCostsHeading}>
            <ACC.Section title={x => x.pcrAddPartnerLabels.tsbReferenceHeading}>
              <SimpleString qa="tsbReference">{pcrItem.tsbReference}</SimpleString>
            </ACC.Section>

            <ACC.Section title={x => x.pages.pcrAddPartnerAcademicCosts.costsSectionTitle}>
              <Table.Table qa="costsTable" data={data}>
                <Table.String
                  header={x => x.pages.pcrAddPartnerAcademicCosts.categoryHeading}
                  qa="category"
                  value={x => x.costCategory.name}
                  footer={
                    state.isClient && (
                      <ACC.Renderers.SimpleString className={"govuk-!-font-weight-bold"}>
                        <ACC.Content value={x => x.pages.pcrAddPartnerAcademicCosts.totalCosts} />
                      </ACC.Renderers.SimpleString>
                    )
                  }
                />

                <Table.Currency
                  header={x => x.pages.pcrAddPartnerAcademicCosts.costHeading}
                  qa="cost"
                  value={x => (x.costDto ? x.costDto.value : 0)}
                  width={30}
                  footer={state.isClient && <ACC.Renderers.Currency value={total} />}
                />
              </Table.Table>
            </ACC.Section>

            <ACC.Link
              styling="SecondaryButton"
              route={this.props.routes.pcrReviewItem.getLink({
                itemId: this.props.pcrItem.id,
                pcrId: this.props.pcr.id,
                projectId: this.props.project.id,
              })}
            >
              Return to summary
            </ACC.Link>
          </ACC.Section>
        )}
      </MountedHoc>
    );
  }
}

export const AcademicCostsReviewStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  const costCategories = stores.costCategories
    .getAllUnfiltered()
    .then(allCostCategories =>
      allCostCategories.filter(
        costCategory =>
          costCategory.organisationType === PCROrganisationType.Academic &&
          costCategory.competitionType === props.project.competitionType,
      ),
    );

  return <ACC.Loader pending={Pending.combine({ costCategories })} render={x => <Component {...props} {...x} />} />;
};
