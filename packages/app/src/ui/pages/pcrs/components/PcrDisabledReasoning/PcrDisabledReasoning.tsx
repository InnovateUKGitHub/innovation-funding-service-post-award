import { IMetaValue, PCRItemHiddenReason } from "@framework/constants/pcrConstants";
import { Info } from "@ui/components/atoms/Details/Details";
import { UL } from "@ui/components/atoms/List/list";
import { Bold } from "@ui/components/atoms/Bold/bold";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";
import { ReactNode, useMemo } from "react";

/**
 * Display the information unto why a specific PCR type is unavailable for
 * selection by the user.
 *
 * @returns A React component with reasons why a specific PCR type is unavailable
 */
const PcrDisabledReasoning = ({
  items,
}: {
  items: { item: IMetaValue; hidden: boolean; hiddenReason: PCRItemHiddenReason }[];
}) => {
  const { getContent } = useContent();

  const list = useMemo<ReactNode[]>(() => {
    const returnList: ReactNode[] = [];

    const disableReasonMessages = {
      [PCRItemHiddenReason.None]: null,
      [PCRItemHiddenReason.Exclusive]: null,
      [PCRItemHiddenReason.AnotherPcrAlreadyHasThisType]: getContent(
        x => x.pages.pcrModifyOptions.anotherPcrAlreadyHasThisTypeMessage,
      ),
      [PCRItemHiddenReason.ThisPcrAlreadyHasThisType]: getContent(
        x => x.pages.pcrModifyOptions.thisPcrAlreadyHasThisTypeMessage,
      ),
      [PCRItemHiddenReason.NotEnoughPartnersToActionThisType]: null,
    };
    const disableReasonTitles = {
      [PCRItemHiddenReason.None]: null,
      [PCRItemHiddenReason.Exclusive]: getContent(x => x.pages.pcrModifyOptions.exclusiveTitle),
      [PCRItemHiddenReason.AnotherPcrAlreadyHasThisType]: getContent(
        x => x.pages.pcrModifyOptions.anotherPcrAlreadyHasThisTypeTitle,
      ),
      [PCRItemHiddenReason.ThisPcrAlreadyHasThisType]: getContent(
        x => x.pages.pcrModifyOptions.thisPcrAlreadyHasThisTypeTitle,
      ),
      [PCRItemHiddenReason.NotEnoughPartnersToActionThisType]: getContent(
        x => x.pages.pcrModifyOptions.notEnoughPartnersToActionThisTypeTitle,
      ),
    };

    const foundHiddenReasons = new Set<PCRItemHiddenReason>();

    for (const item of items) {
      // Only collate reasons that are not "NONE"
      if (item.hiddenReason !== PCRItemHiddenReason.None) {
        foundHiddenReasons.add(item.hiddenReason);
      }
    }

    for (const hiddenReason of [...foundHiddenReasons].sort((a, b) => a - b)) {
      const itemsDisabledForThisReason = items.filter(x => x.hiddenReason === hiddenReason);

      returnList.push(
        <div key={hiddenReason}>
          <SimpleString className="govuk-!-margin-bottom-1 govuk-!-padding-top-3">
            <Bold>{disableReasonTitles[hiddenReason]}</Bold>
            <br />
            {disableReasonMessages[hiddenReason]}
          </SimpleString>

          <UL>
            {itemsDisabledForThisReason
              .map(({ item }) => getContent(item.i18nName ?? (x => x.pcrTypes.unknown)))
              .sort()
              .map((name, i) => (
                <li key={i}>{name}</li>
              ))}
          </UL>
        </div>,
      );
    }

    return returnList;
  }, [items, getContent]);

  if (list.length === 0) return null;

  return <Info summary={getContent(x => x.pages.pcrModifyOptions.learnMoreMissingTitle)}>{list}</Info>;
};

export { PcrDisabledReasoning };
