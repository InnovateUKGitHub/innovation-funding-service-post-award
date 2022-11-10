import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { BroadcastPageRoute } from "@ui/containers/broadcasts/broadcast.page";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";

type BroadcastViewProps = BroadcastDto;

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
      <ACC.Renderers.SimpleString className="govuk-!-margin-bottom-0">
        <ACC.Renderers.Bold>{title} - </ACC.Renderers.Bold> {sampleMessage}
        <ACC.Link route={route} className="broadcast-highlight__link">
          {getContent(x => x.components.broadcastContent.readBroadcastLinkText)}
        </ACC.Link>
      </ACC.Renderers.SimpleString>
    </div>
  );
}
