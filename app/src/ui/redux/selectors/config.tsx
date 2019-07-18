import { RootState } from "@ui/redux";

export const getMaxFileSize = (state: RootState) => state.config.maxFileSize;
