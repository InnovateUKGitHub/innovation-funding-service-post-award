import { ProjectRole } from "@framework/constants/project";
import { H1 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";

interface ContactSetupAssociateParams {
  projectId: ProjectId;
  contactId: ContactId;
}

const ContactSetupAssociatePage = (props: BaseProps & ContactSetupAssociateParams) => {
  console.log(props);
  return (
    <Page pageTitle={<Title title={"stubTitle"} projectNumber={"stubNumber"} />}>
      <H1>Stub</H1>
    </Page>
  );
};

const ContactSetupAssociateRoute = defineRoute({
  routeName: "ContactSetupAssociate",
  routePath: "/projects/:projectId/contact/:contactId/associate/setup",
  container: ContactSetupAssociatePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    contactId: route.params.contactId as ContactId,
  }),
  getTitle: () => ({ displayTitle: "stubtitle", htmlTitle: "stubtitle" }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export { ContactSetupAssociateParams, ContactSetupAssociatePage, ContactSetupAssociateRoute };
