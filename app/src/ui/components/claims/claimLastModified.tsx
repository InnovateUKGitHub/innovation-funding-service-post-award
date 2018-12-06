import React from "react";
import * as ACC from "..";
import { ClaimDto } from "../../../types";

interface Props {
  claim: ClaimDto | null;
}

export const ClaimLastModified: React.SFC<Props> = (props) => !props.claim ? null : (
  <ACC.Renderers.SimpleString>Changes last saved:
    <ACC.Renderers.ShortDateTime value={props.claim.forecastLastModified} />
  </ACC.Renderers.SimpleString>
);
