const generatePrefix = () =>
  String(Math.floor(new Date().getTime() / 1000) % 1000000) + String(Math.floor(Math.random() * 1000)).padStart(4, "0");

const prefix = (val: string) => `${generatePrefix}.${val}`;

export { prefix };
