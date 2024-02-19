import type { ContentSelector } from "@copy/type";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Tag, TagTypeOptions } from "@ui/components/atomicDesign/atoms/Tag/Tag";
import { ValidationError as RhfValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { ValidationError } from "@ui/components/atomicDesign/molecules/validation/ValidationError/validationError";
import { useContent } from "@ui/hooks/content.hook";
import { Result } from "@ui/validation/result";
import cx from "classnames";
import React from "react";
import { v4 as uuid } from "uuid";
import { H3 } from "../../atoms/Heading/Heading.variants";

export type TaskStatus = "To do" | "Complete" | "Incomplete";

const statusConfig: Record<TaskStatus, TagTypeOptions | undefined> = {
  "To do": "grey",
  Incomplete: "blue",
  Complete: undefined,
};

interface ITask {
  name: string | ContentSelector;
  route: ILinkInfo | null;
  status: TaskStatus;
  validation?: Result[];
  rhfError?: { key: string; message: string | null };
  id?: string;
}

export const Task = ({ route, name, status, validation, rhfError, id }: ITask) => {
  const { getContent } = useContent();
  const hasError = !!validation?.find(x => !x.isValid) || !!rhfError;

  const link = typeof name === "string" ? name : getContent(name);
  const taskName = route ? (
    <Link route={route} className="govuk-task-list__link">
      {link}
    </Link>
  ) : (
    link
  );

  const taskStyle = statusConfig[status];

  return (
    <li
      className={cx("govuk-task-list__item", "govuk-task-list__item--with-link", {
        "app-task-list__item--error": hasError,
      })}
    >
      <div id={id} className="govuk-task-list__name-and-hint">
        <RhfValidationError error={rhfError} />
        {validation?.map(v => (
          <ValidationError error={v} key={uuid()} />
        ))}
        {taskName}
      </div>

      <span className="govuk-task-list__status">
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
      <H3 as="h2">
        {step && <span className="app-task-list__section-number">{step}.</span>} {titleValue}
      </H3>

      <ul className="govuk-task-list">
        {validationErrors}
        {children}
      </ul>
    </li>
  );
};
