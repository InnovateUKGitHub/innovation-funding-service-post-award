import { useNavigate } from "react-router-dom";
import { PartnerDto, PartnerDtoGql, ProjectDtoGql, ProjectRole } from "@framework/types";
import { IEditorStore, useStores } from "@ui/redux";
import { PageLoader, Page, Projects, BackLink } from "@ui/components";
import { Pending } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { PostcodeEdit } from "@ui/containers/features";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { usePartnerDetailsEditQuery } from "./partnerDetailsEdit.logic";

export interface PartnerDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface PartnerDetailsEditComponentProps extends PartnerDetailsParams {
  project: Pick<ProjectDtoGql, "projectNumber" | "title" | "status">;
  partner: Pick<PartnerDtoGql, "partnerStatus">;
  editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
  backLink: React.ReactElement;
  saveAndReturnLabel: string;
  displayCurrentPostcode?: boolean;
  onUpdate: (saving: boolean, dto: PartnerDto) => void;
}

/**
 * ### PartnerDetailsEditComponent
 *
 * React component to edit partner details
 */
export function PartnerDetailsEditComponent(props: BaseProps & PartnerDetailsEditComponentProps) {
  const { project, partner, editor, backLink } = props;
  return (
    <Page
      backLink={backLink}
      pageTitle={<Projects.Title projectNumber={project.projectNumber} title={project.title} />}
      error={editor.error}
      validator={editor.validator}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <PostcodeEdit
        editor={editor}
        displayCurrentPostcode={!!props.displayCurrentPostcode}
        saveButtonContent={props.saveAndReturnLabel}
        onUpdate={() => props.onUpdate(true, editor.data)}
      />
    </Page>
  );
}

const PartnerDetailsEditContainer = (props: PartnerDetailsParams & BaseProps) => {
  const { project, partner } = usePartnerDetailsEditQuery(props.projectId, props.partnerId);
  const stores = useStores();
  const { getContent } = useContent();
  const combined = Pending.combine({
    editor: stores.partners.getPartnerEditor(props.projectId, props.partnerId),
  });

  const url = props.routes.partnerDetails.getLink({ projectId: props.projectId, partnerId: props.partnerId });
  const saveAndReturnLabel = getContent(x => x.pages.partnerDetailsEdit.saveAndReturnPartnerDetailsButton);
  const backLink = <BackLink route={url}>{getContent(x => x.pages.partnerDetailsEdit.backToPartnerInfo)}</BackLink>;
  const navigate = useNavigate();

  return (
    <PageLoader
      pending={combined}
      render={x => (
        <PartnerDetailsEditComponent
          project={project}
          partner={partner}
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
          {...x}
          {...props}
        />
      )}
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
