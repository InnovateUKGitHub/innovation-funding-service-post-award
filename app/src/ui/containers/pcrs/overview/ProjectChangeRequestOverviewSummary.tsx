import { PCRDto, PCRItemDto } from "@framework/dtos";
import { Link, Section, SummaryList, SummaryListItem } from "@ui/components";
import { LineBreakList } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { useRoutes } from "@ui/redux";
import { useGetPcrTypeName } from "../utils/useGetPcrTypeName";

const ProjectChangeRequestOverviewSummary = ({
  pcr,
  projectId,
  hideAddTypesLink,
  isGqlData, // deprecate this once gql migration completed here
}: {
  pcr: Pick<PCRDto, "id" | "requestNumber"> & { items: Pick<PCRItemDto, "shortName">[] };
  projectId: ProjectId;
  hideAddTypesLink?: boolean;
  isGqlData?: boolean; // deprecate this once gql migration completed here
}) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  const getPcRTypeName = useGetPcrTypeName();

  const typeNameMapper = isGqlData ? getPcRTypeName : (x: string) => x;

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
          content={<LineBreakList items={pcr.items.map(x => typeNameMapper(x.shortName))} />}
          action={
            !hideAddTypesLink && (
              <Link
                route={routes.projectChangeRequestAddType.getLink({
                  projectId,
                  projectChangeRequestId: pcr.id,
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
