import { configuration } from "@server/features/common/config";
import { Agent } from "undici";

const mtlsFetchAgent = new Agent({
  connect: {
    ca: [configuration.certificates.hydraMtls.certificationAuthority],
    key: configuration.certificates.hydraMtls.private,
    passphrase: configuration.certificates.hydraMtls.passphrase,
    cert: configuration.certificates.hydraMtls.public,
    rejectUnauthorized: configuration.certificates.hydraMtls.rejectUnauthorised,
    requestCert: true,
  },
});

export { mtlsFetchAgent };
