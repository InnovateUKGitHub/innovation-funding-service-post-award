import { WithStyle } from "@ui/hoc/WithStyle";
import { HTMLProps } from "react";

export const Bold = WithStyle<HTMLProps<HTMLSpanElement>>("span", "govuk-!-font-weight-bold");
