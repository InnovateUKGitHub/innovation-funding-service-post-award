    
List<Id> ProjectId = new List<Id>{
'{ProjectIdList}'  
};
   
List<acc_Project__c> projects = [select id from acc_project__c where id IN :ProjectId LIMIT 10000];    
    
List<acc_virements__c> virements = [select id from acc_virements__c where acc_projectid__c  IN :ProjectId LIMIT 10000];
  
List<Acc_ProjectChangeRequest__c> PCRRequestHeaderIds = 
[select id from Acc_ProjectChangeRequest__c where Acc_project__c IN :ProjectId LIMIT 10000];    
List<Acc_ProjectChangeRequest__c> PCRRequestTypeIds = 
[select Acc_RequestHeader__c from Acc_ProjectChangeRequest__c where Acc_RequestHeader__c In :PCRRequestHeaderIds LIMIT 10000];    
    
List<acc_projectContactLink__c > projectContactLink =
[select id from acc_projectContactLink__c where acc_projectid__c  IN :ProjectId LIMIT 10000];

acc_Claims__c[] ClaimId = [select id from acc_Claims__c where acc_projectid__c  IN :ProjectId LIMIT 10000];
List<Acc_StatusChange__c> StatusChangePCR =
[select id from Acc_StatusChange__c where Acc_ProjectChangeRequest__c  IN :PCRRequestHeaderIds];
List<Acc_StatusChange__c> StatusChange =
[select id from Acc_StatusChange__c where Acc_Claim__c IN :ClaimId];
StatusChange.addall(StatusChangePCR);

List<Acc_Claims__c> claims =
[select id from acc_Claims__c where acc_projectid__c  IN :ProjectId LIMIT 10000];

List<acc_Profile__c > Profile =
[select id from acc_Profile__c where acc_projectid__c  IN :ProjectId LIMIT 10000];

List<acc_IFSSpendProfile__c > IFSSpendProfile =
[select id from acc_IFSSpendProfile__c where acc_projectid__c  IN :ProjectId LIMIT 10000];

List<acc_ProjectParticipant__c> ProjectParticipantId = 
[select id from acc_ProjectParticipant__c where acc_projectid__c  IN :ProjectId LIMIT 10000];    
    
List<acc_prepayment__c > prepayment =
[select id from acc_prepayment__c where Acc_ProjectParticipant__c IN :ProjectParticipantId LIMIT 10000];

List<acc_MonitoringAnswer__c> MORequestHeaderIds = 
[select id from acc_MonitoringAnswer__c where Acc_project__c IN :ProjectId LIMIT 10000];    
List<acc_MonitoringAnswer__c> MORequestTypeIds = 
[select Acc_MonitoringHeader__c from acc_MonitoringAnswer__c where Acc_MonitoringHeader__c In :MORequestHeaderIds LIMIT 10000];             

List<acc_ProjectParticipant__c > ProjectParticipant =
[select id from acc_ProjectParticipant__c where acc_projectid__c  IN :ProjectId LIMIT 10000];

List<String> CompIdDup = new List<String>();
List<acc_Project__c> olList = [select Acc_CompetitionId__c from acc_Project__c where id  IN :ProjectId];
for(acc_project__c ol : olList){
    CompIdDup.add(ol.Id);
}
List<AggregateResult> CompId = [select Acc_CompetitionId__c  from acc_Project__c  where Acc_CompetitionId__c  IN :CompIdDup group by Acc_CompetitionId__c having count(Acc_CompetitionId__c)=1];

        
List<Competition__c> recordsToDeleteCompetition = new List<Competition__c>();
for(AggregateResult CompetitionId : CompId ) {
        Competition__c competition = new Competition__c();
    	competition.id  = (id) CompetitionId.get('Acc_CompetitionId__c');
    	recordsToDeleteCompetition.add(competition);
}
   
        
// Deduplicate list
//List<acc_MonitoringAnswer__c> MORequestTypeIds_NoDup = new List<acc_MonitoringAnswer__c>(new Set<acc_MonitoringAnswer__c>(MORequestTypeIds));
List<acc_MonitoringAnswer__c> MORequestHeaderIds_NoDup = new List<acc_MonitoringAnswer__c>(new Set<acc_MonitoringAnswer__c>(MORequestHeaderIds));
        
// Deletes
Delete virements;
Delete projectContactLink;
Delete StatusChange;
Delete PCRRequestTypeIds;
Delete PCRRequestHeaderIds;    
Delete claims;
Delete Profile;
Delete IFSSpendProfile;
Delete prepayment;
Delete MORequestHeaderIds_NoDup;   
//Delete MORequestTypeIds_NoDup;
Delete ProjectParticipant;
Delete projects; 
Delete recordsToDeleteCompetition;
    
    

