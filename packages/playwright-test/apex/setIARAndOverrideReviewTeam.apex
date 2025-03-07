String participantId ='{ParticipantId}';
String submitterId = UserInfo.getUserId();

set<string> IARRequired = new Set<String>{{IARStatusCounter}}; // If Independent Accountants Report is required for this period
set<string> OverrideReviewTeam  = new Set<String>{{ReviewTeamSetCounter}}; // If the Review Team has been overridden for this period
Integer currentClaimNumber = {LoopCounterClaims};

List<Acc_Claims__c> checkClaimStatus  = [SELECT Acc_ClaimStatus__c FROM acc_claims__c WHERE Acc_ProjectParticipant__c =:participantId AND  recordType.Name = 'Total Project Period' AND Acc_ProjectPeriodNumber__c = :currentClaimNumber];

// Only when Claim Status = "Submitted to Monitoring Officer"
if (checkClaimStatus[0].Acc_ClaimStatus__c == 'Submitted') {    

    String claimsChangeStatusIdSubmitted  = [select Id from Acc_Claims__c where RecordType.Name = 'Total Project Period' and Acc_ProjectParticipant__c =:participantId and Acc_ClaimStatus__c = 'Submitted' AND Acc_ProjectPeriodNumber__c = :currentClaimNumber].id;
    Acc_Claims__c claimsRecordStatusSubmittedToInnovate = new Acc_Claims__c();
    if (IARRequired.contains(String.valueOf(currentClaimNumber))) {
           claimsRecordStatusSubmittedToInnovate.Acc_IAROverride__c = 'IAR Required';   
           claimsRecordStatusSubmittedToInnovate.Acc_IAR_Status__c = 'Approved';   
     }
    if (OverrideReviewTeam.contains(String.valueOf(currentClaimNumber))) {
	   Integer randomNumber = Integer.valueof((Math.random() * 10)+1);
           switch on randomNumber { 
	   when 1 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'Claims review team';}
	   when 2 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'Funding Assurance Officer review team';}
	   when 3 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'Re-profiling review team';}
	   when 4 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'Special Cases Review team';}
	   when 5 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'ISCF Review Team';}
	   when 6 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'APC & CCAV Review Team';}
	   when 7 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'SIF & SBRI Review Team';}
	   when 8 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'ATI Review Team';}
	   when 9 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'Women in Innovation & Young Innovators Review Team';}
	   when 10 {claimsRecordStatusSubmittedToInnovate.Acc_OverrideReviewTeam__c = 'European Review Team';}
	   }
    }
    claimsRecordStatusSubmittedToInnovate.id = claimsChangeStatusIdSubmitted;
    update claimsRecordStatusSubmittedToInnovate;

}
