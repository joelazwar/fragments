## Base ########################################################################
# Use node version 16.13.2 and create our base build
FROM node:16.13.2 as base

LABEL maintainer="Joel Azwar <jrazwar@myseneca.ca>" \
      description="Fragments node.js microservice"

# Define environment variables
# We default to use port 8080 in our service
ENV PORT=8080 

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app
# Copy the package.json and lock file over
COPY package*.json /home/node/app/


## Development #################################################################
# 
FROM base as development
WORKDIR /home/node/app
# Install (not ci) with dependencies, and for Linux vs. Linux Musl (which we use for -alpine)
RUN npm install
# Copy the source code over
COPY --chown=node:node . /home/node/app/
# Switch to the node user vs. root
USER node
# Start the app in debug mode so we can attach the debugger
CMD ["npm", "run", "dev"]


## Production ##################################################################

FROM base as production
WORKDIR /home/node/app

# Install production dependencies
RUN npm install --production

## Deploy ######################################################################
# Use a smaller node image (-alpine) at runtime
FROM node:lts-alpine as deploy
# https://github.com/krallin/tini
RUN apk --no-cache add tini
WORKDIR /home/node/app
# Copy what we've installed/built from production
COPY --chown=node:node --from=production /home/node/app/node_modules /home/node/app/node_modules/
# Copy the source code
COPY --chown=node:node . /home/node/app/

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Switch to the node user vs. root
USER node

# Start the app
CMD ["tini", "node", "src/server.js"]

# We run our service on port 8080
EXPOSE 8080
