if (PMFinanceContact) {
  NoOfParticipants++;
}

// Create Competition and Project
Competition__c competition = new Competition__c();
competition.Acc_CompetitionCode__c = Acc_CompetitionCode;
competition.Acc_CompetitionType__c = Acc_CompetitionType;  
competition.Acc_CompetitionName__c  = Acc_CompetitionName;
insert competition; 

Acc_Project__c project = new Acc_Project__c();
project.Acc_CompetitionId__c = competition.Id;
project.Acc_StartDate__c = startDate;
project.Acc_Duration__c = projectDur;
project.Acc_ClaimFrequency__c = null;
project.Acc_ProjectTitle__c  = ProjectName;
project.Acc_TSBProjectNumber__c = accProjNo;
project.Acc_WorkdayProjectSetupComplete__c = true;
insert project;

List<User> userIds = [SELECT id, contactId FROM user WHERE profile.name IN ('IUK Customer Community Plus Login User','Customer Community Plus User', 'Customer Community Plus Login User') AND contactid!=null];

List<Id> contactIds = new List<Id>();
for (User userIdValues: userIds) {
  contactIds.add(userIdvalues.contactId);		
}

List<AggregateResult> accountIdsAgg = [SELECT accountId FROM contact WHERE id IN :contactIds GROUP BY accountId HAVING count(id)>=1 ORDER BY count(id) DESC LIMIT :NoOfParticipants OFFSET :offsetVal];
Set<Id> accountIds = new Set<Id>();
for (AggregateResult ar : accountIdsAgg) {
  accountIds.add((Id) ar.get('accountId'));
}

List<Account> accs = [SELECT Id FROM Account WHERE Id IN :accountIds];

// Create a Map of AccountId and all associated Contacts Ids and Emails
public Map<String, List<Contact>> IdAndEmailMap = new Map<String, List<Contact>>();
for (Account accValues: accs) {
  List<Contact> values = new List<Contact>();
  String accId = String.valueOf(accValues.id);
  values = [SELECT Id, Email FROM Contact WHERE AccountId =: accId];
  IdAndEmailMap.put(accId,values);	
}

// Output the AccountId and all associated Contacts Ids and Emails
for (String accountId : IdAndEmailMap.keySet()) {
  List<Contact> ContactValuesList = IdAndEmailMap.get(accountId);
  for (Contact ContactValues : ContactValuesList) {
    System.debug('Account Id: ' + accountId + ' Contact Id: ' + ContactValues.id + ' Email: ' + ContactValues.Email);
  }
      
  System.debug('Account Id' + accountId);
  System.debug('First id in List ' + ContactValuesList[0].id);
  System.debug('First email in List ' + ContactValuesList[0].Email);
}


// Specifies which Participant has an Account
List<List<String>> participantListValues = new List<List<String>>();
participantListValues.add(new List<String>{'Project Manager','true','Lead'});
participantListValues.add(new List<String>{'Monitoring Officer','false','Collaborator'});
participantListValues.add(new List<String>{'Finance Contact','true','Collaborator'});

Integer ParticipantCount = 0;
List<Acc_ProjectContactLink__c> recordsToInsertContacts = new List<Acc_ProjectContactLink__c>();
List<Acc_ProjectParticipant__c> recordsToInsertParticipants = new List<Acc_ProjectParticipant__c>();
for (String accountId : IdAndEmailMap.keySet()) {
  List<Contact> ContactValuesList = IdAndEmailMap.get(accountId);
    
  Acc_ProjectContactLink__c PCL = new Acc_ProjectContactLink__c();
  PCL.Acc_ProjectId__c = project.id;
  PCL.Acc_Role__c = participantListValues[ParticipantCount][0];
  PCL.Acc_AccountId__c = accountId;
  PCL.Acc_ContactId__c = ContactValuesList[0].id;
  PCL.Acc_EmailOfSFContact__c = ContactValuesList[0].Email + 'noemail';
  recordsToInsertContacts.add(PCL);
    
  if (PMFinanceContact && participantListValues[ParticipantCount][0] == 'Project Manager') {
    Acc_ProjectContactLink__c PCL_FC = new Acc_ProjectContactLink__c();
    PCL_FC.Acc_ProjectId__c = project.id;
    PCL_FC.Acc_Role__c = 'Finance Contact';
    PCL_FC.Acc_AccountId__c = accountId;
    PCL_FC.Acc_ContactId__c = ContactValuesList[0].id;
    PCL_FC.Acc_EmailOfSFContact__c = ContactValuesList[0].Email + 'noemail';
    recordsToInsertContacts.add(PCL_FC);
  }

  // Create Participant if required
  if (participantListValues[ParticipantCount][1] == 'true') {
    Acc_ProjectParticipant__c participant = new Acc_ProjectParticipant__c();
    participant.Acc_ProjectId__c = project.id;
    participant.Acc_ProjectRole__c = participantListValues[ParticipantCount][2];
    participant.Acc_AccountId__c = accountId;
    participant.Acc_ParticipantType__c = participantType;
    participant.Acc_OrganisationType__c = participantOrgType;
    participant.Acc_WorkdaySupplierSetupComplete__c = true;
    recordsToInsertParticipants.add(participant); 
  }
  
  // Only increment if not a Finance Contact
  if (participantListValues[ParticipantCount][0] != 'Finance Contact') ParticipantCount++;
}


// Insert and Update
insert recordsToInsertParticipants;
insert recordsToInsertContacts;   

// Update Project Status only if field not null
if (Acc_ClaimFrequency == 'Quarterly' || Acc_ClaimFrequency == 'Monthly') {
  Acc_Project__c projectClaimsFrequency = new Acc_Project__c();

  if (Acc_CompetitionType == 'KTP') {
    ProjectClaimsFrequency.Acc_NonFEC__c = true;
  }

  projectClaimsFrequency.Acc_MonitoringLevel__c = 'Platinum';
  projectClaimsFrequency.Acc_MonitoringReportSchedule__c = 'Monthly';
  projectClaimsFrequency.Acc_ProjectStatus__c = 'Live';
  projectClaimsFrequency.Acc_ClaimFrequency__c = Acc_ClaimFrequency;
  projectClaimsFrequency.Acc_WorkdayProjectSetupComplete__c = true;
  projectClaimsFrequency.id = project.Id;

  update projectClaimsFrequency;
}
