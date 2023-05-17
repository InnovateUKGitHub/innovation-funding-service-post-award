import { PCRDto } from "@framework/dtos";
import { Link, Section, SummaryList, SummaryListItem } from "@ui/components";
import { LineBreakList } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { useRoutes } from "@ui/redux";

const ProjectChangeRequestOverviewSummary = ({ pcr, projectId }: { pcr: PCRDto; projectId: ProjectId }) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  return (
    <Section title={getContent(x => x.pcrLabels.details)}>
      <SummaryList qa="pcr-prepare">
        <SummaryListItem
          label={getContent(x => x.pcrLabels.requestNumber)}
          content={pcr.requestNumber}
          qa="numberRow"
        />
        <SummaryListItem
          label={getContent(x => x.pcrLabels.types)}
          content={<LineBreakList items={pcr.items.map(x => x.shortName)} />}
          action={
            <Link
              route={routes.projectChangeRequestAddType.getLink({
                projectId,
                projectChangeRequestId: pcr.id,
              })}
            >
              {getContent(x => x.pcrLabels.addTypes)}
            </Link>
          }
          qa="typesRow"
        />
      </SummaryList>
    </Section>
  );
};

export { ProjectChangeRequestOverviewSummary };
