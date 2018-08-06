import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router5';
import { Breadcrumbs, Title } from '../../components/layout';

// import * as Actions from '../../../actions';
// import Title from '../../layout/Title';
// import Breadcrumbs from '../../layout/breadcrumbs';
// import * as Tables from '../../tables';
// import * as Forms from '../../forms'

interface Props {
  data?: any;
}

class DetailsContainer extends React.Component<Props, any> {
  componentDidMount() {
    // this.props.onLoad(this.props.id);
  }

  render() {
    const data = this.props.data;
console.log("DATA", data);
    if (!data) {
      return <i>Not Found</i>;
    }

    const links = [
      {routeName:"home", text:"Home"},
      {routeName: "examples", text:"Examples"}
    ];

    return (
      <div>
        <Breadcrumbs links={links}>Example {data.id}</Breadcrumbs>
        <Title>Example {data.id}</Title>
        <div>{ data.name }</div>

        {/* <Forms.Form>
          <Forms.Fieldset heading="Details">
            <Forms.ReadOnly label="Example Name" name="name" value={data.name} />
          </Forms.Fieldset>
        </Forms.Form> */}
        <Link routeName="example_edit" routeParams={{id:data.id}} className="govuk-button govuk-button--start">Edit</Link>
      </div>
    );
  }
}

function mapStateToProps(state: any, props: any) {
  return {
    data : state && state.data && state.data.examples && state.data.examples[props.route.params.id] && state.data.examples[props.route.params.id].data,
    id:props.route.params.id
  };
}

function mapDispachToProps(dispatch: any) {
  return {
    // onLoad : () => dispatch(ExampleThunks.loadExample())
  };
}

export const Details = connect(mapStateToProps, mapDispachToProps)(DetailsContainer);
