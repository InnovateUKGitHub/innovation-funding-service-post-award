import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { usePcrItemName } from "../utils/getPcrItemName";

const ProjectChangeRequestOverviewSummary = ({
  pcr,
  projectId,
  hideAddTypesLink,
}: {
  pcr: Pick<PCRDto, "id" | "requestNumber"> & { items: Pick<PCRItemDto, "shortName">[] };
  projectId: ProjectId;
  hideAddTypesLink?: boolean;
}) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  const { getPcrItemContent } = usePcrItemName();

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
          content={<LineBreakList items={pcr.items.map(x => getPcrItemContent(x.shortName).name)} />}
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
