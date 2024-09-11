import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ManageTeamMemberValidatorSchema } from "../ManageTeamMember.zod";
import { useRoutes } from "@ui/context/routesProvider";
import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";

const useOnManageTeamMemberSubmit = ({ projectId }: { projectId: ProjectId }) => {
  const navigate = useNavigate();
  const routes = useRoutes();
  const [, setFetchKey] = useFetchKey();

  return useOnUpdate<z.output<ManageTeamMemberValidatorSchema>, PCRDto, EmptyObject>({
    req: async data => {
      let pcrStatus = PCRStatus.Approved;

      switch (data.form) {
        case FormTypes.ProjectManageTeamMembersCreate: {
          pcrStatus = PCRStatus.SubmittedToInnovateUK;

          return await clientsideApiClient.pcrs.create({
            projectId: data.projectId,
            projectChangeRequestDto: {
              projectId: data.projectId,
              status: pcrStatus,
              reasoningStatus: PCRItemStatus.Incomplete,
              items: [
                {
                  type: PCRItemType.ManageTeamMembers,
                  status: PCRItemStatus.Complete,
                },
              ],
            },
          });
        }
        case FormTypes.ProjectManageTeamMembersReplace: {
          pcrStatus = PCRStatus.SubmittedToInnovateUK;

          return await clientsideApiClient.pcrs.create({
            projectId: data.projectId,
            projectChangeRequestDto: {
              projectId: data.projectId,
              status: pcrStatus,
              reasoningStatus: PCRItemStatus.Incomplete,
              items: [
                {
                  type: PCRItemType.ManageTeamMembers,
                  status: PCRItemStatus.Complete,
                  pclId: data.pclId,
                },
              ],
            },
          });
        }
        case FormTypes.ProjectManageTeamMembersUpdate: {
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
                  pclId: data.pclId,
                },
              ],
            },
          });
        }

        case FormTypes.ProjectManageTeamMembersDelete: {
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
                  pclId: data.pclId,
                },
              ],
            },
          });
        }

        default:
          throw new Error("Invalid manage team member action");
      }
    },
    onSuccess(data, res) {
      setFetchKey(x => x + 1);

      navigate(routes.projectChangeRequestSubmittedForReview.getLink({ projectId, pcrId: res.id }).path);
    },
  });
};

export { useOnManageTeamMemberSubmit };
