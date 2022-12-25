# build environment
FROM node:16-alpine

WORKDIR /app

# Copy all required fules
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY . /app

# Install Deps
RUN yarn
# Squeeze out build folder
RUN yarn build

# Last FROM statement is our output base image
FROM nginx:alpine
# Copy build artifact from the first stage
COPY --from=0 /app/build /usr/share/nginx/html
# Run the container on port 80 (nginx's default port)
EXPOSE 80
# Start the nginx webserver automatically once the container runs.
# Set daemon off to run in the foreground
CMD ["nginx", "-g", "daemon off;"]