import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router5';
import { Breadcrumbs, Title } from '../../components/layout';
// import * as Actions from '../../../actions';
// import * as Tables from '../../tables';

interface ListProps {
  data: any;
  onLoad: any;
}

class ListComponent extends React.Component<ListProps> {
  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    let data = this.props.data;
    data = data || [];
    let columns = [
      // Tables.stringColumn("Id", x => x.id),
      // Tables.stringColumn("Name", x => x.name),
      // Tables.linkColumn("example_details", (x) => { return { id: x.id } }, "Details")
    ];

    return (
      <div>
        <Breadcrumbs links={[{routeName:"home", text: "Home"}]}>Examples</Breadcrumbs>
        <Title>Examples</Title>
        <div>
          {this.renderTable(data)}
        </div>
        {/* <Tables.Table key="table" data={data} caption="Some Examples" columns={columns} /> */}
        <Link className="govuk-back-link" routeName="home">Home</Link>
      </div>
    );
  }

  renderTable(data: any[]) {
    console.log(data);
    return data.map((x, i) => <Link key={i} routeName="example_details" routeParams={{ id: x.id }}>{ x.name }</Link>);
  }
}

function mapStateToProps(state: any) {
  return {
    data: state && state.data && state.data.examples && state.data.examples.all && state.data.examples.all.data
  };
}

function mapDispachToProps(dispatch: any) {
  return {
    // onLoad: () => dispatch(ExampleThunks.loadAllExamples())
  };
}

export const List = connect(mapStateToProps, mapDispachToProps)(ListComponent);
