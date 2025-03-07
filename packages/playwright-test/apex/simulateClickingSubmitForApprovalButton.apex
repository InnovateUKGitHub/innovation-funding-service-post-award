// Add Permission Set to user: ACC Claim Probationary

String participantId ='{ParticipantId}';
Integer currentClaimNumber = {LoopCounterClaims};

List<Acc_Claims__c> checkClaimStatus  = [SELECT id, Acc_ClaimStatus__c FROM acc_claims__c WHERE Acc_ProjectParticipant__c =:participantId AND Acc_ProjectPeriodNumber__c = :currentClaimNumber AND recordType.Name = 'Total Project Period'];

if (checkClaimStatus[0].Acc_ClaimStatus__c == 'Awaiting IUK Approval') {   
     // Simulate clicking "Submit" button    
    Acc_SubmitClaimForApprovalController.submitClaimForApproval(checkClaimStatus[0].id, 'Submitted by Provar using APEX');	
   
}