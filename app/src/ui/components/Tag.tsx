import cx from "classnames";

const tagConfig = {
  red: "govuk-tag--red",
  blue: "govuk-tag--blue",
  green: "govuk-tag--green",
  yellow: "govuk-tag--yellow",
  grey: "govuk-tag--grey",
  turquoise: "govuk-tag--turquoise",
  purple: "govuk-tag--purple",
  pink: "govuk-tag--pink",
  orange: "govuk-tag--orange",
} as const;

export type TagTypeOptions = keyof typeof tagConfig;

interface TagProps {
  type: TagTypeOptions | undefined;
  children: string;
}

export const Tag = ({ type, ...props }: TagProps) => {
  const tagStyles = typeof type !== "undefined" ? tagConfig[type] : undefined;

  return <strong className={cx("govuk-tag", tagStyles)} {...props} />;
};
