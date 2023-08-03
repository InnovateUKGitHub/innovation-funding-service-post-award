import { mapToPartnerDocumentSummaryDtoArray, mapToProjectDocumentSummaryDtoArray } from "./mapDocumentsDto";

const data = {
  currentUser: {
    email: "iuk.accproject@bjss.com.bjssdev",
  },
  salesforce: {
    uiapi: {
      query: {
        Acc_ProjectParticipant__c: {
          edges: [
            {
              node: {
                Id: "a0D2600000z6KthEAE",
                Acc_AccountId__c: {
                  value: "0012600001amb0ZAAQ",
                },
                Acc_AccountId__r: {
                  Name: {
                    value: "A B Cad Services",
                  },
                },
                Acc_ProjectRole__c: {
                  value: "Collaborator",
                },
                ContentDocumentLinks: {
                  edges: [
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KthEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001PNMK1AAP",
                            },
                          },
                          Id: "069260000024UOxAAM",
                          LatestPublishedVersionId: {
                            value: "068260000028zfSAAQ",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 30118,
                          },
                          CreatedDate: {
                            value: "2023-05-17T14:11:39.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "bocchi-rock",
                          },
                          LastModifiedDate: {
                            value: "2023-05-17T14:11:40.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "ken Charles",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KthEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001PNMK1AAP",
                            },
                          },
                          Id: "069260000024UOOAA2",
                          LatestPublishedVersionId: {
                            value: "068260000028zeeAAA",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 30118,
                          },
                          CreatedDate: {
                            value: "2023-05-17T14:06:49.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "bocchi-rock",
                          },
                          LastModifiedDate: {
                            value: "2023-05-17T14:06:51.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "ken Charles",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KthEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001PNMK1AAP",
                            },
                          },
                          Id: "069260000024UOEAA2",
                          LatestPublishedVersionId: {
                            value: "068260000028zePAAQ",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 51034,
                          },
                          CreatedDate: {
                            value: "2023-05-17T14:05:39.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "312922834238211",
                          },
                          LastModifiedDate: {
                            value: "2023-05-17T14:05:41.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "ken Charles",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KthEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          Id: "06926000001iE1AAAU",
                          LatestPublishedVersionId: {
                            value: "06826000001iXM2AAM",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 35444,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:48:33.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "eui_small_ent_health_level_file",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:48:34.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              node: {
                Id: "a0D2600000z6KtgEAE",
                Acc_AccountId__c: {
                  value: "0012600001amb0RAAQ",
                },
                Acc_AccountId__r: {
                  Name: {
                    value: "ABS EUI Medium Enterprise",
                  },
                },
                Acc_ProjectRole__c: {
                  value: "Collaborator",
                },
                ContentDocumentLinks: {
                  edges: [
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KtgEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqObAAL",
                            },
                          },
                          Id: "069260000024ZZ7AAM",
                          LatestPublishedVersionId: {
                            value: "0682600000294s5AAA",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 1374,
                          },
                          CreatedDate: {
                            value: "2023-05-22T12:52:06.000Z",
                          },
                          FileType: {
                            value: "RTF",
                          },
                          FileExtension: {
                            value: "rtf",
                          },
                          Title: {
                            value: "Untitled 2",
                          },
                          LastModifiedDate: {
                            value: "2023-05-22T12:52:07.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: "s.shuang@irc.trde.org.uk.test",
                            },
                            Name: {
                              value: "Sarah Shuang",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KtgEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqObAAL",
                            },
                          },
                          Id: "069260000024ZZ2AAM",
                          LatestPublishedVersionId: {
                            value: "0682600000294s0AAA",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 13268,
                          },
                          CreatedDate: {
                            value: "2023-05-22T12:52:06.000Z",
                          },
                          FileType: {
                            value: "RTF",
                          },
                          FileExtension: {
                            value: "rtf",
                          },
                          Title: {
                            value: "Untitled 9",
                          },
                          LastModifiedDate: {
                            value: "2023-05-22T12:52:07.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: "s.shuang@irc.trde.org.uk.test",
                            },
                            Name: {
                              value: "Sarah Shuang",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KtgEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqObAAL",
                            },
                          },
                          Id: "069260000024ZYxAAM",
                          LatestPublishedVersionId: {
                            value: "0682600000294rvAAA",
                          },
                          Description: {
                            value: "CollaborationAgreement",
                          },
                          ContentSize: {
                            value: 1374,
                          },
                          CreatedDate: {
                            value: "2023-05-22T12:51:10.000Z",
                          },
                          FileType: {
                            value: "RTF",
                          },
                          FileExtension: {
                            value: "rtf",
                          },
                          Title: {
                            value: "Untitled 2",
                          },
                          LastModifiedDate: {
                            value: "2023-05-22T12:51:12.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: "s.shuang@irc.trde.org.uk.test",
                            },
                            Name: {
                              value: "Sarah Shuang",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KtgEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqObAAL",
                            },
                          },
                          Id: "069260000024ZGFAA2",
                          LatestPublishedVersionId: {
                            value: "0682600000294YPAAY",
                          },
                          Description: {
                            value: "ReviewMeeting",
                          },
                          ContentSize: {
                            value: 13396,
                          },
                          CreatedDate: {
                            value: "2023-05-22T11:02:23.000Z",
                          },
                          FileType: {
                            value: "WORD_X",
                          },
                          FileExtension: {
                            value: "docx",
                          },
                          Title: {
                            value: "t03",
                          },
                          LastModifiedDate: {
                            value: "2023-05-22T11:02:25.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: "s.shuang@irc.trde.org.uk.test",
                            },
                            Name: {
                              value: "Sarah Shuang",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KtgEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqObAAL",
                            },
                          },
                          Id: "069260000024ZFlAAM",
                          LatestPublishedVersionId: {
                            value: "0682600000294XvAAI",
                          },
                          Description: {
                            value: "Plans",
                          },
                          ContentSize: {
                            value: 13396,
                          },
                          CreatedDate: {
                            value: "2023-05-22T10:58:21.000Z",
                          },
                          FileType: {
                            value: "WORD_X",
                          },
                          FileExtension: {
                            value: "docx",
                          },
                          Title: {
                            value: "t02",
                          },
                          LastModifiedDate: {
                            value: "2023-05-22T10:58:22.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: "s.shuang@irc.trde.org.uk.test",
                            },
                            Name: {
                              value: "Sarah Shuang",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              node: {
                Id: "a0D2600000z6KtfEAE",
                Acc_AccountId__c: {
                  value: "0012600001amaskAAA",
                },
                Acc_AccountId__r: {
                  Name: {
                    value: "EUI Small Ent Health",
                  },
                },
                Acc_ProjectRole__c: {
                  value: "Lead",
                },
                ContentDocumentLinks: {
                  edges: [
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KtfEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqOTAA1",
                            },
                          },
                          Id: "06926000001iKRJAA2",
                          LatestPublishedVersionId: {
                            value: "06826000001idqhAAA",
                          },
                          Description: {
                            value: "Plans",
                          },
                          ContentSize: {
                            value: 43977,
                          },
                          CreatedDate: {
                            value: "2023-02-24T15:43:29.000Z",
                          },
                          FileType: {
                            value: "WORD_X",
                          },
                          FileExtension: {
                            value: "docx",
                          },
                          Title: {
                            value: "Order Form",
                          },
                          LastModifiedDate: {
                            value: "2023-02-24T15:43:31.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "James Black",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0D2600000z6KtfEAE",
                        },
                        ContentDocument: {
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqOTAA1",
                            },
                          },
                          Id: "06926000001Y1tUAAS",
                          LatestPublishedVersionId: {
                            value: "06826000001YIbBAAW",
                          },
                          Description: {
                            value: "Plans",
                          },
                          ContentSize: {
                            value: 13029,
                          },
                          CreatedDate: {
                            value: "2022-12-06T16:30:21.000Z",
                          },
                          FileType: {
                            value: "JPG",
                          },
                          FileExtension: {
                            value: "jpg",
                          },
                          Title: {
                            value: "dangerous",
                          },
                          LastModifiedDate: {
                            value: "2022-12-06T16:30:23.000Z",
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "James Black",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        Acc_Project__c: {
          edges: [
            {
              node: {
                Id: "a0E2600000kSp3gEAC",
                roles: {
                  isMo: false,
                  isFc: true,
                  isPm: false,
                  partnerRoles: [
                    {
                      isFc: false,
                      isMo: false,
                      isPm: false,
                      partnerId: "0012600001amaskAAA",
                    },
                    {
                      isFc: true,
                      isMo: false,
                      isPm: false,
                      partnerId: "0012600001amb0RAAQ",
                    },
                    {
                      isFc: false,
                      isMo: false,
                      isPm: false,
                      partnerId: "0012600001amb0ZAAQ",
                    },
                  ],
                },
                Acc_ProjectNumber__c: {
                  value: "873761",
                },
                Acc_ProjectTitle__c: {
                  value: "ACC-9076/ACC-9077 MSP Document Share",
                },
                Acc_ProjectStatus__c: {
                  value: "Live",
                },
                ContentDocumentLinks: {
                  edges: [
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001UyMLAA0",
                          LatestPublishedVersionId: {
                            value: "06826000001VEILAA4",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 33313,
                          },
                          CreatedDate: {
                            value: "2022-10-03T12:54:29.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "a_b_cad_services_level_file",
                          },
                          LastModifiedDate: {
                            value: "2022-10-03T12:54:29.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Leondro Lio",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001Y1jjAAC",
                          LatestPublishedVersionId: {
                            value: "06826000001YIRJAA4",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 13029,
                          },
                          CreatedDate: {
                            value: "2022-12-06T15:46:45.000Z",
                          },
                          FileType: {
                            value: "JPG",
                          },
                          FileExtension: {
                            value: "jpg",
                          },
                          Title: {
                            value: "dangerous",
                          },
                          LastModifiedDate: {
                            value: "2022-12-06T15:46:45.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Leondro Lio",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001Y1tZAAS",
                          LatestPublishedVersionId: {
                            value: "06826000001YIbGAAW",
                          },
                          Description: {
                            value: "ReviewMeeting",
                          },
                          ContentSize: {
                            value: 35444,
                          },
                          CreatedDate: {
                            value: "2022-12-06T16:30:55.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "eui_small_ent_health_level_file",
                          },
                          LastModifiedDate: {
                            value: "2022-12-06T16:30:57.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: "0032600001LCqOXAA1",
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Javier Baez",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iE0MAAU",
                          LatestPublishedVersionId: {
                            value: "06826000001iXLEAA2",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 254352,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:41:56.000Z",
                          },
                          FileType: {
                            value: "JPG",
                          },
                          FileExtension: {
                            value: "jpg",
                          },
                          Title: {
                            value: "zoom-background-bathroom-stall",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:41:59.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iE0WAAU",
                          LatestPublishedVersionId: {
                            value: "06826000001iXLOAA2",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 254352,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:42:48.000Z",
                          },
                          FileType: {
                            value: "JPG",
                          },
                          FileExtension: {
                            value: "jpg",
                          },
                          Title: {
                            value: "zoom-background-bathroom-stall",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:42:53.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iE0bAAE",
                          LatestPublishedVersionId: {
                            value: "06826000001iXLTAA2",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 254352,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:43:15.000Z",
                          },
                          FileType: {
                            value: "JPG",
                          },
                          FileExtension: {
                            value: "jpg",
                          },
                          Title: {
                            value: "zoom-background-bathroom-stall",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:43:20.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iE0lAAE",
                          LatestPublishedVersionId: {
                            value: "06826000001iXLdAAM",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 254352,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:44:29.000Z",
                          },
                          FileType: {
                            value: "JPG",
                          },
                          FileExtension: {
                            value: "jpg",
                          },
                          Title: {
                            value: "zoom-background-bathroom-stall",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:44:31.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iE0vAAE",
                          LatestPublishedVersionId: {
                            value: "06826000001iXLnAAM",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 254352,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:45:25.000Z",
                          },
                          FileType: {
                            value: "JPG",
                          },
                          FileExtension: {
                            value: "jpg",
                          },
                          Title: {
                            value: "zoom-background-bathroom-stall",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:45:30.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iE1jAAE",
                          LatestPublishedVersionId: {
                            value: "06826000001iXMgAAM",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 742452,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:55:57.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "Screenshot (1)",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:56:00.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iE1oAAE",
                          LatestPublishedVersionId: {
                            value: "06826000001iXMlAAM",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 1157772,
                          },
                          CreatedDate: {
                            value: "2023-02-22T16:56:15.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "Screenshot (3)",
                          },
                          LastModifiedDate: {
                            value: "2023-02-22T16:56:17.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iP8qAAE",
                          LatestPublishedVersionId: {
                            value: "06826000001iiYmAAI",
                          },
                          Description: {
                            value: "AnnexThree",
                          },
                          ContentSize: {
                            value: 13029,
                          },
                          CreatedDate: {
                            value: "2023-02-27T16:52:01.000Z",
                          },
                          FileType: {
                            value: "UNKNOWN",
                          },
                          FileExtension: {
                            value: null,
                          },
                          Title: {
                            value: "jpeg",
                          },
                          LastModifiedDate: {
                            value: "2023-02-27T16:52:06.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iP9UAAU",
                          LatestPublishedVersionId: {
                            value: "06826000001iiZQAAY",
                          },
                          Description: {
                            value: "AnnexThree",
                          },
                          ContentSize: {
                            value: 130687,
                          },
                          CreatedDate: {
                            value: "2023-02-27T16:57:20.000Z",
                          },
                          FileType: {
                            value: "UNKNOWN",
                          },
                          FileExtension: {
                            value: null,
                          },
                          Title: {
                            value: "jpeg",
                          },
                          LastModifiedDate: {
                            value: "2023-02-27T16:57:24.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iPAXAA2",
                          LatestPublishedVersionId: {
                            value: "06826000001iiaTAAQ",
                          },
                          Description: {
                            value: "AnnexThree",
                          },
                          ContentSize: {
                            value: 35444,
                          },
                          CreatedDate: {
                            value: "2023-02-27T17:11:11.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "eui_small_ent_health_level_file",
                          },
                          LastModifiedDate: {
                            value: "2023-02-27T17:11:13.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iQ4uAAE",
                          LatestPublishedVersionId: {
                            value: "06826000001ijU8AAI",
                          },
                          Description: {
                            value: "LMCMinutes",
                          },
                          ContentSize: {
                            value: 35444,
                          },
                          CreatedDate: {
                            value: "2023-02-28T11:36:23.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "eui_small_ent_health_level_file",
                          },
                          LastModifiedDate: {
                            value: "2023-02-28T11:36:25.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iQUxAAM",
                          LatestPublishedVersionId: {
                            value: "06826000001ijuVAAQ",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 30716,
                          },
                          CreatedDate: {
                            value: "2023-02-28T15:51:43.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "ktp",
                          },
                          LastModifiedDate: {
                            value: "2023-02-28T15:51:48.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001iQYLAA2",
                          LatestPublishedVersionId: {
                            value: "06826000001ijxtAAA",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 30716,
                          },
                          CreatedDate: {
                            value: "2023-02-28T16:28:38.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "ktp",
                          },
                          LastModifiedDate: {
                            value: "2023-02-28T16:28:40.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001icV4AAI",
                          LatestPublishedVersionId: {
                            value: "06826000001ivvtAAA",
                          },
                          Description: {
                            value: "ClaimValidationForm",
                          },
                          ContentSize: {
                            value: 166764,
                          },
                          CreatedDate: {
                            value: "2023-03-09T14:27:19.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "xku4ajf",
                          },
                          LastModifiedDate: {
                            value: "2023-03-09T14:27:24.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001icVTAAY",
                          LatestPublishedVersionId: {
                            value: "06826000001ivwSAAQ",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 166764,
                          },
                          CreatedDate: {
                            value: "2023-03-09T14:36:46.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "xku4ajf",
                          },
                          LastModifiedDate: {
                            value: "2023-03-09T14:36:49.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001icaYAAQ",
                          LatestPublishedVersionId: {
                            value: "06826000001iw1XAAQ",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 166764,
                          },
                          CreatedDate: {
                            value: "2023-03-09T15:08:25.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "xku4ajf",
                          },
                          LastModifiedDate: {
                            value: "2023-03-09T15:08:27.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001icbCAAQ",
                          LatestPublishedVersionId: {
                            value: "06826000001iw2BAAQ",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 332752,
                          },
                          CreatedDate: {
                            value: "2023-03-09T15:15:24.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "Screenshot 2023-03-08 at 17-03-28 Add types - Innovation Funding Service",
                          },
                          LastModifiedDate: {
                            value: "2023-03-09T15:15:26.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001icbHAAQ",
                          LatestPublishedVersionId: {
                            value: "06826000001iw2GAAQ",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 317417,
                          },
                          CreatedDate: {
                            value: "2023-03-09T15:16:22.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "image-20230309-101800",
                          },
                          LastModifiedDate: {
                            value: "2023-03-09T15:16:25.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001ifFYAAY",
                          LatestPublishedVersionId: {
                            value: "06826000001iymsAAA",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 308402,
                          },
                          CreatedDate: {
                            value: "2023-03-13T15:01:45.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "satania-thumbsup",
                          },
                          LastModifiedDate: {
                            value: "2023-03-13T15:01:54.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001ifFdAAI",
                          LatestPublishedVersionId: {
                            value: "06826000001iymxAAA",
                          },
                          Description: {
                            value: "ProjectCompletionForm",
                          },
                          ContentSize: {
                            value: 308402,
                          },
                          CreatedDate: {
                            value: "2023-03-13T15:04:23.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "satania-thumbsup",
                          },
                          LastModifiedDate: {
                            value: "2023-03-13T15:04:25.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001igHzAAI",
                          LatestPublishedVersionId: {
                            value: "06826000001izq0AAA",
                          },
                          Description: {
                            value: "AgreementToPCR",
                          },
                          ContentSize: {
                            value: 217537,
                          },
                          CreatedDate: {
                            value: "2023-03-14T14:52:55.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "pcrs",
                          },
                          LastModifiedDate: {
                            value: "2023-03-14T14:53:00.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001igJlAAI",
                          LatestPublishedVersionId: {
                            value: "06826000001izrhAAA",
                          },
                          Description: {
                            value: "Plans",
                          },
                          ContentSize: {
                            value: 217537,
                          },
                          CreatedDate: {
                            value: "2023-03-14T15:09:48.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "pcrs",
                          },
                          LastModifiedDate: {
                            value: "2023-03-14T15:09:51.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001igJvAAI",
                          LatestPublishedVersionId: {
                            value: "06826000001izrrAAA",
                          },
                          Description: {
                            value: "Plans",
                          },
                          ContentSize: {
                            value: 217537,
                          },
                          CreatedDate: {
                            value: "2023-03-14T15:10:38.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "pcrs",
                          },
                          LastModifiedDate: {
                            value: "2023-03-14T15:10:41.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001igK0AAI",
                          LatestPublishedVersionId: {
                            value: "06826000001izrwAAA",
                          },
                          Description: {
                            value: "Plans",
                          },
                          ContentSize: {
                            value: 217537,
                          },
                          CreatedDate: {
                            value: "2023-03-14T15:10:43.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "pcrs",
                          },
                          LastModifiedDate: {
                            value: "2023-03-14T15:10:46.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "06926000001igK5AAI",
                          LatestPublishedVersionId: {
                            value: "06826000001izs1AAA",
                          },
                          Description: {
                            value: "Loan",
                          },
                          ContentSize: {
                            value: 217537,
                          },
                          CreatedDate: {
                            value: "2023-03-14T15:12:03.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "pcrs",
                          },
                          LastModifiedDate: {
                            value: "2023-03-14T15:12:05.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        LinkedEntityId: {
                          value: "a0E2600000kSp3gEAC",
                        },
                        ContentDocument: {
                          Id: "069260000024WnpAAE",
                          LatestPublishedVersionId: {
                            value: "06826000002925LAAQ",
                          },
                          Description: {
                            value: null,
                          },
                          ContentSize: {
                            value: 311565,
                          },
                          CreatedDate: {
                            value: "2023-05-19T13:05:27.000Z",
                          },
                          FileType: {
                            value: "PNG",
                          },
                          FileExtension: {
                            value: "png",
                          },
                          Title: {
                            value: "BackgroundEraser_20230413_163108635 (1)",
                          },
                          LastModifiedDate: {
                            value: "2023-05-19T13:05:29.000Z",
                          },
                          LastModifiedBy: {
                            ContactId: {
                              value: null,
                            },
                          },
                          CreatedBy: {
                            Username: {
                              value: null,
                            },
                            Name: {
                              value: "Bamboo - User",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
};

describe("mapToProjectDocumentSummaryDtoArray", () => {
  it("should map content document links to the summary", () => {
    expect(
      mapToProjectDocumentSummaryDtoArray(
        data.salesforce.uiapi.query.Acc_Project__c.edges[0].node.ContentDocumentLinks.edges,
        ["id", "fileName", "fileSize", "link", "description", "dateCreated", "uploadedBy", "isOwner"],
        {
          currentUser: (data?.currentUser as { email: string }) ?? { email: "unknown user" },
          projectId: "a0E2600000kSp3gEAC" as ProjectId,
          type: "projects",
        },
      ),
    ).toMatchSnapshot();
  });
});

describe("mapToPartnerDocumentSummaryDtoArray", () => {
  it("should map all partner linked documents into a single list if is MO", () => {
    expect(
      mapToPartnerDocumentSummaryDtoArray(
        data.salesforce.uiapi.query.Acc_ProjectParticipant__c.edges,
        [
          "partnerId",
          "id",
          "fileName",
          "fileSize",
          "description",
          "dateCreated",
          "uploadedBy",
          "link",
          "isOwner",
          "partnerName",
          "linkedEntityId",
        ],
        {
          projectId: "a0E2600000kSp3gEAC" as ProjectId,
          currentUser: {
            email: "test@testman.com",
          },
          partnerRoles: data.salesforce.uiapi.query.Acc_Project__c.edges[0].node.roles
            .partnerRoles as unknown as SfPartnerRoles[],
          currentUserRoles: { isMo: true, isFc: false, isPm: false },
        },
      ),
    ).toMatchSnapshot();
  });

  it("should show only own documents if not MO", () => {
    expect(
      mapToPartnerDocumentSummaryDtoArray(
        data.salesforce.uiapi.query.Acc_ProjectParticipant__c.edges,
        [
          "partnerId",
          "id",
          "fileName",
          "fileSize",
          "description",
          "dateCreated",
          "uploadedBy",
          "link",
          "isOwner",
          "partnerName",
          "linkedEntityId",
        ],
        {
          projectId: "a0E2600000kSp3gEAC" as ProjectId,
          currentUser: {
            email: "james.black@euimeabs.test",
          },
          partnerRoles: data.salesforce.uiapi.query.Acc_Project__c.edges[0].node.roles
            .partnerRoles as unknown as SfPartnerRoles[],
          currentUserRoles: { isMo: false, isFc: true, isPm: false },
        },
      ),
    ).toMatchSnapshot();
  });
});
