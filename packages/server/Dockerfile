###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20.5.1-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND yarn.lock (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node packages/server/package.json ./
COPY --chown=node:node packages/server/yarn.lock ./

# Install app dependencies using the `yarn install --frozen-lockfile` command instead of `yarn`
RUN yarn install --frozen-lockfile

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20.5.1-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node packages/server/package.json ./
COPY --chown=node:node packages/server/yarn.lock ./

# In order to run `yarn build` we need access to the Nest CLI which is a dev dependency.
# In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node packages/server/. .

RUN ls -a

# Run the build command which creates the production bundle
RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --prod ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible
RUN yarn install --frozen-lockfile --prod && yarn cache clean

USER node

###################
# PRODUCTION
###################

FROM node:20.5.1-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
