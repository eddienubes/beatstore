FROM node:alpine

WORKDIR /app

# Install Deps
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

# Copy all required files including .env
COPY . /app


# Run application on port 3000
EXPOSE 3000

CMD ["yarn", "start"]
