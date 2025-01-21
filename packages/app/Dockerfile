ARG ACC_MONOREPO_BASE
FROM $ACC_MONOREPO_BASE

EXPOSE 8080
WORKDIR /externalui/packages/app

CMD ["node", "--enable-source-maps", "./dist/src/server/index.js"]
