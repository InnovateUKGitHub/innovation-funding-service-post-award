const percentageFormat = new Intl.NumberFormat("en-GB", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const toPercentage = (n: string | number) => percentageFormat.format(typeof n === "number" ? n : parseFloat(n) / 100);

export { percentageFormat, toPercentage };
