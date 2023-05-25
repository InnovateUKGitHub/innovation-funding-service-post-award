# See https://ukri.atlassian.net/wiki/spaces/ACC/pages/194019456
FROM registry.hub.docker.com/library/node:18.16.0

WORKDIR /app

COPY app/package.json /app/package.json
COPY app/package-lock.json /app/package-lock.json
COPY app/patches /app/patches
RUN npm install

COPY app /app
RUN chown -R node /app

USER node
EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "start:server"]
