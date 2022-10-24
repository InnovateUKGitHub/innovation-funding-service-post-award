import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { ProjectRole } from "@framework/constants";
import { PartnerDetailsEditComponent, PartnerDetailsParams } from "../partnerDetailsEdit.page";
import * as ACC from "../../../components";

const ProjectSetupPartnerPostcodeContainer = (props: PartnerDetailsParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();

  const url = props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId });
  const saveAndReturnLabel = getContent(x => x.pages.projectSetupPostcodeDetails.saveAndReturn);
  const backLink = (
    <ACC.BackLink route={url}>{getContent(x => x.pages.projectSetupPostcodeDetails.backLink)}</ACC.BackLink>
  );

  return (
    <PartnerDetailsEditComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId)}
      backLink={backLink}
      saveAndReturnLabel={saveAndReturnLabel}
      onUpdate={(saving, dto) =>
        stores.partners.updatePartner(saving, props.partnerId, dto, {
          onComplete: () => navigate(url.path),
        })
      }
    />
  );
};

export const ProjectSetupPartnerPostcodeRoute = defineRoute<PartnerDetailsParams>({
  routeName: "projectSetupPostcode",
  routePath: "/projects/:projectId/postcode/:partnerId",
  container: ProjectSetupPartnerPostcodeContainer,
  getParams: r => ({ projectId: r.params.projectId, partnerId: r.params.partnerId }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectSetupPostcodeDetails.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager),
});
