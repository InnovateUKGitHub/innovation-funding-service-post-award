import { ILinkInfo } from "@framework/types";
import { Result } from "@ui/validation";
import classNames from "classnames";
import { Content, UL } from "@ui/components";
import { ContentSelector } from "@content/content";
import React from "react";
import { ValidationError } from "./validationError";
import { Link } from "./links";

export type TaskStatus = "To do" | "Complete" | "Incomplete";
interface ITask {
  name?: string;
  nameContent?: ContentSelector;
  // Pass null for disabled link
  route: ILinkInfo | null;
  status: TaskStatus;
  validation?: Result[];
}

export interface ITaskListItem {
  step?: number;
  title?: string;
  titleContent?: ContentSelector;
  validation?: Result[];
  qa?: string;
  children: React.ReactElement<ITask> | React.ReactElement<ITask>[];
}

export const Task: React.FunctionComponent<ITask> = ({ route, name, nameContent, status, validation }) => {
  const actionClasses = classNames({
    "app-task-list__task-action": true,
    "app-task-list__task-action--completed": status === "Complete",
  });
  const hasError = validation && validation.find(x => !x.isValid);

  const link = nameContent ? <Content value={nameContent} /> : name;
  return (
    <li className={classNames("app-task-list__item", { "app-task-list__item--error": hasError })}>
      {validation && validation.map(v => <ValidationError error={v} key={v.key} />)}
      <span className="app-task-list__task-name">{route ? <Link route={route}>{link}</Link> : link}</span>
      <span className={actionClasses}>{status}</span>
    </li>
  );
};

export const TaskListSection = ({
  step,
  title,
  titleContent,
  validation,
  children,
  qa,
}: ITaskListItem) => {
  const validationErrors = validation && validation.map(v => <ValidationError error={v} key={v.key} />);
  return (
    <li data-qa={qa}>
      <h2 className="app-task-list__section">
        {step && <span className="app-task-list__section-number">{step}.</span>}&nbsp;
        {titleContent ? <Content value={titleContent} /> : title}
      </h2>
      <UL className="app-task-list__items">
        {validationErrors}
        {children}
      </UL>
    </li>
  );
};
