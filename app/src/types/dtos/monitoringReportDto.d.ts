interface OptionDto {
  id: string;
  questionText: string;
  questionScore: number;
}

interface QuestionDto {
  responseId: string;
  optionId: string;
  title: string;
  comments?: string;
  options: OptionDto[];
  displayOrder: number;
}

interface MonitoringReportDto {
  headerId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  periodId: number;
  questions: QuestionDto[];
}
