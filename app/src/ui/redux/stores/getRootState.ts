import { RootState, rootReducer } from "../reducers/rootReducer";

const getRootState: () => RootState = () => rootReducer(undefined, { type: "VOID" });
export default getRootState;
