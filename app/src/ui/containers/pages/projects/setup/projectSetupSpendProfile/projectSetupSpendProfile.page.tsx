import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
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
import { ForecastTable } from "@ui/components/atomicDesign/organisms/claims/ForecastTable/forecastTable";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { useSetupSpendProfileData } from "./projectSetupSpendProfile.logic";

export interface ProjectSetupSpendProfileParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  editor: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>;
  partnerEditor: IEditorStore<PartnerDto, PartnerDtoValidator>;
}

interface Callbacks {
  onChange: (saving: boolean, submit: boolean, dto: ForecastDetailsDTO[]) => void;
  onChangePartner: (dto: PartnerDto) => void;
}

const Form = createTypedForm<ForecastDetailsDTO[]>();

const ProjectSetupSpendProfile = (props: BaseProps & ProjectSetupSpendProfileParams & Data & Callbacks) => {
  const { editor, partnerEditor } = props;

  const data = useSetupSpendProfileData(props.projectId, props.partnerId);

  const readyToSubmitMessage = <Content value={x => x.pages.projectSetupSpendProfile.readyToSubmitMessage} />;

  const options: SelectOption[] = [{ id: "true", value: readyToSubmitMessage }];

  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.projectSetup.getLink({
            projectId: props.projectId,
            partnerId: props.partnerId,
          })}
        >
          <Content value={x => x.pages.projectSetupSpendProfile.backLink} />
        </BackLink>
      }
      error={editor.error}
      validator={editor.validator}
      pageTitle={<Title projectNumber={data.project.projectNumber} title={data.project.title} />}
    >
      <Section qa="project-setup-spend-profile">
        <SimpleString qa="guidance">
          <Content value={x => x.pages.projectSetupSpendProfile.guidanceMessage} />
        </SimpleString>
        <Form.Form
          editor={editor}
          onChange={data => {
            props.onChangePartner(partnerEditor.data);
            props.onChange(false, partnerEditor.data.spendProfileStatus === SpendProfileStatus.Complete, data);
          }}
          onSubmit={() =>
            props.onChange(true, partnerEditor.data.spendProfileStatus === SpendProfileStatus.Complete, editor.data)
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
};

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
