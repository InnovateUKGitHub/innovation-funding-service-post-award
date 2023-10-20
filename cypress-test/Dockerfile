FROM cypress/browsers
WORKDIR /cypress
ADD . .
RUN npm ci

USER root

ENV ELECTRON_RUN_AS_NODE 1

CMD npm run test
