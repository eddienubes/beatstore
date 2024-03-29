# build environment
FROM node:16-alpine

WORKDIR /app

# Install Deps
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

# Copy all required files including .env
COPY . /app
COPY .env /app/.env

# Squeeze out build folder
RUN yarn build

# Last FROM statement is our output base image
FROM nginx:alpine
# Copy build artifact from the first stage
COPY --from=0 /app/build /usr/share/nginx/html
COPY --from=0 /app/docker/nginx.conf /etc/nginx/nginx.conf
# Run the container on port 80 (nginx's default port)
EXPOSE 80
# Start the nginx webserver automatically once the container runs.
# Set daemon off to run in the foreground
CMD ["nginx", "-g", "daemon off;"]