import { useNavigate } from "react-router-dom";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { IEditorStore, useStores } from "@ui/redux";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { PostcodeEdit } from "@ui/containers/features";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";

interface PartnerDetailsEditComponentProps extends PartnerDetailsParams {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
  backLink: React.ReactElement;
  saveAndReturnLabel: string;
  displayCurrentPostcode?: boolean;
  onUpdate: (saving: boolean, dto: PartnerDto) => void;
}

export interface PartnerDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

/**
 * ### PartnerDetailsEditComponent
 *
 * React component to edit partner details
 */
export function PartnerDetailsEditComponent(props: PartnerDetailsEditComponentProps) {
  const combined = Pending.combine({
    project: props.project,
    partner: props.partner,
    editor: props.editor,
  });

  return (
    <ACC.PageLoader
      pending={combined}
      render={({ partner, project, editor }) => (
        <ACC.Page
          backLink={props.backLink}
          pageTitle={<ACC.Projects.Title {...project} />}
          error={editor.error}
          validator={editor.validator}
          project={project}
          partner={partner}
        >
          <PostcodeEdit
            partner={partner}
            editor={editor}
            displayCurrentPostcode={!!props.displayCurrentPostcode}
            saveButtonContent={props.saveAndReturnLabel}
            onUpdate={() => props.onUpdate(true, editor.data)}
          />
        </ACC.Page>
      )}
    />
  );
}

const PartnerDetailsEditContainer = (props: PartnerDetailsParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const url = props.routes.partnerDetails.getLink({ projectId: props.projectId, partnerId: props.partnerId });
  const saveAndReturnLabel = getContent(x => x.pages.partnerDetailsEdit.saveAndReturnPartnerDetailsButton);
  const backLink = (
    <ACC.BackLink route={url}>{getContent(x => x.pages.partnerDetailsEdit.backToPartnerInfo)}</ACC.BackLink>
  );
  const navigate = useNavigate();

  return (
    <PartnerDetailsEditComponent
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId)}
      backLink={backLink}
      saveAndReturnLabel={saveAndReturnLabel}
      displayCurrentPostcode
      onUpdate={(saving, dto) =>
        stores.partners.updatePartner(saving, props.partnerId, dto, {
          onComplete: () => {
            navigate(url.path);
          },
        })
      }
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
