import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ManageTeamMemberValidatorSchema } from "./ManageTeamMemberCrud.zod";
import { useRoutes } from "@ui/context/routesProvider";
import { useFormContext } from "react-hook-form";

const useOnManageTeamMemberSubmit = ({ projectId }: { projectId: ProjectId }) => {
  const navigate = useNavigate();
  const routes = useRoutes();
  const [, setFetchKey] = useFetchKey();

  return useOnUpdate<z.output<ManageTeamMemberValidatorSchema>, { id: PcrId }, EmptyObject>({
    req: async data => {
      switch (data.form) {
        case FormTypes.ProjectManageTeamMembersCreate: {
          return await clientsideApiClient.pcrs.inviteTeamMember({
            projectId,
            pcr: {
              ...data,
              form: FormTypes.ProjectManageTeamMembersCreate,
            },
          });
        }
        case FormTypes.ProjectManageTeamMembersReplace: {
          return await clientsideApiClient.pcrs.replaceTeamMember({
            projectId,
            pcr: {
              ...data,
              form: FormTypes.ProjectManageTeamMembersReplace,
            },
          });
        }

        case FormTypes.ProjectManageTeamMembersUpdate: {
          return await clientsideApiClient.pcrs.updateTeamMember({
            projectId,
            pcr: {
              ...data,
              form: FormTypes.ProjectManageTeamMembersUpdate,
            },
          });
        }

        case FormTypes.ProjectManageTeamMembersDelete:
          return await clientsideApiClient.pcrs.deleteTeamMember({
            projectId,
            pcr: {
              ...data,
              form: FormTypes.ProjectManageTeamMembersDelete,
            },
          });

        default:
          throw new Error("Invalid manage team member action");
      }
    },
    onSuccess(data, res) {
      setFetchKey(x => x + 1);

      switch (data.form) {
        case FormTypes.ProjectManageTeamMembersCreate:
        case FormTypes.ProjectManageTeamMembersReplace:
          navigate(routes.projectChangeRequestSubmittedForReview.getLink({ projectId, pcrId: res.id }).path);
          break;
        case FormTypes.ProjectManageTeamMembersUpdate:
        case FormTypes.ProjectManageTeamMembersDelete:
          navigate(routes.projectChangeRequestCompleted.getLink({ projectId, pcrId: res.id }).path);
      }
    },
  });
};

const useManageTeamMemberFormContext = useFormContext<z.output<ManageTeamMemberValidatorSchema>>;

export { useOnManageTeamMemberSubmit, useManageTeamMemberFormContext };
