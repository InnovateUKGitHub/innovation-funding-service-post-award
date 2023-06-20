import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/content";
import { Link } from "@ui/components/links";
import { SimpleString } from "@ui/components/renderers/simpleString";

export interface ForecastClaimAdviceProps {
  claimLink: ILinkInfo;
}

export const ForecastClaimAdvice = ({ claimLink }: ForecastClaimAdviceProps) => {
  return (
    <SimpleString qa="forecastClaimAdvice">
      <Content
        value={x => x.pages.forecastsComponents.adviceMessage}
        components={[
          <Link key="claimLink" route={claimLink}>
            {" "}
          </Link>,
        ]}
      />
    </SimpleString>
  );
};
