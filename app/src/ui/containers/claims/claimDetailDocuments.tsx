import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "../../models";
import { Pending } from "../../../shared/pending";
import { EditClaimLineItemsRoute } from "./index";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { DocumentList } from "../../components";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  costCategories: Pending<Dtos.CostCategoryDto[]>;
  documents: Pending<Dtos.DocumentSummaryDto[]>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  costCategories: Dtos.CostCategoryDto[];
  documents: Dtos.DocumentSummaryDto[];
}

export class ClaimDetailDocumentsComponent extends ContainerBase<Params, Data> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.costCategories,
      this.props.documents,
      (project, costCategories, documents) => ({ project, costCategories, documents })
    );
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents({project, costCategories, documents}: CombinedData) {
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
        <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "(Documents open in a new window)" : ""}>
          {documents.length > 0 ? <DocumentList documents={documents} qa="supporting-documents"/>: <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents attached</p> }
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
      documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state)
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
    Actions.loadClaimDetailDocuments(params.partnerId, params.periodId, params.costCategoryId)
  ],
  container: ClaimDetailDocuments
});
