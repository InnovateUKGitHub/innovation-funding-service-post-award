interface OptionDto {
  questionText: string;
  questionScore: number;
}

interface QuestionDto {
  title: string;
  score?: number;
  comments?: string;
  options: OptionDto[];
}

interface MonitoringReportDto {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date;
  periodId: number;
  questions: QuestionDto[];
}
