import React from "react";
import { ILinkInfo } from "@framework/types";
import { Result } from "@ui/validation";
import classNames from "classnames";
import { ValidationError } from "./validationError";
import { Link } from "./links";

interface ITask {
  name: string;
  route: ILinkInfo;
  status: "To do" | "Complete" | "Incomplete";
  validation?: Result[];
}

export interface ITaskListItem {
  step: number;
  title: string;
  validation?: Result[];
  qa?: string;
}

export const Task: React.FunctionComponent<ITask> = ({ route, name, status, validation }) => {
  const actionClasses = classNames({
    "app-task-list__task-action" : true,
    "app-task-list__task-action--completed": status === "Complete",
  });
  return (
    <li className="app-task-list__item">
      {validation && validation.map((v) => <ValidationError error={v} key={v.key}/>)}
      <span className="app-task-list__task-name"><Link route={route}>{name}</Link></span>
      <span className={actionClasses}>{status}</span>
    </li>
  );
};

export const TaskListSection: React.FunctionComponent<ITaskListItem> = ({ step, title, validation, children, qa}) => {
  return (
    <li key={step} data-qa={qa}>
      <h2 className="app-task-list__section"><span className="app-task-list__section-number">{step}.</span>&nbsp;{title}</h2>
      <ul className="app-task-list__items">
        {validation && validation.map((v) => <ValidationError error={v} key={v.key}/>)}
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
