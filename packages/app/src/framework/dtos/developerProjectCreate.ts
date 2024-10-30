interface DeveloperProjectCreateDto {
  claimFrequency: string;
  competitionCode: string;
  competitionType: string;
  participantOrgType: string;
  participantType: string;
  projectDuration: number;
  projectId: number;
  projectName: string;
  impactManagementParticipation: string;
  startDate: Date;
}

export { DeveloperProjectCreateDto };
