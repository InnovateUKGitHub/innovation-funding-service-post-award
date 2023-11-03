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

interface SirtestalotContext {
  userInfo?: LoginInfo;
  previousFileSha256?: string;
}

declare namespace Mocha {
  interface Context extends SirtestalotContext {}
}
