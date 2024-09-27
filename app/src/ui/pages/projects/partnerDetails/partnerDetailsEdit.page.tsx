import { ProjectRole } from "@framework/constants/project";
import { BackLink } from "@ui/components/atoms/Links/links";
import { PartnerDetailsEditComponent } from "@ui/components/templates/PartnerDetailsEdit/PartnerDetailsEdit";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";

export interface PartnerDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const PartnerDetailsEditContainer = (props: PartnerDetailsParams & BaseProps) => {
  const { getContent } = useContent();
  const url = props.routes.partnerDetails.getLink({ projectId: props.projectId, partnerId: props.partnerId });

  return (
    <PartnerDetailsEditComponent
      backLink={<BackLink route={url}>{getContent(x => x.pages.partnerDetailsEdit.backToPartnerInfo)}</BackLink>}
      saveButtonContent={getContent(x => x.pages.partnerDetailsEdit.saveAndReturnPartnerDetailsButton)}
      navigateTo={url.path}
      {...props}
    />
  );
};

export const PartnerDetailsEditRoute = defineRoute<PartnerDetailsParams>({
  routeName: "partnerDetailsEdit",
  routePath: "/projects/:projectId/setup/:partnerId/project-location",
  container: PartnerDetailsEditContainer,
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    partnerId: r.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.partnerDetailsEdit.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager),
});
