# DataLinks <img src="https://github.com/Hampfh/DataLinks/blob/master/client/public/favicon-32x32.png?raw=true">

## Contents
* [Project stack](#project-stack)
* [Frontend docs]()
* [Backend docs](#backend-docs)
  * [Structure](#structure)

## Project stack
Datalinks is split into two parts, a backend and frontend. The general framework/language stack looks something like this:  
  
**Backend:**  
* NodeJS
* Typescript
* Express.js
* MongoDB  

**Frontend:**  
* React
* Redux
* Typescript

## Backend docs
Here is all documentation for Datalink's backend, aka the API. This includes route-management, db-communication logic etc.
### Structure
In github all backend related code is located in the `app` folder in the root directory. This folder has four subfolders, `assets`, `controllers`, `models` and `routes`. Here is an explenation of what that means:  
*assets:*  
Holds all static data that may be served from the api, this is often the home to images, json files etc. Before this web-app was upgraded to a wiki-backend this folder held one file called data.json where all information was stored.  
**controllers:**  
This folder contains all logic, one could say that this is the brain of the api. All routes goes to one controller which decides what to do with the information and then responds to the user.  
**models:**  
This is basically a blueprint folder, telling MongoDb (the database) how data should be structured. After these blueprints have been defined the rest of the web-app must follow these rules when posting data to the database.
**routes:**  
Currently this folder only holds one file, mainly because there aren't that many routes and it doesn't get very cluttered by putting them all into the `api.ts` file located in it. A route file is responsible for taking the url that the user/(or website) put in and then send that to the correct controller. It's basically a middleman that makes sure that information is going to the correct place.
