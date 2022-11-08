FROM node:16.18.0 as builder

RUN corepack prepare pnpm@7.14.2 --activate

RUN corepack enable

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY package.json ./
RUN pnpm install --offline

ADD . .
RUN pnpm run build

RUN pnpm prune --prod

FROM node:16.18.0-alpine
COPY --from=builder ./node_modules ./node_modules
COPY --from=builder ./dist ./dist
COPY ./server.js ./server.js

CMD [ "node", "server.js"]