export interface IConfig {
    ifsApplicationUrl: Readonly<string>;
    ifsGrantLetterUrl: Readonly<string>;
    salesforcePassword: Readonly<string>;
    salesforceToken: Readonly<string>;
}

const secrets = {
    salesforcePassword: process.env.SALESFORCEPASSWORD as string,
    salesforceToken: process.env.SALESFORCETOKEN as string
};

export const Configuration: IConfig = {
    ifsApplicationUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
    ifsGrantLetterUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
    ...secrets
};
