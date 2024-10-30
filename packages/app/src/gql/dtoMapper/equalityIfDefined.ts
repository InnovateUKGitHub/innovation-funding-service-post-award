const inequalityIfDefined = <T, Q>(a: T, b: Q) => a === undefined || a !== b;
const equalityIfDefined = <T, Q>(a: T, b: Q) => a === undefined || a === b;

export { inequalityIfDefined, equalityIfDefined };
