const batch = <T>(items: T[], batchSize: number = 200) => {
  const splitItems: T[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    splitItems.push(items.slice(i, i + batchSize));
  }

  return splitItems;
};

export { batch };
