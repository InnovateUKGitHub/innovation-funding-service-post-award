import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";

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
