import { PCRItemDisabledReason } from "@framework/constants";
import { PCRItemTypeDto } from "@framework/dtos";
import { Info, UL } from "@ui/components";
import { Bold, SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { ReactNode, useMemo } from "react";
import { usePcrItemName } from "../../utils/getPcrItemName";

/**
 * Display the information unto why a specific PCR type is unavailable for
 * selection by the user.
 *
 * @returns A React component with reasons why a specific PCR type is unavailable
 */
const PcrDisabledReasoning = ({ items }: { items: PCRItemTypeDto[] }) => {
  const { getContent } = useContent();
  const { getPcrItemContent } = usePcrItemName();

  const disableReasonMessages = {
    [PCRItemDisabledReason.None]: "",
    [PCRItemDisabledReason.AnotherPcrAlreadyHasThisType]: getContent(
      x => x.pages.pcrModifyOptions.anotherPcrAlreadyHasThisTypeMessage,
    ),
    [PCRItemDisabledReason.ThisPcrAlreadyHasThisType]: getContent(
      x => x.pages.pcrModifyOptions.thisPcrAlreadyHasThisTypeMessage,
    ),
    [PCRItemDisabledReason.NotEnoughPartnersToActionThisType]: getContent(
      x => x.pages.pcrModifyOptions.notEnoughPartnersToActionThisTypeMessage,
    ),
  };
  const disableReasonTitles = {
    [PCRItemDisabledReason.None]: "",
    [PCRItemDisabledReason.AnotherPcrAlreadyHasThisType]: getContent(
      x => x.pages.pcrModifyOptions.anotherPcrAlreadyHasThisTypeTitle,
    ),
    [PCRItemDisabledReason.ThisPcrAlreadyHasThisType]: getContent(
      x => x.pages.pcrModifyOptions.thisPcrAlreadyHasThisTypeTitle,
    ),
    [PCRItemDisabledReason.NotEnoughPartnersToActionThisType]: getContent(
      x => x.pages.pcrModifyOptions.notEnoughPartnersToActionThisTypeTitle,
    ),
  };

  const list = useMemo<ReactNode[]>(() => {
    const returnList: ReactNode[] = [];

    const foundDisableReasons = new Set<PCRItemDisabledReason>();

    for (const item of items) {
      foundDisableReasons.add(item.disabledReason);
    }

    for (const disableReason of [...foundDisableReasons].sort((a, b) => a - b)) {
      const itemsDisabledForThisReason = items.filter(x => x.disabledReason === disableReason);

      returnList.push(
        <div key={disableReason}>
          <SimpleString className="govuk-!-margin-bottom-1 govuk-!-padding-top-3">
            <Bold>{disableReasonTitles[disableReason]}</Bold>
            <br />
            {disableReasonMessages[disableReason]}
          </SimpleString>

          <UL>
            {itemsDisabledForThisReason
              .map(x => getPcrItemContent(x.displayName).name)
              .sort()
              .map((name, i) => (
                <li key={i}>{name}</li>
              ))}
          </UL>
        </div>,
      );
    }

    return returnList;
  }, [items]);

  return <Info summary={getContent(x => x.pages.pcrModifyOptions.learnMoreMissingTitle)}>{list}</Info>;
};

export { PcrDisabledReasoning };
