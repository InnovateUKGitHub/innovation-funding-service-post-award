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

export function PcrTypesGuidance({ qa, types }: PcrTypesGuidanceProps) {
  const { getContent } = useContent();

  const content = {
    reallocateCostsMessage: getContent(x => x.pages.pcrCreate.reallocateCostsMessage),
    reallocateCostsTitle: getContent(x => x.pages.pcrCreate.reallocateCostsTitle),
    removePartnerTitle: getContent(x => x.pages.pcrCreate.removePartnerTitle),
    removePartnerMessage: getContent(x => x.pages.pcrCreate.removePartnerMessage),
    addPartnerTitle: getContent(x => x.pages.pcrCreate.addPartnerTitle),
    addPartnerMessage: getContent(x => x.pages.pcrCreate.addPartnerMessage),
    changeScopeTitle: getContent(x => x.pages.pcrCreate.changeScopeTitle),
    changeScopeMessage: getContent(x => x.pages.pcrCreate.changeScopeMessage),
    changeDurationTitle: getContent(x => x.pages.pcrCreate.changeDurationTitle),
    changeDurationMessage: getContent(x => x.pages.pcrCreate.changeDurationMessage),
    changePartnersNameTitle: getContent(x => x.pages.pcrCreate.changePartnersNameTitle),
    changePartnersNameMessage: getContent(x => x.pages.pcrCreate.changePartnersNameMessage),
    putProjectOnHoldTitle: getContent(x => x.pages.pcrCreate.putProjectOnHoldTitle),
    putProjectOnHoldMessage: getContent(x => x.pages.pcrCreate.putProjectOnHoldMessage),
    endProjectEarlyTitle: getContent(x => x.pages.pcrCreate.endProjectEarlyTitle),
    endProjectEarlyMessage: getContent(x => x.pages.pcrCreate.endProjectEarlyMessage),
    loanDrawdownChangeTitle: getContent(x => x.pages.pcrCreate.loanDrawdownChangeTitle),
    loanDrawdownChangeMessage: getContent(x => x.pages.pcrCreate.loanDrawdownChangeMessage),
    loanDrawdownExtensionTitle: getContent(x => x.pages.pcrCreate.loanDrawdownExtensionTitle),
    loanDrawdownExtensionMessage: getContent(x => x.pages.pcrCreate.loanDrawdownExtensionMessage),
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

  const title = getContent(x => x.pages.pcrCreate.learnMoreTitle);
  const hint = getContent(x => x.pages.pcrCreate.selectTypesHint);

  return (
    <div data-qa={qa}>
      <ACC.Renderers.SimpleString className="govuk-hint">{hint}</ACC.Renderers.SimpleString>

      <ACC.Inputs.FormGuidanceExpander qa={`${qa}-guidance`} title={title} items={pcrTypesContent} />
    </div>
  );
}
