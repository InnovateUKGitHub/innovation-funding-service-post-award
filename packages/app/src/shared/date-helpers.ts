export const calendarMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const totalCalendarMonths = calendarMonthNames.length;

export const monthDifference = (dateFrom: Date, dateTo: Date): number => {
  return dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear());
};

export const monthNameToNumber = (input: string): string => {
  // https://design-system.service.gov.uk/components/date-input/#research-on-this-component
  // Convert named months to numbers to help mistaken users and those with discalculia
  switch (input.toLowerCase().slice(0, 3)) {
    case "jan":
      return "1";
    case "feb":
      return "2";
    case "mar":
      return "3";
    case "apr":
      return "4";
    case "may":
      return "5";
    case "jun":
      return "6";
    case "jul":
      return "7";
    case "aug":
      return "8";
    case "sep":
      return "9";
    case "oct":
      return "10";
    case "nov":
      return "11";
    case "dec":
      return "12";
    default:
      return input;
  }
};
