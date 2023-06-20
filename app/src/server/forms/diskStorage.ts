import { configuration } from "@server/features/common/config";
import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
  storage,
  limits: {
    // Add extra leeway for multer to accept larger files.
    fileSize: configuration.options.maxFileSize * 1.2,
    files: configuration.options.maxUploadFileCount,
  },
});
