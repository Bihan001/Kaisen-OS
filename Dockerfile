# PROD CONFIG
FROM node:14.16-alpine3.10

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install --only=production

RUN npm install -g typescript

WORKDIR /app/client

COPY ./client/package*.json ./

RUN npm install --only=production

WORKDIR /app

COPY ./backend/ .

COPY ./client/ ./client

ENV NODE_ENV=production
ENV PORT=5000
ENV MONGODB_URI=mongodb+srv://kaisen:kaisen@kaisen-test-cluster.hllyu.mongodb.net/test-db?retryWrites=true&w=majority
ENV FIREBASE_URI=https://mern-authentication-6634c.firebaseio.com
ENV SERVICE_ACCOUNT_PATH=/app/serviceAccount.json


CMD [ "npm", "start" ]
