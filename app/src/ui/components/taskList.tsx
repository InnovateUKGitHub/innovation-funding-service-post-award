import React from "react";
import { ILinkInfo } from "@framework/types";
import { Result } from "@ui/validation";
import classNames from "classnames";
import { ValidationError } from "./validationError";
import { Link } from "./links";
import { Content } from "@ui/components/content";
import { ContentSelector } from "@content/content";

export type TaskStatus = "To do" | "Complete" | "Incomplete";
interface ITask {
  name?: string;
  nameContent?: ContentSelector;
  route: ILinkInfo;
  status: TaskStatus;
  validation?: Result[];
  disableLink?: boolean;
}

export interface ITaskListItem {
  step: number;
  title?: string;
  titleContent?: ContentSelector;
  validation?: Result[];
  qa?: string;
}

export const Task: React.FunctionComponent<ITask> = ({ route, name, nameContent, status, validation, disableLink }) => {
  const actionClasses = classNames({
    "app-task-list__task-action": true,
    "app-task-list__task-action--completed": status === "Complete",
  });
  const hasError = validation && validation.find(x => !x.isValid);

  const link = !!nameContent ? <Content value={nameContent}/> : name;
  return (
    <li className={classNames("app-task-list__item", { "app-task-list__item--error": hasError })}>
      {validation && validation.map((v) => <ValidationError error={v} key={v.key}/>)}
      <span className="app-task-list__task-name">
        {disableLink ? link : <Link route={route}>{link}</Link>}
      </span>
      <span className={actionClasses}>{status}</span>
    </li>
  );
};

export const TaskListSection: React.FunctionComponent<ITaskListItem> = ({ step, title, titleContent, validation, children, qa}) => {
  return (
    <li key={step} data-qa={qa}>
      <h2 className="app-task-list__section"><span className="app-task-list__section-number">{step}.</span>&nbsp;{
        !!titleContent ? <Content value={titleContent}/> : title
      }</h2>
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
