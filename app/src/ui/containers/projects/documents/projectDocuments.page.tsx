import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useLazyLoadQuery } from "react-relay";
import { projectDocumentsQuery } from "./ProjectDocuments.query";
import { ProjectDocumentsQuery } from "./__generated__/ProjectDocumentsQuery.graphql";
import { getFirstEdge, getDefinedEdges } from "@gql/selectors/edges";
import { Page, Projects, Section } from "@ui/components";
import { NewDocumentsTable } from "./NewDocumentsTable";
import { MspDocumentShareUpload } from "./MspDocumentShareUpload";

export interface ProjectDocumentPageParams {
  projectId: string;
}

const ProjectDocumentsContainer = (props: ProjectDocumentPageParams & BaseProps) => {
  const data = useLazyLoadQuery<ProjectDocumentsQuery>(projectDocumentsQuery, {
    projectId: props.projectId,
  });

  const project = getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges);
  const partners = getDefinedEdges(data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.edges);

  return (
    <Page
      pageTitle={
        <Projects.Title
          projectNumber={project.node.Acc_ProjectNumber__c?.value ?? ""}
          title={project.node.Acc_ProjectTitle__c?.value ?? ""}
        />
      }
      backLink={<Projects.ProjectBackLink routes={props.routes} projectId={props.projectId} />}
    >
      <MspDocumentShareUpload projectId={props.projectId} />
      <Section title="Project">
        <NewDocumentsTable documents={project.node.ContentDocumentLinks} />
      </Section>
      <Section title="Partner">
        {partners.map(partner => (
          <Section key={partner.node.Id} title={partner.node.Acc_AccountId__r?.Name?.value ?? ""}>
            <NewDocumentsTable documents={partner.node.ContentDocumentLinks} />
          </Section>
        ))}
      </Section>
    </Page>
  );
};

export const ProjectDocumentsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocumentsContainer,
  getParams: route => ({ projectId: route.params.projectId }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectDocuments.title),
});
