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

interface ProjectFactoryInfo {
  project: {
    number: string;
  };
}

interface SirtestalotContext {
  userInfo?: LoginInfo;
  localFileInfo?: LocalFileInfo;
  remoteSha256?: string;
  memory?: string;
  project?: ProjectFactoryInfo;
}

declare namespace Mocha {
  interface Context extends SirtestalotContext {}
}
