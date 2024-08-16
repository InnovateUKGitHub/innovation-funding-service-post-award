import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { H2 } from "@ui/components/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { BroadcastView } from "../BroadcastView/BroadcastView";

/**
 * ### BroadcastsViewer
 *
 * React component displays broadcasts
 */
export function BroadcastsViewer({ broadcasts }: { broadcasts: Pick<BroadcastDto, "id" | "title" | "content">[] }) {
  const { getContent } = useContent();

  return (
    <>
      <H2>{getContent(x => x.components.broadcastContent.broadcastsTitle)}</H2>

      <div className="broadcasts govuk-!-margin-bottom-8">
        {broadcasts &&
          (broadcasts.length ? (
            broadcasts.map(broadcast => <BroadcastView key={broadcast.id} {...broadcast} />)
          ) : (
            <SimpleString>{getContent(x => x.components.broadcastContent.emptyBroadcasts)}</SimpleString>
          ))}
      </div>
    </>
  );
}
