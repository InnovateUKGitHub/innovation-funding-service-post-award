import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { LogItem, Logs } from "@ui/components/atomicDesign/molecules/Logs/logs";
import { useContent } from "@ui/hooks/content.hook";
import { useMemo } from "react";
import { mapToPCRStatus } from "@framework/mappers/pcr";
import { pcrStatusMetaValues } from "@framework/constants/pcrConstants";

const useMapPcrStatusMessages = (statusChanges: LogItem[]) => {
  const { getContent } = useContent();

  return useMemo(() => {
    return statusChanges.map(x => {
      const statusEnum = mapToPCRStatus(x.newStatusLabel);
      const statusData = pcrStatusMetaValues.find(x => x.status === statusEnum);

      if (statusData) {
        return { ...x, newStatusLabel: getContent(statusData.i18nName) };
      } else {
        return x;
      }
    });
  }, [statusChanges, getContent]);
};

const ProjectChangeRequestOverviewLog = ({ statusChanges }: { statusChanges: LogItem[] }) => {
  const { getContent } = useContent();

  const newStatusChanges = useMapPcrStatusMessages(statusChanges);

  return (
    <Section>
      <Accordion>
        <AccordionItem title={getContent(x => x.pcrLabels.statusAndCommentsLog)} qa="status-and-comments-log">
          <Logs data={newStatusChanges} qa="projectChangeRequestStatusChangeTable" />
        </AccordionItem>
      </Accordion>
    </Section>
  );
};

export { ProjectChangeRequestOverviewLog };
