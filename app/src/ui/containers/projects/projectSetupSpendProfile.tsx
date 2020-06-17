import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { IForecastDetailsDtosValidator } from "@ui/validators";

export interface ProjectSetupSpendProfileParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  data: Pending<ACC.Claims.ForecastData>;
  // TODO: Validation will be handled as part of ACC-5850 so the validator here is a placeholder
  editor: Pending<IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: ForecastDetailsDTO[]) => void;
}

class ProjectSetupSpendProfileComponent extends ContainerBase<ProjectSetupSpendProfileParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({ data: this.props.data, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor)} />;
  }

  public renderContents(combined: ACC.Claims.ForecastData, editor: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.projectSetup.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId })}><ACC.Content value={(x) => x.projectSetupSpendProfile.backLink()} /></ACC.BackLink>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={combined.project} />}
      >
        <ACC.Section qa="project-setup-spend-profile" >
          {this.renderGuidance()}
          <Form.Form
            editor={editor}
            onChange={data => this.props.onChange(false, data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="project-setup-spend-profile-form"
          >
            <ACC.Claims.ForecastTable data={combined} editor={editor} />
            <Form.Fieldset>
              <Form.Submit><ACC.Content value={x => x.projectSetupSpendProfile.submitButton()}/></Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance() {
    return <ACC.Renderers.SimpleString qa="guidance"><ACC.Content value={x => x.projectSetupSpendProfile.guidanceMessage()}/></ACC.Renderers.SimpleString>;
  }
}

const ProjectSetupSpendProfileContainer = (props: ProjectSetupSpendProfileParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ProjectSetupSpendProfileComponent
        data={Pending.combine({
          project: stores.projects.getById(props.projectId),
          partner: stores.partners.getById(props.partnerId),
          forecastDetails: stores.forecastDetails.getAllInitialByPartner(props.partnerId),
          golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
          costCategories: stores.costCategories.getAll(),
          // Initial forecast so happens before claims
          claim: Pending.done(null),
          claims: Pending.done([]),
          claimDetails: Pending.done([]),
        })}
        editor={stores.forecastDetails.getInitialForecastEditor(props.partnerId)}
        onChange={(saving, dto) => {
          stores.forecastDetails.updateInitialForcastEditor(saving, props.projectId, props.partnerId, dto, "Your spend profile has been updated.", () => {
            stores.navigation.navigateTo(props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId }));
          });
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectSetupSpendProfileRoute = defineRoute({
  routeName: "projectSetupSpendProfile",
  routePath: "/projects/:projectId/setup/:partnerId/projectSetupSpendProfile",
  container: ProjectSetupSpendProfileContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.projectSetupSpendProfile.title(),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
