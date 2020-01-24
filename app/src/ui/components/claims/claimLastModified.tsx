import React from "react";
import { PartnerDto } from "@framework/types";
import { SimpleString } from "../renderers/simpleString";
import { FullDateTime } from "../renderers/date";

interface Props {
  partner: PartnerDto | null;
}

export const ClaimLastModified: React.FunctionComponent<Props> = (props) => !props.partner ? null : (
  <SimpleString qa="last-updated">Changes last saved:&nbsp;
    <FullDateTime value={props.partner.forecastLastModifiedDate} />
  </SimpleString>
);
