export const isEmptyDate = (monthStr?: string, yearStr?: string) => !monthStr && !yearStr;

export const isValidMonth = (monthStr?: string) => {
  const month = Number(monthStr);
  return !isNaN(month) && Number.isInteger(month) && month >= 1 && month <= 12;
};

export const isValidYear = (yearStr?: string) => {
  const year = Number(yearStr);
  return !isNaN(year) && Number.isInteger(year) && year >= 2000 && year <= 2200;
};

export const endDateIsBeforeStart = (startMonth?: string, startYear?: string, endMonth?: string, endYear?: string) =>
  Number(endYear) < Number(startYear) ||
  (Number(endYear) === Number(startYear) && Number(endMonth) < Number(startMonth));

export const isEmptyDateDMY = (dayStr?: string, monthStr?: string, yearStr?: string) =>
  !dayStr && !monthStr && !yearStr;

export const isValidDay = (dayStr?: string) => {
  const day = Number(dayStr);
  return !isNaN(day) && Number.isInteger(day) && day >= 1 && day <= 31;
};
