import { useContent } from "@ui/hooks";
import { FullDateTime, SimpleString } from "../renderers";

export interface ClaimLastModifiedProps {
  modifiedDate: Date;
}

export const ClaimLastModified = ({ modifiedDate }: ClaimLastModifiedProps) => {
  const { getContent } = useContent();
  const messagePrefix = getContent(x => x.components.claimLastModified.message);
  const never = getContent(x => x.components.claimLastModified.never);

  return (
    <SimpleString qa="last-updated">
      {messagePrefix}: <FullDateTime value={modifiedDate} invalidDisplay={never} />
    </SimpleString>
  );
};
