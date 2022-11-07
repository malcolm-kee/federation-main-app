FROM node:16.18.0

RUN corepack prepare pnpm@7.14.2 --activate

RUN corepack enable

COPY pnpm-lock.yaml ./

RUN pnpm fetch

ADD . .
RUN pnpm install --offline

RUN pnpm run build

CMD [ "node", "server.js"]