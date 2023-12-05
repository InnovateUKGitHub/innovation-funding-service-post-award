const accCache = new Map<string, string>();

const tasks = {
  setCyCache({ key, value }: { key: string; value: string }): void {
    accCache.set(key, value);
    return null;
  },

  getCyCache({ key }: { key: string }): string | null {
    return accCache.get(key) ?? null;
  },
};

type SirtestalotTasks = typeof tasks;

export { tasks, SirtestalotTasks };
