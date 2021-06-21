import { useContent } from "@ui/hooks";
import { ContentSelector } from "@content/content";

interface Link {
  url: string;
  text: string | ContentSelector;
  qa?: string;
}
// Note: The filtered list just wants a string
type InternalLink = Link & { text: string };

export interface LinksListProps {
  links: Link[];
  openNewWindow?: boolean;
  renderAfterLink?: (x: number) => React.ReactNode;
}

export function LinksList({ links = [], openNewWindow = false, renderAfterLink }: LinksListProps) {
  const { getContent } = useContent();

  if (!links?.length) return null;

  const filteredList = links.reduce<InternalLink[]>(
    (allLinks, link) => [
      ...allLinks,
      {
        text: getContent(link.text),
        url: link.url!,
        qa: link.qa,
      },
    ],
    [],
  );

  return (
    <>
      {filteredList.map((link, i) => (
        <div className="govuk-!-padding-bottom-4" key={link.text}>
          {/* eslint-disable-next-line react/jsx-no-target-blank */}
          <a
            target={openNewWindow ? "_blank" : ""}
            rel={openNewWindow ? "noreferrer" : ""}
            className="govuk-link govuk-!-font-size-19"
            href={link.url}
            data-qa={link.qa}
          >
            {getContent(link.text)}
          </a>

          {renderAfterLink?.(i)}
        </div>
      ))}
    </>
  );
}
