import { TypedDetails, Section, Renderers } from "@ui/components";

import { BroadcastDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";

export const BroadcastDetail = (props: BroadcastDto) => {
  const { getContent } = useContent();
  const Broadcast = TypedDetails<NonNullable<typeof props>>();

  return (
    <>
      <Section
        className="broadcast-detail"
        title={getContent(x => x.components.broadcastContent.broadcastDetailsHeading)}
      >
        <Broadcast.Details
          data={props}
          displayDensity="Compact"
          labelWidth="Narrow"
          labelClassName="broadcast-detail_value"
        >
          <Broadcast.Date
            label={getContent(x => x.components.broadcastContent.broadcastLabelStartDate)}
            qa="broadcast-start-date"
            value={x => x.startDate}
          />

          <Broadcast.Date
            label={getContent(x => x.components.broadcastContent.broadcastLabelEndDate)}
            qa="broadcast-end-date"
            value={x => x.endDate}
          />
        </Broadcast.Details>
      </Section>

      <Section title={getContent(x => x.components.broadcastContent.broadcastMessageHeading)}>
        {props.content.map((paragraph, i) => (
          <Renderers.SimpleString key={i}>{paragraph}</Renderers.SimpleString>
        ))}
      </Section>
    </>
  );
};
