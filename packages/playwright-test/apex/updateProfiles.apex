String projectId = '{AccProjectId}';
String participantId ='{Acc_ParticipantId}';
String competitionType = '{CompetitionType}';
String OrganisationType = '{OrganisationType}';
Decimal ParticipantCosts =0;

List<String> costCategories = new List<String>{{CostCategoriesData}};   

// Insert Claim data 
String[] CostCategory = new String[] {{CostCategoryArray}};
String[] PeriodNumber = new String[] {{PeriodNumberArray}};
String[] Value=new String[] {{ValueArray}};

List<List<String>>  ProfileForecasteAndClaimsValues = new List<List<String>>();
for (Integer i = 0; i < CostCategory.size();i++ ){
      ProfileForecasteAndClaimsValues.add(new List<String>{CostCategory[i],PeriodNumber[i],Value[i]});		
}

// Get Cost Category Ids
List<Acc_CostCategory__c> CostCategoryId = [select Id from Acc_CostCategory__c where Acc_CostCategoryName__c IN :costCategories and Acc_CompetitionType__c = : competitionType and Acc_OrganisationType__c =: OrganisationType];

// Map of CostCategories to Cost CategoryIds
public Map<String, String> CostCategoriesMap = new Map<String, String>();
for (String ccName : costCategories)
{
	String ccId = [select Id from Acc_CostCategory__c where Acc_CostCategoryName__c = :ccName and Acc_CompetitionType__c = : competitionType and Acc_OrganisationType__c =: OrganisationType LIMIT 1].Id;
	CostCategoriesMap.put(ccName, ccId);  
}

// Get the Record Types
String ProfileDetailRecordTypeId = [select Id from RecordType where sObjectType='Acc_Profile__c' and Name = 'Profile Detail' LIMIT 1].Id; 
String TotalCostCategoryRecordTypeId = [select Id from RecordType where sObjectType='Acc_Profile__c' and Name = 'Total Cost Category' LIMIT 1].Id; 
String TotalProjectPeriodId = [select Id from RecordType  where sObjectType='Acc_Claims__c' and name = 'Total Project Period' LIMIT 1].Id; 

// Calculate GOL Values, used to calculated ProjectParticipant.Total Participant Costs
Map<String,Decimal> GOLinputValues = new Map<String,Decimal>();

// Profile Latest Forecast Costs and create new Claims
List<Acc_Profile__c> recordsToUpdateProfile = new List<Acc_Profile__c>();
for(List<String> ProfileForecasteValues: ProfileForecasteAndClaimsValues)
{
    
    String CostCategory = ProfileForecasteValues[0];
    String PeriodNo = ProfileForecasteValues[1];
    String CostCategoryCost = ProfileForecasteValues[2];
    

	// Profiles  -- UPDATED with InitialForecastCosts
	Acc_Profile__c profileRecord = new Acc_Profile__c();
	profileRecord.id = [select id from Acc_Profile__c where Acc_CostCategory__c = :CostCategoriesMap.get(CostCategory) and Acc_ProjectPeriodNumber__c = :Decimal.valueOf(PeriodNo) and RecordTypeId = :ProfileDetailRecordTypeId and Acc_ProjectId__c = :projectId and Acc_ProjectParticipant__c = :participantId].id;
    profileRecord.Acc_LatestForecastCost__c = decimal.valueOf(CostCategoryCost);	
    profileRecord.Acc_InitialForecastCost__c = decimal.valueOf(CostCategoryCost);

	recordsToUpdateProfile.add(profileRecord);

	// Sum GOL values
	Decimal GOLTotal = GOLinputValues.get(CostCategory) == null ? 0 : GOLinputValues.get(CostCategory);
	GOLinputValues.put(CostCategory, GOLTotal + (decimal.valueOf(CostCategoryCost)));

}

public Map<String, Decimal> GOLinputValuesMap = new Map<String, Decimal>();
for (String cc : GOLinputValues.keySet())
{
	String val = [select Id from Acc_CostCategory__c where Acc_CostCategoryName__c = :cc and Acc_CompetitionType__c = :competitionType and Acc_OrganisationType__c =: OrganisationType LIMIT 1].Id;
	GOLinputValuesMap.put(val, GOLinputValues.get(cc));
}

	List<Acc_Profile__c> recordsToUpdateProfileGOL = new List<Acc_Profile__c>();
	List<Acc_Profile__c> ProfileCostCategoryIdList = [select Id,Acc_CostCategory__c from Acc_Profile__c where RecordTypeId = :TotalCostCategoryRecordTypeId and Acc_ProjectParticipant__c = :participantId  and  Acc_ProjectId__c = :projectId and Acc_CostCategory__c IN :CostCategoryId ];
	for(Acc_Profile__c ProfileId: ProfileCostCategoryIdList) {

	// GOL Profile values
	Acc_Profile__c profileRecord = new Acc_Profile__c();
	profileRecord.id = ProfileId.id;    
	Decimal value= GOLinputValuesMap.get(ProfileId.Acc_CostCategory__c);       
    profileRecord.Acc_CostCategoryGOLCost__c = value;	
	recordsToUpdateProfileGOL.add(profileRecord);
}

update recordsToUpdateProfileGOL;
update recordsToUpdateProfile;




