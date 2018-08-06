// import * as React from 'react';
// import { connect } from 'react-redux';
// import { Link } from 'react-router5';
// import { actions as routerActions } from 'redux-router5';
// import * as Actions from '../../../actions';
// import * as Forms from '../../forms';
// import Breadcrumbs from '../../layout/breadcrumbs';
// import Title from '../../layout/Title';

// class Edit extends React.Component {

//     constructor(props) {
//         super(props);

//         console.log("INIT", this.props);

//         this.state = { editor: JSON.parse(JSON.stringify(this.props.data || {})) };
//     }

//     render() {
//         let {data} = this.props;
//         let links = [
//             { routeName: "home", text: "Home" },
//              { routeName: "examples", text: "Examples" }, 
//              {routeName: "example_details", text: `Example ${data.id}`, routeParams:{id:data.id}}
//             ];

//         return (
//             <div>
//                 <Breadcrumbs links={links}>Edit Example {data.id}</Breadcrumbs>
//                 <Title>Example {data.id}</Title>
//                 {this.renderForm()}
//             </div>
//         );
//     }

//     renderForm() {
//         let data = this.state.editor;
//         if (!data || !data.id) {
//             return <i>Not Found</i>;
//         }
//         else {
//             let action = `/forms/examples/${data.id}`;
//             return (
//                 <Forms.Form action={action} onSubmit={() => this.props.onSave(this.state.editor)}>
//                     <Forms.Fieldset heading={`Details`}>
//                         <Forms.TextField label="Example Name" name="name" value={data.name} hint="Please enter the name for the example" onChange={v => this.onChange(dto => dto.name = v)} />
//                         <Forms.Button label="Save" />
//                     </Forms.Fieldset>
//                 </Forms.Form>
//             );
//         };
//     }

//     onChange(update) {
//         let editor = this.state.editor;
//         update(editor);
//         this.setState({ editor });
//     }
// }

// function mapStateToProps(state, props) {
//     return {
//         data: state && state.data && state.data.example && state.data.example[props.route.params.id] && state.data.example[props.route.params.id].data,
//         id: props.route.params.id
//     };
// }

// function mapDispachToProps(dispatch) {
//     return {
//         onLoad: (id) => dispatch(Actions.loadExample(id)),
//         onSave: (dto) => dispatch(Actions.updateExample(dto))
//             .then(x => dispatch(routerActions.navigateTo('example_details', { id: dto.id })))
//     };
// }

// export default connect(mapStateToProps, mapDispachToProps)(Edit);


