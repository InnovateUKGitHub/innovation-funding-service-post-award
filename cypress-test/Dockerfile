FROM cypress/browsers
WORKDIR /cypress
ADD . .
RUN npm ci

USER root

# https://github.com/cypress-io/cypress/issues/3116#issuecomment-475622307
ENV NODE_OPTIONS=

CMD npm run test
