import React from "react";
import { ILinkInfo } from "@framework/types";
import { Result } from "@ui/validation";
import * as ACC from "@ui/components/index";

interface ITask {
  name: string;
  route: ILinkInfo;
  status: string;
}

export interface ITaskListItem {
  step: number;
  title: string;
  validation?: Result[];
  qa?: string
}

export const Task: React.FunctionComponent<ITask> = ({ route, name, status }) => {
  return (
    <li className="app-task-list__item">
      <span className="app-task-list__task-name"><ACC.Link route={route}>{name}</ACC.Link></span>
      <span className="app-task-list__task-completed">{status}</span>
    </li>
  );
};

export const TaskListSection: React.FunctionComponent<ITaskListItem> = ({ step, title, validation, children, qa}) => {
  return (
    <li key={step} data-qa={qa}>
      <h2 className="app-task-list__section"><span className="app-task-list__section-number">{step}.</span>&nbsp;{title}</h2>
      {validation && validation.map((v) => <ACC.ValidationError error={v} key={v.key}/>)}
      <ul className="app-task-list__items">
        {children}
      </ul>
    </li>
  );
};

export const TaskList: React.FunctionComponent<{qa?: string;}> = ({ qa, children }) => {
  return (
    <ol className="app-task-list" data-qa={qa}>
      {children}
    </ol>
  );
};
