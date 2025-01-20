# See https://ukri.atlassian.net/wiki/spaces/ACC/pages/64192524 - How to upgrade NodeJS
FROM docker-ifs.devops.innovateuk.org/acc/node:22.13.0

WORKDIR /externalui
RUN chown node /externalui
USER node

COPY --chown=node:node turbo.mjs turbo.json package.json package-lock.json /externalui/
COPY --chown=node:node patches /externalui/patches
COPY --chown=node:node packages /externalui/packages
RUN npm ci --no-optional

EXPOSE 8080

RUN npm run build && npm run test

ARG ACC_BUILD_TAG
ENV ACC_BUILD_TAG $ACC_BUILD_TAG

ARG ACC_BUILD_EPOCH
ENV ACC_BUILD_EPOCH $ACC_BUILD_EPOCH

WORKDIR /externalui/packages/app

CMD ["node", "--enable-source-maps", "./dist/src/server/index.js"]
