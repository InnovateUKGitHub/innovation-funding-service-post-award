const dateRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;

export const processResponse = (response: Response) => response.json().then(processDto);

export const processDto: any = (data: any) => {
  if(Array.isArray(data)) {
    return data.map(x => processDto(x));
  }

  if(data && data.constructor.prototype === Object.prototype) {
    const newObj: {[key: string]: any} = {};

    Object.keys(data).forEach(key => {
      newObj[key] = processDto(data[key]);
    });

    return newObj;
  }

  if (typeof(data) === "string" && dateRegex.test(data)) {
    return new Date(data);
  }

  return data;
};
