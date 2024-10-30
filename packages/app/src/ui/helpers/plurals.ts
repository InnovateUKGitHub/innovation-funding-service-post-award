const pluralMap = {
  day: ["day", "days"],
  month: ["month", "months"],
  year: ["year", "years"],
};

type PluralOption = keyof typeof pluralMap;

/**
 * @description Gets the plural based on the value needed and integer provided.
 * @example
 *  getPlural("month", 1) <==> 1 month
 *  getPlural("month", 2) <==> 2 months
 */
export const getPlural = (chosenPlural: PluralOption, value: number | null | undefined) => {
  if (!value && value !== 0) return "";

  const selectedPlural = pluralMap[chosenPlural];
  const absoluteNumber = Math.abs(value);
  const pluralOption = Number(absoluteNumber > 1);

  const appendedValue: string = selectedPlural[pluralOption];

  return `${value} ${appendedValue}`;
};
