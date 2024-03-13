import { BaseProps, defineRoute } from "@ui/containers/containerBase";

import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PcrAddSpendProfileCostParams } from "./spendProfilePrepareCost.page";
import { CostCategoryGroupType } from "@framework/constants/enums";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { CostCategoryList } from "@framework/types/CostCategory";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { DeleteCapitalUsageCostFormComponent } from "./deleteCapitalUsageCostFormComponent";
import { DeleteLabourCostFormComponent } from "./deleteLabourCostFormComponent";
import { DeleteMaterialsCostFormComponent } from "./deleteMaterialCostFormComponent";
import { DeleteOtherCostFormComponent } from "./deleteOtherCostFormComponent";
import { DeleteSubcontractingCostFormComponent } from "./deleteSubcontractingCostFormComponent";
import { DeleteTravelAndSubsCostFormComponent } from "./deleteTravelAndSubsCostFormComponent";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { useSpendProfileCostsQuery } from "./spendProfileCosts.logic";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useContent } from "@ui/hooks/content.hook";
import { useForm } from "react-hook-form";
import { useOnSavePcrItem } from "../../pcrItemWorkflow.logic";
import { noop } from "lodash";

export interface PcrDeleteSpendProfileCostParams extends PcrAddSpendProfileCostParams {
  costId: CostId;
}

export interface SpendProfileDeleteFormProps<T extends PCRSpendProfileCostDto> {
  data: T;
  costCategory: Pick<CostCategoryDto, "name">;
}

const SpendProfileDeleteCostPage = ({
  projectId,
  itemId,
  costCategoryId,
  costId,
  pcrId,
  messages,
  ...props
}: PcrDeleteSpendProfileCostParams & BaseProps) => {
  const { project, costCategory, cost, spendProfile } = useSpendProfileCostsQuery(
    projectId,
    itemId,
    costCategoryId,
    costId,
    0,
  );

  if (!cost) {
    throw new Error("attempting to delete a missing cost object");
  }

  const { getContent } = useContent();

  const { onUpdate, isFetching } = useOnSavePcrItem(
    projectId,
    pcrId,
    itemId,
    noop,
    undefined,
    undefined,
    PCRItemType.PartnerAddition,
  );
  const { handleSubmit } = useForm({});

  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.pcrSpendProfileCostsSummary.getLink({
            itemId,
            pcrId,
            projectId,
            costCategoryId: costCategoryId,
          })}
        >
          <Content value={x => x.pages.pcrSpendProfileDeleteCost.backLink({ costCategoryName: costCategory.name })} />
        </BackLink>
      }
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      projectId={projectId}
    >
      <Messages messages={messages} />

      <Section>
        <Form
          onSubmit={handleSubmit(() =>
            onUpdate({
              data: {
                spendProfile: {
                  ...spendProfile,
                  costs: spendProfile.costs.filter(x => x.id !== cost?.id),
                },
              },
              context: {
                link: props.routes.pcrSpendProfileCostsSummary.getLink({
                  projectId,
                  pcrId,
                  itemId,
                  costCategoryId,
                }),
              },
            }),
          )}
        >
          <input type="hidden" name="id" value={cost?.id} />
          <SwitchComponent cost={cost} costCategory={costCategory} />
          <Fieldset>
            <Button type="submit" disabled={isFetching}>
              {getContent(x => x.pages.pcrSpendProfileDeleteCost.buttonDelete)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

const SwitchComponent = ({
  costCategory,
  cost,
}: {
  costCategory: Pick<CostCategoryDto, "type" | "name">;
  cost: PCRSpendProfileCostDto;
}) => {
  const costCategoryType = new CostCategoryList().fromId(costCategory.type);
  switch (costCategoryType.group) {
    case CostCategoryGroupType.Labour:
      return <DeleteLabourCostFormComponent data={cost as PCRSpendProfileLabourCostDto} costCategory={costCategory} />;
    case CostCategoryGroupType.Materials:
      return (
        <DeleteMaterialsCostFormComponent data={cost as PCRSpendProfileMaterialsCostDto} costCategory={costCategory} />
      );
    case CostCategoryGroupType.Capital_Usage:
      return (
        <DeleteCapitalUsageCostFormComponent
          data={cost as PCRSpendProfileCapitalUsageCostDto}
          costCategory={costCategory}
        />
      );
    case CostCategoryGroupType.Subcontracting:
      return (
        <DeleteSubcontractingCostFormComponent
          data={cost as PCRSpendProfileSubcontractingCostDto}
          costCategory={costCategory}
        />
      );
    case CostCategoryGroupType.Travel_And_Subsistence:
      return (
        <DeleteTravelAndSubsCostFormComponent
          data={cost as PCRSpendProfileTravelAndSubsCostDto}
          costCategory={costCategory}
        />
      );
    case CostCategoryGroupType.Other_Costs:
      return <DeleteOtherCostFormComponent data={cost as PCRSpendProfileOtherCostsDto} costCategory={costCategory} />;
    default:
      return null;
  }
};

export const PCRSpendProfileDeleteCostRoute = defineRoute<PcrDeleteSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileDeleteCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/:costId/delete",
  container: SpendProfileDeleteCostPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
    costId: route.params.costId as CostId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileDeleteCost.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
