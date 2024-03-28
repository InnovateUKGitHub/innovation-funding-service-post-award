import { ProjectRole } from "@framework/constants/project";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useOnDeletePcr, usePcrDeleteQuery } from "./pcrDelete.logic";
import { useForm } from "react-hook-form";
import { useContent } from "@ui/hooks/content.hook";
import { ShortDate } from "@ui/components/atomicDesign/atoms/Date";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { useGetPcrItemMetadata } from "./utils/useGetPcrItemMetadata";

export interface PCRDeleteParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const PCRDeletePage = ({ projectId, pcrId, ...props }: BaseProps & PCRDeleteParams) => {
  const { pcr, fragmentRef } = usePcrDeleteQuery(projectId, pcrId);
  const { getPcrItemContent } = useGetPcrItemMetadata();

  const { getContent } = useContent();

  const {
    onUpdate: onDelete,
    apiError,
    isFetching,
  } = useOnDeletePcr(projectId, pcrId, props.routes.pcrsDashboard.getLink({ projectId }).path);

  const { handleSubmit } = useForm({
    defaultValues: {},
  });

  return (
    <Page
      backLink={
        <BackLink route={props.routes.pcrsDashboard.getLink({ projectId })}>
          {getContent(x => x.pages.pcrDelete.backLink)}
        </BackLink>
      }
      apiError={apiError}
      fragmentRef={fragmentRef}
    >
      <Section>
        <ValidationMessage messageType="alert" message={getContent(x => x.pages.pcrDelete.alertMessage)} />
        <SummaryList qa="pcr_viewItem">
          <SummaryListItem label="Request number" content={pcr.requestNumber} qa="requestNumber" />
          <SummaryListItem
            label="Types"
            content={<LineBreakList items={pcr.items.map(x => getPcrItemContent(x.shortName).name)} />}
            qa="types"
          />
          <SummaryListItem label="Started" content={<ShortDate value={pcr.started} />} qa="started" />
          <SummaryListItem label="Last updated" content={<ShortDate value={pcr.lastUpdated} />} qa="lastUpdated" />
        </SummaryList>
      </Section>

      <Section>
        <Form data-qa="pcrDelete" onSubmit={handleSubmit(data => onDelete({ data }))}>
          <Button type="submit" name="button_delete" disabled={isFetching}>
            {getContent(x => x.pages.pcrDelete.button)}
          </Button>
        </Form>
      </Section>
    </Page>
  );
};

export const PCRDeleteRoute = defineRoute({
  routeName: "pcrDelete",
  routePath: "/projects/:projectId/pcrs/:pcrId/delete",
  container: PCRDeletePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Delete draft request",
    displayTitle: "Delete draft request",
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
