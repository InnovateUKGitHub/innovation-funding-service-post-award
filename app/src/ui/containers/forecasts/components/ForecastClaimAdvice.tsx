import React from "react";

import { useContent } from "@ui/hooks";
import { ILinkInfo } from "@framework/types";
import { SimpleString } from "@ui/components/renderers";
import { Link } from "@ui/components";

export interface ForecastClaimAdviceProps {
  claimLink: ILinkInfo;
}

export function ForecastClaimAdvice({ claimLink }: ForecastClaimAdviceProps) {
  const { getContent } = useContent();

  const part1 = getContent(x => x.forecastsComponents.adviseMessage.part1);
  const part2Link = getContent(x => x.forecastsComponents.adviseMessage.part2Link);
  const part3 = getContent(x => x.forecastsComponents.adviseMessage.part3);

  return (
    <SimpleString>
      {part1}
      <Link route={claimLink}>{part2Link}</Link>
      {part3}
    </SimpleString>
  );
}
