interface DeveloperProjectCreateDto {
  projectName: string;
  competitionType: string;
  claimFrequency: string;
  projectDuration: number;
  participantType: string;
  participantOrgType: string;
  projectId: number;
  competitionCode: string;
  startDate: Date;
}

export { DeveloperProjectCreateDto };
