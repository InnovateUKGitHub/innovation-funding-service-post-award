FROM cypress/browsers
WORKDIR /cypress
ADD . .
RUN npm ci
CMD npm run test
