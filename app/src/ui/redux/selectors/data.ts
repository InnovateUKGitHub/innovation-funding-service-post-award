import {RootState} from "../reducers";

export const getData = (state: RootState) => (state.data) || {};
