import { configuration } from "@server/features/common/config";
import { Agent } from "undici";

const mtlsFetchAgent = new Agent({
  connect: {
    ca: [configuration.certificates.hydraMtls.certificationAuthority],
    key: configuration.certificates.hydraMtls.private,
    cert: configuration.certificates.hydraMtls.public,
    rejectUnauthorized: configuration.certificates.hydraMtls.rejectUnauthorised,
    servername: configuration.certificates.hydraMtls.serverName,
  },
});

export { mtlsFetchAgent };
