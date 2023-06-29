import React, { cloneElement, useEffect, useState } from "react";
import cx from "classnames";
import { SimpleString } from "../../atomicDesign/atoms/SimpleString/simpleString";

export type CharacterTypes =
  | {
      type: "ascending";
      minValue?: number;
      maxValue?: never;
    }
  | {
      type: "descending";
      maxValue: number; // See comment below for non-null operator usage
      minValue?: never;
    };

export type CharacterCountOptions = CharacterTypes & {
  count: number;
};

/**
 * utility function to check the character count
 */
function checkCharacterCount({ type, count, minValue, maxValue }: CharacterCountOptions) {
  let hasErrorHint = false;

  const state: {
    countMessage: string;
    countClassName: string;
  } = {
    countMessage: "",
    countClassName: "",
  };

  if (type === "ascending") {
    const requiredCount = (minValue ??= 0) - count;
    const hasNegativeHint = requiredCount > 0;
    const toneOfVoice = hasNegativeHint ? "required" : "";
    const characterPlural = count === 1 ? "character" : "characters";
    const renderedCount = hasNegativeHint ? requiredCount : count;
    const absoluteCount = Math.abs(renderedCount);

    hasErrorHint = hasNegativeHint;
    state.countMessage = `You have ${absoluteCount} ${characterPlural} ${toneOfVoice}`.trim();
  }

  if (type === "descending") {
    // TSC Bug - Min value should be coerced as 'number' not 'number | undefined' due to union above
    const remainingCount = (maxValue as number) - count;
    const hasNegativeHint = remainingCount < 0;
    const toneOfVoice = hasNegativeHint ? "too many" : "remaining";
    const absoluteCount = Math.abs(remainingCount);
    const characterPlural = absoluteCount === 1 ? "character" : "characters";

    hasErrorHint = hasNegativeHint;
    state.countMessage = `You have ${absoluteCount} ${characterPlural} ${toneOfVoice}`.trim();
  }

  const conditionClassName = hasErrorHint ? "character-count--error" : "character-count--default";
  const countClassName = cx("character-count", conditionClassName);

  return {
    ...state,
    countClassName,
  };
}

export type CharacterCountProps = CharacterCountOptions & {
  children: React.ReactElement;
};

export const CharacterCount = ({ children, ...characterConfig }: CharacterCountProps) => {
  // Note: 'useIsClient' is not correctly rendering the right UI
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Note: Disable for SSR - JS is needed to calculate the values
  if (!mounted) return children;

  const { countClassName, countMessage } = checkCharacterCount(characterConfig);

  return (
    <div className="govuk-!-margin-bottom-3">
      {children}
      <SimpleString className={cx("margin-top-neg-sixteen", countClassName)} aria-live="polite">
        {countMessage}
      </SimpleString>
    </div>
  );
};
