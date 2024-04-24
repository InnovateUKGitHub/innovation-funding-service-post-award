interface LoginInfo {
  username: string | null;
  project: {
    number: string;
    title: string;
  } | null;
  partner: {
    title: string;
  } | null;
}

interface FileInfo {
  name: string;
  type?: string;
}

interface LocalFileInfo extends FileInfo {
  path: string;
}

interface SirtestalotContext {
  userInfo?: LoginInfo;
  localFileInfo?: LocalFileInfo;
  remoteSha256?: string;
  memory?: string;
}

declare namespace Mocha {
  interface Context extends SirtestalotContext {}
}
