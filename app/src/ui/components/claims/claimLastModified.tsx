import React from "react";
import * as ACC from "..";
import {PartnerDto} from "../../../types";

interface Props {
  partner: PartnerDto | null;
}

export const ClaimLastModified: React.SFC<Props> = (props) => !props.partner ? null : (
  <ACC.Renderers.SimpleString qa="claim-last-modified">Changes last saved:&nbsp;
    <ACC.Renderers.FullDateTime value={props.partner.forecastLastModifiedDate} />
  </ACC.Renderers.SimpleString>
);
