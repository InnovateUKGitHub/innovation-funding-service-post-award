import { getAuthRoles } from "@framework/types";
import { Content, H3, Loader } from "@ui/components";
import { ContainerProps } from "@ui/containers/containerBase";
import { getCurrentPartnerName } from "@ui/helpers/getCurrentPartnerName";
import { Callbacks, ProjectDocumentPageParams, ProjectPartnerDocumentTableLoaderData } from "./projectDocuments.page";
import { ProjectPartnerDocumentTable } from "./projectPartnerDocumentTable";

export const ProjectPartnerDocumentTableLoader = (
  props: ContainerProps<ProjectDocumentPageParams, ProjectPartnerDocumentTableLoaderData, Callbacks>,
) => {
  const { isMo } = getAuthRoles(props.project.roles);

  return (
    <>
      <H3>
        {isMo ? (
          <Content value={x => x.pages.projectDocuments.partnerLevelSubtitle} />
        ) : (
          <Content
            value={x =>
              x.pages.projectDocuments.partnerSelfLevelSubtitle({ partnerName: getCurrentPartnerName(props.partners) })
            }
          />
        )}
      </H3>

      <Loader
        pending={props.partnerDocuments}
        render={x => <ProjectPartnerDocumentTable {...Object.assign({}, props, { partnerDocuments: x })} />}
      />
    </>
  );
};
