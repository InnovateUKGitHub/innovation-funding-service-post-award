
export interface IClock {
  today(): Date;
  parse(value: string): Date;
}

export class Clock implements IClock {
  today() {
    return new Date();
  }

  parse(value: string) {
    return new Date(value);
  }
}
