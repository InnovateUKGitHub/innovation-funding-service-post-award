import { configuration } from "@server/features/common/config";
import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
  storage,
  limits: {
    // Add extra leeway for multer to accept more than allowed (only to then validate against it)
    fileSize: configuration.options.maxFileSize * 1.2,
    files: configuration.options.maxUploadFileCount + 1,
  },

  // TODO: Give support to https://github.com/expressjs/multer/pull/1210
  fileFilter: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    cb(null, true);
  },
});
