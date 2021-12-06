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
    reallocateCostsMessage: getContent(x => x.pcrCreate.reallocateCostsMessage),
    reallocateCostsTitle: getContent(x => x.pcrCreate.reallocateCostsTitle),
    removePartnerTitle: getContent(x => x.pcrCreate.removePartnerTitle),
    removePartnerMessage: getContent(x => x.pcrCreate.removePartnerMessage),
    addPartnerTitle: getContent(x => x.pcrCreate.addPartnerTitle),
    addPartnerMessage: getContent(x => x.pcrCreate.addPartnerMessage),
    changeScopeTitle: getContent(x => x.pcrCreate.changeScopeTitle),
    changeScopeMessage: getContent(x => x.pcrCreate.changeScopeMessage),
    changeDurationTitle: getContent(x => x.pcrCreate.changeDurationTitle),
    changeDurationMessage: getContent(x => x.pcrCreate.changeDurationMessage),
    changePartnersNameTitle: getContent(x => x.pcrCreate.changePartnersNameTitle),
    changePartnersNameMessage: getContent(x => x.pcrCreate.changePartnersNameMessage),
    putProjectOnHoldTitle: getContent(x => x.pcrCreate.putProjectOnHoldTitle),
    putProjectOnHoldMessage: getContent(x => x.pcrCreate.putProjectOnHoldMessage),
    endProjectEarlyTitle: getContent(x => x.pcrCreate.endProjectEarlyTitle),
    endProjectEarlyMessage: getContent(x => x.pcrCreate.endProjectEarlyMessage),
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
      type: PCRItemType.ProjectTermination,
      header: content.endProjectEarlyTitle,
      description: content.endProjectEarlyMessage,
    },
  ];

  const pcrTypesContent = types.reduce<PcrTypeContent[]>((previous: PcrTypeContent[], { type }) => {
    const pcrTypeContent = guidanceContent.find(x => x.type === type);

    return pcrTypeContent ? [...previous, pcrTypeContent] : previous;
  }, []);

  const title = getContent(x => x.pcrCreate.learnMoreAboutTitle);
  const hint = getContent(x => x.pcrCreate.selectTypesHint);

  return (
    <div data-qa={qa}>
      <ACC.Renderers.SimpleString className="govuk-hint">{hint}</ACC.Renderers.SimpleString>

      <ACC.Inputs.FormGuidanceExpander qa={`${qa}-guidance`} title={title} items={pcrTypesContent} />
    </div>
  );
}
