# See https://ukri.atlassian.net/wiki/spaces/ACC/pages/64192524 - How to upgrade NodeJS
FROM docker-ifs.devops.innovateuk.org/acc/node:20.17.0

WORKDIR /app
RUN chown node /app
USER node

COPY --chown=node:node app/package.json app/package-lock.json .prettierrc .prettierignore /app/
COPY --chown=node:node app/patches ./patches
RUN npm ci --no-optional
RUN npm run patch-package

COPY --chown=node:node app /app

EXPOSE 8080

RUN npm run lint && npm run esbuild:tsc && npm run test && npm run build

ARG ACC_BUILD_TAG
ENV ACC_BUILD_TAG $ACC_BUILD_TAG

ARG ACC_BUILD_EPOCH
ENV ACC_BUILD_EPOCH $ACC_BUILD_EPOCH

CMD ["node", "--enable-source-maps", "./dist/src/server/index.js"]
