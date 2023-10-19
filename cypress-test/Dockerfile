FROM cypress/browsers
WORKDIR test
ADD . .
RUN npm ci
CMD npm run test
