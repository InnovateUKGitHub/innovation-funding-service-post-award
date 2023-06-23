import { combineReducers } from "redux";
import { IClientUser } from "@framework/types/IUser";
import { historyReducer } from "@ui/redux/reducers/historyReducer";
import { ErrorPayload } from "@shared/create-error-payload";
import { dataReducer } from "./dataReducer";
import { loadStatusReducer } from "./loadStatusReducer";
import { editorReducer } from "./editorsReducer";
import { errorReducer } from "./errorReducer";
import { userReducer } from "./userReducer";
import { messagesReducer } from "./messagesReducer";
import { configReducer } from "./configReducer";
import { IClientConfig } from "src/types/IClientConfig";

export type DataState = ReturnType<typeof dataReducer>;

export type EditorState = ReturnType<typeof editorReducer>;

export type MessagesState = ReturnType<typeof messagesReducer>;

export type ErrorState = ReturnType<typeof errorReducer>;

export interface RootState {
  data: DataState;
  editors: EditorState;
  history: number;
  loadStatus: number;
  messages: MessagesState;
  user: IClientUser;
  config: IClientConfig;
  globalError: ErrorPayload["params"] | null;
}

export const rootReducer = combineReducers<RootState>({
  data: dataReducer,
  editors: editorReducer,
  history: historyReducer,
  loadStatus: loadStatusReducer,
  messages: messagesReducer,
  user: userReducer,
  config: configReducer,
  globalError: errorReducer,
});
