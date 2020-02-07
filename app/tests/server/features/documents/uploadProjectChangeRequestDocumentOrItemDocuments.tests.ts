// tslint:disable: no-identical-functions no-duplicate-string
import * as Entites from "@framework/entities";
import { Authorisation, ProjectRole } from "@framework/types";
import { ValidationError } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { TestContext } from "../../testContextProvider";

describe("UploadProjectChangeRequestDocumentOrItemDocumentCommand", () => {
  it("should upload a project change request item document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const file = context.testData.createFile("This is some content", "testFile.txt");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files: [file]});
    const documentIds = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentIds[0]);

    expect(document.VersionData).toEqual("This is some content");
    expect(document.PathOnClient).toEqual("testFile.txt");
  });

  it("should upload a project change request document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);

    const file = context.testData.createFile("This is some content", "testFile.txt");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequest.id, {files: [file]});
    const documentIds = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentIds[0]);

    expect(document.VersionData).toEqual("This is some content");
    expect(document.PathOnClient).toEqual("testFile.txt");
  });

  it("should throw a validation error if the file type is not allowed", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);

    const file = context.testData.createFile("This is some content", "testFile.zip");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequest.id, {files: [file]});
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should upload multiple item documents", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const files = context.testData.range(5, (i) => context.testData.createFile(`File content ${i}`, `File name ${i}`));

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files});
    const documentIds = await context.runCommand(command);
    expect(documentIds.length).toBe(5);

    const documents = await Promise.all(documentIds.map(x => context.repositories.documents.getDocumentMetadata(x)));
    expect(documents.map(x => x.VersionData)).toEqual(files.map(f => f.content));
    expect(documents.map(x => x.PathOnClient)).toEqual(files.map(f => f.fileName));
  });

  it("should throw validation error if the file has no content", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const file = context.testData.createFile("", "testFile.txt");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files: [file]});
    const result = context.runCommand(command);

    await expect(result).rejects.toThrow(ValidationError);
  });

  it("should throw validation error if the file content is too large", async () => {
    const context = new TestContext();
    context.config.maxFileSize = 10;
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const tooLargeFileContent = new Array(context.config.maxFileSize + 1).fill("a").join("");

    const file = context.testData.createFile(tooLargeFileContent, "testFile.txt");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files: [file]});
    const result = context.runCommand(command);

    await expect(result).rejects.toThrow(ValidationError);
  });

  it("should throw validation error if too many files are uploaded", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const files = context.testData.range(context.config.maxUploadFileCount + 1, (i) => context.testData.createFile(`File content ${i}`, `File name ${i}`));

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files});
    const result = context.runCommand(command);

    await expect(result).rejects.toThrow(ValidationError);
  });

  it("should throw validation error if the file has no name", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const file = context.testData.createFile("Test file content", "");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files: [file]});
    const result = context.runCommand(command);

    await expect(result).rejects.toThrow(ValidationError);
  });

  it("should throw validation error if there are no files to upload", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files: []});
    const result = context.runCommand(command);

    await expect(result).rejects.toThrow(ValidationError);
  });
});

describe("Access control", () => {
  it("Project manager should run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const file = context.testData.createFile("This is some content", "testFile.txt");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files: [file]});

    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.ProjectManager,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  it("Other roles should not run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "recordType_1",
      parent: projectChangeRequest.id,
      type: "Scope change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const file = context.testData.createFile("This is some content", "testFile.txt");

    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(project.Id, projectChangeRequestItem.id, {files: [file]});

    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.MonitoringOfficer | ProjectRole.FinancialContact,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
