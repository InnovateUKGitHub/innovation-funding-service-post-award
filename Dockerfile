# See https://ukri.atlassian.net/wiki/spaces/ACC/pages/64192524 - How to upgrade NodeJS
FROM docker-ifs.devops.innovateuk.org/acc/node:20.9.0

WORKDIR /app

COPY app/package.json /app/package.json
COPY app/package-lock.json /app/package-lock.json
COPY app/patches /app/patches
COPY .prettierrc /app/.prettierrc
COPY .prettierignore /app/.prettierignore
RUN npm install

COPY app /app
RUN chown -R node /app

USER node
EXPOSE 8080

RUN npm run test
RUN npm run lint
RUN npm run build

CMD ["node", "--enable-source-maps", "./dist/src/server/index.js"]
