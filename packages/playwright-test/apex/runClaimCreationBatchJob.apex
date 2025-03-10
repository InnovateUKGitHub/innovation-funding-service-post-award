// Run batch jobs
Acc_ProjectPeriodProcessor_Batch batchProjectPeriodProcessor = new Acc_ProjectPeriodProcessor_Batch();
Database.executeBatch(batchProjectPeriodProcessor, 200);
Database.executeBatch(new Acc_ClaimsCreateBatch(), 1);
