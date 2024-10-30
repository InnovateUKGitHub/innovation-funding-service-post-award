class TsforceTokenException extends Error {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(message, { cause });
  }
}

export { TsforceTokenException };
