import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "../../models";
import { Pending } from "../../../shared/pending";
import { EditClaimLineItemsRoute } from "./index";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  costCategories: Pending<Dtos.CostCategoryDto[]>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  costCategories: Dtos.CostCategoryDto[];
}

export class ClaimDetailDocumentsComponent extends ContainerBase<Params, Data> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.costCategories,
      (project, costCategories) => ({ project, costCategories })
    );
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents(
    {project, costCategories}: CombinedData
  ) {
    const back = EditClaimLineItemsRoute.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId, costCategoryId: this.props.costCategoryId });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={back}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Section>
          <ACC.Projects.Title pageTitle={`Claim for ${costCategory.name}`} project={project} />
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data>(ClaimDetailDocumentsComponent);

export const ClaimDetailDocuments = definition.connect({
  withData: (state, props) => {
    return {
      project: Selectors.getProject(props.projectId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
    };
  },
  withCallbacks: () => ({
  })
});

export const ClaimDetailDocumentsRoute = definition.route({
  routeName: "ClaimDetailDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId/documents",
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  getLoadDataActions: (params) => [
    Actions.loadCostCategories(),
    Actions.loadProject(params.projectId),
  ],
  container: ClaimDetailDocuments
});
