export function pounds(value: number): string {
  const currentLocale = "en-GB";
  const currencyOptions = {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  } as const;

  const currencyValue = new Intl.NumberFormat(currentLocale, currencyOptions);
  return currencyValue.format(value);
}
