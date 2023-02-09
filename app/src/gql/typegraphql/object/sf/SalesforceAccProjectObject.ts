import { Extensions, Field, ObjectType } from "type-graphql";
import { SalesforceAccProjectParticipantObject } from "./SalesforceAccProjectParticipantObject";
import { SalesforceStringValueObject } from "./SalesforceTypeObject";

@ObjectType()
@Extensions({ sfObject: "Acc_Project__c" })
class SalesforceAccProjectObject {
  @Field(() => String)
  @Extensions({ sfField: "Id" })
  id!: string;

  @Extensions({ sfField: "Name" })
  @Field(() => String)
  name!: string;

  @Extensions({ sfField: "Acc_ProjectNumber__c" })
  @Field(() => String, { nullable: true })
  projectNumber!: string;

  @Extensions({ sfField: "Acc_ProjectTitle__c" })
  @Field(() => String, { nullable: true })
  title!: string;

  @Extensions({ sfField: "Acc_LeadParticipantName__c" })
  @Field(() => String, { nullable: true })
  leadParticipantName!: string;

  @Extensions({ sfField: "Acc_LeadParticipantID__c" })
  @Field(() => String, { nullable: true })
  leadParticipantId!: string;

  @Extensions({ sfField: "Acc_NumberofPeriods__c" })
  @Field(() => Number, { nullable: true })
  numberOfPeriods!: number;

  @Extensions({ sfField: "Acc_CurrentPeriodNumber__c" })
  @Field(() => Number, { nullable: true })
  currentPeriodNumber!: number;

  @Extensions({ sfField: "Acc_StartDate__c" })
  @Field(() => String, { nullable: true })
  startDate!: string;

  @Extensions({ sfField: "Acc_EndDate__c" })
  @Field(() => String, { nullable: true })
  endDate!: string;

  @Extensions({ sfField: "Acc_ClaimsForReview__c" })
  @Field(() => Number, { nullable: true })
  claimsForReview!: number;

  @Extensions({ sfField: "Acc_PCRsForReview__c" })
  @Field(() => Number, { nullable: true })
  pcrsForReview!: number;

  @Extensions({ sfField: "Acc_PCRsUnderQuery__c" })
  @Field(() => Number, { nullable: true })
  pcrsUnderQuery!: number;

  @Extensions({ sfField: "Acc_ClaimsOverdue__c" })
  @Field(() => Number, { nullable: true })
  claimsOverdue!: number;

  @Extensions({ sfField: "Acc_ClaimsUnderQuery__c" })
  @Field(() => Number, { nullable: true })
  claimsUnderQuery!: number;

  @Extensions({ sfField: "Acc_NumberOfOpenClaims__c" })
  @Field(() => Number, { nullable: true })
  numberOfOpenClaims!: number;

  @Extensions({ sfField: "Acc_ProjectStatus__c" })
  @Field(() => String, { nullable: true })
  projectStatus!: string;

  @Extensions({ sfField: "Acc_CurrentPeriodStartDate__c" })
  @Field(() => String, { nullable: true })
  currentPeriodStartDate!: string;

  @Extensions({ sfField: "Acc_CurrentPeriodEndDate__c" })
  @Field(() => String, { nullable: true })
  currentPeriodEndDate!: string;

  @Extensions({ sfRelationIds: "Acc_ProjectParticipantsProject__r" })
  @Field(() => [String], { nullable: true })
  projectParticipantIds!: string[];

  @Extensions({ sfRelation: "Acc_ProjectParticipantsProject__r" })
  @Field(() => [SalesforceAccProjectParticipantObject], { defaultValue: [] })
  projectParticipants!: SalesforceAccProjectParticipantObject[];
}

export { SalesforceAccProjectObject };
