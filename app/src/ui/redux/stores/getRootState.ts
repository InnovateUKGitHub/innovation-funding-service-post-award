import { rootReducer, RootState } from "@ui/redux/reducers";
const getRootState: () => RootState = () => rootReducer({} as any, "" as any);
export default getRootState;
