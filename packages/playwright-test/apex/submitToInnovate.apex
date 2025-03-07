String participantId ='{ParticipantId}';
Integer currentClaimNumber = {LoopCounterClaims};

List<Acc_Claims__c> checkClaimStatus  = [SELECT Acc_ClaimStatus__c FROM acc_claims__c WHERE Acc_ProjectParticipant__c =:participantId AND  recordType.Name = 'Total Project Period' AND Acc_ProjectPeriodNumber__c = :currentClaimNumber];

// Only when Claim Status = "Submitted to Monitoring Officer"
if (checkClaimStatus[0].Acc_ClaimStatus__c == 'Submitted') {    

    String claimsChangeStatusIdSubmitted  = [select Id from Acc_Claims__c where RecordType.Name = 'Total Project Period' and Acc_ProjectParticipant__c =:participantId and Acc_ClaimStatus__c = 'Submitted' AND Acc_ProjectPeriodNumber__c = :currentClaimNumber].id;
    Acc_Claims__c claimsRecordStatusSubmittedToInnovate = new Acc_Claims__c();
    claimsRecordStatusSubmittedToInnovate.id = claimsChangeStatusIdSubmitted;
    claimsRecordStatusSubmittedToInnovate.Acc_ClaimStatus__c = 'Awaiting IUK Approval';
    update claimsRecordStatusSubmittedToInnovate;

}