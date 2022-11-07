import { rootReducer, RootState } from "@ui/redux/reducers";

const getRootState: () => RootState = () => rootReducer(undefined, { type: "VOID" });
export default getRootState;
