import { Extensions, Field, ObjectType } from "type-graphql";

@ObjectType()
@Extensions({ sfObject: "Acc_ProjectParticipant__c" })
class SalesforceAccProjectParticipantObject {
  @Field(() => String)
  @Extensions({ sfField: "Id" })
  id!: string;

  @Extensions({ sfField: "Name" })
  @Field(() => String)
  name!: string;

  @Extensions({ sfField: "Acc_NewForecastNeeded__c" })
  @Field(() => Boolean, { nullable: true })
  newForecastNeeded!: boolean;

  @Extensions({ sfField: "Acc_ParticipantStatus__c" })
  @Field(() => String, { nullable: true })
  participantStatus!: string;

  @Extensions({ sfField: "Acc_TrackingClaims__c" })
  @Field(() => String, { nullable: true })
  trackingClaims!: string;

  @Extensions({ sfField: "Acc_OpenClaimStatus__c" })
  @Field(() => String, { nullable: true })
  openClaimStatus!: string;
}

export { SalesforceAccProjectParticipantObject };
