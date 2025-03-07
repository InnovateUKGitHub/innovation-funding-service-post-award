String projectId ='{ProjectId}';
Integer award_Rate = integer.valueOf('{AwardRate}');
Integer cap_Limit = integer.valueOf('{CapLimit}');

// Project Participant Ids
List<Acc_ProjectParticipant__c> projectParticipantList = [SELECT Id 
FROM Acc_ProjectParticipant__c 
WHERE Acc_ProjectId__c =: projectId];

// Update Participant AwardRate and CapLimit
List<Acc_ProjectParticipant__c> Acc_ProjectParticipantUpdate = new List<Acc_ProjectParticipant__c>();
for(Acc_ProjectParticipant__c partId: projectParticipantList){
    Acc_ProjectParticipant__c participant = new Acc_ProjectParticipant__c();
    participant.id = partId.Id;
    participant.Acc_Award_Rate__c = award_Rate;
    participant.Acc_Cap_Limit__c = cap_Limit;
    Acc_ProjectParticipantUpdate.add(participant);
}

update Acc_ProjectParticipantUpdate;