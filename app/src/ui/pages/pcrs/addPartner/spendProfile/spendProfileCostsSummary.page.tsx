import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { PcrWorkflow } from "@ui/pages/pcrs/pcrWorkflow";
import { AddPartnerStepNames } from "@ui/pages/pcrs/addPartner/addPartnerWorkflow";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRSpendProfileCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { PCRItemType, PCRStepType } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { CostCategoryList } from "@framework/types/CostCategory";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { Info } from "@ui/components/atoms/Details/Details";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { useSpendProfileCostsQuery } from "./spendProfileCosts.logic";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useForm } from "react-hook-form";
import { useOnSavePcrItem } from "../../pcrItemWorkflow.logic";
import { noop } from "lodash";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { TableEmptyCell } from "@ui/components/atoms/table/TableEmptyCell/TableEmptyCell";

export interface PcrSpendProfileCostSummaryParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  costCategoryId: CostCategoryId;
}

const SpendProfileCostsSummaryComponent = (props: PcrSpendProfileCostSummaryParams & BaseProps) => {
  const { pcrId, itemId, projectId, routes, costCategoryId } = props;

  const { project, pcrItem, spendProfile, costCategory, fragmentRef } = useSpendProfileCostsQuery(
    projectId,
    itemId,
    costCategoryId,
    undefined,
    undefined,
  );

  const addPartnerItem = pcrItem;
  if (!addPartnerItem) {
    throw new Error("cannot find a matching add partner item");
  }
  const addPartnerWorkflow = getWorkflow(addPartnerItem);
  const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();
  const stepRoute = routes.pcrPrepareItem.getLink({
    itemId,
    pcrId,
    projectId,
    step: spendProfileStep?.stepNumber ?? undefined,
  });

  const costs = spendProfile.costs.filter(x => x.costCategoryId === costCategoryId);
  const costCategoryType = new CostCategoryList(project.competitionType).fromId(costCategory.type);

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
        <BackLink route={stepRoute}>
          <Content value={x => x.pages.pcrSpendProfileCostsSummary.backLink} />
        </BackLink>
      }
      fragmentRef={fragmentRef}
    >
      <Messages messages={props.messages} />
      <Section
        title={x => x.pages.pcrSpendProfileCostsSummary.sectionTitleCosts({ costCategoryName: costCategory.name })}
      >
        {costCategoryType.showPreGuidanceWarning && (
          <ValidationMessage markdown messageType="info" message={costCategoryType.preGuidanceWarningMessageKey} />
        )}

        {costCategoryType.showGuidance && (
          <Info
            summary={
              <Content
                value={x => x.pages.pcrSpendProfileCostsSummary.guidanceTitle({ costCategoryName: costCategory.name })}
              />
            }
          >
            <Content markdown value={costCategoryType.guidanceMessageKey} />
          </Info>
        )}

        <SummaryTable
          costs={costs}
          costCategory={costCategory}
          routes={routes}
          itemId={itemId}
          pcrId={pcrId}
          projectId={projectId}
          costCategoryId={costCategoryId}
        />
        <Form data-qa="submit_costs" onSubmit={handleSubmit(data => onUpdate({ data, context: { link: stepRoute } }))}>
          <Fieldset>
            <Button type="submit" disabled={isFetching}>
              <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonSubmit} />
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

type SummaryTableProps = {
  costs: Pick<PCRSpendProfileCostDto, "value" | "description" | "id">[];
  costCategory: Pick<CostCategoryDto, "name">;
  routes: BaseProps["routes"];
  itemId: PcrItemId;
  pcrId: PcrId;
  projectId: ProjectId;
  costCategoryId: CostCategoryId;
};
const SummaryTable = ({ costs, costCategory, routes, itemId, pcrId, projectId, costCategoryId }: SummaryTableProps) => {
  const { getContent } = useContent();
  const total = costs.reduce((acc, cost) => acc + (cost.value || 0), 0);

  return (
    <Table>
      <THead>
        <TR>
          <TH>{getContent(x => x.pages.pcrSpendProfileCostsSummary.table.description)}</TH>
          <TH numeric>{getContent(x => x.pages.pcrSpendProfileCostsSummary.table.cost)}</TH>
          <TH>
            <TableEmptyCell />
          </TH>
        </TR>
      </THead>
      <TBody>
        {costs.map(x => (
          <TR key={x.id}>
            <TD>{x.description}</TD>
            <TD numeric>
              <Currency value={x.value}></Currency>
            </TD>
            <TD>{renderLinks(itemId, x.id, costCategoryId, projectId, pcrId, routes)}</TD>
          </TR>
        ))}
      </TBody>
      <TFoot>
        <TR>
          <TD>
            <Link
              route={routes.pcrPrepareSpendProfileAddCost.getLink({
                itemId,
                pcrId,
                projectId,
                costCategoryId,
              })}
            >
              <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonAddCost} />
            </Link>
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
        </TR>
        <TR>
          <TH numeric>
            <Content value={x => x.pcrSpendProfileLabels.totalCosts({ costCategoryName: costCategory.name })} />
          </TH>
          <TH numeric id="category-total-cost">
            <Currency value={total} />
          </TH>
          <TH>
            <TableEmptyCell />
          </TH>
        </TR>
      </TFoot>
    </Table>
  );
};

const getWorkflow = (
  addPartnerItem: Pick<
    FullPCRItemDto,
    "projectRole" | "partnerType" | "isCommercialWork" | "typeOfAid" | "organisationType" | "hasOtherFunding" | "type"
  >,
) => {
  // You need to have a workflow to find a step number by name
  // so getting a workflow with undefined step first
  // allowing me to find the step name and get the workflow with the correct step
  const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
  if (!summaryWorkflow) return null;
  const stepName: AddPartnerStepNames = PCRStepType.spendProfileStep;
  const spendProfileStep = summaryWorkflow.findStepNumberByName(stepName);
  return PcrWorkflow.getWorkflow(addPartnerItem, spendProfileStep);
};

const renderLinks = (
  itemId: PcrItemId,
  costId: CostId,
  costCategoryId: CostCategoryId,
  projectId: ProjectId,
  pcrId: PcrId,
  routes: BaseProps["routes"],
) => {
  const links: { route: ILinkInfo; text: React.ReactNode; qa: string }[] = [];
  links.push({
    route: routes.pcrPrepareSpendProfileEditCost.getLink({
      itemId,
      costId,
      costCategoryId,
      projectId,
      pcrId,
    }),
    text: <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonEditCost} />,
    qa: "edit",
  });
  links.push({
    route: routes.pcrPrepareSpendProfileDeleteCost.getLink({
      itemId,
      costId,
      costCategoryId,
      projectId,
      pcrId,
    }),
    text: <Content value={x => x.pages.pcrSpendProfileCostsSummary.buttonRemoveCost} />,
    qa: "remove",
  });

  return links.map((x, i) => (
    <div key={i} data-qa={x.qa}>
      <Link route={x.route}>{x.text}</Link>
    </div>
  ));
};

export const PCRSpendProfileCostsSummaryRoute = defineRoute<PcrSpendProfileCostSummaryParams>({
  routeName: "pcrSpendProfileCostsSummary",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId",
  container: SpendProfileCostsSummaryComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileCostsSummary.title),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRolePermissionBits.ProjectManager),
});
