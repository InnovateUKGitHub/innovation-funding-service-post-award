import { existsSync, readFileSync, writeFileSync } from "fs";
import { printSchema } from "graphql/utilities";
import { resolvers } from "./sfdc-graphql-endpoint/src/graphql/resolvers";
import { entitiesToSchema } from "./sfdc-graphql-endpoint/src/graphql/schema";
import { Api } from "./sfdc-graphql-endpoint/src/sfdc/api";
import { Connection } from "./sfdc-graphql-endpoint/src/sfdc/connection";
import { createSfdcSchema } from "./sfdc-graphql-endpoint/src/sfdc/schema";
import { DescribeSObjectResult } from "./sfdc-graphql-endpoint/src/sfdc/types/describe-sobject";

const entities = [
  "Acc_BatchSettings__c",
  "Acc_BroadcastMessage__c",
  "Acc_Claims__c",
  "Acc_CostCategory__c",
  "Acc_DocumentType__c",
  "Acc_EmailSenders__c",
  "Acc_IFSSpendProfile__c",
  "Acc_MonitoringAnswer__c",
  "Acc_MonitoringQuestion__c",
  "Acc_Prepayment__c",
  "Acc_Profile__c",
  "Acc_Programme__c",
  "Acc_Project__c",
  "Acc_ProjectChangeRequest__c",
  "Acc_ProjectContactLink__c",
  "Acc_ProjectParticipant__c",
  "Acc_StatusChange__c",
  "Acc_Virements__c",
  "Account",
  "AccountBrand",
  "AccountContactRelation",
  "AccountContactRole",
  "AG_Change_Request_Log__c",
  "Approver_Matrix__c",
  "Assessor_Profile__c",
  "Assessor_Skill__c",
  "Asset",
  "AssetRelationship",
  "Bids__c",
  "Business_Case__c",
  "Campaign",
  "CampaignMember",
  "Candidate_Project__c",
  "Case",
  "CaseContactRole",
  "ChatterActivity",
  "CollaborationGroup",
  "CollaborationGroupMember",
  "Competition__c",
  "Contact",
  "Contact_Note__c",
  "ContentVersion",
  "Contract",
  "ContractContactRole",
  "DisableTriggers__c",
  "DuplicateRecordItem",
  "DuplicateRecordSet",
  "EmailMessage",
  "Event",
  "Exception__c",
  "External_ID__c",
  "FeedItem",
  "ForecastingAdjustment",
  "ForecastingCategoryMapping",
  "ForecastingOwnerAdjustment",
  "ForecastingQuota",
  "ForecastingTypeToCategory",
  "Idea",
  "Individual",
  "Innovate_API_Org_Settings__c",
  "Lead",
  "Loan__c",
  "LoanNotification__c",
  "Loans_Global_Settings__c",
  "Loans_Part_B_Survey__mdt",
  "Lot__c",
  "Lot_Application__c",
  "Lot_Member__c",
  "Macro",
  "MacroInstruction",
  "MO_Certificate__c",
  "MO_Project_Participant__c",
  "MO_Project_Skill__c",
  "MO_Resource_Skill__c",
  "MO_Skill_Innovate__c",
  "NetworkMember",
  "Objects_Field_Tracking__c",
  "Opportunity",
  "OpportunityCompetitor",
  "OpportunityContactRole",
  "OpportunityLineItem",
  "Order",
  "OrderItem",
  "PartnerRole",
  "Personal_Information__c",
  "Pricebook2",
  "PricebookEntry",
  "Product2",
  "ProfileSkill",
  "QuickText",
  "Quote",
  "QuoteLineItem",
  "RecordAction",
  "RecordType",
  "Scorecard",
  "ScorecardAssociation",
  "ScorecardMetric",
  "Site",
  "SocialPersona",
  "SocialPost",
  "Solution",
  "StreamingChannel",
  "Task",
  "Topic",
  "TopicAssignment",
  "Triggers__c",
  "UserProvisioningRequest",
  "WorkBadge",
  "WorkBadgeDefinition",
  "WorkThanks",
] as const;

export interface IOptionalAutogeneratedGraphQLSchemaProps {
  connection?: Connection;
  api?: Api;
}
export interface IAutogeneratedGraphQLSchemaProps {
  connection: Connection;
  api: Api;
}

/**
 * Create a connection to Salesforce, and automatically generate a GraphQL schema.
 *
 * Schema is generated from a cached "salesforceSchema.json" if it exists,
 * otherwise, fetching from Salesforce directly if it does not.
 *
 * @returns Connection, API interface and GraphQL Schema
 */
const getAutogeneratedGraphQLSchema = async ({ api }: IAutogeneratedGraphQLSchemaProps) => {
  // List of Salesforce schema definitions.
  let sObjects: DescribeSObjectResult[];

  // Populate the list if our schema cache exists.
  if (existsSync("salesforceSchema.json")) {
    sObjects = JSON.parse(readFileSync("salesforceSchema.json", { encoding: "utf-8" }));
  } else {
    // Otherwise, for each Salesforce object, ask Salesforce to describe the object.
    sObjects = await Promise.all(entities.map(entity => api.describeSObject(entity)));

    // Write the response into cache for future re-runs.
    writeFileSync("salesforceSchema.json", JSON.stringify(sObjects, null, 2));
  }

  // Convert the SObjects to a GraphQL schema.
  const schema = await entitiesToSchema({
    sfdcSchema: createSfdcSchema({ sObjects }),
    resolvers: resolvers,
  });

  return schema;
};

export { getAutogeneratedGraphQLSchema };