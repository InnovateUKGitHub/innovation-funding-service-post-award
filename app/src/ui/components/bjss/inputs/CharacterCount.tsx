import React from "react";
import cx from "classnames";
import { SimpleString } from "../../atomicDesign/atoms/SimpleString/simpleString";
import { useMounted } from "@ui/context/Mounted";

export type CharacterTypes =
  | {
      type: "ascending";
      minValue?: number;
      maxValue?: never;
      warnValue?: number;
    }
  | {
      type: "descending";
      maxValue: number; // See comment below for non-null operator usage
      minValue?: never;
      warnValue?: number;
    };

export type CharacterCountOptions = CharacterTypes & {
  count: number;
};

/**
 * utility function to check the character count
 */
const useCharacterCount = ({ type, count, minValue, maxValue, warnValue = 0 }: CharacterCountOptions) => {
  const { isServer } = useMounted();
  if (isServer) return null;

  let hasErrorHint = false;
  let message: string | null = null;

  if (type === "ascending") {
    const requiredCount = (minValue ??= 0) - count;
    const hasNegativeHint = requiredCount > 0;
    const toneOfVoice = hasNegativeHint ? "required" : "";
    const characterPlural = count === 1 ? "character" : "characters";
    const renderedCount = hasNegativeHint ? requiredCount : count;
    const absoluteCount = Math.abs(renderedCount);

    hasErrorHint = hasNegativeHint;
    message = `You have ${absoluteCount} ${characterPlural} ${toneOfVoice}`.trim();
  }

  if (type === "descending") {
    // TSC Bug - Min value should be coerced as 'number' not 'number | undefined' due to union above
    const remainingCount = (maxValue as number) - count;
    const hasNegativeHint = remainingCount < 0;
    const toneOfVoice = hasNegativeHint ? "too many" : "remaining";
    const absoluteCount = Math.abs(remainingCount);
    const characterPlural = absoluteCount === 1 ? "character" : "characters";

    hasErrorHint = hasNegativeHint;
    message = `You have ${absoluteCount} ${characterPlural} ${toneOfVoice}`.trim();
  }

  const className = cx("character-count", hasErrorHint ? "character-count--error" : "character-count--default");

  if (count < warnValue) {
    return {
      message: null,
      className,
    };
  }

  return {
    message,
    className,
  };
};

export type CharacterCountProps = CharacterCountOptions & {
  children: React.ReactElement;
};

export const CharacterCount = ({ children, ...characterConfig }: CharacterCountProps) => {
  const count = useCharacterCount(characterConfig);

  if (!count) return children;

  return (
    <div className="govuk-!-margin-bottom-3">
      {children}
      {count.message && (
        <SimpleString className={cx("margin-top-neg-sixteen", count.className)} aria-live="polite">
          {count.message}
        </SimpleString>
      )}
    </div>
  );
};
