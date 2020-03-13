import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { Authorisation, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";

interface Data {
    project: Pending<ProjectDto>;
    partner: Pending<PartnerDto>;
    editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
}

interface Params {
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

class PartnerDetailsEditComponent extends ContainerBase<Params, Data, Callbacks> {

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
                backLink={<ACC.BackLink route={this.props.routes.partnerDetails.getLink({ id: this.props.id, partnerId: this.props.partnerId })} >Back to partner details </ACC.BackLink>}
                pageTitle={<ACC.PageTitle />}
                error={editor.error}
                validator={editor.validator}
                project={project}
            >
                <Form.Form
                    data={partner}
                    editor={editor}
                    onSubmit={() => this.props.onUpdate(true, editor.data)}
                    qa="partnerDetailsForm"
                >
                    <Form.Fieldset heading="Update postcode">
                        <Form.Custom name="current-partner-postcode-value" label="Current value" value={x => <ACC.Renderers.SimpleString>{x.postcode}</ACC.Renderers.SimpleString>} update={() => null} />
                        <Form.Custom name="new-partner-postcode-value" label="New value" value={x => <Form.String name="changePostcode" value={(m) => editor.data.postcode} update={(m, val) => editor.data.postcode = val!} />} update={() => null} />
                    </Form.Fieldset>
                    <Form.Fieldset>
                        <Form.Submit><ACC.Content value={(content) => content.partnerDetailsEdit.buttonSaveAndReturnPartnerDetails()} /></Form.Submit>
                    </Form.Fieldset>
                </Form.Form>
            </ACC.Page >
        );
    }
}

const PartnerDetailsEditContainer = (props: Params & BaseProps) => (
    <StoresConsumer>
        {
            stores => (
                <PartnerDetailsEditComponent
                    project={stores.projects.getById(props.id)}
                    partner={stores.partners.getById(props.partnerId)}
                    editor={stores.partners.getPartnerEditor(props.id, props.partnerId)}
                    onUpdate={(saving, dto) => stores.partners.updatePartner(saving, props.partnerId, dto, () => stores.navigation.navigateTo(props.routes.partnerDetails.getLink({ id: props.id, partnerId: props.partnerId })))}
                    {...props}
                />
            )
        }
    </StoresConsumer>
);

export const PartnerDetailsEditRoute = defineRoute<Params>({
    routeName: "partnerDetailsEdit",
    routePath: "/projects/:id/edit/:partnerId",
    container: (props) => <PartnerDetailsEditContainer {...props} />,
    getParams: (r) => ({ id: r.params.id, partnerId: r.params.partnerId }),
    getTitle: ({ content }) => content.partnerDetailsEdit.title(),
    accessControl: (auth, { id, partnerId }) => auth.forPartner(id, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager)
});
