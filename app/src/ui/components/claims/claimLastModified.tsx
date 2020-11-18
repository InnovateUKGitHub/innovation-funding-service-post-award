import React from "react";
import { FullDateTime, SimpleString } from "../renderers";
import { useContent } from "@ui/redux";

export interface ClaimLastModifiedProps {
  modifiedDate: Date;
}

export function ClaimLastModified({ modifiedDate }: ClaimLastModifiedProps) {
  const { getContent } = useContent();
  const messagePrefix = getContent((x) => x.components.claimLastModified.message);

  return (
    <SimpleString qa="last-updated">
      {messagePrefix}: <FullDateTime value={modifiedDate} />
    </SimpleString>
  );
}
