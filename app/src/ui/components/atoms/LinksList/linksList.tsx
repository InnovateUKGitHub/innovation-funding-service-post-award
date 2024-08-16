interface LinksListData {
  url: string;
  text: string;
  qa?: string;
}

export interface LinksListProps {
  links: LinksListData[];
  openNewWindow?: boolean;
}

export const LinksList = ({ links, openNewWindow = false }: LinksListProps) => {
  if (!links?.length) return null;

  return (
    <ul className="acc-links-list">
      {links.map((link, i) => (
        <li className="acc-links-list-item" key={`${link.text}-${i}`}>
          <a
            target={openNewWindow ? "_blank" : undefined}
            rel={openNewWindow ? "noreferrer" : undefined}
            className="govuk-link govuk-!-font-size-19"
            href={link.url}
            data-qa={link.qa}
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
};
