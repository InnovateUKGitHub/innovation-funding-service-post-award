import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation, getAuthRoles } from "./authorisation";

describe("authorisation", () => {
  const roles = {
    Project1: {
      projectRoles: ProjectRolePermissionBits.FinancialContact,
      partnerRoles: {
        Partner1A: ProjectRolePermissionBits.FinancialContact,
      },
    },
    Project2: {
      projectRoles: ProjectRolePermissionBits.FinancialContact | ProjectRolePermissionBits.MonitoringOfficer,
      partnerRoles: {
        Partner2A: ProjectRolePermissionBits.FinancialContact,
        Partner2B: ProjectRolePermissionBits.FinancialContact | ProjectRolePermissionBits.MonitoringOfficer,
      },
    },
  };

  const auth = new Authorisation(roles);

  const unknownProject = "ProjectX" as ProjectId;
  const projectOne = "Project1" as ProjectId;
  const projectTwo = "Project2" as ProjectId;

  const partner1A = "Partner1A" as PartnerId;
  const partner2A = "Partner2A" as PartnerId;
  const partner2B = "Partner2B" as PartnerId;
  const unknownPartner = "PartnerX" as PartnerId;

  describe("getRoles for project", () => {
    it("when project not found returns Unknown", async () => {
      expect(auth.forProject(unknownProject).getRoles()).toBe(ProjectRolePermissionBits.Unknown);
    });

    it("when project found returns correct role", async () => {
      expect(auth.forProject(projectTwo).getRoles()).toBe(roles.Project2.projectRoles);
    });
  });

  describe("getRoles for partner", () => {
    it("when project not found returns Unknown", async () => {
      expect(auth.forPartner(unknownProject, partner2A).getRoles()).toBe(ProjectRolePermissionBits.Unknown);
    });

    it("when partner not found returns Unknown", async () => {
      expect(auth.forPartner(projectTwo, unknownPartner).getRoles()).toBe(ProjectRolePermissionBits.Unknown);
    });

    it("when partner found returns correct role", async () => {
      expect(auth.forPartner(projectTwo, partner2A).getRoles()).toBe(roles.Project2.partnerRoles.Partner2A);
    });
  });

  describe("hasRole for project", () => {
    it("when project not found returns false", async () => {
      expect(auth.forProject(unknownProject).hasRole(ProjectRolePermissionBits.FinancialContact)).toBe(false);
    });

    it("when project found but not role returns false", async () => {
      expect(auth.forProject(projectOne).hasRole(ProjectRolePermissionBits.MonitoringOfficer)).toBe(false);
    });

    it("when project found and role found returns true", async () => {
      expect(auth.forProject(projectOne).hasRole(ProjectRolePermissionBits.FinancialContact)).toBe(true);
    });

    it("when project found and role one of many returns true", async () => {
      expect(auth.forProject(projectTwo).hasRole(ProjectRolePermissionBits.MonitoringOfficer)).toBe(true);
    });
  });

  describe("hasAllRoles for project", () => {
    it("when project not found returns false", async () => {
      expect(
        auth
          .forProject(unknownProject)
          .hasAllRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(false);
    });

    it("when project found but not all roles found returns false", async () => {
      expect(
        auth
          .forProject(projectOne)
          .hasAllRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(false);
    });

    it("when project found and all roles found returns true", async () => {
      expect(
        auth
          .forProject(projectTwo)
          .hasAllRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(true);
    });
  });

  describe("hasAnyRoles for project", () => {
    it("when project not found returns false", async () => {
      expect(
        auth
          .forProject(unknownProject)
          .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(false);
    });

    it("when project found and one roles found returns true", async () => {
      expect(
        auth
          .forProject(projectOne)
          .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.ProjectManager),
      ).toBe(true);
    });

    it("when project found and all roles found returns true", async () => {
      expect(
        auth
          .forProject(projectTwo)
          .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(true);
    });

    it("when project found and no roles found returns false", async () => {
      expect(
        auth
          .forProject(projectOne)
          .hasAnyRoles(ProjectRolePermissionBits.MonitoringOfficer, ProjectRolePermissionBits.ProjectManager),
      ).toBe(false);
    });
  });

  describe("hasOnlyRole for project", () => {
    it("when project not found returns false", async () => {
      expect(auth.forProject(unknownProject).hasOnlyRole(ProjectRolePermissionBits.FinancialContact)).toBe(false);
    });

    it("when project found and has only role returns true", async () => {
      expect(auth.forProject(projectOne).hasOnlyRole(ProjectRolePermissionBits.FinancialContact)).toBe(true);
    });

    it("when project found and has other roles as well returns false", async () => {
      expect(auth.forProject(projectTwo).hasOnlyRole(ProjectRolePermissionBits.FinancialContact)).toBe(false);
    });
  });

  describe("hasRole for partner", () => {
    it("when project not found returns false", async () => {
      expect(auth.forPartner(unknownProject, partner1A).hasRole(ProjectRolePermissionBits.FinancialContact)).toBe(
        false,
      );
    });

    it("when partner not found returns false", async () => {
      expect(auth.forPartner(projectOne, unknownPartner).hasRole(ProjectRolePermissionBits.FinancialContact)).toBe(
        false,
      );
    });

    it("when partner found and role not found returns false", async () => {
      expect(auth.forPartner(projectOne, partner1A).hasRole(ProjectRolePermissionBits.ProjectManager)).toBe(false);
    });

    it("when partner found and role found returns true", async () => {
      expect(auth.forPartner(projectOne, partner1A).hasRole(ProjectRolePermissionBits.FinancialContact)).toBe(true);
    });
  });

  describe("hasAllRoles for partner", () => {
    it("when project not found returns false", async () => {
      expect(
        auth
          .forPartner(unknownProject, partner1A)
          .hasAllRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(
        auth
          .forPartner(projectOne, unknownPartner)
          .hasAllRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(false);
    });

    it("when partner found and roles not all found returns false", async () => {
      // @ts-expect-error invalid partner role
      expect(auth.forPartner(projectTwo, partner2A).hasAllRoles(ProjectRolePermissionBits.FinancialContact, 32)).toBe(
        false,
      );
    });

    it("when partner found and roles all found not returns true", async () => {
      expect(
        auth
          .forPartner(projectTwo, partner2B)
          .hasAllRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(true);
    });
  });

  describe("hasAnyRoles for partner", () => {
    it("when project not found returns false", async () => {
      expect(
        auth
          .forPartner(unknownProject, partner1A)
          .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(false);
    });

    it("when partner not found returns false", async () => {
      expect(
        auth
          .forPartner(projectOne, unknownPartner)
          .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(false);
    });

    it("when partner found and roles not all found returns true", async () => {
      expect(
        auth
          .forPartner(projectTwo, partner2A)
          .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(true);
    });

    it("when partner found and role all found returns true", async () => {
      expect(
        auth
          .forPartner(projectTwo, partner2B)
          .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.MonitoringOfficer),
      ).toBe(true);
    });

    it("when partner found and no roles found returns false", async () => {
      expect(auth.forPartner(projectTwo, partner2A).hasAnyRoles(ProjectRolePermissionBits.ProjectManager)).toBe(false);
    });
  });

  describe("hasOnlyRole for partner", () => {
    it("when project not found returns false", async () => {
      expect(auth.forPartner(unknownProject, partner1A).hasOnlyRole(ProjectRolePermissionBits.FinancialContact)).toBe(
        false,
      );
    });

    it("when partner not found returns false", async () => {
      expect(auth.forPartner(projectOne, partner2A).hasOnlyRole(ProjectRolePermissionBits.FinancialContact)).toBe(
        false,
      );
    });

    it("when partner found and has only role returns true", async () => {
      expect(auth.forPartner(projectOne, partner1A).hasOnlyRole(ProjectRolePermissionBits.FinancialContact)).toBe(true);
    });

    it("when partner found and has other roles as well returns false", async () => {
      expect(auth.forPartner(projectTwo, partner2B).hasOnlyRole(ProjectRolePermissionBits.FinancialContact)).toBe(
        false,
      );
    });
  });

  describe("gets auth values for when using sf roles object directly", () => {
    test.each`
      sfRoles                                      | expected
      ${{ isPm: false, isMo: false, isFc: false }} | ${{}}
      ${{ isPm: true, isMo: false, isFc: false }}  | ${{ isPm: true, isPmOrMo: true }}
      ${{ isPm: false, isMo: true, isFc: false }}  | ${{ isMo: true, isPmOrMo: true }}
      ${{ isPm: false, isMo: false, isFc: true }}  | ${{ isFc: true }}
      ${{ isPm: true, isMo: false, isFc: true }}   | ${{ isPm: true, isFc: true, isPmAndFc: true, isPmOrMo: true }}
      ${{ isPm: true, isMo: true, isFc: false }}   | ${{ isPm: true, isMo: true, isPmOrMo: true }}
      ${{ isPm: true, isMo: true, isFc: true }}    | ${{ isPm: true, isMo: true, isFc: true, isPmOrMo: true, isPmAndFc: false, isSuperAdmin: true }}
    `(
      "should return the expected auth object",
      ({
        sfRoles,
        expected,
      }: {
        sfRoles: SfRoles;
        expected: Partial<{
          isUnknown: boolean;
          isMo: boolean;
          isFc: boolean;
          isPm: boolean;
          isSuperAdmin: boolean;
          isPmAndFc: boolean;
          isPmOrMo: boolean;
        }>;
      }) => {
        const defaultResults = {
          isUnknown: false,
          isMo: false,
          isFc: false,
          isPm: false,
          isSuperAdmin: false,
          isPmAndFc: false,
          isPmOrMo: false,
        };
        expect(getAuthRoles(sfRoles)).toEqual({ ...defaultResults, ...expected });
      },
    );
  });
});
