import cx from "classnames";

const tagConfig: Record<"red" | "blue" | "green" | "yellow", string> = {
  red: "govuk-tag--red",
  blue: "govuk-tag--blue",
  green: "govuk-tag--green",
  yellow: "govuk-tag--yellow",
};

export type TagTypeOptions = keyof typeof tagConfig;

interface TagProps {
  type: TagTypeOptions;
  children: string;
}

export function Tag({ type, ...props }: TagProps) {
  const tagStyles = tagConfig[type];

  return <strong className={cx("govuk-tag", tagStyles)} {...props} />;
}
