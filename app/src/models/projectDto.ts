export interface ProjectDto {
    id: string;
    title: string;
    competition: string;
    startDate: Date;
    endDate: Date;
    summary: string;
    applicationUrl?: string;
    grantOfferLetterUrl?: string;
    projectNumber:string;
}
