import { ProjectRole } from "@framework/constants/project";
import { BackLink } from "@ui/components/atoms/Links/links";
import { PartnerDetailsEditComponent } from "@ui/components/templates/PartnerDetailsEdit/PartnerDetailsEdit";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { PartnerDetailsParams } from "../partnerDetails/partnerDetailsEdit.page";

const ProjectSetupPartnerPostcodeContainer = (props: PartnerDetailsParams & BaseProps) => {
  const { getContent } = useContent();
  const url = props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId });

  return (
    <PartnerDetailsEditComponent
      backLink={<BackLink route={url}>{getContent(x => x.pages.projectSetupPostcodeDetails.backLink)}</BackLink>}
      saveButtonContent={getContent(x => x.pages.projectSetupPostcodeDetails.saveAndReturn)}
      navigateTo={url.path}
      isSetup
      {...props}
    />
  );
};

export const ProjectSetupPartnerPostcodeRoute = defineRoute<PartnerDetailsParams>({
  routeName: "projectSetupPostcode",
  routePath: "/projects/:projectId/postcode/:partnerId",
  container: ProjectSetupPartnerPostcodeContainer,
  getParams: r => ({ projectId: r.params.projectId as ProjectId, partnerId: r.params.partnerId as PartnerId }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectSetupPostcodeDetails.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager),
});
