FROM node:20.5.1-alpine

COPY .yarnrc .
RUN yarn global add @bufbuild/buf ts-proto

WORKDIR /usr/local/share/.config/yarn/global

CMD [ "buf", "generate" ]
