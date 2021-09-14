import { getAuthRoles, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { StoresConsumer } from "@ui/redux";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
}

interface Params {
  projectId: string;
  partnerId: string;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
}

class PartnerDetailsComponent extends ContainerBase<Params, Data> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private renderContents({ partner, project }: CombinedData) {
    const { isFc, isPm } = getAuthRoles(partner.roles);

    const backToProjectDetailsLink = <ACC.Content value={x => x.partnerDetails.backToProjectDetails} />;
    const editLink = <ACC.Content value={x => x.partnerDetails.editLink} />;

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.projectDetails.getLink({ projectId: this.props.projectId })}>
            {backToProjectDetailsLink}
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        partner={partner}
      >
        <ACC.Section>
          <ACC.SummaryList qa="partner-details">
            <ACC.SummaryListItem
              labelContent={x => x.partnerDetails.contactLabels.partnerName}
              qa="partner-name"
              content={<ACC.Renderers.SimpleString>{partner.name}</ACC.Renderers.SimpleString>}
            />
            <ACC.SummaryListItem
              labelContent={x => x.partnerDetails.contactLabels.partnerType}
              qa="partner-type"
              content={<ACC.Renderers.SimpleString>{partner.type}</ACC.Renderers.SimpleString>}
            />
            <ACC.SummaryListItem
              labelContent={x => x.partnerDetails.contactLabels.partnerPostcode}
              qa="partner-postcode"
              content={<ACC.Renderers.SimpleString>{partner.postcode}</ACC.Renderers.SimpleString>}
              action={
                isFc || isPm ? (
                  <ACC.Link
                    styling={"Link"}
                    route={this.props.routes.partnerDetailsEdit.getLink({
                      projectId: this.props.projectId,
                      partnerId: this.props.partnerId,
                    })}
                  >
                    {editLink}
                  </ACC.Link>
                ) : null
              }
            />
          </ACC.SummaryList>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const PartnerDetailsContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PartnerDetailsComponent
        project={stores.projects.getById(props.projectId)}
        partner={stores.partners.getById(props.partnerId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PartnerDetailsRoute = defineRoute<Params>({
  routeName: "partnerDetails",
  routePath: "/projects/:projectId/details/:partnerId",
  container: PartnerDetailsContainer,
  getParams: r => ({ projectId: r.params.projectId, partnerId: r.params.partnerId }),
  getTitle: ({ content }) => content.partnerDetails.title(),
  accessControl: (auth, { projectId }) =>
    auth
      .forProject(projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
