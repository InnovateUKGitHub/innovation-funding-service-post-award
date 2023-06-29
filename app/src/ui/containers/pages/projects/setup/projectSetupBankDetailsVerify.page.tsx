import { useNavigate } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { BankCheckStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";

export interface ProjectSetupBankDetailsVerifyParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
}

interface Callbacks {
  onChange: (submit: boolean, dto: PartnerDto) => void;
}

const Form = createTypedForm<PartnerDto>();
class ProjectSetupBankDetailsVerifyComponent extends ContainerBase<
  ProjectSetupBankDetailsVerifyParams,
  Data,
  Callbacks
> {
  public render() {
    const combined = Pending.combine({ project: this.props.project, editor: this.props.editor });
    return <PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor)} />;
  }
  public renderContents(project: ProjectDto, editor: IEditorStore<PartnerDto, PartnerDtoValidator>) {
    const { bankDetails } = editor.data;

    return (
      <Page
        backLink={
          <BackLink
            route={this.props.routes.projectSetup.getLink({
              projectId: this.props.projectId,
              partnerId: this.props.partnerId,
            })}
          >
            <Content value={x => x.pages.projectSetupBankDetailsVerify.backLink} />
          </BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<Title {...project} />}
      >
        {this.renderGuidance()}
        <Section>
          <SummaryList qa="bank-details-summary">
            <SummaryListItem
              label={x => x.partnerLabels.organisationName}
              content={editor.data.name}
              qa={"organisationName"}
            />
            <SummaryListItem
              label={x => x.partnerLabels.companyNumber}
              content={bankDetails.companyNumber}
              qa={"companyNumber"}
            />
            <SummaryListItem label={x => x.partnerLabels.sortCode} content={bankDetails.sortCode} qa={"sortCode"} />
            <SummaryListItem
              label={x => x.partnerLabels.accountNumber}
              content={bankDetails.accountNumber}
              qa={"accountNumber"}
            />
            {/* TODO: Commenting out in the hope we get an answer from experian in the coming weeks */}
            {/* <SummaryListItem label={x => x.pages.projectSetupBankDetailsVerify.partnerLabels.firstName()} content={bankDetails.firstName} qa={"firstName"}/>
            <SummaryListItem label={x => x.pages.projectSetupBankDetailsVerify.partnerLabels.lastName()} content={bankDetails.lastName} qa={"lastName"}/> */}
            <SummaryListItem
              label={x => x.partnerLabels.accountBuilding}
              content={bankDetails.address.accountBuilding}
              qa={"accountBuilding"}
            />
            <SummaryListItem
              label={x => x.partnerLabels.accountStreet}
              content={bankDetails.address.accountStreet}
              qa={"accountStreet"}
            />
            <SummaryListItem
              label={x => x.partnerLabels.accountLocality}
              content={bankDetails.address.accountLocality}
              qa={"accountLocality"}
            />
            <SummaryListItem
              label={x => x.partnerLabels.accountTownOrCity}
              content={bankDetails.address.accountTownOrCity}
              qa={"accountTownOrCity"}
            />
            <SummaryListItem
              label={x => x.partnerLabels.accountPostcode}
              content={bankDetails.address.accountPostcode}
              qa={"accountPostcode"}
            />
          </SummaryList>
        </Section>
        <Section qa="bank-details-verify-section">
          <Form.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="bank-details-form"
          >
            <Form.Fieldset>
              <Form.Submit>
                <Content value={x => x.pages.projectSetupBankDetailsVerify.submitButton} />
              </Form.Submit>
              <Link
                styling="SecondaryButton"
                route={this.props.routes.projectSetupBankDetails.getLink({
                  projectId: this.props.projectId,
                  partnerId: this.props.partnerId,
                })}
              >
                <Content value={x => x.pages.projectSetupBankDetailsVerify.changeButton} />
              </Link>
            </Form.Fieldset>
          </Form.Form>
        </Section>
      </Page>
    );
  }

  private renderGuidance() {
    return (
      <Section qa={"guidance"}>
        <Content markdown value={x => x.pages.projectSetupBankDetailsVerify.guidanceMessage} />
      </Section>
    );
  }
}

const ProjectSetupBankDetailsVerifyContainer = (props: ProjectSetupBankDetailsVerifyParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  return (
    <ProjectSetupBankDetailsVerifyComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId)}
      onChange={(submit, dto) => {
        stores.partners.updatePartner(submit, props.partnerId, dto, {
          verifyBankDetails: submit,
          onComplete: (resp: PartnerDto) =>
            resp.bankCheckStatus === BankCheckStatus.VerificationPassed
              ? navigate(
                  props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId }).path,
                )
              : navigate(
                  props.routes.failedBankCheckConfirmation.getLink({
                    projectId: props.projectId,
                    partnerId: props.partnerId,
                  }).path,
                ),
        });
      }}
    />
  );
};

export const ProjectSetupBankDetailsVerifyRoute = defineRoute({
  routeName: "ProjectSetupBankDetailsVerify",
  routePath: "/projects/:projectId/setup/:partnerId/bank-details-verify",
  container: ProjectSetupBankDetailsVerifyContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupBankDetailsVerify.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
