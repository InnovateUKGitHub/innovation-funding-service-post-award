// Get the Claim Name to be Approved
String claimName = [SELECT name
FROM Acc_Claims__c
WHERE Acc_ProjectParticipant__c = '{ParticipantId}'
AND Acc_ProjectPeriodNumber__c = {LoopCounterClaims}
AND recordType.Name = 'Total Project Period'].name;

String workItemIds = [Select id FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObject.Name =: claimName].id;
           
// Instantiate the new ProcessWorkitemRequest object and populate it
Approval.ProcessWorkitemRequest req1 = new Approval.ProcessWorkitemRequest();
req1.setComments('Approving request.');
req1.setAction('Approve');
req1.setNextApproverIds(new Id[] {UserInfo.getUserId()});
req1.setWorkitemId(workItemIds);
                
Approval.ProcessResult result1 =  Approval.process(req1);