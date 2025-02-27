
// Run batch job to create Profiles for large Projects
//Database.executeBatch(new Acc_AsyncNonIFSProfCreationBatch(), 1);

// Run batch jobs
Acc_ProjectPeriodProcessor_Batch batchProjectPeriodProcessor = new Acc_ProjectPeriodProcessor_Batch();
Database.executeBatch(batchProjectPeriodProcessor, 200);
    
ID batchprocessid = Database.executeBatch(new Acc_ClaimsCreateBatch(), 1);
AsyncApexJob aaj = [SELECT Id, Status, JobItemsProcessed, TotalJobItems, NumberOfErrors FROM AsyncApexJob WHERE ID =: batchprocessid ];