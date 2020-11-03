// tslint:disable: no-duplicate-string

import { Authorisation, ProjectRole } from "@framework/types";

describe("authorisation", () => {

  const roles = {
    Project1: {
      projectRoles: ProjectRole.FinancialContact,
      partnerRoles: {
        Partner1A: ProjectRole.FinancialContact
      }
    },
    Project2: {
      projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer,
      partnerRoles: {
        Partner2A: ProjectRole.FinancialContact,
        Partner2B: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer
      }
    }
  };

  const auth = new Authorisation(roles);

  describe("getRoles for project", () => {
    it("when project not found returns Unknown", async () => {
      expect(auth.forProject("ProjectX").getRoles()).toBe(ProjectRole.Unknown);
    });

    it("when project found returns correct role", async () => {
      expect(auth.forProject("Project2").getRoles()).toBe(roles.Project2.projectRoles);
    });
  });

  describe("getRoles for partner", () => {
    it("when project not found returns Unknown", async () => {
      expect(auth.forPartner("ProjectX", "Partner2A").getRoles()).toBe(ProjectRole.Unknown);
    });

    it("when partner not found returns Unknown", async () => {
      expect(auth.forPartner("Project2", "PartnerX").getRoles()).toBe(ProjectRole.Unknown);
    });

    it("when partner found returns correct role", async () => {
      expect(auth.forPartner("Project2", "Partner2A").getRoles()).toBe(roles.Project2.partnerRoles.Partner2A);
    });
  });

  describe("hasRole for project", () => {
    it("when project not found returns false", async () => {
      expect(auth.forProject("ProjectX").hasRole(ProjectRole.FinancialContact)).toBe(false);
    });

    it("when project found but not role returns false", async () => {
      expect(auth.forProject("Project1").hasRole(ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found and role found returns true", async () => {
      expect(auth.forProject("Project1").hasRole(ProjectRole.FinancialContact)).toBe(true);
    });

    it("when project found and role one of many returns true", async () => {
      expect(auth.forProject("Project2").hasRole(ProjectRole.MonitoringOfficer)).toBe(true);
    });
  });

  describe("hasAllRoles for project", () => {
    it("when project not found returns false", async () => {
      expect(auth.forProject("ProjectX").hasAllRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found but not all roles found returns false", async () => {
      expect(auth.forProject("Project1").hasAllRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found and all roles found returns true", async () => {
      expect(auth.forProject("Project2").hasAllRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });
  });

  describe("hasAnyRoles for project", () => {
    it("when project not found returns false", async () => {
      expect(auth.forProject("ProjectX").hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found and one roles found returns true", async () => {
      expect(auth.forProject("Project1").hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager)).toBe(true);
    });

    it("when project found and all roles found returns true", async () => {
      expect(auth.forProject("Project2").hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });

    it("when project found and no roles found returns false", async () => {
      expect(auth.forProject("Project1").hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager)).toBe(false);
    });
  });

  describe("hasOnlyRole for project", () => {
    it("when project not found returns false", async () => {
      expect(auth.forProject("ProjectX").hasOnlyRole(ProjectRole.FinancialContact)).toBe(false);
    });

    it("when project found and has only role returns true", async () => {
      expect(auth.forProject("Project1").hasOnlyRole(ProjectRole.FinancialContact)).toBe(true);
    });

    it("when project found and has other roles as well returns false", async () => {
      expect(auth.forProject("Project2").hasOnlyRole(ProjectRole.FinancialContact)).toBe(false);
    });

  });

  describe("hasRole for partner", () => {
    it("when project not found returns false", async () => {
      expect(auth.forPartner("ProjectX", "Partner1A").hasRole(ProjectRole.FinancialContact)).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(auth.forPartner("Project1", "PartnerX").hasRole(ProjectRole.FinancialContact)).toBe(false);
    });

    it("when partner found and role not found returns false", async () => {
      expect(auth.forPartner("Project1", "Partner1A").hasRole(ProjectRole.ProjectManager)).toBe(false);
    });

    it("when partner found and role found returns true", async () => {
      expect(auth.forPartner("Project1", "Partner1A").hasRole(ProjectRole.FinancialContact)).toBe(true);
    });
  });

  describe("hasAllRoles for partner", () => {
    it("when project not found returns false", async () => {
      expect(auth.forPartner("ProjectX", "Partner1A").hasAllRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(auth.forPartner("Project1", "PartnerX").hasAllRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner found and roles not all found returns false", async () => {
      expect(auth.forPartner("Project2", "Partner2A").hasAllRoles(ProjectRole.FinancialContact, 32)).toBe(false);
    });

    it("when partner found and roles all found not returns true", async () => {
      expect(auth.forPartner("Project2", "Partner2B").hasAllRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });
  });

  describe("hasAnyRoles for partner", () => {
    it("when project not found returns false", async () => {
      expect(auth.forPartner("ProjectX", "Partner1A").hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(auth.forPartner("Project1", "PartnerX").hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner found and roles not all found returns true", async () => {
      expect(auth.forPartner("Project2", "Partner2A").hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });

    it("when partner found and role all found returns true", async () => {
      expect(auth.forPartner("Project2", "Partner2B").hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });

    it("when partner found and no roles found returns false", async () => {
      expect(auth.forPartner("Project2", "Partner2A").hasAnyRoles(ProjectRole.ProjectManager)).toBe(false);
    });
  });

  describe("hasOnlyRole for partner", () => {
    it("when project not found returns false", async () => {
      expect(auth.forPartner("ProjectX", "Partner1A").hasOnlyRole(ProjectRole.FinancialContact)).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(auth.forPartner("Project1", "Partner2A").hasOnlyRole(ProjectRole.FinancialContact)).toBe(false);
    });

    it("when partner found and has only role returns true", async () => {
      expect(auth.forPartner("Project1", "Partner1A").hasOnlyRole(ProjectRole.FinancialContact)).toBe(true);
    });

    it("when partner found and has other roles as well returns false", async () => {
      expect(auth.forPartner("Project2", "Partner2B").hasOnlyRole(ProjectRole.FinancialContact)).toBe(false);
    });

  });

});
