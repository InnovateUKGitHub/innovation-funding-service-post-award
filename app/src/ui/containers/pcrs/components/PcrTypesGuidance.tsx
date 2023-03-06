import { PCRItemType } from "@framework/constants";
import { PCRItemTypeDto } from "@framework/dtos";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";

export interface PcrTypesGuidanceProps {
  qa: string;
  types: PCRItemTypeDto[];
}

interface PcrTypeContent {
  type: PCRItemType;
  header: string;
  description: string;
}

/**
 * Gets content for PCR types guidance
 */
export function PcrTypesGuidance({ qa, types }: PcrTypesGuidanceProps) {
  const { getContent } = useContent();

  const content = {
    reallocateCostsMessage: getContent(x => x.pages.pcrModifyOptions.reallocateCostsMessage),
    reallocateCostsTitle: getContent(x => x.pages.pcrModifyOptions.reallocateCostsTitle),
    removePartnerTitle: getContent(x => x.pages.pcrModifyOptions.removePartnerTitle),
    removePartnerMessage: getContent(x => x.pages.pcrModifyOptions.removePartnerMessage),
    addPartnerTitle: getContent(x => x.pages.pcrModifyOptions.addPartnerTitle),
    addPartnerMessage: getContent(x => x.pages.pcrModifyOptions.addPartnerMessage),
    changeScopeTitle: getContent(x => x.pages.pcrModifyOptions.changeScopeTitle),
    changeScopeMessage: getContent(x => x.pages.pcrModifyOptions.changeScopeMessage),
    changeDurationTitle: getContent(x => x.pages.pcrModifyOptions.changeDurationTitle),
    changeDurationMessage: getContent(x => x.pages.pcrModifyOptions.changeDurationMessage),
    changePartnersNameTitle: getContent(x => x.pages.pcrModifyOptions.changePartnersNameTitle),
    changePartnersNameMessage: getContent(x => x.pages.pcrModifyOptions.changePartnersNameMessage),
    putProjectOnHoldTitle: getContent(x => x.pages.pcrModifyOptions.putProjectOnHoldTitle),
    putProjectOnHoldMessage: getContent(x => x.pages.pcrModifyOptions.putProjectOnHoldMessage),
    endProjectEarlyTitle: getContent(x => x.pages.pcrModifyOptions.endProjectEarlyTitle),
    endProjectEarlyMessage: getContent(x => x.pages.pcrModifyOptions.endProjectEarlyMessage),
    loanDrawdownChangeTitle: getContent(x => x.pages.pcrModifyOptions.loanDrawdownChangeTitle),
    loanDrawdownChangeMessage: getContent(x => x.pages.pcrModifyOptions.loanDrawdownChangeMessage),
    loanDrawdownExtensionTitle: getContent(x => x.pages.pcrModifyOptions.loanDrawdownExtensionTitle),
    loanDrawdownExtensionMessage: getContent(x => x.pages.pcrModifyOptions.loanDrawdownExtensionMessage),
  };

  const guidanceContent: PcrTypeContent[] = [
    {
      type: PCRItemType.MultiplePartnerFinancialVirement,
      header: content.reallocateCostsTitle,
      description: content.reallocateCostsMessage,
    },
    {
      type: PCRItemType.PartnerWithdrawal,
      header: content.removePartnerTitle,
      description: content.removePartnerMessage,
    },
    {
      type: PCRItemType.PartnerAddition,
      header: content.addPartnerTitle,
      description: content.addPartnerMessage,
    },
    {
      type: PCRItemType.ScopeChange,
      header: content.changeScopeTitle,
      description: content.changeScopeMessage,
    },
    {
      type: PCRItemType.TimeExtension,
      header: content.changeDurationTitle,
      description: content.changeDurationMessage,
    },
    {
      type: PCRItemType.AccountNameChange,
      header: content.changePartnersNameTitle,
      description: content.changePartnersNameMessage,
    },
    {
      type: PCRItemType.ProjectSuspension,
      header: content.putProjectOnHoldTitle,
      description: content.putProjectOnHoldMessage,
    },
    {
      type: PCRItemType.LoanDrawdownChange,
      header: content.loanDrawdownChangeTitle,
      description: content.loanDrawdownChangeMessage,
    },
    {
      type: PCRItemType.LoanDrawdownExtension,
      header: content.loanDrawdownExtensionTitle,
      description: content.loanDrawdownExtensionMessage,
    },
  ];

  const pcrTypesContent = types.reduce<PcrTypeContent[]>((previous, { type }) => {
    const pcrTypeContent = guidanceContent.find(x => x.type === type);

    return pcrTypeContent ? [...previous, pcrTypeContent] : previous;
  }, []);

  const title = getContent(x => x.pages.pcrModifyOptions.learnMoreTitle);
  const hint = getContent(x => x.pages.pcrModifyOptions.selectTypesHint);

  return (
    <div data-qa={qa}>
      <ACC.Renderers.SimpleString className="govuk-hint">{hint}</ACC.Renderers.SimpleString>

      <ACC.Inputs.FormGuidanceExpander qa={`${qa}-guidance`} title={title} items={pcrTypesContent} />
    </div>
  );
}
