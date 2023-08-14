import { useNavigate } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { SpendProfileStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { IForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { ForecastData, ForecastTable } from "@ui/components/atomicDesign/organisms/claims/ForecastTable/forecastTable";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";

export interface ProjectSetupSpendProfileParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  data: ForecastData;
  editor: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>;
  partnerEditor: IEditorStore<PartnerDto, PartnerDtoValidator>;
}

interface Callbacks {
  onChange: (saving: boolean, submit: boolean, dto: ForecastDetailsDTO[]) => void;
  onChangePartner: (dto: PartnerDto) => void;
}

const Form = createTypedForm<ForecastDetailsDTO[]>();
class ProjectSetupSpendProfile extends ContainerBase<ProjectSetupSpendProfileParams, Data, Callbacks> {
  render() {
    const { data, editor, partnerEditor } = this.props;
    const readyToSubmitMessage = <Content value={x => x.pages.projectSetupSpendProfile.readyToSubmitMessage} />;

    const options: SelectOption[] = [{ id: "true", value: readyToSubmitMessage }];

    return (
      <Page
        backLink={
          <BackLink
            route={this.props.routes.projectSetup.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
            })}
          >
            <Content value={x => x.pages.projectSetupSpendProfile.backLink} />
          </BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<Title {...data.project} />}
      >
        <Section qa="project-setup-spend-profile">
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
            <Form.Custom
              name="forecastTable"
              update={() => null}
              value={({ onChange }) => <ForecastTable onChange={onChange} data={data} editor={editor} />}
            />
            <Form.Fieldset heading={x => x.pages.projectSetupSpendProfile.markAsComplete}>
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
                <Content value={x => x.pages.projectSetupSpendProfile.submitButton} />
              </Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </Section>
      </Page>
    );
  }

  private renderGuidance() {
    return (
      <SimpleString qa="guidance">
        <Content value={x => x.pages.projectSetupSpendProfile.guidanceMessage} />
      </SimpleString>
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

  const data = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partner: stores.partners.getById(props.partnerId),
    forecastDetails: stores.forecastDetails.getAllInitialByPartner(props.partnerId),
    golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
    costCategories: stores.costCategories.getAllFiltered(props.partnerId),
    // Initial forecast so happens before claims
    claim: Pending.done(null),
    claims: Pending.done([]),
    claimDetails: Pending.done([]),
  });

  const editor = stores.forecastDetails.getInitialForecastEditor(props.partnerId);

  const partnerEditor = stores.partners.getPartnerEditor(props.projectId, props.partnerId);
  const onChange = (saving: boolean, submit: boolean, payload: ForecastDetailsDTO[]) => {
    stores.forecastDetails.updateInitialForecastEditor(
      saving,
      props.projectId,
      props.partnerId,
      payload,
      submit,
      getContent(x => x.pages.projectSetupSpendProfile.spendProfileUpdatedMessage),
      navigateToProjectSetup,
    );
  };

  const onChangePartner = (dto: PartnerDto) => stores.partners.updatePartner(false, props.partnerId, dto);

  const combined = Pending.combine({
    data,
    editor,
    partnerEditor,
  });

  return (
    <PageLoader
      pending={combined}
      render={x => <ProjectSetupSpendProfile onChange={onChange} onChangePartner={onChangePartner} {...props} {...x} />}
    />
  );
};

export const ProjectSetupSpendProfileRoute = defineRoute({
  routeName: "projectSetupSpendProfile",
  routePath: "/projects/:projectId/setup/:partnerId/projectSetupSpendProfile",
  container: ProjectSetupSpendProfileContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupSpendProfile.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
