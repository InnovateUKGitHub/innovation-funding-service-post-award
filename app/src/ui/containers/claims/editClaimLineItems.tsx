import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import {Currency, Percentage} from "../../components/renderers";
import {TypedLoader} from "../../components";
import { PrepareClaimRoute } from ".";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  lineItems: Pending<Dtos.ClaimLineItemDto[]>;
  costCategories: Pending<Dtos.CostCategoryDto[]>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  lineItems: Dtos.ClaimLineItemDto[];
  costCategories: Dtos.CostCategoryDto[];
}

export class EditClaimLineItemsComponent extends ContainerBase<Params, Data, {}> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.lineItems,
      this.props.costCategories,
      (project, lineItems, costCategories) => ({project, lineItems, costCategories})
    );
    const Loader = TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  // TODO fix back link
  private renderContents(data: { project: Dtos.ProjectDto, lineItems: Dtos.ClaimLineItemDto[], costCategories: Dtos.CostCategoryDto[] }) {
    const back = PrepareClaimRoute.getLink({projectId: data.project.id, partnerId: this.props.partnerId, periodId: this.props.periodId });

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={back}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Section>
          <ACC.Projects.Title pageTitle={`Claim for ${data.costCategories.find(x => x.id === this.props.costCategoryId )!.name}`} project={data.project} />
        </ACC.Section>
        <ACC.Section>
            <ACC.SectionPanel title="Breakdown of costs">
                <ClaimLineItemsTable lineItems={data.lineItems}/>
            </ACC.SectionPanel>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ClaimLineItemsTable: React.SFC<{ lineItems: Dtos.ClaimLineItemDto[] }> = ({lineItems}) => {
  const LineItemTable = ACC.Table.forData(lineItems);
  const renderFooterRow = (row: { key: string, title: string, value: React.ReactNode }) => (
    <tr key={row.key} className="govuk-table__row">
      <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
      <td className="govuk-table__cell govuk-table__cell--numeric">{row.value}</td>
    </tr>
  );
  // TODO get real value for forecast and difference
  return (
    <LineItemTable.Table
      qa="current-claim-summary-table"
      footers={[
        renderFooterRow({ key: "1", title: "Total labour costs", value:
            <Currency className={"govuk-!-font-weight-bold"} value={lineItems.reduce((total, item) => (total+item.value), 0)}/>
        }),
        renderFooterRow({ key: "2", title: "Forecast costs", value:
            <Currency value={0}/>
        }),
        renderFooterRow({ key: "3", title: "Difference", value:
            <Percentage value={0}/>
        })
      ]}
    >
      <LineItemTable.String header="Description of cost" qa="cost-description" value={(x) => x.description}/>
      <LineItemTable.Currency header="Cost (£)" qa="cost-value" value={(x) => x.value}/>
    </LineItemTable.Table>
  );
};

const definition = ReduxContainer.for<Params, Data, {}>(EditClaimLineItemsComponent);

export const EditClaimLineItems = definition.connect({
  withData: (store, params) => ({
    project: Pending.create(store.data.project[params.projectId]),
    lineItems: Pending.create(store.data.claimLineItems[params.partnerId]),
    partnerId: params.partnerId,
    costCategories: Pending.create(store.data.costCategories.all)
  }),
  withCallbacks: () => ({})
});

export const EditClaimLineItemsRoute = definition.route({
  routeName: "claim-costs-edit",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadCostCategories(),
    Actions.loadClaimLineItemsForCategory(params.partnerId, params.costCategoryId, params.periodId)
  ],
  container: EditClaimLineItems
});
