import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { StoresConsumer } from "@ui/redux";

interface Data {
    project: Pending<ProjectDto>;
    partner: Pending<PartnerDto>;
}

interface Params {
    id: string;
    partnerId: string;
}

interface Callbacks {
}

interface CombinedData {
    project: ProjectDto;
    partner: PartnerDto;
}

class PartnerDetailsComponent extends ContainerBase<Params, Data, Callbacks> {

    render() {
        const combined = Pending.combine({
            project: this.props.project,
            partner: this.props.partner
        });

        return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
    }

    private renderContents({ partner, project }: CombinedData) {
        const isFC = (partner.roles & ProjectRole.FinancialContact) === ProjectRole.FinancialContact;
        const isPM = (partner.roles & ProjectRole.ProjectManager) === ProjectRole.ProjectManager;

        return (
            <ACC.Page
                backLink={<ACC.BackLink route={this.props.routes.projectDetails.getLink({ id: this.props.id })}>Back to project details</ACC.BackLink>}
                pageTitle={<ACC.Projects.Title project={project} />}
                project={project}
                partner={partner}
            >
                <ACC.Section>
                    <ACC.SummaryList qa="partner-details">
                        <ACC.SummaryListItem
                            labelContent={x => x.partnerDetails.contactLabels.partnerName()}
                            qa="partner-name"
                            content={<ACC.Renderers.SimpleString>{partner.name}</ACC.Renderers.SimpleString>}
                        />
                        <ACC.SummaryListItem
                            labelContent={x => x.partnerDetails.contactLabels.partnerType()}
                            qa="partner-type"
                            content={<ACC.Renderers.SimpleString>{partner.type}</ACC.Renderers.SimpleString>}
                        />
                        <ACC.SummaryListItem
                            labelContent={x => x.partnerDetails.contactLabels.partnerPostcode()}
                            qa="partner-postcode"
                            content={<ACC.Renderers.SimpleString>{partner.postcode}</ACC.Renderers.SimpleString>}
                            action={isFC || isPM ? <ACC.Link styling={"Link"} route={this.props.routes.partnerDetailsEdit.getLink({ id: this.props.id, partnerId: this.props.partnerId })}>Edit</ACC.Link> : null}
                        />
                    </ACC.SummaryList>
                </ACC.Section>
            </ACC.Page >
        );
    }
}

const PartnerDetailsContainer = (props: Params & BaseProps) => (
    <StoresConsumer>
        {
            stores => (
                <PartnerDetailsComponent
                    project={stores.projects.getById(props.id)}
                    partner={stores.partners.getById(props.partnerId)}
                    {...props}
                />
            )
        }
    </StoresConsumer>
);

export const PartnerDetailsRoute = defineRoute<Params>({
    routeName: "partnerDetails",
    routePath: "/projects/:id/details/:partnerId",
    container: (props) => <PartnerDetailsContainer {...props} />,
    getParams: (r) => ({ id: r.params.id, partnerId: r.params.partnerId }),
    getTitle: ({ content }) => content.partnerDetails.title(),
    accessControl: (auth, { id }) => auth.forProject(id).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
