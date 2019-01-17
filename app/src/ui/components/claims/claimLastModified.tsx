import React from "react";
import * as ACC from "..";
import {PartnerDto} from "../../../types";

interface Props {
  partner: PartnerDto | null;
}

export const ClaimLastModified: React.SFC<Props> = (props) => !props.partner ? null : (
  <ACC.Renderers.SimpleString>{"Changes last saved: "}
    <ACC.Renderers.LastUpdatedDateTime value={props.partner.forecastLastModifiedDate} />
  </ACC.Renderers.SimpleString>
);
