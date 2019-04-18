interface ClaimDetailsDto {
    costCategoryId: string;
    periodId: number;
    periodStart: Date|null;
    periodEnd: Date|null;
    value: number;
    comments: string|null;
}
