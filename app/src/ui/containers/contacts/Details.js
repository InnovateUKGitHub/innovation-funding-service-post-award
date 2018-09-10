import * as React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../../actions';
import { Link } from 'react-router5';
import Title from '../../layout/Title';
import Breadcrumbs from '../../layout/breadcrumbs';
import * as Tables from '../../tables';
import * as Forms from '../../forms'

class Details extends React.Component {
    componentDidMount() {
        this.props.onLoad(this.props.id);
    }
    render() {
        let data = this.props.data;

        if (!data) {
            return <i>Not Found</i>;
        }

        return (
            <div>
                <Breadcrumbs links={[{ routeName: "home", text: "Home" }, { routeName: "contacts", text: "Contacts" }]}>Contact {data.id}</Breadcrumbs>
                <Title>Contact {data.id}</Title>
                <Forms.Form>
                    <Forms.Fieldset heading="Details">
                        <Forms.ReadOnly label="First Name" name="firstname" value={data.firstName} />
                        <Forms.ReadOnly label="Last Name" name="lastname" value={data.lastName} />
                        <Forms.ReadOnly label="Email" name="email" value={data.email} />
                        <Forms.ReadOnly label="Address" name="address" value={this.renderAddress(data.address)} />
                    </Forms.Fieldset>
                </Forms.Form>
                <Link routeName="contact_edit" routeParams={{ id: data.id }} className="govuk-button govuk-button--start">Edit</Link>
            </div>
        );
    }

    renderAddress(address){
        let items = [address.street, address.city, address.county, address.postcode].filter(x => !!x);
        if(!items.length)
        {
            return "";
        }
        return items.join(", ");
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
        onLoad: (id) => dispatch(Actions.loadContact(id))
    };
}

export default connect(mapStateToProps, mapDispachToProps)(Details);


