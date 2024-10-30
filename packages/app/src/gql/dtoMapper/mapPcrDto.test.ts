import { mapToPcrDtoArray, PcrNode } from "./mapPcrDto";

const edges = [
  {
    node: {
      Id: "a0G26000007KkbiEAC",
      Acc_Status__c: {
        value: "Approved",
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 7,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-10T13:55:22.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-24T09:53:31.000Z",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
        DeveloperName: {
          value: "Acc_RequestHeader",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KkbnEAC",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: "AAA LTD",
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KkbiEAC",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: "Business",
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-10T13:55:23.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-24T09:53:48.000Z",
      },
      RecordType: {
        Name: {
          value: "Add a partner",
          label: "Add a partner",
        },
        DeveloperName: {
          value: "Acc_AddAPartner",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KkfzEAC",
      Acc_Status__c: {
        value: "Withdrawn",
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 8,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-10T15:56:40.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-17T15:11:14.000Z",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
        DeveloperName: {
          value: "Acc_RequestHeader",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007Kkg4EAC",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KkfzEAC",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-10T15:56:42.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-10T15:57:55.000Z",
      },
      RecordType: {
        Name: {
          value: "Change project scope",
          label: "Change project scope",
        },
        DeveloperName: {
          value: "Acc_ChangeProjectScope",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007Ko6gEAC",
      Acc_Status__c: {
        value: "Queried by Monitoring Officer",
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 11,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-18T14:56:25.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-18T14:57:59.000Z",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
        DeveloperName: {
          value: "Acc_RequestHeader",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007Ko6lEAC",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007Ko6gEAC",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-18T14:56:27.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-18T14:56:47.000Z",
      },
      RecordType: {
        Name: {
          value: "Change project duration",
          label: "Change project duration",
        },
        DeveloperName: {
          value: "Acc_ChangeProjectDuration",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KqPTEA0",
      Acc_Status__c: {
        value: "Submitted to Innovate UK",
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 14,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-24T09:29:47.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-24T09:46:08.000Z",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
        DeveloperName: {
          value: "Acc_RequestHeader",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KqPYEA0",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: true,
      },
      Acc_OrganisationName__c: {
        value: "C",
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KqPTEA0",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: "Business",
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-24T09:29:48.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-24T09:55:17.000Z",
      },
      RecordType: {
        Name: {
          value: "Add a partner",
          label: "Add a partner",
        },
        DeveloperName: {
          value: "Acc_AddAPartner",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KqPdEAK",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: true,
      },
      Acc_OrganisationName__c: {
        value: "A LIMITED",
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KqPTEA0",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: "Business",
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-24T09:30:16.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-24T09:55:54.000Z",
      },
      RecordType: {
        Name: {
          value: "Add a partner",
          label: "Add a partner",
        },
        DeveloperName: {
          value: "Acc_AddAPartner",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KqPiEAK",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: true,
      },
      Acc_OrganisationName__c: {
        value: "D LIMITED",
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KqPTEA0",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: "Business",
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-24T09:30:37.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-24T09:56:10.000Z",
      },
      RecordType: {
        Name: {
          value: "Add a partner",
          label: "Add a partner",
        },
        DeveloperName: {
          value: "Acc_AddAPartner",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KqPsEAK",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "Complete",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KqPTEA0",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: "A B Cad Services",
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-05-24T09:44:00.000Z",
      },
      LastModifiedDate: {
        value: "2023-05-24T09:44:28.000Z",
      },
      RecordType: {
        Name: {
          value: "Remove a partner",
          label: "Remove a partner",
        },
        DeveloperName: {
          value: "Acc_RemoveAPartner",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KtLnEAK",
      Acc_Status__c: {
        value: "Draft",
      },
      Acc_MarkedasComplete__c: {
        value: "To Do",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 21,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-06-02T09:43:50.000Z",
      },
      LastModifiedDate: {
        value: "2023-06-02T09:43:53.000Z",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
        DeveloperName: {
          value: "Acc_RequestHeader",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KtLsEAK",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "To Do",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KtLnEAK",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-06-02T09:43:52.000Z",
      },
      LastModifiedDate: {
        value: "2023-06-02T09:43:52.000Z",
      },
      RecordType: {
        Name: {
          value: "Reallocate several partners' project cost",
          label: "Reallocate several partners' project cost",
        },
        DeveloperName: {
          value: "Acc_ReallocateSeveralPartnersProjectCost",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KtsoEAC",
      Acc_Status__c: {
        value: "Draft",
      },
      Acc_MarkedasComplete__c: {
        value: "To Do",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 22,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: "Collaborator",
      },
      CreatedDate: {
        value: "2023-06-05T10:53:36.000Z",
      },
      LastModifiedDate: {
        value: "2023-06-05T10:53:38.000Z",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
        DeveloperName: {
          value: "Acc_RequestHeader",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KtstEAC",
      Acc_Status__c: {
        value: null,
      },
      Acc_MarkedasComplete__c: {
        value: "To Do",
      },
      Acc_NewOrganisationName__c: {
        value: null,
      },
      Acc_OtherFunding__c: {
        value: false,
      },
      Acc_CommercialWork__c: {
        value: false,
      },
      Acc_OrganisationName__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KtsoEAC",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      Acc_ParticipantType__c: {
        value: null,
      },
      Acc_ExistingPartnerName__c: {
        value: null,
      },
      Acc_Project__c: {
        value: "a0E2600000okzO9EAI",
      },
      Acc_ProjectRole__c: {
        value: null,
      },
      CreatedDate: {
        value: "2023-06-05T10:53:38.000Z",
      },
      LastModifiedDate: {
        value: "2023-06-05T10:53:38.000Z",
      },
      RecordType: {
        Name: {
          value: "Add a partner",
          label: "Add a partner",
        },
        DeveloperName: {
          value: "Acc_AddAPartner",
        },
      },
    },
  },
] as ReadonlyArray<Readonly<{ node: PcrNode } | null> | null>;

describe("mapPcrDtoArray", () => {
  it("should map the node to the projectDto structure", () => {
    expect(
      mapToPcrDtoArray(
        edges,
        ["id", "requestNumber", "projectId", "started", "lastUpdated", "reasoningStatus", "status", "statusName"],
        [
          "accountName",
          "hasOtherFunding",
          "id",
          "isCommercialWork",
          "organisationName",
          "organisationType",
          "partnerNameSnapshot",
          "partnerType",
          "projectRole",
          "shortName",
          "status",
          "type",
          "typeName",
          "typeOfAid",
        ],
        { typeOfAid: "de minimis" },
      ),
    ).toMatchSnapshot();
  });
});
