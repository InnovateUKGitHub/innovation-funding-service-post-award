import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { TypedDetails } from "@ui/components/organisms/Details/details";
import { Section } from "@ui/components/molecules/Section/section";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";

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
          <SimpleString key={i}>{paragraph}</SimpleString>
        ))}
      </Section>
    </>
  );
};
