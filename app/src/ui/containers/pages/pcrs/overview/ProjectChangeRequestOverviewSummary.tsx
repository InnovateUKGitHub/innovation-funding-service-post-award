import { PCRDto, PCRItemSummaryDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/molecules/Section/section";
import { Link } from "@ui/components/atoms/Links/links";
import { LineBreakList } from "@ui/components/atoms/LineBreakList/lineBreakList";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";

const ProjectChangeRequestOverviewSummary = ({
  pcr,
  projectId,
  hideAddTypesLink,
}: {
  pcr: Pick<PCRDto, "id" | "requestNumber"> & { items: Pick<PCRItemSummaryDto, "type">[] };
  projectId: ProjectId;
  hideAddTypesLink?: boolean;
}) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  const { getPcrItemContent } = useGetPcrItemMetadata();

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
          content={<LineBreakList items={pcr.items.map(x => getPcrItemContent(x.type).name)} />}
          action={
            !hideAddTypesLink && (
              <Link
                route={routes.projectChangeRequestAddType.getLink({
                  projectId,
                  pcrId: pcr.id,
                })}
              >
                {getContent(x => x.pcrLabels.addTypes)}
              </Link>
            )
          }
          qa="typesRow"
        />
      </SummaryList>
    </Section>
  );
};

export { ProjectChangeRequestOverviewSummary };
