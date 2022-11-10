import { ILinkInfo } from "@framework/types";
import { SimpleString } from "@ui/components/renderers";
import { Content, Link } from "@ui/components";

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
