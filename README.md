# **KAISEN OS**

### Author: Bihan Chakraborty & Ankur Saha

## Environment Variables

    NODE_ENV
    PORT
    MONGODB_URI
    FIREBASE_URI
    SERVICE_ACCOUNT_PATH

## Setting up development environment

##### 1. **Clone the Github repository.**

##### 2. **Create a dev.env file in backend folder and add the environment variables in the following format.(one time operation).**

        <ENVIRONMENT_VARIABLE>=<value>

        NODE_ENV=development
        PORT=5000
        MONGODB_URI=<MongoDB URI>
        FIREBASE_URI=<Firebase URI>
        SERVICE_ACCOUNT_PATH=<Path to serviceAccount.json>

##### 3. **Run `npm install` in both backend and client folders to install all the necessary dependencies.**

##### 4. **Change directory to backend and run `npm run dev` to start the development server**

## Setting up production environment(Using docker)

##### 1. **Clone the Github repository.**

##### 2. **Change directory to backend and run `npm run build`(Make sure typescript is installed globally)**

##### 4. **In the root directory, run `docker build -t kaisen:latest .` followed by `docker run -d -p 5000:5000 --name kaisen-container kaisen:latest`**

## NPM Commands for backend

- `$ npm run dev` - **Starts server from typescript files**
- `$ npm start` - **Starts server from javascript files**
- `$ npm install` - **Installs the dependencies listed on the package.json file**
- `$ npm run build` - **Builds all typescript files to javascript files**

## Server status check

If the server startup is successful, visiting "/api/files" should return the response :

`{ success: true, status: 'success', message: 'Files Route is up and running!', data: {}, }`
