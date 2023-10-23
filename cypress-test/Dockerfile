FROM cypress/browsers
WORKDIR /cypress
ADD . .
RUN npm ci

USER root

ENV ELECTRON_RUN_AS_NODE 1

# https://github.com/cypress-io/cypress/issues/3116#issuecomment-475622307
ENV NODE_OPTIONS=

CMD npm run test
