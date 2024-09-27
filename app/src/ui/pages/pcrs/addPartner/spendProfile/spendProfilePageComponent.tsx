import { Info } from "@ui/components/atoms/Details/Details";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Content } from "@ui/components/molecules/Content/content";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { ReactNode, useContext, useMemo } from "react";
import { AddPartnerStepNames } from "../addPartnerWorkflow";
import { PcrWorkflow, WorkflowPcrType } from "../../pcrWorkflow";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { CostCategoryGroupType } from "@framework/constants/enums";
import { SpendProfileContext } from "./spendProfileCosts.logic";
import { CostCategoryList } from "@framework/types/CostCategory";

export const SpendProfilePreparePage = ({
  validationErrors,
  children,
}: {
  validationErrors: RhfErrors;
  children: ReactNode;
}) => {
  const {
    costCategory,
    itemId,
    pcrId,
    projectId,
    pcrItem,
    routes,
    costCategoryId,
    apiError,
    messages,
    costCategoryType,
    fragmentRef,
  } = useContext(SpendProfileContext);
  const isOverheads = useMemo(
    () => new CostCategoryList().fromId(costCategory.type).group === CostCategoryGroupType.Overheads,
    [costCategory],
  );

  const backLink = useMemo(() => {
    if (isOverheads) {
      return routes.pcrPrepareItem.getLink({
        itemId,
        pcrId,
        projectId,
        step: getSpendProfileStep(pcrItem) || undefined,
      });
    }

    // For all other cost categories go to the summary page
    return routes.pcrSpendProfileCostsSummary.getLink({
      itemId,
      pcrId,
      projectId,
      costCategoryId,
    });
  }, [itemId, costCategoryId, projectId]);

  return (
    <Page
      backLink={
        <BackLink route={backLink}>
          <Content value={x => x.pages.pcrSpendProfilePrepareCost.backLink({ costCategoryName: costCategory.name })} />
        </BackLink>
      }
      apiError={apiError}
      validationErrors={validationErrors}
      fragmentRef={fragmentRef}
    >
      <Messages messages={messages} />
      <Section
        title={x => x.pages.pcrSpendProfilePrepareCost.sectionTitleCost({ costCategoryName: costCategory.name })}
      >
        {isOverheads && (
          <Info
            summary={
              <Content
                value={x => x.pages.pcrSpendProfilePrepareCost.guidanceTitle({ costCategoryName: costCategory.name })}
              />
            }
          >
            <Content markdown value={costCategoryType.guidanceMessageKey} />
          </Info>
        )}
        {children}
      </Section>
    </Page>
  );
};

const getSpendProfileStep = (addPartnerItem: WorkflowPcrType) => {
  const workflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
  if (!workflow) return null;
  const stepName: AddPartnerStepNames = PCRStepType.spendProfileStep;
  return workflow.findStepNumberByName(stepName);
};
