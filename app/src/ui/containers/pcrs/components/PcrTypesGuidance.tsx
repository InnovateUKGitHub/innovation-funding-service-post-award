import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";

export interface PcrTypesGuidanceProps {
  qa: string;
}

export function PcrTypesGuidance({ qa }: PcrTypesGuidanceProps) {
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

  const guidanceContent = [
    { header: content.reallocateCostsTitle, description: content.reallocateCostsMessage },
    { header: content.removePartnerTitle, description: content.removePartnerMessage },
    { header: content.addPartnerTitle, description: content.addPartnerMessage },
    { header: content.changeScopeTitle, description: content.changeScopeMessage },
    { header: content.changeDurationTitle, description: content.changeDurationMessage },
    { header: content.changePartnersNameTitle, description: content.changePartnersNameMessage },
    { header: content.putProjectOnHoldTitle, description: content.putProjectOnHoldMessage },
    { header: content.endProjectEarlyTitle, description: content.endProjectEarlyMessage },
  ];

  const title = getContent(x => x.pcrCreate.learnMoreAboutTitle);
  const hint = getContent(x => x.pcrCreate.selectTypesHint);

  return (
    <div data-qa={qa}>
      <ACC.Renderers.SimpleString className="govuk-hint">{hint}</ACC.Renderers.SimpleString>

      <ACC.Inputs.FormGuidanceExpander qa={`${qa}-guidance`} title={title} items={guidanceContent} />
    </div>
  );
}
