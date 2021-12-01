---
sidebar_position: 1
title: Get started
---

:::note
This documentation assumes that you know how [react](https://reactjs.org/) and [redux](https://redux.js.org/) works
:::

## 1. Setup environment
### Git
Check if you have git, type the following into the terminal:
```
git --version
```
If you get a message telling you that you entered an unrecognizable command then you have to install git which you can do from [here](https://git-scm.com/downloads). Don't worry about all the options just click continue through the whole installation wizard.

### NodeJS
To be able to work with the environment you must first install [NodeJS](https://nodejs.org/en/). Make sure to install the **LTS** alternative. You can check if you already have this installed by running:
```
node -v
npm -v
```

If you get a version for both of them then you already have node installed (although make sure that your version isn't too outdated).

### Code editor
If you don't already have a code editor, it's strongly recommended to use [vsCode](https://code.visualstudio.com/).

## 2. Clone the repository from GitHub
```
git clone https://github.com/hampfh/datalinks
```

## 3. NPM install
When the repository is cloned navigate to the `client` directory and type:
```
npm install
```
This will install all client dependencies for you

## 4. Run the project
```
npm start
```

If you were successful the client should automatically open the application in your browser

## 5. Congrats
You now have a working environment