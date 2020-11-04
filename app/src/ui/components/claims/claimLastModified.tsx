import React from "react";
import { PartnerDto } from "@framework/types";
import { SimpleString } from "../renderers/simpleString";
import { FullDateTime } from "../renderers/date";
import { useContent } from "@ui/redux/contentProvider";

interface Props {
  partner: PartnerDto | null;
}

export const ClaimLastModified: React.FunctionComponent<Props> = (props) => {
  if (!props.partner) return null;

  const { getContent } = useContent();
  const messagePrefix = getContent((x) => x.components.claimLastModified.message);

  return (
  <SimpleString qa="last-updated">
    {messagePrefix}
    <FullDateTime value={props.partner.forecastLastModifiedDate} />
  </SimpleString>
  );
};
