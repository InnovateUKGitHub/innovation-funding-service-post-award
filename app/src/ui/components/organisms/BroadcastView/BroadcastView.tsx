import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { Link } from "@ui/components/atoms/Links/links";
import { Bold } from "@ui/components/atoms/Bold/bold";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { BroadcastPageRoute } from "@ui/containers/pages/broadcasts/broadcast.page";
import { useContent } from "@ui/hooks/content.hook";

type BroadcastViewProps = Pick<BroadcastDto, "id" | "title" | "content">;

/**
 * ### BroadcastView
 *
 * React component displays individual broadcast
 */
export function BroadcastView({ id, title, content }: BroadcastViewProps) {
  const { getContent } = useContent();
  const route = BroadcastPageRoute.getLink({ broadcastId: id });

  const snippetMaxCharacters = 80;
  const messageSnippet = content[0].slice(0, snippetMaxCharacters);
  const hasOverflowContent = messageSnippet.length >= snippetMaxCharacters;
  const sampleMessage = hasOverflowContent ? `${messageSnippet}...` : messageSnippet;

  return (
    <div className="broadcast-highlight govuk-!-margin-bottom-2">
      <SimpleString className="govuk-!-margin-bottom-0">
        <Bold>{title} - </Bold> {sampleMessage}
        <Link route={route} className="broadcast-highlight__link">
          {getContent(x => x.components.broadcastContent.readBroadcastLinkText)}
        </Link>
      </SimpleString>
    </div>
  );
}
