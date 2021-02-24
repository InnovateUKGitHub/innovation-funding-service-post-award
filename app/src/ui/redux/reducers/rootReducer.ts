import { combineReducers } from "redux";
import { router5Reducer, RouterState } from "redux-router5";
import { IClientUser } from "@framework/types/IUser";
import { historyReducer } from "@ui/redux/reducers/historyReducer";
import { dataReducer } from "./dataReducer";
import { loadStatusReducer } from "./loadStatusReducer";
import { editorReducer } from "./editorsReducer";
import { userReducer } from "./userReducer";
import { messagesReducer } from "./messagesReducer";
import { configReducer, IClientConfig } from "./configReducer";
import { pageTitleReducer, PageTitleState } from "./pageTitleReducer";

export type DataState = ReturnType<typeof dataReducer>;
export type DataStateKeys = keyof DataState;
export type EditorState = ReturnType<typeof editorReducer>;
export type EditorStateKeys = keyof EditorState;
export type MessagesState = ReturnType<typeof messagesReducer>;

export interface RootState {
  router: RouterState;
  data: DataState;
  editors: EditorState;
  history: number;
  loadStatus: number;
  messages: MessagesState;
  user: IClientUser;
  isClient: boolean;
  config: IClientConfig;
  title: PageTitleState;
}

export const rootReducer = combineReducers<RootState>({
  router: router5Reducer,
  data: dataReducer,
  editors: editorReducer,
  history: historyReducer,
  loadStatus: loadStatusReducer,
  messages: messagesReducer,
  user: userReducer,
  isClient: (state = false) => state,
  config: configReducer,
  title: pageTitleReducer
});
