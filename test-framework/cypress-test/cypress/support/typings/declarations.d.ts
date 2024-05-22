interface ProjectFactoryData {
  prefix: string;
  project: {
    number: string;
    title: string;
  };
  pcl: {
    role: string;
    username: string;
    participantName: string;
  }[];
}

interface LoginInfo {
  username: string | null;
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
  projectCreated?: string;
}

declare namespace Mocha {
  interface Context extends SirtestalotContext {}
}
