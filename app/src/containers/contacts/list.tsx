import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router5";
import { Breadcrumbs, Title } from "../../components/layout";
import { matchRoute } from "../../routing/matchRoute";
// import * as Tables from '../../tables';
// import * as Actions from '../../../actions';

interface IProps {
  onLoad: any;
}

class ListComponent extends React.Component<IProps> {
  componentDidMount() {
    this.props.onLoad();
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
        <Title title="Contacts" />
        {/* <Tables.Table key="table" data={data} caption="Some Contacts from salesforce" columns={columns} /> */}
        <Link className="govuk-back-link" routeName="home">Home</Link>
      </div>
    );
  }

  renderAddress(address: any) {
    const items = [address.street, address.city, address.county, address.postcode].filter(x => !!x);

    return (!items.length)
      ? ""
      : items.map((x,i) => [<span key={`address${i}`}>{x}<br/></span>, ]);
  }
}

function mapStateToProps(state: any) {
  return {
    data: state && state.data && state.data.contacts && state.data.contacts.all && state.data.contacts.all.data
  };
}

function routeConnect(
  routeName: string,
  component: React.ComponentType<any>,
  mapState?: any,
  mapDispatch?: any
) {
  const mapLoadData = (dispatch: any) => {
    const props = typeof mapDispatch === "undefined" ? {} : mapDispatch(dispatch);
    const route = matchRoute({ name: routeName } as any);

    if(!!route && route.loadData) {
      props.onLoad = () => dispatch(route.loadData);
    }

    return props;
  };

  return connect(mapState, mapLoadData)(component);
}

export const ContactList = routeConnect("contacts", ListComponent, mapStateToProps);
// export const ContactList = connect(mapStateToProps, mapDispachToProps)(ListComponent);
