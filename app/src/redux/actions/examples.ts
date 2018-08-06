// import { ActionsUnion, AsyncThunk } from "./common";
// import { conditionalLoad, createLoadAction } from "./dataLoad";

// function loadAllExamples(): AsyncThunk<any> {
//   var data = Array.from({ length: 10 })
//     .map((x, i) => i + 1)
//     .map((id, i) => ({ id: id, name: "Item " + id }));

//   return conditionalLoad(
//     (state: any) => state && state.examples && state.examples.data,
//     createLoadAction("all", "examples"),
//     () => Promise.resolve(data)
//   );

//   // () => fetch(`http://localhost:8080/api/examples/${id}`)
// }

// function loadExample(): AsyncThunk<any> {
//   return (dispatch, getState) => {
//     const state = getState();
//     const id    = state.router.route.params.id;

//     const load = conditionalLoad(
//       (state: any) => state.examples,
//       createLoadAction(id, "examples"),
//       () => Promise.resolve({ id, name: `Item ${id}` })
//       // () => fetch(`http://localhost:8080/api/examples`)
//     );

//     return load(dispatch, getState, {});
//   }
// }

// export const ExampleThunks = {
//   loadAllExamples,
//   loadExample,

// };

// export const ExampleActions = {
// };

// export type ExampleActions = ActionsUnion<typeof ExampleActions>;

// // function asyncFunc(): AsyncThunk<string> {
// //   return (dispatch) => {
// //     dispatch(Actions.setAge(1));
    
// //     return Promise.resolve('NICE!');
// //   };
// // }
