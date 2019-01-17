// tslint:disable: no-duplicate-string
import "jest";
import { Authorisation, ProjectRole } from "../../src/types";

describe("authorisation", () => {

  const roles = {
    Project1: {
      projectRoles: ProjectRole.FinancialContact,
      partnerRoles: {
        Partner1A : ProjectRole.FinancialContact
      }
    },
    Project2: {
      projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer,
      partnerRoles: {
        Partner2A : ProjectRole.FinancialContact,
        Partner2B : ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer
      }
    }
  };

  const auth = new Authorisation(roles);

  describe("GetProjectRoles", () => {
    it("when project not found returns Unknown", async () => {
      expect(auth.getProjectRoles("ProjectX")).toBe(ProjectRole.Unknown);
    });

    it("when project found returns correct role", async () => {
      expect(auth.getProjectRoles("Project2")).toBe(roles.Project2.projectRoles);
    });
  });

  describe("GetPartnerRoles", () => {
    it("when project not found returns Unknown", async () => {
      expect(auth.getPartnerRoles("ProjectX", "Partner2A")).toBe(ProjectRole.Unknown);
    });

    it("when partner not found returns Unknown", async () => {
      expect(auth.getPartnerRoles("Project2", "PartnerX")).toBe(ProjectRole.Unknown);
    });

    it("when partner found returns correct role", async () => {
      expect(auth.getPartnerRoles("Project2", "Partner2A")).toBe(roles.Project2.partnerRoles.Partner2A);
    });
  });

  describe("HasProjectRole", () => {
    it("when project not found returns false", async () => {
      expect(auth.hasProjectRole("ProjectX", ProjectRole.FinancialContact)).toBe(false);
    });

    it("when project found but not role returns false", async () => {
      expect(auth.hasProjectRole("Project1", ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found and role found returns true", async () => {
      expect(auth.hasProjectRole("Project1", ProjectRole.FinancialContact)).toBe(true);
    });

    it("when project found and role one of many returns true", async () => {
      expect(auth.hasProjectRole("Project2", ProjectRole.MonitoringOfficer)).toBe(true);
    });
  });

  describe("HasAllProjectRoles", () => {
    it("when project not found returns false", async () => {
      expect(auth.hasAllProjectRoles("ProjectX", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found but not all roles found returns false", async () => {
      expect(auth.hasAllProjectRoles("Project1", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found and all roles found returns true", async () => {
      expect(auth.hasAllProjectRoles("Project2", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });
  });

  describe("HasAnyProjectRoles", () => {
    it("when project not found returns false", async () => {
      expect(auth.hasAnyProjectRoles("ProjectX", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when project found and one roles found returns true", async () => {
      expect(auth.hasAnyProjectRoles("Project1", ProjectRole.FinancialContact, ProjectRole.ProjectManager)).toBe(true);
    });

    it("when project found and all roles found returns true", async () => {
      expect(auth.hasAnyProjectRoles("Project2", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });

    it("when project found and no roles found returns false", async () => {
      expect(auth.hasAnyProjectRoles("Project1", ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager)).toBe(false);
    });
  });

  describe("HasPartnerRole", () => {
    it("when project not found returns false", async () => {
      expect(auth.hasPartnerRole("ProjectX", "Partner1A", ProjectRole.FinancialContact)).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(auth.hasPartnerRole("Project1", "PartnerX", ProjectRole.FinancialContact)).toBe(false);
    });

    it("when partner found and role not found returns false", async () => {
      expect(auth.hasPartnerRole("Project1", "Partner1A", ProjectRole.ProjectManager)).toBe(false);
    });

    it("when partner found and role found returns true", async () => {
      expect(auth.hasPartnerRole("Project1", "Partner1A", ProjectRole.FinancialContact)).toBe(true);
    });
  });

  describe("HasAllPartnerRoles", () => {
    it("when project not found returns false", async () => {
      expect(auth.hasAllPartnerRoles("ProjectX", "Partner1A", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(auth.hasAllPartnerRoles("Project1", "PartnerX", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner found and roles not all found returns false", async () => {
      expect(auth.hasAllPartnerRoles("Project2", "Partner2A", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner found and roles all found not returns true", async () => {
      expect(auth.hasAllPartnerRoles("Project2", "Partner2B", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });
  });

  describe("HasAnyPartnerRoles", () => {
    it("when project not found returns false", async () => {
      expect(auth.hasAnyPartnerRoles("ProjectX", "Partner1A", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(auth.hasAnyPartnerRoles("Project1", "PartnerX", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(false);
    });

    it("when partner found and roles not all found returns true", async () => {
      expect(auth.hasAnyPartnerRoles("Project2", "Partner2A", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });

    it("when partner found and role all found returns true", async () => {
      expect(auth.hasAnyPartnerRoles("Project2", "Partner2B", ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer)).toBe(true);
    });

    it("when partner found and no roles found returns false", async () => {
      expect(auth.hasAnyPartnerRoles("Project2", "Partner2A", ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)).toBe(false);
    });
  });
});
