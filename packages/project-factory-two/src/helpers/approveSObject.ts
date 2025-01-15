import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { SObjectFieldIdType } from "../types/SObjectFieldType";
import { ProjectFactoryDatabaseIdMissingException } from "../exceptions/ProjectFactoryDatabaseIdMissingException";

const approveSObject = (conn: ITsforceConnection, id: SObjectFieldIdType) => {
  let approvalId: string | undefined;
  if (typeof id === "function") approvalId = id();
  if (typeof id === "string") approvalId = id;
  if (typeof approvalId !== "string") throw new ProjectFactoryDatabaseIdMissingException("Approval ID missing");

  return conn.executeApex({
    query: `
      String submitterId = UserInfo.getUserId();

      Approval.ProcessSubmitRequest req1 = new Approval.ProcessSubmitRequest();
      req1.setObjectId('${approvalId}');
      req1.setSubmitterId(submitterId);
      Approval.ProcessResult result = Approval.process(req1);
      System.assert(result.isSuccess());
      List<Id> newWorkItemIds = result.getNewWorkitemIds();

      Approval.ProcessWorkitemRequest req2 = new Approval.ProcessWorkitemRequest();
      req2.setComments('Approving request.');
      req2.setAction('Approve');
      req2.setNextApproverIds(new Id[] { UserInfo.getUserId() });
      req2.setWorkitemId(newWorkItemIds.get(0));
      Approval.ProcessResult result2 = Approval.process(req2);
    `,
  });
};

export { approveSObject };
