# DataLinks <img src="https://github.com/Hampfh/DataLinks/blob/master/client/public/favicon-32x32.png?raw=true">

## Contents
* [Project stack](#project-stack)
* [Frontend docs]()
* [Backend docs](#backend-docs)
  * [Structure](#structure)
  * [Data structures](#data-structures)
  * [Frameworks](#frameworks)

## Project stack
Datalinks is split into two parts, a backend and frontend. The general framework/language stack looks something like this:  
  
**Backend:**  
* NodeJS
* Typescript
* Express.js
* MongoDB  
* Express
* Mongoose

**Frontend:**  
* React
* Redux
* Typescript

## Backend docs
Here is all documentation for Datalink's backend, aka the API. This includes route-management, db-communication logic, etc.
### Structure
In GitHub, all backend related code is located in the `app` folder in the root directory. This folder has four subfolders, `assets`, `controllers`, `models`, and `routes`. Here is an explanation of what that means:  
**assets:**  
Holds all static data that may be served from the API, this is often the home to images, JSON files, etc. Before this web-app was upgraded to a wiki-backend this folder held one file called data.json where all information was stored.  
**controllers:**  
This folder contains all logic, one could say that this is the brain of the API. All routes go to one controller which decides what to do with the information and then responds to the user.  
**models:**  
This is basically a blueprint folder, telling MongoDb (the database) how data should be structured. After these blueprints have been defined the rest of the web-app must follow these rules when posting data to the database.
**routes:**  
Currently, this folder only holds one file, mainly because there aren't that many routes and it doesn't get very cluttered by putting them all into the `api.ts` file located in it. A route file is responsible for taking the URL that the user/(or website) put in and then send that to the correct controller. It's basically a middleman that makes sure that information is going to the correct place.

### Data structures
There are two important data structures in the database, there are subjects that hold information about course name, description, code, etc (generally things that the user cannot change). The other structure is groups. The whole site is built with these, a group may contain other groups (thus enabling nesting) but it may also contain `content objects`. A content object is what it's named, it's an object holding content. There are currently three different of these, link objects, text objects (and in the new release deadline objects). For further exploration, I recommend you go and seem them for yourself [here](https://github.com/Hampfh/DataLinks/tree/master/app/models). You might also notice that a third data model exists, the logging model. This is used for logging all changes done to the site, this allows for overtime tracking of the site changes and might in the future be connected to some form of reward system.
