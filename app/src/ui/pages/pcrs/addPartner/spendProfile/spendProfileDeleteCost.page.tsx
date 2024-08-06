import { BaseProps, defineRoute } from "@ui/app/containerBase";

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
import { ProjectRole } from "@framework/constants/project";
import { CostCategoryList } from "@framework/types/CostCategory";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { DeleteCapitalUsageCostFormComponent } from "./deleteCapitalUsageCostFormComponent";
import { DeleteLabourCostFormComponent } from "./deleteLabourCostFormComponent";
import { DeleteMaterialsCostFormComponent } from "./deleteMaterialCostFormComponent";
import { DeleteOtherCostFormComponent } from "./deleteOtherCostFormComponent";
import { DeleteSubcontractingCostFormComponent } from "./deleteSubcontractingCostFormComponent";
import { DeleteTravelAndSubsCostFormComponent } from "./deleteTravelAndSubsCostFormComponent";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { useOnDeleteSpendProfileItem, useSpendProfileCostsQuery } from "./spendProfileCosts.logic";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useContent } from "@ui/hooks/content.hook";
import { useForm } from "react-hook-form";
import { FormTypes } from "@ui/zod/FormTypes";

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
  const { costCategory, cost, fragmentRef } = useSpendProfileCostsQuery(projectId, itemId, costCategoryId, costId);

  if (!cost) {
    throw new Error("attempting to delete a missing cost object");
  }

  const { getContent } = useContent();

  const { onUpdate, isFetching, apiError } = useOnDeleteSpendProfileItem(costId, projectId);
  const { handleSubmit } = useForm<EmptyObject>({});

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
      apiError={apiError}
      fragmentRef={fragmentRef}
    >
      <Messages messages={messages} />

      <Section>
        <Form
          onSubmit={handleSubmit(() =>
            onUpdate({
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
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSPendProfileDeleteItem} />
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
    default:
      return <DeleteOtherCostFormComponent data={cost as PCRSpendProfileOtherCostsDto} costCategory={costCategory} />;
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
