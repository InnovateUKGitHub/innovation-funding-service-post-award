import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { useContent } from "@ui/hooks/content.hook";

export interface ForecastClaimAdviceProps {
  isFc: boolean;
}

export const ForecastClaimAdvice = ({ isFc }: ForecastClaimAdviceProps) => {
  const { getContent } = useContent();

  const adviceMessage = isFc
    ? getContent(x => x.pages.forecastsComponents.adviceMessageFc)
    : getContent(x => x.pages.forecastsComponents.adviceMessage);

  return <P data-qa="forecastClaimAdvice">{adviceMessage}</P>;
};
