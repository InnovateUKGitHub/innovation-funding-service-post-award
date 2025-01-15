const currencyFormat = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const toCurrency = (n: string | number) => currencyFormat.format(typeof n === "number" ? n : parseFloat(n));

export { currencyFormat, toCurrency };
