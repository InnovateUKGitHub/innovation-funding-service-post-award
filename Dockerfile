FROM node:19
WORKDIR /usr/src/app
COPY ["app", "./"]
RUN npm install
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]