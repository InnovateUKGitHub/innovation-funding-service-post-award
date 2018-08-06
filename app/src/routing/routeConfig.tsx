import React from "react";
import { Route } from 'router5'
import * as Containers from "../containers";

export interface AsyncRoute extends Route {
  component: React.ComponentType;
  loadData: any;
};

export const routeConfig: AsyncRoute[] = [
  { 
    name: 'home',
    path: '/',
    component: Containers.Home,
    loadData: () => Promise.resolve({})
  },
  // {
  //   name: 'examples',
  //   path: '/examples',
  //   component: Examples.List,
  //   loadData: ExampleThunks.loadAllExamples()
  //   // loadData: (dispatch) => dispatch(Actions.loadExamples())
  // },
  // {
  //   name: 'example_details',
  //   path: '/examples/:id',
  //   component: Examples.Details,
  //   // loadData: () => Promise.resolve({})
  //   loadData: ExampleThunks.loadExample()
  // },
  // {
  //   name: 'example_edit',
  //   path: '/examples/:id/edit',
  //   render: (props) => <Examples.Edit {...props} />,
  //   loadData: (dispatch, props) => dispatch(Actions.loadExample(props.router.route.params.id))
  // },
  // {
  //   name: 'accounts',
  //   path: '/accounts',
  //   render: (props) => <Accounts.List {...props}/>,
  //   loadData: (dispatch) => dispatch(Actions.loadAccounts())
  // },
  {
    name: 'contacts',
    path: '/contacts',
    component: Containers.ContactList,
    // loadData: (dispatch) => dispatch(Actions.loadContacts())
    loadData: () => Promise.resolve({})
  },
  // {
  //   name: 'contact_details',
  //   path: '/contacts/:id',
  //   render: (props) => <Contacts.Details {...props}/>,
  //   loadData: (dispatch, props) => dispatch(Actions.loadContact(props.router.route.params.id))
  // },
  // {
  //   name: 'contact_edit',
  //   path: '/contacts/:id/edit',
  //   render: (props) => <Contacts.Edit {...props}/>,
  //   loadData: (dispatch, props) => dispatch(Actions.loadContact(props.router.route.params.id))
  // },
];
