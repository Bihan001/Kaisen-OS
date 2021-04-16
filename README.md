# **KAISEN OS**

### Author: Bihan Chakraborty & Ankur Saha

## Environment Variables

    NODE_ENV
    BACKEND_PORT
    MONGODB_URI
    FIREBASE_URI
    SERVICE_ACCOUNT_PATH

## Setting up development environment(Without using Docker)

##### 1. **Clone the Github repository.**

##### 2. **Create a dev.env file in root folder and add the environment variables in the following format.(one time operation).**

        <ENVIRONMENT_VARIABLE>=<value>

        NODE_ENV=development
        BACKEND_PORT=5000
        MONGODB_URI=<MongoDB URI>
        FIREBASE_URI=<Firebase URI>
        SERVICE_ACCOUNT_PATH=<Path to serviceAccount.json>

##### 3. **Run `npm install` in both root and client folders to install all the necessary dependencies.**

##### 4. **Run `npm run dev-full` in the root directory to start the development server and the react client.**

## Setting up development environment(Using Docker)

##### 1. **Clone the Github repository.**

##### 2. **In the root directory, run `docker-compose -f dev-docker-compose.yaml up --build`.**

##### 4. **The server and the client will start at `http://<host_machine_ip>:5000` and `http://<host_machine_ip>:3000` respectively.**

## Setting up production environment(Using docker)

##### 1. **Clone the Github repository.**

##### 2. **In the root directory, run `docker-compose -f prod-docker-compose.yaml up --build`.**

##### 3. **The project will start in `http://<host_machine_ip>:5000`.**

## NPM Commands(Root folder)

- `$ npm run dev` - **Starts server from typescript files.**
- `$ npm run dev-full` - **Starts server from typescript files and starts the client.**
- `$ npm start` - **Starts server from javascript files.**
- `$ npm install` - **Installs the dependencies listed on the package.json file.**
- `$ npm run build` - **Builds all typescript files to javascript files.**

## NPM Commands(Client folder)

- `$ npm start` - **Starts the react client in port 3000 by default.**
- `$ npm install` - **Installs the dependencies listed on the package.json file.**
- `$ npm run build` - **Builds all react files into static files.**

## Server status check

If the server startup is successful, visiting `http://<host_machine_ip>:5000/api/files` should return the response:

`{ success: true, status: 'success', message: 'Files Route is up and running!', data: {}, }`
