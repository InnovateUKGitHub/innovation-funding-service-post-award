String participantId ='{ParticipantId}';
Integer currentClaimNumber = {LoopCounterClaims};
String submitterId = UserInfo.getUserId();

List<Acc_Claims__c> checkClaimStatus  = [SELECT Acc_ClaimStatus__c FROM acc_claims__c WHERE Acc_ProjectParticipant__c =:participantId AND  recordType.Name = 'Total Project Period' AND Acc_ProjectPeriodNumber__c = :currentClaimNumber];

// Only when Claim Status = "New"
if (checkClaimStatus[0].Acc_ClaimStatus__c == 'New') {    
    List<Acc_Profile__c> profileProfileDetailList = [
        SELECT 	id, Acc_ProjectPeriodNumber__c,Acc_CostCategory__r.Acc_CostCategoryName__c, Acc_CostCategory__r.id, Acc_ProjectParticipant__r.id, Acc_LatestForecastCost__c
        FROM Acc_Profile__c
        WHERE Acc_ProjectParticipant__r.Id = :participantId
        AND RecordType.Name = 'Profile Detail'
        AND Acc_ProjectPeriodNumber__c = :currentClaimNumber
    ];
    
    String ClaimsLineItemId = [select Id from RecordType  where sObjectType='Acc_Claims__c' and name = 'Claims Line Item' LIMIT 1].Id;  
    
    List<Acc_Claims__c> recordsToAddClaims = new List<Acc_Claims__c>();
    
    For (Acc_Profile__c profileProfileDetailListValues: profileProfileDetailList) {
    Acc_Claims__c claimsRecord = new Acc_Claims__c();
    claimsRecord.RecordTypeId = ClaimsLineItemId;
    claimsRecord.Acc_ProjectPeriodNumber__c = profileProfileDetailListValues.Acc_ProjectPeriodNumber__c;
    claimsRecord.Acc_CostCategory__c = profileProfileDetailListValues.Acc_CostCategory__r.id;
    claimsRecord.Acc_LineItemCost__c = profileProfileDetailListValues.Acc_LatestForecastCost__c;
    claimsRecord.Acc_ProjectParticipant__c = participantId;

    recordsToAddClaims.add(claimsRecord);  
    }
    insert recordsToAddClaims;
    
    String claimsChangeStatusId = [select Id from Acc_Claims__c where RecordType.Name = 'Total Project Period' and Acc_ProjectParticipant__c =:participantId and Acc_ClaimStatus__c = 'New' AND Acc_ProjectPeriodNumber__c = :currentClaimNumber].id;
    System.debug('claimsChangeStatusId:' + claimsChangeStatusId);
    
    Acc_Claims__c claimsRecordStatusSubmittedToMO = new Acc_Claims__c();
    claimsRecordStatusSubmittedToMO.id = claimsChangeStatusId;
    claimsRecordStatusSubmittedToMO.Acc_ClaimStatus__c = 'Submitted';		// Submitted to Monitoring Officer
    update claimsRecordStatusSubmittedToMO;

}