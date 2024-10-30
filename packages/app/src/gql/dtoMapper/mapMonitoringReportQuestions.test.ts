import { mapToMonitoringReportQuestionDtoArray } from "./mapMonitoringReportQuestions";

describe("mapToMonitoringReportQuestionsDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "a0926000004WYHsAAO",
        Acc_QuestionName__c: {
          value: "Scope",
        },
        Acc_DisplayOrder__c: {
          value: 1,
        },
        Acc_QuestionScore__c: {
          value: 5,
        },
        Acc_QuestionText__c: {
          value:
            "The consortium has identified opportunities, beyond those specified in it's proposal, and plans to explore these within this project",
        },
        Acc_QuestionDescription__c: {
          value:
            "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYHtAAO",
        Acc_QuestionName__c: {
          value: "Scope",
        },
        Acc_DisplayOrder__c: {
          value: 1,
        },
        Acc_QuestionScore__c: {
          value: 4,
        },
        Acc_QuestionText__c: {
          value: "The project remains on course to deliver all planned objectives",
        },
        Acc_QuestionDescription__c: {
          value:
            "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYHuAAO",
        Acc_QuestionName__c: {
          value: "Scope",
        },
        Acc_DisplayOrder__c: {
          value: 1,
        },
        Acc_QuestionScore__c: {
          value: 3,
        },
        Acc_QuestionText__c: {
          value: "There is a possibility that the project will fail to deliver on all planned objectives",
        },
        Acc_QuestionDescription__c: {
          value:
            "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYHvAAO",
        Acc_QuestionName__c: {
          value: "Scope",
        },
        Acc_DisplayOrder__c: {
          value: 1,
        },
        Acc_QuestionScore__c: {
          value: 2,
        },
        Acc_QuestionText__c: {
          value: "It appears highly likely that the project will fail to deliver on one or more key objectives",
        },
        Acc_QuestionDescription__c: {
          value:
            "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYHwAAO",
        Acc_QuestionName__c: {
          value: "Scope",
        },
        Acc_DisplayOrder__c: {
          value: 1,
        },
        Acc_QuestionScore__c: {
          value: 1,
        },
        Acc_QuestionText__c: {
          value: "It is certain that the project will fail to deliver on one or more key objectives",
        },
        Acc_QuestionDescription__c: {
          value:
            "For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.",
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYHxAAO",
        Acc_QuestionName__c: {
          value: "Time",
        },
        Acc_DisplayOrder__c: {
          value: 2,
        },
        Acc_QuestionScore__c: {
          value: 5,
        },
        Acc_QuestionText__c: {
          value: "The project is running ahead of schedule",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYHyAAO",
        Acc_QuestionName__c: {
          value: "Time",
        },
        Acc_DisplayOrder__c: {
          value: 2,
        },
        Acc_QuestionScore__c: {
          value: 4,
        },
        Acc_QuestionText__c: {
          value: "The project is meeting its planned timetable",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYHzAAO",
        Acc_QuestionName__c: {
          value: "Time",
        },
        Acc_DisplayOrder__c: {
          value: 2,
        },
        Acc_QuestionScore__c: {
          value: 3,
        },
        Acc_QuestionText__c: {
          value:
            'Milestones and deliverables for the current period have been met but future ones appear to be "at risk"',
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI0AAO",
        Acc_QuestionName__c: {
          value: "Time",
        },
        Acc_DisplayOrder__c: {
          value: 2,
        },
        Acc_QuestionScore__c: {
          value: 2,
        },
        Acc_QuestionText__c: {
          value: "Milestones and deliverables for the current period have slipped by up to three months",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI1AAO",
        Acc_QuestionName__c: {
          value: "Time",
        },
        Acc_DisplayOrder__c: {
          value: 2,
        },
        Acc_QuestionScore__c: {
          value: 1,
        },
        Acc_QuestionText__c: {
          value: "Milestones and deliverables for the current period have slipped by more than three months",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI2AAO",
        Acc_QuestionName__c: {
          value: "Cost",
        },
        Acc_DisplayOrder__c: {
          value: 3,
        },
        Acc_QuestionScore__c: {
          value: 5,
        },
        Acc_QuestionText__c: {
          value:
            "Under/overspend within +/- <5%. Accurate & evidenced forecasts in place across project. Expenditure is lower than expected for work done",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI3AAO",
        Acc_QuestionName__c: {
          value: "Cost",
        },
        Acc_DisplayOrder__c: {
          value: 3,
        },
        Acc_QuestionScore__c: {
          value: 4,
        },
        Acc_QuestionText__c: {
          value:
            "Under/overspend within +/- 6-10%. Accurate & evidenced forecasts are in place. Expenditure is in line with planned activity and budget",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI4AAO",
        Acc_QuestionName__c: {
          value: "Cost",
        },
        Acc_DisplayOrder__c: {
          value: 3,
        },
        Acc_QuestionScore__c: {
          value: 3,
        },
        Acc_QuestionText__c: {
          value:
            "Under/overspend within +/- 11-15%. Expenditure not commensurate with progress in some instances. Limited forecast evidence",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI5AAO",
        Acc_QuestionName__c: {
          value: "Cost",
        },
        Acc_DisplayOrder__c: {
          value: 3,
        },
        Acc_QuestionScore__c: {
          value: 2,
        },
        Acc_QuestionText__c: {
          value:
            "Under/overspend within +/- 16-20%. Expenditure is not commensurate with progress. Forecasts not updated properly, and significantly inaccurate",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI6AAO",
        Acc_QuestionName__c: {
          value: "Cost",
        },
        Acc_DisplayOrder__c: {
          value: 3,
        },
        Acc_QuestionScore__c: {
          value: 1,
        },
        Acc_QuestionText__c: {
          value:
            "Under/overspend +/- >21%. Expenditure is routinely not commensurate with progress. Forecasts not updated, and routinely inaccurate",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI7AAO",
        Acc_QuestionName__c: {
          value: "Exploitation",
        },
        Acc_DisplayOrder__c: {
          value: 4,
        },
        Acc_QuestionScore__c: {
          value: 5,
        },
        Acc_QuestionText__c: {
          value: "Exceeding expectations",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI8AAO",
        Acc_QuestionName__c: {
          value: "Exploitation",
        },
        Acc_DisplayOrder__c: {
          value: 4,
        },
        Acc_QuestionScore__c: {
          value: 4,
        },
        Acc_QuestionText__c: {
          value: "Good",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYI9AAO",
        Acc_QuestionName__c: {
          value: "Exploitation",
        },
        Acc_DisplayOrder__c: {
          value: 4,
        },
        Acc_QuestionScore__c: {
          value: 3,
        },
        Acc_QuestionText__c: {
          value: "Scope for improvement",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIAAA4",
        Acc_QuestionName__c: {
          value: "Exploitation",
        },
        Acc_DisplayOrder__c: {
          value: 4,
        },
        Acc_QuestionScore__c: {
          value: 2,
        },
        Acc_QuestionText__c: {
          value: "Very poor",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIBAA4",
        Acc_QuestionName__c: {
          value: "Exploitation",
        },
        Acc_DisplayOrder__c: {
          value: 4,
        },
        Acc_QuestionScore__c: {
          value: 1,
        },
        Acc_QuestionText__c: {
          value: "Unacceptable",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYICAA4",
        Acc_QuestionName__c: {
          value: "Risk management",
        },
        Acc_DisplayOrder__c: {
          value: 5,
        },
        Acc_QuestionScore__c: {
          value: 5,
        },
        Acc_QuestionText__c: {
          value: "Exceeding expectations",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIDAA4",
        Acc_QuestionName__c: {
          value: "Risk management",
        },
        Acc_DisplayOrder__c: {
          value: 5,
        },
        Acc_QuestionScore__c: {
          value: 4,
        },
        Acc_QuestionText__c: {
          value: "Good practice",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIEAA4",
        Acc_QuestionName__c: {
          value: "Risk management",
        },
        Acc_DisplayOrder__c: {
          value: 5,
        },
        Acc_QuestionScore__c: {
          value: 3,
        },
        Acc_QuestionText__c: {
          value: "Scope for improvement",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIFAA4",
        Acc_QuestionName__c: {
          value: "Risk management",
        },
        Acc_DisplayOrder__c: {
          value: 5,
        },
        Acc_QuestionScore__c: {
          value: 2,
        },
        Acc_QuestionText__c: {
          value: "Very poor",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIGAA4",
        Acc_QuestionName__c: {
          value: "Risk management",
        },
        Acc_DisplayOrder__c: {
          value: 5,
        },
        Acc_QuestionScore__c: {
          value: 1,
        },
        Acc_QuestionText__c: {
          value: "Unacceptable",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIHAA4",
        Acc_QuestionName__c: {
          value: "Project planning",
        },
        Acc_DisplayOrder__c: {
          value: 6,
        },
        Acc_QuestionScore__c: {
          value: 5,
        },
        Acc_QuestionText__c: {
          value: "Exceeding expectations",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIIAA4",
        Acc_QuestionName__c: {
          value: "Project planning",
        },
        Acc_DisplayOrder__c: {
          value: 6,
        },
        Acc_QuestionScore__c: {
          value: 4,
        },
        Acc_QuestionText__c: {
          value: "Good",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIJAA4",
        Acc_QuestionName__c: {
          value: "Project planning",
        },
        Acc_DisplayOrder__c: {
          value: 6,
        },
        Acc_QuestionScore__c: {
          value: 3,
        },
        Acc_QuestionText__c: {
          value: "Scope for improvement",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIKAA4",
        Acc_QuestionName__c: {
          value: "Project planning",
        },
        Acc_DisplayOrder__c: {
          value: 6,
        },
        Acc_QuestionScore__c: {
          value: 2,
        },
        Acc_QuestionText__c: {
          value: "Very poor",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYILAA4",
        Acc_QuestionName__c: {
          value: "Project planning",
        },
        Acc_DisplayOrder__c: {
          value: 6,
        },
        Acc_QuestionScore__c: {
          value: 1,
        },
        Acc_QuestionText__c: {
          value: "Unacceptable",
        },
        Acc_QuestionDescription__c: {
          value: null,
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: true,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYIMAA4",
        Acc_QuestionName__c: {
          value: "Summary",
        },
        Acc_DisplayOrder__c: {
          value: 7,
        },
        Acc_QuestionScore__c: {
          value: null,
        },
        Acc_QuestionText__c: {
          value: null,
        },
        Acc_QuestionDescription__c: {
          value: "Please summarise the project's key achievements and the key issues and risks that it faces.",
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: false,
        },
      },
    },
    {
      node: {
        Id: "a0926000004WYINAA4",
        Acc_QuestionName__c: {
          value: "Issues and actions",
        },
        Acc_DisplayOrder__c: {
          value: 8,
        },
        Acc_QuestionScore__c: {
          value: null,
        },
        Acc_QuestionText__c: {
          value: null,
        },
        Acc_QuestionDescription__c: {
          value:
            "Please confirm any specific issues that require Technology Strategy Board intervention - e.g. apparent scope change, partner changes, budget virements or time extensions.",
        },
        Acc_ActiveFlag__c: {
          value: true,
        },
        Acc_ScoredQuestion__c: {
          value: false,
        },
      },
    },
  ];

  it("should map the gql data to the correct Dtos", () => {
    expect(
      mapToMonitoringReportQuestionDtoArray(edges, [
        "description",
        "displayOrder",
        "isScored",
        "options",
        "title",
        "isActive",
        "id",
      ]),
    ).toMatchSnapshot();
  });
});
