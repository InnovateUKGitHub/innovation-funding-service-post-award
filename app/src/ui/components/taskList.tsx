import React from "react";
import cx from "classnames";
import { v4 as uuid } from "uuid";
import { ILinkInfo } from "@framework/types";
import { Result } from "@ui/validation";
import { UL, Tag, TagTypeOptions } from "@ui/components";
import type { ContentSelector } from "@copy/type";
import { useContent } from "@ui/hooks";

import { ValidationError } from "./validationError";
import { Link } from "./links";

export type TaskStatus = "To do" | "Complete" | "Incomplete";

const statusConfig: Record<TaskStatus, TagTypeOptions> = {
  "To do": "blue",
  Incomplete: "yellow",
  Complete: "green",
};

interface ITask {
  name: string | ContentSelector;
  route: ILinkInfo | null;
  status: TaskStatus;
  validation?: Result[];
}

export const Task = ({ route, name, status, validation }: ITask) => {
  const { getContent } = useContent();
  const hasError = !!validation?.find(x => !x.isValid);

  const link = typeof name === "string" ? name : getContent(name);
  const taskName = route ? <Link route={route}>{link}</Link> : link;

  const taskStyle = statusConfig[status];

  return (
    <li className={cx("app-task-list__item", { "app-task-list__item--error": hasError })}>
      {validation?.map(v => (
        <ValidationError error={v} key={uuid()} />
      ))}

      <span className="app-task-list__task-name">{taskName}</span>

      <span className="app-task-list__task-action">
        <Tag type={taskStyle}>{status}</Tag>
      </span>
    </li>
  );
};

export interface ITaskListItem {
  title: string | ContentSelector;
  step?: number;
  validation?: Result[];
  qa?: string;
  children: React.ReactElement<ITask> | React.ReactElement<ITask>[];
}

export const TaskListSection = ({ step, title, validation, children, qa }: ITaskListItem) => {
  const { getContent } = useContent();

  const titleValue = typeof title === "string" ? title : getContent(title);
  const validationErrors = validation?.map(v => <ValidationError error={v} key={v.key} />);

  return (
    <li data-qa={qa}>
      <h2 className="app-task-list__section">
        {step && <span className="app-task-list__section-number">{step}.</span>} {titleValue}
      </h2>

      <UL className="app-task-list__items">
        {validationErrors}
        {children}
      </UL>
    </li>
  );
};
