# **KAISEN OS Backend**

## Environment Variables

    NODE_ENV
    PORT
    MONGODB_URI
    FIREBASE_URI
    SERVICE_ACCOUNT_PATH

## Setting up development environment

##### 1. **pull the code from github**

##### 2. **run `npm install` to install all the necessary dependencies**

##### 3. **Create a `dev.env` file in the root of the project folder containing the env variables in the format below (one time operation)**

        <ENVIRONMENT_VARIABLE>=<value>

        NODE_ENV=development
        PORT=5000
        MONGODB_URI=<MongoDB URI>
        FIREBASE_URI=<Firebase URI>
        SERVICE_ACCOUNT_PATH=<Path to serviceAccount.json>

##### 4. **run `npm run dev` to start the development server**

## Setting up production environment

##### 1. **pull the code from github**

##### 2. **run `npm install` to install all the necessary dependencies**

##### 3. **Create a `prod.env` file in the root of the project folder containing the env variables in the format below (one time operation)**

        <ENVIRONMENT_VARIABLE>=<value>

        NODE_ENV=production
        PORT=<NGINX port>
        MONGODB_URI=<MongoDB URI>
        FIREBASE_URI=<Firebase URI>
        SERVICE_ACCOUNT_PATH=<Path to serviceAccount.json>

##### 4. **run `npm start` to start the production server**

## npm Commands

- `$ npm run dev` - **Starts server from typescript files**
- `$ npm start` - **Starts server from javascript files**
- `$ npm install` - **Installs the dependencies listed on the package.json file**
- `$ npm run build` - **Builds all typescript files to javascript files**

## Server status check

If the server startup is successful, visiting the home route (/) should return the response :

`{ success: true, status: 'success', message: 'Kaisen OS Backend is up and running!', data: {}, }`
