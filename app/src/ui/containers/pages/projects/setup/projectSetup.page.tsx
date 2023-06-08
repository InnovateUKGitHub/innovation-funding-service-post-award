import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { PartnerStatus, BankDetailsTaskStatus, BankCheckStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { TaskListSection, Task, TaskStatus } from "@ui/components/atomicDesign/molecules/TaskList/TaskList";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";

export interface ProjectSetupParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  project: ProjectDto;
  partner: PartnerDto;
  editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: PartnerDto) => void;
}

const Form = createTypedForm<PartnerDto>();

const isPostcodeComplete = (postcode: string | null): TaskStatus => (postcode ? "Complete" : "To do");

const ProjectSetupComponent = (props: ProjectSetupParams & Data & Callbacks & BaseProps) => {
  const { project, partner, editor } = props;

  const getBankDetailsLink = (partner: PartnerDto) => {
    if (partner.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete) {
      return null;
    }
    switch (partner.bankCheckStatus) {
      case BankCheckStatus.NotValidated: {
        return props.routes.projectSetupBankDetails.getLink({
          partnerId: props.partnerId,
          projectId: props.projectId,
        });
      }
      case BankCheckStatus.ValidationFailed:
      case BankCheckStatus.VerificationFailed: {
        return props.routes.projectSetupBankStatement.getLink({
          partnerId: props.partnerId,
          projectId: props.projectId,
        });
      }
      case BankCheckStatus.ValidationPassed: {
        return props.routes.projectSetupBankDetailsVerify.getLink({
          partnerId: props.partnerId,
          projectId: props.projectId,
        });
      }
      case BankCheckStatus.VerificationPassed: {
        return null;
      }
      default:
        return null;
    }
  };

  return (
    <Page
      backLink={
        <BackLink route={props.routes.projectDashboard.getLink({})}>
          <Content value={x => x.pages.projectSetup.backLink} />
        </BackLink>
      }
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
      error={editor.error}
      validator={editor.validator}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <Section qa="guidance">
        <SimpleString>
          <Content value={x => x.projectMessages.setupGuidance} />
        </SimpleString>
      </Section>

      <UL qa="taskList">
        <TaskListSection title={x => x.taskList.giveUsInfoSectionTitle} qa="WhatDoYouWantToDo">
          <Task
            name={x => x.pages.projectSetup.setSpendProfile}
            status={partner.spendProfileStatusLabel as TaskStatus}
            route={props.routes.projectSetupSpendProfile.getLink({
              partnerId: partner.id,
              projectId: project.id,
            })}
            validation={[editor.validator.spendProfileStatus]}
          />

          <Task
            name={x => x.pages.projectSetup.provideBankDetails}
            status={partner.bankDetailsTaskStatusLabel as TaskStatus}
            route={getBankDetailsLink(partner)}
            validation={[editor.validator.bankDetailsTaskStatus]}
          />

          <Task
            name={x => x.pages.projectSetup.provideProjectLocation}
            status={isPostcodeComplete(partner.postcode)}
            route={props.routes.projectSetupPostcode.getLink({
              projectId: props.projectId,
              partnerId: props.partnerId,
            })}
            validation={[editor.validator.postcodeSetupStatus]}
          />
        </TaskListSection>
      </UL>

      <Form.Form
        data={partner}
        editor={editor}
        onSubmit={() => {
          editor.data.partnerStatus = PartnerStatus.Active;
          props.onUpdate(true, editor.data);
        }}
        qa="projectSetupForm"
      >
        <Form.Fieldset>
          <Form.Submit>
            <Content value={x => x.pages.projectSetup.complete} />
          </Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </Page>
  );
};

const ProjectSetupContainer = (props: ProjectSetupParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partner: stores.partners.getById(props.partnerId),
    editor: stores.partners.getPartnerEditor(props.projectId, props.partnerId),
  });

  const onUpdate = (saving: boolean, dto: PartnerDto) =>
    stores.partners.updatePartner(saving, props.partnerId, dto, {
      onComplete: () => navigate(props.routes.projectDashboard.getLink({}).path),
    });

  return (
    <PageLoader pending={combined} render={x => <ProjectSetupComponent {...props} onUpdate={onUpdate} {...x} />} />
  );
};

export const ProjectSetupRoute = defineRoute<ProjectSetupParams>({
  routeName: "projectSetup",
  routePath: "/projects/:projectId/setup/:partnerId",
  getParams: r => ({ projectId: r.params.projectId as ProjectId, partnerId: r.params.partnerId as PartnerId }),
  container: ProjectSetupContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetup.title),
});
