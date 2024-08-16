import React from "react";
import cx from "classnames";
import type { ContentSelector } from "@copy/type";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { useContent } from "@ui/hooks/content.hook";
import { Result } from "@ui/validation/result";
import { UL } from "@ui/components/atoms/List/list";
import { Link } from "@ui/components/atoms/Links/links";
import { ValidationError } from "@ui/components/molecules/validation/ValidationError/validationError";
import { ValidationError as RhfValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { TagTypeOptions, Tag } from "@ui/components/atoms/Tag/Tag";
import { H2 } from "../../atoms/Heading/Heading.variants";

export type TaskStatus = "To do" | "Complete" | "Incomplete";

const statusConfig: Record<TaskStatus, TagTypeOptions | undefined> = {
  "To do": "grey",
  Incomplete: "blue",
  Complete: undefined,
};

interface ITask {
  name: string | ContentSelector;
  route: ILinkInfo | null;
  status?: TaskStatus;
  rhfError?: RhfError;
  id?: string;
  disabled?: boolean;
}

export const Task = ({ route, name, status, rhfError, id, disabled }: ITask) => {
  const { getContent } = useContent();
  const hasError = !!rhfError;

  const link = typeof name === "string" ? name : getContent(name);
  const taskName = route ? (
    <Link route={route} disabled={disabled}>
      {link}
    </Link>
  ) : (
    link
  );

  return (
    <li className={cx("app-task-list__item", { "app-task-list__item--error": hasError })}>
      <RhfValidationError error={rhfError} />

      <span id={id} className="app-task-list__task-name">
        {taskName}
      </span>

      {status && (
        <span className="app-task-list__task-action">
          <Tag type={statusConfig[status]}>{status}</Tag>
        </span>
      )}
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
      <H2 className="app-task-list__section">
        {step && <span className="app-task-list__section-number">{step}.</span>} {titleValue}
      </H2>

      <UL className="app-task-list__items">
        {validationErrors}
        {children}
      </UL>
    </li>
  );
};
