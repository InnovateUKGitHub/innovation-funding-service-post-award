import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import {routeConfig} from "../../routing";
import {Currency, Percentage} from "../../components/renderers";
import {TypedLoader} from "../../components";

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

export class ClaimLineItemsComponent extends ContainerBase<Params, Data, {}> {

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
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink
            route={routeConfig.claimDetails.getLink({projectId: data.project.id, partnerId: this.props.partnerId, periodId: this.props.periodId })}
          >Back
          </ACC.BackLink>
        </ACC.Section>
        <ACC.Section>
          <ACC.Projects.Title pageTitle={`Claim for ${data.costCategories.find(x => x.id === this.props.costCategoryId )!.name}`} project={data.project} />
        </ACC.Section>
        <ACC.Section>
          <ClaimLineItemsTable lineItems={data.lineItems}/>
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
            <Currency className={"govuk-!-font-weight-bold"} value={lineItems.reduce((total, item) => total + (item.value || 0), 0)}/>
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

const definition = ReduxContainer.for<Params, Data, {}>(ClaimLineItemsComponent);

export const ClaimLineItems = definition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    lineItems: Selectors.findClaimLineItemsByPartnerCostCategoryAndPeriod(props.partnerId, props.costCategoryId, props.periodId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state)
  }),
  withCallbacks: () => ({})
});

export const ClaimLineItemsRoute = definition.route({
  routeName: "claim-line-items-view",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId/costs/:costCategoryId",
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
  container: ClaimLineItems
});
