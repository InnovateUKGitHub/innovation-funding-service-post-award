import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router5";
import { Breadcrumbs, Title } from "../../components";
// import * as Tables from '../../tables';
// import * as Actions from '../../../actions';

class List extends React.Component {
  componentDidMount() {
    // this.props.onLoad();
  }

  render() {
    // let data = null; // this.props.data;
    // data = data || [];
    // let columns = [
      // Tables.stringColumn("Id", x => x.id),
      // Tables.stringColumn("Name", x => x.name),
      // Tables.linkColumn("example_details", (x) => { return { id: x.id } }, "Details")
    // ];
    return (
      <div>
        <Breadcrumbs links={[{routeName:"home", text: "Home"}]}>Accounts</Breadcrumbs>
        <Title>Accounts</Title>
        {/* <Tables.Table key="table" data={data} caption="Some Accounts from salesforce" columns={columns} /> */}
        <Link className="govuk-back-link" routeName="home">Home</Link>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    // data: state && state.data && state.data.accounts && state.data.accounts.all && state.data.accounts.all.data
  };
}

// tslint:disable:no-identical-functions
function mapDispachToProps(dispatch: any) {
  return {
    // onLoad: () => dispatch(Actions.loadAccounts())
  };
}

export default connect(mapStateToProps, mapDispachToProps)(List);
