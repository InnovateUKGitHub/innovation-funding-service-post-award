import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { LogItem, Logs } from "@ui/components/atomicDesign/molecules/Logs/logs";
import { useContent } from "@ui/hooks/content.hook";

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
