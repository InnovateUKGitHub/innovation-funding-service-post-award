import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { Authorisation, ClaimDto, ClaimStatusChangeDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { IRoutes } from "@ui/routing";
import { StoresConsumer } from "@ui/redux";

export interface PrepareClaimParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claim: Pending<ClaimDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ClaimDto, progress?: boolean) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
}

export class PrepareComponent extends ContainerBase<PrepareClaimParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    const isPmOrMo = (data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    const backLink = isPmOrMo ? this.props.routes.allClaimsDashboard.getLink({ projectId: data.project.id }) : this.props.routes.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id });

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>Back to claims</ACC.BackLink>}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title project={data.project} />}
      >
        {data.claim.isFinalClaim && <ACC.ValidationMessage messageType="info" message="This is the final claim."/>}
        {this.renderDetailsSection(data)}
      </ACC.Page>
    );
  }

  private renderDetailsSection(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();

    return (
      <ACC.Section title={<ACC.Claims.ClaimPeriodDate claim={data.claim} />}>
        <ACC.Claims.ClaimTable
          {...data}
          validation={data.editor.validator.claimDetails.results}
          standardOverheadRate={this.props.config.standardOverheadRate}
          getLink={costCategoryId => this.props.routes.prepareClaimLineItems.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId })}
        />
        <Form.Form
          editor={data.editor}
          onChange={(dto) => this.props.onUpdate(false, dto)}
          onSubmit={() => this.props.onUpdate(true, data.editor.data, true)}
        >
          {this.renderLogsSection()}
          <Form.Fieldset qa="save-and-continue">
            <ACC.Link styling="PrimaryButton" route={this.props.routes.claimDocuments.getLink({projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}>Continue to claims documents</ACC.Link>
            <Form.Button name="return" onClick={() => this.props.onUpdate(true, data.editor.data, false)}>Save and return to claims</Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private renderLogsSection() {
    return (
      <ACC.Accordion>
        <ACC.AccordionItem title="Status and comments log" qa="status-and-comments-log">
          {/* Keeping logs inside loader because accordion defaults to closed*/}
          <ACC.Loader
            pending={this.props.statusChanges}
            render={(statusChanges) => (
              <ACC.Logs qa="claim-status-change-table" data={statusChanges} />
            )}
          />
        </ACC.AccordionItem>
      </ACC.Accordion>
    );
  }

}

const getDestination = (props: PrepareClaimParams & BaseProps, progress: boolean|undefined, auth: Authorisation) => {
  if (progress) {
    return props.routes.claimForecast.getLink({ projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId });
  }

  if (auth.forProject(props.projectId).hasRole(ProjectRole.ProjectManager)) {
    return props.routes.allClaimsDashboard.getLink({ projectId: props.projectId });
  }

  return props.routes.claimsDashboard.getLink({ projectId: props.projectId, partnerId: props.partnerId });
};

const PrepareContainer = (props: PrepareClaimParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PrepareComponent
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          costCategories={stores.costCategories.getAll()}
          claim={stores.claims.get(props.partnerId, props.periodId)}
          costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
          statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
          editor={stores.claims.getClaimEditor(props.projectId, props.partnerId, props.periodId)}
          onUpdate={(saving, dto, progress) => stores.claims.updateClaimEditor(saving, props.projectId, props.partnerId, props.periodId, dto, "You have saved your claim.", () => stores.navigation.navigateTo(getDestination(props, progress, stores.users.getCurrentUserAuthorisation())))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const PrepareClaimRoute = defineRoute({
  routeName: "prepareClaim",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
  container: PrepareContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: () => ({
      htmlTitle: "Edit claim",
      displayTitle: "Claim"
    })
});
