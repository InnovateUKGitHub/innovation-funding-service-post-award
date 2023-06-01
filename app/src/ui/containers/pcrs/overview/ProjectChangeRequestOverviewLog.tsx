import { Accordion, AccordionItem, Logs, LogItem, Section } from "@ui/components";
import { useContent } from "@ui/hooks";

const ProjectChangeRequestOverviewLog = ({ statusChanges }: { statusChanges: LogItem[] }) => {
  const { getContent } = useContent();

  return (
    <Section>
      <Accordion>
        <AccordionItem title={getContent(x => x.pcrLabels.statusAndCommentsLog)} qa="status-and-comments-log">
          <Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" />
        </AccordionItem>
      </Accordion>
    </Section>
  );
};

export { ProjectChangeRequestOverviewLog };
