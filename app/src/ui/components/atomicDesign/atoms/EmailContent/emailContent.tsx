import type { ContentSelector } from "@copy/type";
import { useContent } from "@ui/hooks/content.hook";
import { EmailProps, Email } from "../Email/Email";

export interface EmailContentProps extends Omit<EmailProps, "value" | "children"> {
  value: ContentSelector;
  qa?: string;
}

/**
 * Wrapper component for the `<Email />` component
 * that allows passing in content using the content
 * function as a value.
 *
 * @example
 * <EmailContent value={x => x.myPage.emailAddress} />
 */
export function EmailContent({ value, ...props }: EmailContentProps) {
  const { getContent } = useContent();
  const email = getContent(value);

  return <Email {...props}>{email || ""}</Email>;
}
