export class AuditReportFrequencyMapper {
  public static mapFromSalesforce(label: string) {
    switch (label.trim()) {
      case "Never, for this project":
        return "never";
      case "With all claims":
        return "all";
      case "With the first and last claim only":
        return "firstAndLast";
      case "With the last claim only":
        return "last";
      case "With the first claim, last claim and on every anniversary of the project start date":
        return "firstLastAnniversary";
      case "Quarterly":
        return "quarterly";
      default:
        return "unknown";
    }
  }
}

export type AuditReportFrequency =
  | "never"
  | "all"
  | "firstAndLast"
  | "last"
  | "firstLastAnniversary"
  | "quarterly"
  | "unknown";
