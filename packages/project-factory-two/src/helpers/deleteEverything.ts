import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { batch } from "./batch";

const deleteEverything = async (connection: ITsforceConnection) => {
  const deleteAll = async (sobject: string): Promise<void> => {
    const idRecords = await connection.sobject(sobject).select<{ Id: string }>(["Id"]).execute();
    const ids = idRecords.records.map(x => x.Id);

    if (ids.length > 0) {
      for (const idBatch of batch(ids)) {
        await connection.sobject(sobject).deleteMany(idBatch);
      }
    }
  };

  await deleteAll("Acc_Virements__c");
  await deleteAll("Acc_ProjectContactLink__c");
  await deleteAll("Acc_StatusChange__c");
  await deleteAll("Acc_IFSSpendProfile__c");
  await deleteAll("PCR_Approval__c");
  await deleteAll("Acc_ProjectChangeRequest__c");
  await deleteAll("Acc_Claims__c");
  await deleteAll("Acc_Profile__c");
  await deleteAll("Acc_Prepayment__c");
  await deleteAll("Acc_ProjectParticipant__c");
  await deleteAll("Assurance_Insights_Related_Project__c");
  await deleteAll("Acc_Project__c");
  await deleteAll("Acc_MonitoringAnswer__c");
  await deleteAll("Competition__c");
};

export { deleteEverything };
