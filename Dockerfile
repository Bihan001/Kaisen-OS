# PROD CONFIG
FROM node:14.16-alpine3.10 as production

WORKDIR /app

RUN npm install -g typescript

COPY ./package*.json ./

RUN npm install

WORKDIR /app/client

COPY ./client/package*.json ./

RUN npm install

WORKDIR /app

COPY . .


# ENV NODE_ENV=production
# ENV PORT=5000
# ENV MONGODB_URI=mongodb+srv://kaisen:kaisen@kaisen-test-cluster.hllyu.mongodb.net/test-db?retryWrites=true&w=majority
# ENV FIREBASE_URI=https://mern-authentication-6634c.firebaseio.com
# ENV SERVICE_ACCOUNT_PATH=/app/serviceAccount.json


CMD [ "npm", "start" ]

# DEV CONFIG
FROM production as dev

EXPOSE 5000 3000

RUN npm install -g nodemon

RUN npm install --only=dev

CMD [ "npm", "run", "dev-full" ]
