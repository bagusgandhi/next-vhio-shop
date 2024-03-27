FROM node:lts-alpine


WORKDIR /app

# Copy package json and install package
COPY package-lock.json package.json /app/
RUN npm install

# Copy the remaining file
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

RUN npm run build

RUN npm run socket

CMD npm run start