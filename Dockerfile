# Use node version 16.13.2
FROM node:16.13.2

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

# Download dumb-init
RUN wget --progress=dot:giga https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64.deb \
    dpkg -i dumb-init_*.deb \
# Add user to prevent using root user
    useradd -ms /bin/bash user

USER user

# Use /app as our working directory
WORKDIR /home/user/app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production 

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["dumb-init", "node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080
