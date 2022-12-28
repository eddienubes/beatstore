FROM node:alpine

WORKDIR /app

# Install Deps
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

# Copy all required files including .env
COPY .env /app/.env
COPY . /app

RUN ls -l -a
RUN ls -l -a /app
RUN cd /app && cat .env


# Run application on port 3000
EXPOSE 3001

CMD ["yarn", "start"]
