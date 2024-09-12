import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ManageTeamMemberValidatorSchema } from "./ManageTeamMember.zod";
import { useRoutes } from "@ui/context/routesProvider";
import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { useFormContext } from "react-hook-form";

const useOnManageTeamMemberSubmit = ({ projectId }: { projectId: ProjectId }) => {
  const navigate = useNavigate();
  const routes = useRoutes();
  const [, setFetchKey] = useFetchKey();

  return useOnUpdate<z.output<ManageTeamMemberValidatorSchema>, PCRDto, EmptyObject>({
    req: async data => {
      let pcrStatus = PCRStatus.Approved;
      let pclId: ProjectContactLinkId | undefined;

      switch (data.form) {
        case FormTypes.ProjectManageTeamMembersCreate:
          {
            pcrStatus = PCRStatus.SubmittedToInnovateUK;
          }
          break;
        case FormTypes.ProjectManageTeamMembersReplace:
          {
            pcrStatus = PCRStatus.SubmittedToInnovateUK;
            pclId = data.pclId;
          }
          break;
        case FormTypes.ProjectManageTeamMembersUpdate:
          {
            await clientsideApiClient.projectContacts.update({
              projectId,
              contacts: [
                {
                  id: data.pclId,
                  firstName: data.firstName,
                  lastName: data.lastName,
                },
              ],
            });
            pclId = data.pclId;
          }
          break;

        case FormTypes.ProjectManageTeamMembersDelete:
          {
            await clientsideApiClient.projectContacts.update({
              projectId,
              contacts: [
                {
                  id: data.pclId,
                  inactive: true,
                  endDate: new Date(),
                },
              ],
            });
            pclId = data.pclId;
          }
          break;

        default:
          throw new Error("Invalid manage team member action");
      }

      return await clientsideApiClient.pcrs.create({
        projectId: data.projectId,
        projectChangeRequestDto: {
          projectId: data.projectId,
          status: pcrStatus,
          reasoningStatus: PCRItemStatus.Complete,
          items: [
            {
              type: PCRItemType.ManageTeamMembers,
              status: PCRItemStatus.Complete,
              pclId,
              // TODO: FPD-1090 The conversion is sane because the strings are identical
              manageType: data.form as unknown as ManageTeamMemberMethod,
            },
          ],
        },
      });
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
