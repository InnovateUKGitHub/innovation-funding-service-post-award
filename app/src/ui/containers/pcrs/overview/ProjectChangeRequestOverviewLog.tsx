import { ProjectChangeRequestStatusChangeDto } from "@framework/dtos";
import { Accordion, AccordionItem, Logs, Section } from "@ui/components";
import { useContent } from "@ui/hooks";

const ProjectChangeRequestOverviewLog = ({
  statusChanges,
}: {
  statusChanges: ProjectChangeRequestStatusChangeDto[];
}) => {
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
