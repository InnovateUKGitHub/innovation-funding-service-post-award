export interface IConfig {
    ifsApplicationUrl: Readonly<string>;
    ifsGrantLetterUrl: Readonly<string>;
  
    serverUrl: string;
    ssoProviderUrl: string;

    salesforceClientId: Readonly<string>;
    salesforceConnectionUrl: Readonly<string>;
    // ToDo: Remove
    salesforcePassword: Readonly<string>;
    // ToDo: Remove
    salesforceToken: Readonly<string>;
    // ToDo: Remove
    salesforceUseJwtToken: Readonly<boolean>;
    // ToDo: Remove
    salesforceUsername: string;
    // ToDo: Remove
    useSSO: boolean;
}

const secrets = {
    serverUrl: process.env.SERVER_URL!,
    ssoProviderUrl: process.env.SSO_PROVIDER_URL!,

    salesforceClientId: process.env.SALESFORCECLIENTID!,
    salesforceConnectionUrl: process.env.SALESFORCECONNECTIONURL!,
    salesforcePassword: process.env.SALESFORCEPASSWORD!,
    salesforceToken: process.env.SALESFORCETOKEN!,  
    salesforceUseJwtToken: process.env.SALESFORCEUSEJWTTOKEN === "true",
    salesforceUsername: process.env.SALESFORCEUSERNAME!,

    useSSO: process.env.USE_SSO === "true",
};

export const Configuration: IConfig = {
    ifsApplicationUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
    ifsGrantLetterUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
    ...secrets
};
