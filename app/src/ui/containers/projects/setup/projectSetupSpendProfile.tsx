import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ForecastDetailsDTO, PartnerDto, ProjectRole, SpendProfileStatus } from "@framework/types";
import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { IForecastDetailsDtosValidator } from "@ui/validators";
import { useContent } from "@ui/hooks";

export interface ProjectSetupSpendProfileParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  data: Pending<ACC.Claims.ForecastData>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>>;
  partnerEditor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
}

interface Callbacks {
  onChange: (saving: boolean, submit: boolean, dto: ForecastDetailsDTO[]) => void;
  onChangePartner: (dto: PartnerDto) => void;
}

class ProjectSetupSpendProfileComponent extends ContainerBase<ProjectSetupSpendProfileParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      data: this.props.data,
      editor: this.props.editor,
      partnerEditor: this.props.partnerEditor,
    });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor, x.partnerEditor)} />;
  }
  public renderContents(
    combined: ACC.Claims.ForecastData,
    editor: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>,
    partnerEditor: IEditorStore<PartnerDto, PartnerDtoValidator>,
  ) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();
    const readyToSubmitMessage = <ACC.Content value={x => x.projectSetupSpendProfile.readyToSubmitMessage} />;

    const options: ACC.SelectOption[] = [{ id: "true", value: readyToSubmitMessage }];

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink
            route={this.props.routes.projectSetup.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
            })}
          >
            <ACC.Content value={x => x.projectSetupSpendProfile.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...combined.project} />}
      >
        <ACC.Section qa="project-setup-spend-profile">
          {this.renderGuidance()}
          <Form.Form
            editor={editor}
            onChange={data => {
              this.props.onChangePartner(partnerEditor.data);
              this.props.onChange(false, partnerEditor.data.spendProfileStatus === SpendProfileStatus.Complete, data);
            }}
            onSubmit={() =>
              this.props.onChange(
                true,
                partnerEditor.data.spendProfileStatus === SpendProfileStatus.Complete,
                editor.data,
              )
            }
            qa="project-setup-spend-profile-form"
          >
            <ACC.Claims.ForecastTable data={combined} editor={editor} />
            <Form.Fieldset heading={x => x.projectSetupSpendProfile.markAsComplete}>
              <Form.Checkboxes
                name="isComplete"
                options={options}
                value={() => (partnerEditor.data.spendProfileStatus === SpendProfileStatus.Complete ? options : [])}
                update={(_, value) =>
                  (partnerEditor.data.spendProfileStatus =
                    value && value.some(y => y.id === "true")
                      ? SpendProfileStatus.Complete
                      : SpendProfileStatus.Incomplete)
                }
              />
              <Form.Submit>
                <ACC.Content value={x => x.projectSetupSpendProfile.submitButton} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance() {
    return (
      <ACC.Renderers.SimpleString qa="guidance">
        <ACC.Content value={x => x.projectSetupSpendProfile.guidanceMessage} />
      </ACC.Renderers.SimpleString>
    );
  }
}

const ProjectSetupSpendProfileContainer = (props: ProjectSetupSpendProfileParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();

  const navigateToProjectSetup = () => {
    const projectSetupParams = {
      projectId: props.projectId,
      partnerId: props.partnerId,
    };

    navigate(props.routes.projectSetup.getLink(projectSetupParams).path);
  };

  return (
    <ProjectSetupSpendProfileComponent
      {...props}
      data={Pending.combine({
        project: stores.projects.getById(props.projectId),
        partner: stores.partners.getById(props.partnerId),
        forecastDetails: stores.forecastDetails.getAllInitialByPartner(props.partnerId),
        golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
        costCategories: stores.costCategories.getAllFiltered(props.partnerId),
        // Initial forecast so happens before claims
        claim: Pending.done(null),
        claims: Pending.done([]),
        claimDetails: Pending.done([]),
      })}
      editor={stores.forecastDetails.getInitialForecastEditor(props.partnerId)}
      partnerEditor={stores.partners.getPartnerEditor(props.projectId, props.partnerId)}
      onChange={(saving, submit, payload) => {
        stores.forecastDetails.updateInitialForcastEditor(
          saving,
          props.projectId,
          props.partnerId,
          payload,
          submit,
          getContent(x => x.projectSetupSpendProfile.spendProfileUpdatedMessage),
          navigateToProjectSetup,
        );
      }}
      onChangePartner={dto => stores.partners.updatePartner(false, props.partnerId, dto)}
    />
  );
};

export const ProjectSetupSpendProfileRoute = defineRoute({
  routeName: "projectSetupSpendProfile",
  routePath: "/projects/:projectId/setup/:partnerId/projectSetupSpendProfile",
  container: ProjectSetupSpendProfileContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.projectSetupSpendProfile.title(),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
