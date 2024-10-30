import { mapToFullMonitoringReport, mapToMonitoringReportDtoArray } from "./mapMonitoringReportDto";

describe("mapToMonitoringReportDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "0",
        Acc_MonitoringReportStatus__c: {
          value: "Draft",
          label: "Draft label",
        },
        Acc_PeriodStartDate__c: { value: "2022-02-24" },
        Acc_PeriodEndDate__c: { value: "2022-04-24" },
        Acc_FinalMonitoringReport__c: { value: true },
        Acc_ProjectPeriodNumber__c: { value: 1 },
        LastModifiedDate: { value: "2022-04-24" },
        Acc_Project__c: { value: "1" },
      },
    },
    {
      node: {
        Id: "1",
        Acc_MonitoringReportStatus__c: {
          value: "Approved",
          label: "Approved label",
        },
        Acc_PeriodStartDate__c: { value: "2022-02-24" },
        Acc_PeriodEndDate__c: { value: "2022-04-24" },
        Acc_FinalMonitoringReport__c: { value: false },
        Acc_ProjectPeriodNumber__c: { value: 2 },
        LastModifiedDate: { value: "2022-04-24" },
        Acc_Project__c: { value: "1" },
      },
    },
    {
      node: {
        Id: "2",
        Acc_MonitoringReportStatus__c: {
          value: "Awaiting IUK Approval",
          label: "Awaiting IUK Approval label",
        },
        Acc_PeriodStartDate__c: { value: "2022-02-24" },
        Acc_PeriodEndDate__c: { value: "2022-04-24" },
        Acc_FinalMonitoringReport__c: { value: true },
        Acc_ProjectPeriodNumber__c: { value: 3 },
        LastModifiedDate: { value: "2022-04-24" },
        Acc_Project__c: { value: "1" },
      },
    },
    {
      node: {
        Id: "3",
        Acc_MonitoringReportStatus__c: null,
        Acc_PeriodStartDate__c: null,
        Acc_PeriodEndDate__c: null,
        Acc_FinalMonitoringReport__c: null,
        Acc_ProjectPeriodNumber__c: null,
        LastModifiedDate: null,
        Acc_Project__c: null,
      },
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToMonitoringReportDtoArray(edges, [
        "headerId",
        "status",
        "periodId",
        "startDate",
        "endDate",
        "statusName",
        "lastUpdated",
        "projectId",
      ]),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToMonitoringReportDtoArray(edges, ["headerId", "status", "periodId"])).toMatchSnapshot();
  });

  it("should create a full monitoring report with the mapFullMonitoringReport function", () => {
    const monitoringReportAnswers = [
      {
        node: {
          Id: "a072600000BkmTeAAJ",
          RecordType: {
            Name: {
              value: "Monitoring Answer",
            },
          },
          Acc_MonitoringHeader__c: {
            value: "a072600000Bkbc8AAB",
          },
          Acc_Question__c: {
            value: "a0926000004WYHuAAO",
          },
          Acc_QuestionComments__c: {
            value: 'we\'re on fire!\n<a href="javascript:alert(1)" class="govuk-heading-l">javascript\n<p>',
          },
          Acc_QuestionName__c: {
            value: "Scope",
          },
          Acc_MonitoringReportStatus__c: {
            value: null,
            label: null,
          },
          LastModifiedDate: {
            value: "2023-04-25T13:19:25.000Z",
          },
          Acc_Project__c: {
            value: null,
          },
          Acc_ProjectPeriodNumber__c: {
            value: null,
          },
          Acc_AddComments__c: {
            value: null,
          },
          Acc_PeriodStartDate__c: {
            value: null,
          },
          Acc_PeriodEndDate__c: {
            value: null,
          },
        },
      },
      {
        node: {
          Id: "a072600000BkvtNAAR",
          RecordType: {
            Name: {
              value: "Monitoring Answer",
            },
          },
          Acc_MonitoringHeader__c: {
            value: "a072600000Bkbc8AAB",
          },
          Acc_Question__c: {
            value: "a0926000004WYI4AAO",
          },
          Acc_QuestionComments__c: {
            value: "leo looks bemused",
          },
          Acc_QuestionName__c: {
            value: "Cost",
          },
          Acc_MonitoringReportStatus__c: {
            value: null,
            label: null,
          },
          LastModifiedDate: {
            value: "2023-04-25T13:19:25.000Z",
          },
          Acc_Project__c: {
            value: null,
          },
          Acc_ProjectPeriodNumber__c: {
            value: null,
          },
          Acc_AddComments__c: {
            value: null,
          },
          Acc_PeriodStartDate__c: {
            value: null,
          },
          Acc_PeriodEndDate__c: {
            value: null,
          },
        },
      },
      {
        node: {
          Id: "a072600000BkvniAAB",
          RecordType: {
            Name: {
              value: "Monitoring Answer",
            },
          },
          Acc_MonitoringHeader__c: {
            value: "a072600000Bkbc8AAB",
          },
          Acc_Question__c: {
            value: "a0926000004WYI0AAO",
          },
          Acc_QuestionComments__c: {
            value: null,
          },
          Acc_QuestionName__c: {
            value: "Time",
          },
          Acc_MonitoringReportStatus__c: {
            value: null,
            label: null,
          },
          LastModifiedDate: {
            value: "2023-04-25T13:19:25.000Z",
          },
          Acc_Project__c: {
            value: null,
          },
          Acc_ProjectPeriodNumber__c: {
            value: null,
          },
          Acc_AddComments__c: {
            value: null,
          },
          Acc_PeriodStartDate__c: {
            value: null,
          },
          Acc_PeriodEndDate__c: {
            value: null,
          },
        },
      },
      {
        node: {
          Id: "a072600000Bkbc8AAB",
          RecordType: {
            Name: {
              value: "Monitoring Header",
            },
          },
          Acc_MonitoringHeader__c: {
            value: null,
          },
          Acc_Question__c: {
            value: null,
          },
          Acc_QuestionComments__c: {
            value: null,
          },
          Acc_QuestionName__c: {
            value: null,
          },
          Acc_MonitoringReportStatus__c: {
            value: "Draft",
            label: "Draft",
          },
          LastModifiedDate: {
            value: "2023-04-25T13:19:25.000Z",
          },
          Acc_Project__c: {
            value: "a0E2600000o7SHyEAM",
          },
          Acc_ProjectPeriodNumber__c: {
            value: 1,
          },
          Acc_AddComments__c: {
            value: null,
          },
          Acc_PeriodStartDate__c: {
            value: "2023-04-01",
          },
          Acc_PeriodEndDate__c: {
            value: "2023-04-30",
          },
        },
      },
      {
        node: {
          Id: "a072600000BkbcDAAR",
          RecordType: {
            Name: {
              value: "Monitoring Answer",
            },
          },
          Acc_MonitoringHeader__c: {
            value: "a072600000Bkbc8AAB",
          },
          Acc_Question__c: {
            value: "a0926000004WYIMAA4",
          },
          Acc_QuestionComments__c: {
            value: null,
          },
          Acc_QuestionName__c: {
            value: "Summary",
          },
          Acc_MonitoringReportStatus__c: {
            value: null,
            label: null,
          },
          LastModifiedDate: {
            value: "2023-04-25T13:19:25.000Z",
          },
          Acc_Project__c: {
            value: null,
          },
          Acc_ProjectPeriodNumber__c: {
            value: null,
          },
          Acc_AddComments__c: {
            value: null,
          },
          Acc_PeriodStartDate__c: {
            value: null,
          },
          Acc_PeriodEndDate__c: {
            value: null,
          },
        },
      },
      {
        node: {
          Id: "a072600000BkbcEAAR",
          RecordType: {
            Name: {
              value: "Monitoring Answer",
            },
          },
          Acc_MonitoringHeader__c: {
            value: "a072600000Bkbc8AAB",
          },
          Acc_Question__c: {
            value: "a0926000004WYINAA4",
          },
          Acc_QuestionComments__c: {
            value: null,
          },
          Acc_QuestionName__c: {
            value: "Issues and actions",
          },
          Acc_MonitoringReportStatus__c: {
            value: null,
            label: null,
          },
          LastModifiedDate: {
            value: "2023-04-25T13:19:25.000Z",
          },
          Acc_Project__c: {
            value: null,
          },
          Acc_ProjectPeriodNumber__c: {
            value: null,
          },
          Acc_AddComments__c: {
            value: null,
          },
          Acc_PeriodStartDate__c: {
            value: null,
          },
          Acc_PeriodEndDate__c: {
            value: null,
          },
        },
      },
    ];

    const questions = [
      {
        description:
          "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        displayOrder: 1,
        id: "a0926000004WYHsAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHsAAO",
            questionScore: 5,
            questionText:
              "The consortium has identified opportunities, beyond those specified in it's proposal, and plans to explore these within this project",
          },
        ],
        title: "Scope",
      },
      {
        description:
          "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        displayOrder: 1,
        id: "a0926000004WYHtAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHtAAO",
            questionScore: 4,
            questionText: "The project remains on course to deliver all planned objectives",
          },
        ],
        title: "Scope",
      },
      {
        description:
          "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        displayOrder: 1,
        id: "a0926000004WYHuAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHuAAO",
            questionScore: 3,
            questionText: "There is a possibility that the project will fail to deliver on all planned objectives",
          },
        ],
        title: "Scope",
      },
      {
        description:
          "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        displayOrder: 1,
        id: "a0926000004WYHvAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHvAAO",
            questionScore: 2,
            questionText:
              "It appears highly likely that the project will fail to deliver on one or more key objectives",
          },
        ],
        title: "Scope",
      },
      {
        description:
          "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        displayOrder: 1,
        id: "a0926000004WYHwAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHwAAO",
            questionScore: 1,
            questionText: "It is certain that the project will fail to deliver on one or more key objectives",
          },
        ],
        title: "Scope",
      },
      {
        description: null,
        displayOrder: 2,
        id: "a0926000004WYHxAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHxAAO",
            questionScore: 5,
            questionText: "The project is running ahead of schedule",
          },
        ],
        title: "Time",
      },
      {
        description: null,
        displayOrder: 2,
        id: "a0926000004WYHyAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHyAAO",
            questionScore: 4,
            questionText: "The project is meeting its planned timetable",
          },
        ],
        title: "Time",
      },
      {
        description: null,
        displayOrder: 2,
        id: "a0926000004WYHzAAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYHzAAO",
            questionScore: 3,
            questionText:
              'Milestones and deliverables for the current period have been met but future ones appear to be "at risk"',
          },
        ],
        title: "Time",
      },
      {
        description: null,
        displayOrder: 2,
        id: "a0926000004WYI0AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI0AAO",
            questionScore: 2,
            questionText: "Milestones and deliverables for the current period have slipped by up to three months",
          },
        ],
        title: "Time",
      },
      {
        description: null,
        displayOrder: 2,
        id: "a0926000004WYI1AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI1AAO",
            questionScore: 1,
            questionText: "Milestones and deliverables for the current period have slipped by more than three months",
          },
        ],
        title: "Time",
      },
      {
        description: null,
        displayOrder: 3,
        id: "a0926000004WYI2AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI2AAO",
            questionScore: 5,
            questionText:
              "Under/overspend within +/- <5%. Accurate & evidenced forecasts in place across project. Expenditure is lower than expected for work done",
          },
        ],
        title: "Cost",
      },
      {
        description: null,
        displayOrder: 3,
        id: "a0926000004WYI3AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI3AAO",
            questionScore: 4,
            questionText:
              "Under/overspend within +/- 6-10%. Accurate & evidenced forecasts are in place. Expenditure is in line with planned activity and budget",
          },
        ],
        title: "Cost",
      },
      {
        description: null,
        displayOrder: 3,
        id: "a0926000004WYI4AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI4AAO",
            questionScore: 3,
            questionText:
              "Under/overspend within +/- 11-15%. Expenditure not commensurate with progress in some instances. Limited forecast evidence",
          },
        ],
        title: "Cost",
      },
      {
        description: null,
        displayOrder: 3,
        id: "a0926000004WYI5AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI5AAO",
            questionScore: 2,
            questionText:
              "Under/overspend within +/- 16-20%. Expenditure is not commensurate with progress. Forecasts not updated properly, and significantly inaccurate",
          },
        ],
        title: "Cost",
      },
      {
        description: null,
        displayOrder: 3,
        id: "a0926000004WYI6AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI6AAO",
            questionScore: 1,
            questionText:
              "Under/overspend +/- >21%. Expenditure is routinely not commensurate with progress. Forecasts not updated, and routinely inaccurate",
          },
        ],
        title: "Cost",
      },
      {
        description: null,
        displayOrder: 4,
        id: "a0926000004WYI7AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI7AAO",
            questionScore: 5,
            questionText: "Exceeding expectations",
          },
        ],
        title: "Exploitation",
      },
      {
        description: null,
        displayOrder: 4,
        id: "a0926000004WYI8AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI8AAO",
            questionScore: 4,
            questionText: "Good",
          },
        ],
        title: "Exploitation",
      },
      {
        description: null,
        displayOrder: 4,
        id: "a0926000004WYI9AAO",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYI9AAO",
            questionScore: 3,
            questionText: "Scope for improvement",
          },
        ],
        title: "Exploitation",
      },
      {
        description: null,
        displayOrder: 4,
        id: "a0926000004WYIAAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIAAA4",
            questionScore: 2,
            questionText: "Very poor",
          },
        ],
        title: "Exploitation",
      },
      {
        description: null,
        displayOrder: 4,
        id: "a0926000004WYIBAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIBAA4",
            questionScore: 1,
            questionText: "Unacceptable",
          },
        ],
        title: "Exploitation",
      },
      {
        description: null,
        displayOrder: 5,
        id: "a0926000004WYICAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYICAA4",
            questionScore: 5,
            questionText: "Exceeding expectations",
          },
        ],
        title: "Risk management",
      },
      {
        description: null,
        displayOrder: 5,
        id: "a0926000004WYIDAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIDAA4",
            questionScore: 4,
            questionText: "Good practice",
          },
        ],
        title: "Risk management",
      },
      {
        description: null,
        displayOrder: 5,
        id: "a0926000004WYIEAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIEAA4",
            questionScore: 3,
            questionText: "Scope for improvement",
          },
        ],
        title: "Risk management",
      },
      {
        description: null,
        displayOrder: 5,
        id: "a0926000004WYIFAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIFAA4",
            questionScore: 2,
            questionText: "Very poor",
          },
        ],
        title: "Risk management",
      },
      {
        description: null,
        displayOrder: 5,
        id: "a0926000004WYIGAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIGAA4",
            questionScore: 1,
            questionText: "Unacceptable",
          },
        ],
        title: "Risk management",
      },
      {
        description: null,
        displayOrder: 6,
        id: "a0926000004WYIHAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIHAA4",
            questionScore: 5,
            questionText: "Exceeding expectations",
          },
        ],
        title: "Project planning",
      },
      {
        description: null,
        displayOrder: 6,
        id: "a0926000004WYIIAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIIAA4",
            questionScore: 4,
            questionText: "Good",
          },
        ],
        title: "Project planning",
      },
      {
        description: null,
        displayOrder: 6,
        id: "a0926000004WYIJAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIJAA4",
            questionScore: 3,
            questionText: "Scope for improvement",
          },
        ],
        title: "Project planning",
      },
      {
        description: null,
        displayOrder: 6,
        id: "a0926000004WYIKAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYIKAA4",
            questionScore: 2,
            questionText: "Very poor",
          },
        ],
        title: "Project planning",
      },
      {
        description: null,
        displayOrder: 6,
        id: "a0926000004WYILAA4",
        isActive: true,
        isScored: true,
        options: [
          {
            id: "a0926000004WYILAA4",
            questionScore: 1,
            questionText: "Unacceptable",
          },
        ],
        title: "Project planning",
      },
      {
        description: "Please summarise the project's key achievements and the key issues and risks that it faces.",
        displayOrder: 7,
        id: "a0926000004WYIMAA4",
        isActive: true,
        isScored: false,
        options: [
          {
            id: "a0926000004WYIMAA4",
            questionScore: 0,
            questionText: "unknown question",
          },
        ],
        title: "Summary",
      },
      {
        description:
          "Please confirm any specific issues that require Technology Strategy Board intervention - e.g. apparent scope change, partner changes, budget virements or time extensions.",
        displayOrder: 8,
        id: "a0926000004WYINAA4",
        isActive: true,
        isScored: false,
        options: [
          {
            id: "a0926000004WYINAA4",
            questionScore: 0,
            questionText: "unknown question",
          },
        ],
        title: "Issues and actions",
      },
    ];

    expect(
      mapToFullMonitoringReport(
        monitoringReportAnswers,
        [
          "headerId",
          "endDate",
          "lastUpdated",
          "periodId",
          "startDate",
          "statusName",
          "projectId",
          "status",
          "addComments",
          "questions",
        ],
        {
          questions,
        },
      ),
    ).toMatchSnapshot();
  });
});
