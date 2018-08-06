import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router5';
import { actions as routerActions } from 'redux-router5';
import * as Actions from '../../../actions';
import * as Forms from '../../forms';
import Breadcrumbs from '../../layout/breadcrumbs';
import Title from '../../layout/Title';

class Edit extends React.Component {

    constructor(props) {
        super(props);
        this.state = { editor: JSON.parse(JSON.stringify(this.props.data || {})) };
    }

    render() {
        let {data} = this.props;
        let links = [
            { routeName: "home", text: "Home" },
             { routeName: "contacts", text: "Contacts" }, 
             {routeName: "contact_details", text: `Contact ${data.id}`, routeParams:{id:data.id}}
            ];

        return (
            <div>
                <Breadcrumbs links={links}>Edit Example {data.id}</Breadcrumbs>
                <Title>Edit Contact {data.id}</Title>
                {this.renderForm()}
            </div>
        );
    }

    renderForm() {
        let data = this.state.editor;
        if (!data || !data.id) {
            return <i>Not Found</i>;
        }
        else {
            let action = `/forms/contacts/${data.id}`;
            return (
                <Forms.Form action={action} onSubmit={() => this.props.onSave(this.state.editor)}>
                    <Forms.Fieldset heading={`Details`}>
                        <Forms.TextField label="First Name" name="firstname" value={data.firstName} hint="Please enter the first name of the contact" onChange={v => this.onChange(dto => dto.firstName = v)} />
                        <Forms.TextField label="Last Name" name="lastname" value={data.lastName} hint="Please enter the last name of the contact" onChange={v => this.onChange(dto => dto.lastName = v)} />
                        <Forms.Button label="Save" />
                    </Forms.Fieldset>
                </Forms.Form>
            );
        };
    }

    onChange(update) {
        let editor = this.state.editor;
        update(editor);
        this.setState({ editor });
    }
}

function mapStateToProps(state, props) {
    return {
        data: state && state.data && state.data.contact && state.data.contact[props.route.params.id] && state.data.contact[props.route.params.id].data,
        id: props.route.params.id
    };
}

function mapDispachToProps(dispatch) {
    return {
        onLoad: (id) => dispatch(Actions.loadContact(id)),
        onSave: (dto) => dispatch(Actions.updateContact(dto))
            .then(x => dispatch(routerActions.navigateTo('contact_details', { id: dto.id })))
    };
}

export default connect(mapStateToProps, mapDispachToProps)(Edit);


