---
sidebar_position: 1
title: Get started
---

:::note  
This documentation assumes that you know how [express](https://expressjs.com/en/starter/hello-world.html) works and operates to some extent 
:::

## 1. Setup environment
### Git (same as client)
Check if you have git, type the following into the terminal:
```
git --version
```
If you get a message telling you that you entered an unrecognizable command then you have to install git which you can do from [here](https://git-scm.com/downloads). Don't worry about all the options just click continue through the whole installation wizard.

### NodeJS (same as client)
To be able to work with the environment you must first install [NodeJS](https://nodejs.org/en/). Make sure to install the **LTS** alternative. You can check if you already have this installed by running:
```
node -v
npm -v
```

If you get a version for both of them then you already have node installed (although make sure that your version isn't too outdated).

### Code editor (same as client)
If you don't already have a code editor, it's strongly recommended to use [vsCode](https://code.visualstudio.com/).

### Database
You must also install a database for which all information will be saved in your local environment. You can download your database [here](https://www.mongodb.com/try/download/community), simply follow the installation wizard and then continue.

## 2. Clone the repository from GitHub (same as client)
```
git clone https://github.com/hampfh/datalinks
```

## 3. NPM install
When the repository is cloned navigate to the `server` directory and type:
```
npm install
```
This will install all server dependencies for you

## 4. Env file
Lastly, before we are ready to build the application you must create a new file named `.env`. This file contains all secrets of your applications, however, since you are developing locally this information isn't very confidential. This file should be placed within the `server` folder together with `package.json` In this file paste the following:
```python
PORT=8084
NODE_ENV=development

HOST=http://localhost

KTH_LOGIN_ID=<kth client id>
KTH_LOGIN_SECRET=<kth client token>
KTH_LOGIN_CONFIGURATION_URL=https://​login.ug.kth.se/adfs/.well-known/openid-configuration
KTH_TOKEN_SECRET=<random string>

SESSION_SECRET=<random string>

ADMIN_EDIT_TOKEN=<random string>

# Database properties
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=<name of db>
# If you haven't created a user with a specific password then don't worry about this
DB_USER=<db user name>
DB_PASSWORD=<db user password>
```

## 5. Build the project
Now you are good to go, build the project by running the following command:
```
npm run build
```
:::note 
This command must be executed every time a change is made to the code to see the change in the backend
:::
:::tip
If you don't want to keep running `npm run build` there is another command `npm run watch` which will automatically rebuild the project for you every time a file is changed and saved
:::

## 6. Run the project
```
npm start
```

If you were successful the server should print out:
```shell
Server listening on port 8084
DB connection is up!
```

:::caution
Every time you make a change to the backend you must cancel the `npm start` command and re-run it, otherwise the bundle will not update. It is a common mistake to forget to do this and then wonder why changes aren't applying
:::

## 7. Congrats
You now have a working environment