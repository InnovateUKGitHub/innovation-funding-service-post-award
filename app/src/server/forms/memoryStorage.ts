import { configuration } from "@server/features/common";
import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
  storage,
  limits: {
    fileSize: configuration.options.maxFileSize,
    files: configuration.options.maxUploadFileCount,
  },
});
