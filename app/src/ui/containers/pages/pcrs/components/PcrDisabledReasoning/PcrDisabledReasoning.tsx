import { PCRItemDisabledReason } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { Bold } from "@ui/components/atomicDesign/atoms/Bold/bold";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";
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

  const list = useMemo<ReactNode[]>(() => {
    const returnList: ReactNode[] = [];

    const disableReasonMessages = {
      [PCRItemDisabledReason.None]: null,
      [PCRItemDisabledReason.AnotherPcrAlreadyHasThisType]: getContent(
        x => x.pages.pcrModifyOptions.anotherPcrAlreadyHasThisTypeMessage,
      ),
      [PCRItemDisabledReason.ThisPcrAlreadyHasThisType]: getContent(
        x => x.pages.pcrModifyOptions.thisPcrAlreadyHasThisTypeMessage,
      ),
      [PCRItemDisabledReason.NotEnoughPartnersToActionThisType]: null,
    };
    const disableReasonTitles = {
      [PCRItemDisabledReason.None]: null,
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
  }, [items, getContent, getPcrItemContent]);

  if (list.length === 0) return null;

  return <Info summary={getContent(x => x.pages.pcrModifyOptions.learnMoreMissingTitle)}>{list}</Info>;
};

export { PcrDisabledReasoning };
