import { TestContext } from "../../server/testContextProvider";
import { SalesforceProjectRole } from "@server/repositories";
import { ProjectsStore } from "@ui/redux/stores";

const createTestData = async (context: TestContext) => {
  const testStore = context.testStore;

  const project1 = await testStore.createProject(x => {
    x.Acc_ProjectTitle__c = "project 1";
    x.Acc_LeadParticipantName__c = "Bob";
  });

  const partner1 = await testStore.createPartner(project1, x => {
    x.name = "partner 1";
    x.projectRole = SalesforceProjectRole.ProjectLead;
  });

  const project2 = await testStore.createProject(x => {
    x.Acc_ProjectTitle__c = "project 2";
    x.Acc_LeadParticipantName__c = "Barb";
  });

  const partner2 = await testStore.createPartner(project2, x => {
    x.name = "partner 2";
    x.projectRole = SalesforceProjectRole.ProjectLead;
  });
  const project3 = await testStore.createProject(x => {
    x.Acc_ProjectTitle__c = "project 3";
    x.Acc_LeadParticipantName__c = "Barnie";
  });
  const partner3 = await testStore.createPartner(project3, x => {
    x.name = "partner 3";
    x.projectRole = SalesforceProjectRole.ProjectLead;
  });

  return [
    {project: project1, partner: partner1},
    {project: project2, partner: partner2},
    {project: project3, partner: partner3},
   ];
};

describe("Projects Store", () => {
  describe("getProjectsFilter",  () => {
    it("should return a function for filtering projects",  async () => {
      const context = new TestContext();
      await createTestData(context);
      const projectsStore = new ProjectsStore(context.testStore.getState, context.testStore.dispatch);
      const projects = projectsStore.getProjectsFilter("project").data!;
      expect(projects).toHaveLength(3);
    });
    it("should filter by project name",  async () => {
      const context = new TestContext();
      const testData = await createTestData(context);
      const projectsStore = new ProjectsStore(context.testStore.getState, context.testStore.dispatch);
      const projects = projectsStore.getProjectsFilter("project 2").data!;
      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe(testData[1].project.Id);
    });
    // tslint:disable-next-line:no-identical-functions
    it("should ignore case",  async () => {
      const context = new TestContext();
      const testData = await createTestData(context);
      const projectsStore = new ProjectsStore(context.testStore.getState, context.testStore.dispatch);
      const projects = projectsStore.getProjectsFilter("PROJECT 2").data!;
      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe(testData[1].project.Id);
    });
    it("should filter by project number",  async () => {
      const context = new TestContext();
      const testData = await createTestData(context);
      const projectsStore = new ProjectsStore(context.testStore.getState, context.testStore.dispatch);
      const projects = projectsStore.getProjectsFilter(testData[2].project.Acc_ProjectNumber__c).data!;
      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe(testData[2].project.Id);
    });
    // tslint:disable-next-line:no-identical-functions
    it("should filter by lead partner name",  async () => {
      const context = new TestContext();
      const testData = await createTestData(context);
      const projectsStore = new ProjectsStore(context.testStore.getState, context.testStore.dispatch);
      const projects = projectsStore.getProjectsFilter("Bob").data!;
      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe(testData[0].project.Id);
    });
    // tslint:disable-next-line:no-identical-functions
    it("should return no results if there are no matches",  async () => {
      const context = new TestContext();
      await createTestData(context);
      const projectsStore = new ProjectsStore(context.testStore.getState, context.testStore.dispatch);
      const projects = projectsStore.getProjectsFilter("Zelda").data!;
      expect(projects).toHaveLength(0);
    });
    // tslint:disable-next-line:no-identical-functions
    it("should return all the results if no search string is passed in",  async () => {
      const context = new TestContext();
      await createTestData(context);
      const projectsStore = new ProjectsStore(context.testStore.getState, context.testStore.dispatch);
      const projects = projectsStore.getProjectsFilter("").data!;
      expect(projects).toHaveLength(3);
    });
  });
});
