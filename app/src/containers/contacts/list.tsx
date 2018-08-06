import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router5';
import { Breadcrumbs, Title } from "../../components/layout";
// import * as Tables from '../../tables';
// import * as Actions from '../../../actions';

class ListComponent extends React.Component {
  componentDidMount() {
    // this.props.onLoad();
  }

  render() {
    // let data = this.props.data;
    // data = data || [];
    // let columns = [
    //   Tables.stringColumn("Id", x => x.id),
    //   Tables.stringColumn("Name", x => x.title + " " + x.firstName + " " + x.lastName),
    //   Tables.stringColumn("Email", x => x.email),
    //   Tables.stringColumn("Address", x => this.renderAddress(x.address)),
    //   Tables.linkColumn("contact_details", (x) => { return { id: x.id } }, "Details")
    // ];

    return (
      <div>
        <Breadcrumbs links={[{routeName:"home", text: "Home"}]}>Contacts</Breadcrumbs>
        <Title>Contacts</Title>
        {/* <Tables.Table key="table" data={data} caption="Some Contacts from salesforce" columns={columns} /> */}
        <Link className="govuk-back-link" routeName="home">Home</Link>
      </div>
    );
  }

  renderAddress(address: any){
    let items = [address.street, address.city, address.county, address.postcode].filter(x => !!x);
    if(!items.length) {
      return "";
    }
    return items.map((x,i) => [<span key={`address${i}`}>{x}<br/></span>, ]);
  }
}

function mapStateToProps(state: any) {
  return {
    data: state && state.data && state.data.contacts && state.data.contacts.all && state.data.contacts.all.data
  };
}

function mapDispachToProps(dispatch: any) {
  return {
    // onLoad: () => dispatch(Actions.loadContacts())
  };
}

export const ContactList = connect(mapStateToProps, mapDispachToProps)(ListComponent); 