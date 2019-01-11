import path from "path";
import { Response } from "express";
import { ErrorCode, IAppError } from "../types/IAppError";

const getErrorStatus = (code: number) => {
  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.BAD_REQUEST_ERROR:
      return 400;
    case ErrorCode.FORBIDDEN_ERROR:
      return 403;
    case ErrorCode.REQUEST_ERROR:
      return 404;
    case ErrorCode.SECURITY_ERROR:
      return 503;
    case ErrorCode.UNKNOWN_ERROR:
    default:
      return 500;
  }
};

export const errorHandlerApi = (res: Response, err?: IAppError) => {
  const code    = !!err ? err.code : ErrorCode.UNKNOWN_ERROR;
  const message = !!err ? err.message : "Something went wrong";
  const results = !!err ? err.results : null;
  const status  = getErrorStatus(code);

  return res.status(status).json({ code, message, results });
};

export const errorHandlerRender = (res: Response, err?: IAppError) => {
  const code = !!err ? err.code : ErrorCode.UNKNOWN_ERROR;
  const status = getErrorStatus(code);
  const html = code === ErrorCode.REQUEST_ERROR ? "../../../public/error-not-found.html" : "../../../public/error.html";

  return res.status(status).sendFile(path.join(__dirname, html));
};
