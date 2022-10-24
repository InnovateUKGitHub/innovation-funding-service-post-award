import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import * as Dtos from "@framework/dtos";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import * as ACC from "@ui/components";
import { BankCheckStatus, BankDetailsTaskStatus, PartnerStatus, ProjectRole } from "@framework/constants";

export interface ProjectSetupParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  partner: Pending<Dtos.PartnerDto>;
  editor: Pending<IEditorStore<Dtos.PartnerDto, PartnerDtoValidator>>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: Dtos.PartnerDto) => void;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  editor: IEditorStore<Dtos.PartnerDto, PartnerDtoValidator>;
}

class ProjectSetupComponent extends ContainerBase<ProjectSetupParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private renderContents({ project, partner, editor }: CombinedData) {
    const Form = ACC.TypedForm<Dtos.PartnerDto>();

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.projectDashboard.getLink({})}>
            <ACC.Content value={x => x.pages.projectSetup.backLink} />
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        error={editor.error}
        validator={editor.validator}
        project={project}
        partner={partner}
      >
        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.projectMessages.setupGuidance} />
          </ACC.Renderers.SimpleString>
        </ACC.Section>

        <ACC.UL qa="taskList">
          <ACC.TaskListSection title={x => x.taskList.giveUsInfoSectionTitle} qa="WhatDoYouWantToDo">
            <ACC.Task
              name={x => x.pages.projectSetup.setSpendProfile}
              status={partner.spendProfileStatusLabel as ACC.TaskStatus}
              route={this.props.routes.projectSetupSpendProfile.getLink({
                partnerId: partner.id,
                projectId: project.id,
              })}
              validation={[editor.validator.spendProfileStatus]}
            />

            <ACC.Task
              name={x => x.pages.projectSetup.provideBankDetails}
              status={partner.bankDetailsTaskStatusLabel as ACC.TaskStatus}
              route={this.getBankDetailsLink(partner)}
              validation={[editor.validator.bankDetailsTaskStatus]}
            />

            <ACC.Task
              name={x => x.pages.projectSetup.provideProjectLocation}
              status={this.isPostcodeComplete(partner.postcode)}
              route={this.props.routes.projectSetupPostcode.getLink({
                projectId: this.props.projectId,
                partnerId: this.props.partnerId,
              })}
              validation={[editor.validator.postcodeSetupStatus]}
            />
          </ACC.TaskListSection>
        </ACC.UL>

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
              <ACC.Content value={x => x.pages.projectSetup.complete} />
            </Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Page>
    );
  }

  // TODO: remove this temporary solution when we have added the postcodeStatusLabel in SF
  private isPostcodeComplete(postcode: string | null): ACC.TaskStatus {
    return postcode ? "Complete" : "To do";
  }

  private getBankDetailsLink(partner: Dtos.PartnerDto) {
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
  getParams: r => ({ projectId: r.params.projectId, partnerId: r.params.partnerId }),
  container: ProjectSetupContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetup.title),
});
