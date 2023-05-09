import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { ProjectRole } from "@framework/constants";
import { PartnerDetailsEditComponent, PartnerDetailsParams } from "../partnerDetailsEdit.page";
import { BackLink, PageLoader } from "@ui/components";
import { usePartnerDetailsEditQuery } from "../partnerDetailsEdit.logic";
import { Pending } from "@shared/pending";

const ProjectSetupPartnerPostcodeContainer = (props: PartnerDetailsParams & BaseProps) => {
  const { project, partner } = usePartnerDetailsEditQuery(props.projectId, props.partnerId);
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();
  const combined = Pending.combine({
    editor: stores.partners.getPartnerEditor(props.projectId, props.partnerId),
  });

  const url = props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId });
  const saveAndReturnLabel = getContent(x => x.pages.projectSetupPostcodeDetails.saveAndReturn);
  const backLink = <BackLink route={url}>{getContent(x => x.pages.projectSetupPostcodeDetails.backLink)}</BackLink>;

  return (
    <PageLoader
      pending={combined}
      render={x => (
        <PartnerDetailsEditComponent
          project={project}
          partner={partner}
          backLink={backLink}
          saveAndReturnLabel={saveAndReturnLabel}
          onUpdate={(saving, dto) =>
            stores.partners.updatePartner(saving, props.partnerId, dto, {
              onComplete: () => navigate(url.path),
            })
          }
          {...x}
          {...props}
        />
      )}
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
