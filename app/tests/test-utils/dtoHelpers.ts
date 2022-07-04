export const createDto = <T extends {}> (dto: Partial<T>): T => (dto as T);
