import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { ReactNode, useContext, useMemo } from "react";
import { AddPartnerStepNames } from "../addPartnerWorkflow";
import { PcrWorkflow, WorkflowPcrType } from "../../pcrWorkflow";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { CostCategoryType } from "@framework/constants/enums";
import { SpendProfileContext } from "./spendProfileCosts.logic";

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
    project,
    apiError,
    messages,
    costCategoryType,
  } = useContext(SpendProfileContext);
  const backLink = useMemo(() => {
    if (costCategory.type === CostCategoryType.Overheads) {
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
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      apiError={apiError}
      validationErrors={validationErrors}
      projectId={projectId}
    >
      <Messages messages={messages} />
      <Section
        title={x => x.pages.pcrSpendProfilePrepareCost.sectionTitleCost({ costCategoryName: costCategory.name })}
      >
        {costCategoryType.id === CostCategoryType.Overheads && (
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
