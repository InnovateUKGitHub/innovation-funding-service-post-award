// tslint:disable:no-duplicate-string no-big-function
import { TestContext } from "../../testContextProvider";
import { SaveMonitoringReport } from "../../../../src/server/features/monitoringReports/saveMonitoringReport";
import { ValidationError } from "../../../../src/server/features/common";
import { MonitoringReportDto } from "../../../../src/types/dtos/monitoringReportDto";
import { MonitoringReportStatus } from "../../../../src/types/constants/monitoringReportStatus";

const response: MonitoringReportDto = {
  headerId: "H1",
  endDate: new Date(),
  startDate: new Date(),
  projectId: "P1",
  periodId: 1,
  status: MonitoringReportStatus.DRAFT,
  questions: [{
    comments: "Comment the first",
    optionId: "QuestionId: 2",
    displayOrder: 1,
    title: "Scones?",
    options: [{
      id: "QuestionId: 1",
      questionText: "A",
      questionScore: 1
    }, {
      id: "QuestionId: 2",
      questionText: "B",
      questionScore: 2
    }, {
      id: "QuestionId: 3",
      questionText: "C",
      questionScore: 3
    }]
  }, {
    comments: "Comment the second",
    optionId: "QuestionId: 6",
    displayOrder: 2,
    title: "Crumpets?",
    options: [{
      id: "QuestionId: 4",
      questionText: "A",
      questionScore: 1
    }, {
      id: "QuestionId: 5",
      questionText: "B",
      questionScore: 2
    }, {
      id: "QuestionId: 6",
      questionText: "C",
      questionScore: 3
    }]
  }, {
    comments: null,
    optionId: null,
    displayOrder: 3,
    title: "Tea?",
    options: [{
      id: "QuestionId: 7",
      questionText: "A",
      questionScore: 1
    }, {
      id: "QuestionId: 8",
      questionText: "B",
      questionScore: 2
    }, {
      id: "QuestionId: 9",
      questionText: "C",
      questionScore: 3
    }]
  }]
} as MonitoringReportDto;

const saveResponse = async (context: TestContext, saveThis: MonitoringReportDto, submit: boolean, numberOfQuestions: number = 4) => {
  context.testData.createMonitoringReportHeader(saveThis.headerId, "P1", 1);
  for (let i = 0; i < numberOfQuestions; i++) {
    context.testData.createQuestion(3, i + 1);
  }
  const command = new SaveMonitoringReport(saveThis, submit);
  await context.runCommand(command);
  return await context.repositories.monitoringReportResponse.getAllForHeader(saveThis.headerId);
};

describe("saveMonitoringReports", () => {

  it("should not save responses without an option id", async () => {
    const context = new TestContext();
    const responses = await saveResponse(context, response, false);
    expect(responses.find(x => x.Acc_Question__c === "QuestionId: 7")).toBeUndefined();
    expect(responses.find(x => x.Acc_Question__c === "QuestionId: 8")).toBeUndefined();
    expect(responses.find(x => x.Acc_Question__c === "QuestionId: 9")).toBeUndefined();
  });

  it("should save all new responses", async () => {
    const context = new TestContext();
    const responses = await saveResponse(context, response, false);
    expect(responses).toHaveLength(2);
    const resp1 = responses.find(x => x.Acc_Question__c === "QuestionId: 2")!;
    const resp2 = responses.find(x => x.Acc_Question__c === "QuestionId: 6")!;
    expect(resp1.Acc_QuestionComments__c).toBe("Comment the first");
    expect(resp2.Acc_QuestionComments__c).toBe("Comment the second");
  });

  it("should update existing responses", async () => {
    const context = new TestContext();
    const resp = await saveResponse(context, response, false);
    const update = {
      headerId: "H1",
      endDate: new Date(),
      startDate: new Date(),
      projectId: "P1",
      periodId: 1,
      status: MonitoringReportStatus.DRAFT,
      questions: [{
        comments: "Comment the first update",
        optionId: "QuestionId: 3",
        displayOrder: 1,
        responseId: resp[0].Id,
        title: "Scones?",
        options: [{
          id: "QuestionId: 1",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 2",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 3",
          questionText: "C",
          questionScore: 3
        }]
      }, {
        comments: "Comment the second update",
        optionId: "QuestionId: 4",
        responseId: resp[1].Id,
        displayOrder: 2,
        title: "Crumpets?",
        options: [{
          id: "QuestionId: 4",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 5",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 6",
          questionText: "C",
          questionScore: 3
        }]
      }]
    } as MonitoringReportDto;
    const responses = await saveResponse(context, update, false);
    expect(responses).toHaveLength(2);
    const resp1 = responses.find(x => x.Acc_Question__c === "QuestionId: 3")!;
    const resp2 = responses.find(x => x.Acc_Question__c === "QuestionId: 4")!;
    expect(resp1.Acc_QuestionComments__c).toBe("Comment the first update");
    expect(resp2.Acc_QuestionComments__c).toBe("Comment the second update");
  });

  it("should remove ommitted responses", async () => {
    const context = new TestContext();
    const resp = await saveResponse(context, response, false);
    const update = {
      headerId: "H1",
      endDate: new Date(),
      startDate: new Date(),
      projectId: "P1",
      periodId: 1,
      status: MonitoringReportStatus.DRAFT,
      questions: [{
        comments: "Comment the second update",
        optionId: "QuestionId: 4",
        displayOrder: 2,
        responseId: resp[0].Id,
        title: "Crumpets?",
        options: [{
          id: "QuestionId: 4",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 5",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 6",
          questionText: "C",
          questionScore: 3
        }]
      }]
    } as MonitoringReportDto;
    const responses = await saveResponse(context, update, false);
    expect(responses).toHaveLength(1);
  });

  it("should not change the report status from draft if it has not been submitted", async () => {
    const context = new TestContext();
    await saveResponse(context, response, false);
    const header = await context.repositories.monitoringReportHeader.get(response.projectId, response.periodId);
    expect(header.Acc_MonitoringReportStatus__c).toBe(MonitoringReportStatus.DRAFT);
  });

  it("should save the report with submitted status if it is submitted", async () => {
    const context = new TestContext();
    const submit = {
      headerId: "H1",
      endDate: new Date(),
      startDate: new Date(),
      projectId: "P1",
      periodId: 1,
      status: MonitoringReportStatus.DRAFT,
      questions: [{
        comments: "Comment the first",
        optionId: "QuestionId: 2",
        displayOrder: 1,
        title: "Scones?",
        options: [{
          id: "QuestionId: 1",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 2",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 3",
          questionText: "C",
          questionScore: 3
        }]
      }]
    } as MonitoringReportDto;
    await saveResponse(context, submit, true, 1);
    const header = await context.repositories.monitoringReportHeader.get(response.projectId, response.periodId);
    expect(header.Acc_MonitoringReportStatus__c).toBe(MonitoringReportStatus.SUBMITTED);
  });
});

describe("saveMonitoringReports validation", () => {
  it("should throw a validation error if the report has already been submitted", async () => {
    const context = new TestContext();
    const submit = {
      headerId: "H1",
      endDate: new Date(),
      startDate: new Date(),
      projectId: "P1",
      periodId: 1,
      status: MonitoringReportStatus.DRAFT,
      questions: [{
        comments: "Comment the first",
        optionId: "QuestionId: 2",
        displayOrder: 1,
        title: "Scones?",
        options: [{
          id: "QuestionId: 1",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 2",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 3",
          questionText: "C",
          questionScore: 3
        }]
      }]
    } as MonitoringReportDto;
    await saveResponse(context, submit, true, 1);
    const command = new SaveMonitoringReport(submit, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should return a validation error if an invalid option is selected", async () => {
    const context = new TestContext();
    const update = {
      headerId: "H1",
      endDate: new Date(),
      startDate: new Date(),
      projectId: "P1",
      periodId: 1,
      status: MonitoringReportStatus.DRAFT,
      questions: [{
        comments: "Comment the second update",
        optionId: "notathing",
        displayOrder: 2,
        title: "Crumpets?",
        options: [{
          id: "QuestionId: 4",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 5",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 6",
          questionText: "C",
          questionScore: 3
        }]
      }]
    } as MonitoringReportDto;
    await expect(saveResponse(context, update, false)).rejects.toThrow(ValidationError);
    expect(await context.repositories.monitoringReportResponse.getAllForHeader(update.headerId)).toHaveLength(0);
  });
  it("should return a validation error if submitted and there are scores missing", async () => {
    const context = new TestContext();
    const submit = {
      headerId: "H1",
      endDate: new Date(),
      startDate: new Date(),
      projectId: "P1",
      periodId: 1,
      status: MonitoringReportStatus.DRAFT,
      questions: [{
        comments: "Comment the first",
        optionId: "QuestionId: 2",
        displayOrder: 1,
        title: "Scones?",
        options: [{
          id: "QuestionId: 1",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 2",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 3",
          questionText: "C",
          questionScore: 3
        }]
      }]
    } as MonitoringReportDto;
    await expect(saveResponse(context, submit, true)).rejects.toThrow(ValidationError);
  });

  it("should return a validation error if submitted and with a comment without a score", async () => {
    const context = new TestContext();
    const update = {
      headerId: "H1",
      endDate: new Date(),
      startDate: new Date(),
      projectId: "P1",
      periodId: 1,
      status: MonitoringReportStatus.DRAFT,
      questions: [{
        comments: "Comment the second update",
        title: "Crumpets?",
        displayOrder: 2,
        options: [{
          id: "QuestionId: 4",
          questionText: "A",
          questionScore: 1
        }, {
          id: "QuestionId: 5",
          questionText: "B",
          questionScore: 2
        }, {
          id: "QuestionId: 6",
          questionText: "C",
          questionScore: 3
        }]
      }]
    } as MonitoringReportDto;
    await expect(saveResponse(context, update, false)).rejects.toThrow(ValidationError);
    expect(await context.repositories.monitoringReportResponse.getAllForHeader(update.headerId)).toHaveLength(0);
  });
});
