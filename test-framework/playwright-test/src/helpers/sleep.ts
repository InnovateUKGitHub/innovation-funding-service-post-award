const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export { sleep };
