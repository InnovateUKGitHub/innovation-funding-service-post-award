/* eslint-disable @typescript-eslint/ban-ts-comment */
const dateRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;

export const processResponse = (response: Response) => response.json().then(processDto);

const isObjectType = (data: unknown): data is AnyObject => {
  return typeof data === "object" && data !== null;
};

export const processDto = <T>(data: T): T => {
  if (Array.isArray(data)) {
    // @ts-ignore
    return data.map(x => processDto(x));
  }

  // Do not process JavaScript Dates.
  if (data instanceof Date) {
    return data;
  }

  if (isObjectType(data)) {
    const newObj: AnyObject = {};

    Object.keys(data).forEach(key => {
      newObj[key] = processDto(data[key]);
    });
    // @ts-ignore
    return newObj;
  }

  if (typeof data === "string" && dateRegex.test(data)) {
    // @ts-ignore
    return new Date(data);
  }

  return data;
};
