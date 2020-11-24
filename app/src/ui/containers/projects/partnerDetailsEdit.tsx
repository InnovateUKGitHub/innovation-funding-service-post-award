import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";

interface Data {
    project: Pending<ProjectDto>;
    partner: Pending<PartnerDto>;
    editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
}

export interface PartnerDetailsParams {
    id: string;
    partnerId: string;
}

interface Callbacks {
    onUpdate: (saving: boolean, dto: PartnerDto) => void;
}

interface CombinedData {
    project: ProjectDto;
    partner: PartnerDto;
    editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
}

class PartnerDetailsEditComponent extends ContainerBase<PartnerDetailsParams, Data, Callbacks> {

    render() {
        const combined = Pending.combine({
            project: this.props.project,
            partner: this.props.partner,
            editor: this.props.editor,
        });

        return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
    }

    private renderContents({ partner, project, editor }: CombinedData) {
        const Form = ACC.TypedForm<PartnerDto>();

        return (
            <ACC.Page
                backLink={<ACC.BackLink route={this.props.routes.partnerDetails.getLink({ id: this.props.id, partnerId: this.props.partnerId })} >Back to partner information</ACC.BackLink>}
                pageTitle={<ACC.Projects.Title project={project} />}
                error={editor.error}
                validator={editor.validator}
                project={project}
                partner={partner}
            >
                <Form.Form
                    data={partner}
                    editor={editor}
                    onSubmit={() => this.props.onUpdate(true, editor.data)}
                    qa="partnerDetailsForm"
                >
                    <Form.Fieldset headingContent={x => x.partnerDetailsEdit.postcodeSectionTitle}>
                        <Form.Custom name="current-partner-postcode-value" labelContent={x => x.partnerDetailsEdit.currentPostcodeLabel} value={x => <ACC.Renderers.SimpleString>{x.postcode}</ACC.Renderers.SimpleString>} update={() => null} />
                        <Form.String
                          name="new-partner-postcode-value"
                          hintContent={x => x.partnerDetailsEdit.newPostcodeHint}
                          width="one-quarter"
                          value={(m) => editor.data.postcode}
                          labelContent={x => x.partnerDetailsEdit.newPostcodeLabel}
                          update={(m, val) => editor.data.postcode = val!}
                        />
                    </Form.Fieldset>
                    <Form.Fieldset>
                        <Form.Submit><ACC.Content value={(content) => content.partnerDetailsEdit.buttonSaveAndReturnPartnerDetails} /></Form.Submit>
                    </Form.Fieldset>
                </Form.Form>
            </ACC.Page >
        );
    }
}

const PartnerDetailsEditContainer = (props: PartnerDetailsParams & BaseProps) => (
    <StoresConsumer>
        {
            stores => (
                <PartnerDetailsEditComponent
                    project={stores.projects.getById(props.id)}
                    partner={stores.partners.getById(props.partnerId)}
                    editor={stores.partners.getPartnerEditor(props.id, props.partnerId)}
                    onUpdate={(saving, dto) => stores.partners.updatePartner(saving, props.partnerId, dto, {onComplete: () => stores.navigation.navigateTo(props.routes.partnerDetails.getLink({ id: props.id, partnerId: props.partnerId }))})}
                    {...props}
                />
            )
        }
    </StoresConsumer>
);

export const PartnerDetailsEditRoute = defineRoute<PartnerDetailsParams>({
    routeName: "partnerDetailsEdit",
    routePath: "/projects/:id/edit/:partnerId",
    container: (props) => <PartnerDetailsEditContainer {...props} />,
    getParams: (r) => ({ id: r.params.id, partnerId: r.params.partnerId }),
    getTitle: ({ content }) => content.partnerDetailsEdit.title(),
    accessControl: (auth, { id, partnerId }) => auth.forPartner(id, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager)
});
