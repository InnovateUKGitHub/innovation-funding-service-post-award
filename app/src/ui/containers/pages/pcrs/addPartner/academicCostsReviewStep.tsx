import React from "react";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { sumBy } from "@framework/util/numberHelper";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { MountedHoc } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Loader } from "@ui/components/bjss/loading";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";

interface ContainerProps {
  costCategories: CostCategoryDto[];
}

interface Data {
  costCategory: CostCategoryDto;
  costDto: PCRSpendProfileAcademicCostDto;
}

const Table = createTypedTable<Data>();

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

    return (
      <MountedHoc>
        {state => (
          <Section title={x => x.pcrAddPartnerLabels.projectCostsHeading}>
            <Section title={x => x.pcrAddPartnerLabels.tsbReferenceHeading}>
              <SimpleString qa="tsbReference">{pcrItem.tsbReference}</SimpleString>
            </Section>

            <Section title={x => x.pages.pcrAddPartnerAcademicCosts.costsSectionTitle}>
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

                <Table.Currency
                  header={x => x.pages.pcrAddPartnerAcademicCosts.costHeading}
                  qa="cost"
                  value={x => (x.costDto ? x.costDto.value : 0)}
                  width={30}
                  footer={state.isClient && <Currency value={total} />}
                />
              </Table.Table>
            </Section>

            <Link
              styling="SecondaryButton"
              route={this.props.routes.pcrReviewItem.getLink({
                itemId: this.props.pcrItem.id,
                pcrId: this.props.pcr.id,
                projectId: this.props.project.id,
              })}
            >
              Return to summary
            </Link>
          </Section>
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

  return <Loader pending={Pending.combine({ costCategories })} render={x => <Component {...props} {...x} />} />;
};
