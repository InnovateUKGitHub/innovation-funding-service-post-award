export interface IConfig {
    ifsApplicationUrl: Readonly<string>;
    ifsGrantLetterUrl: Readonly<string>;
    salesforcePassword: Readonly<string>;
    salesforceToken: Readonly<string>;
    salesforceUseJwtToken: Readonly<boolean>;
    salesforceClientId: Readonly<string>;
    salesforceConnectionUrl: Readonly<string>;
}

const secrets = {
    salesforcePassword: process.env.SALESFORCEPASSWORD!,
    salesforceToken: process.env.SALESFORCETOKEN!,
    salesforceUseJwtToken: process.env.SALESFORCEUSEJWTTOKEN === "true",
    salesforceClientId: process.env.SALESFORCECLIENTID!,
    salesforceConnectionUrl: process.env.SALESFORCECONNECTIONURL!
};

export const Configuration: IConfig = {
    ifsApplicationUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
    ifsGrantLetterUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
    ...secrets
};
