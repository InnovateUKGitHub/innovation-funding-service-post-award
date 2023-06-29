import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
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
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: PartnerDto) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
}

const Form = createTypedForm<PartnerDto>();
class ProjectSetupComponent extends ContainerBase<ProjectSetupParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      editor: this.props.editor,
    });

    return <PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private renderContents({ project, partner, editor }: CombinedData) {
    return (
      <Page
        backLink={
          <BackLink route={this.props.routes.projectDashboard.getLink({})}>
            <Content value={x => x.pages.projectSetup.backLink} />
          </BackLink>
        }
        pageTitle={<Title {...project} />}
        error={editor.error}
        validator={editor.validator}
        project={project}
        partner={partner}
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
              route={this.props.routes.projectSetupSpendProfile.getLink({
                partnerId: partner.id,
                projectId: project.id,
              })}
              validation={[editor.validator.spendProfileStatus]}
            />

            <Task
              name={x => x.pages.projectSetup.provideBankDetails}
              status={partner.bankDetailsTaskStatusLabel as TaskStatus}
              route={this.getBankDetailsLink(partner)}
              validation={[editor.validator.bankDetailsTaskStatus]}
            />

            <Task
              name={x => x.pages.projectSetup.provideProjectLocation}
              status={this.isPostcodeComplete(partner.postcode)}
              route={this.props.routes.projectSetupPostcode.getLink({
                projectId: this.props.projectId,
                partnerId: this.props.partnerId,
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
            this.props.onUpdate(true, editor.data);
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
  }

  // TODO: remove this temporary solution when we have added the postcodeStatusLabel in SF
  private isPostcodeComplete(postcode: string | null): TaskStatus {
    return postcode ? "Complete" : "To do";
  }

  private getBankDetailsLink(partner: PartnerDto) {
    if (partner.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete) {
      return null;
    }
    switch (partner.bankCheckStatus) {
      case BankCheckStatus.NotValidated: {
        return this.props.routes.projectSetupBankDetails.getLink({
          partnerId: this.props.partnerId,
          projectId: this.props.projectId,
        });
      }
      case BankCheckStatus.ValidationFailed:
      case BankCheckStatus.VerificationFailed: {
        return this.props.routes.projectSetupBankStatement.getLink({
          partnerId: this.props.partnerId,
          projectId: this.props.projectId,
        });
      }
      case BankCheckStatus.ValidationPassed: {
        return this.props.routes.projectSetupBankDetailsVerify.getLink({
          partnerId: this.props.partnerId,
          projectId: this.props.projectId,
        });
      }
      case BankCheckStatus.VerificationPassed: {
        return null;
      }
      default:
        return null;
    }
  }
}

const ProjectSetupContainer = (props: ProjectSetupParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  return (
    <ProjectSetupComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId)}
      onUpdate={(saving, dto) =>
        stores.partners.updatePartner(saving, props.partnerId, dto, {
          onComplete: () => navigate(props.routes.projectDashboard.getLink({}).path),
        })
      }
    />
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
