<img src="https://github.com/Hampfh/DataLinks/blob/master/client/src/assets/banner.png?raw=true" />  

## Contents
* [Questions?](#questions)
* [Project stack](#project-stack)
* [Setup development tools](#setup-development)
* [Frontend docs](https://github.com/Hampfh/DataLinks/blob/master/client/README.md)
* [Backend docs](#backend-docs)
  * [Structure](#structure)
  * [Data structures](#data-structures)
  * [Frameworks](#frameworks)
  * [API](#api)

## Questions
If you have any questions that aren't answered here please don't hesitate to create an issue and label it with `questions`. If you don't have questions but a feature request or bug I also encourage you to create an issue and give it the `improvement`- or `bug` label.

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

## Setup development
1. `Install vscode`. I really recommend that you use vscode, I know there are a lot of text editors out there but vscode has the best support for extensions and also works very well together with typescript.
2. `clone the project`. Click the green button on the Github page, copy the code, and clone it as usual. 
3. `install dependencies`. Before we can run the application we need to install all dependencies, this is done by running the command `npm install`. Don't forget that you also need to install dependencies for the client. Repeat the same process but in the client folder.
4. `install MongoDB local db`. Since this web application uses MongoDB you need to install a local database that you can use for testing and playing around yourself. You can find the download [here](https://www.mongodb.com/try/download/community). This is the raw database, however, it isn't very intuitive, I, therefore, recommend that you also install [mongodb compass](https://www.mongodb.com/try/download/compass) (if it isn't following when downloading the community edition).
5. Before we can start the application we also need to create a `.env` file in the root directory. It's very important that it hasn't any name and the extension .env. This file is not included in this repository as it's a sensitive file that should be individual to each computer. However, here is an example you can use. As long as you stay in `development` mode and not `production` you don't need to add a DB_USER and DB_PASSWORD (as long as you haven't put your local database behind an authentication wall, then you need to fill in these fields too)
```.env
# Env file for datalinks

PORT=8084
NODE_ENV=development

# Database properties
DB_HOST=127.0.0.1
DB_PORT=27017
DB_USER=<your database user here>
DB_PASSWORD=<your database password here>
DB_NAME=datasektionen
```
6. `Start everything`. Assuming you've now done all the previous steps successfully we need to compile and start the backend and the frontend. (This requires two cmds). In cmd one locate the root directory of the application and run `npm run tsc`, this will compile the backend code to js. Now we're ready to run it with `npm start`. 
In the other cmd you can simply run `npm start` and react should start its development server for you.
7. `Happy coding`. You're now good to go

## Backend docs
Here is all documentation for Datalink's backend, aka the API. This includes route-management, db-communication logic, etc.
### Structure
In GitHub, all backend related code is located in the `app` folder in the root directory. This folder has four subfolders, `assets`, `controllers`, `models`, and `routes`. Here is an explanation of what that means:  
**assets:**  
Holds all static data that may be served from the API, this is often the home to images, JSON files, etc. Before this web-app was upgraded to a wiki-backend this folder held one file called data.json where all information was stored.  
**controllers:**  
This folder contains all logic, one could say that this is the brain of the API. All routes go to one controller which decides what to do with the information and then responds to the user.  
**models:**  
This is a blueprint folder, telling MongoDb (the database) how data should be structured. After these blueprints have been defined the rest of the web-app must follow these rules when posting data to the database.
**routes:**  
Currently, this folder only holds one file, mainly because there aren't that many routes and it doesn't get very cluttered by putting them all into the `api.ts` file located in it. A route file is responsible for taking the URL that the user/(or website) put in and then send that to the correct controller. It's a middleman that makes sure that information is going to the correct place.

### Data structures
There are two important data structures in the database, there are subjects that hold information about course name, description, code, etc (generally things that the user cannot change). The other structure is groups. The whole site is built with these, a group may contain other groups (thus enabling nesting) but it may also contain `content objects`. A content object is what it's named, it's an object holding content. There are currently three different of these, link objects, text objects (and in the new release deadline objects). For further exploration, I recommend you go and seem them for yourself [here](https://github.com/Hampfh/DataLinks/tree/master/app/models). You might also notice that a third data model exists, the logging model. This is used for logging all changes done to the site, this allows for overtime tracking of the site changes and might in the future be connected to some form of reward system.

### API

* [Subject requests](#subjects)
* [Group requests](#group)
* [Content requests](#content)
* [Contributor requests](#Contributor)

#### Subjects
##### Create subject
`POST`
`https://new.datasektionen.link/api/v1/subject`  
**Params:**    
| key 			| description 			| 
| --			| --		  			|
| name 			| Name of subject 		|  
| code 			| Subject code 			|  
| description 	| Subject description 	|
| color 		| Subject hex code		|
---
##### Fetch subjects
`GET`
`https://new.datasektionen.link/api/v1/subject`    
**Params:**  
| key 			| description 			|   
| --			| --		  			|  

---
##### Delete subject
`DELETE`
`https://new.datasektionen.link/api/v1/subject`   
**Params:**  
| key 			| description 			|  
| --			| --		  			| 
| id 			| Id of subject 		|   

#### Group
##### Create group
`POST`
`https://new.datasektionen.link/api/v1/group`    
**Params:**  
| key 			| description 			|  
| --			| --		  			| 
| parentGroup	| Id of parent group	| 
---
##### DELETE group
`DELETE`
`https://new.datasektionen.link/api/v1/group`    
**Params:**  
| key 			| description 			|  
| --			| --		  			| 
| id			| Id of group 			| 

#### Content
##### Create link
`POST` 
`https://new.datasektionen.link/api/v1/group/linkcontent`  
**Params:**  
| key 			| description 			|  
| --			| --		  			| 
| parentGroup	| Id of parent 			| 
| displayText	| Link text				| 
| link			| Actual link			| 
---
##### Create text
`POST` 
`https://new.datasektionen.link/api/v1/group/textcontent`  
**Params:**  
| key 			| description 			|  
| --			| --		  			| 
| parentGroup	| Id of parent 			| 
| title			| Text title			| 
| text			| Text					| 
---
##### Create deadline
`POST` 
`https://new.datasektionen.link/api/v1/group/deadlinecontent`  
**Params:**  
| key 			| description 				|  
| --			| --		  				| 
| parentGroup	| Id of parent 				| 
| displayText	| Deadline name				| 
| deadline		| Deadline datetime			| 
| start			| Begin from this datetime 	|
---
##### Update link
`PATCH` 
`https://new.datasektionen.link/api/v1/group/linkcontent`  
**Params:**  
| key 			| description 				|  
| --			| --		  				| 
| id			| Id of target element		| 
| parentGroup	| Id of parent 				| 
| displayText	| Link text	 (optional)		| 
| link			| Actual link (optional)	| 
---
##### Update text
`POST` 
`https://new.datasektionen.link/api/v1/group/textcontent`  
**Params:**  
| key 			| description 			|  
| --			| --		  			| 
| id			| Id of target element	| 
| parentGroup	| Id of parent 			| 
| title			| Text title (optional)	| 
| text			| Text (optional)		| 
---
##### Update deadline
`POST` 
`https://new.datasektionen.link/api/v1/group/deadlinecontent`  
**Params:**  
| key 			| description 							|  
| --			| --		  							| 
| id			| Id of target element					| 
| parentGroup	| Id of parent 							| 
| displayText	| Deadline name	(optional)				| 
| deadline		| Deadline datetime (optional)			| 
| start			| Begin from this datetime (optional)	|
---
##### Delete content
Delete any element (link, text or deadline)
`POST` 
`https://new.datasektionen.link/api/v1/group/deadlinecontent`  
**Params:**   
| key 			| description 							|  
| --			| --		  							| 
| id			| Id of target element					| 
| parentGroup	| Id of parent							| 
#### Contributor
##### Set contributor name
`POST`
`https://new.datasektionen.link/api/v1/contributor/name`  
**Params:**  
| key 			| description 							|  
| --			| --		  							| 
| name			| Contributor name						|
---
##### Get contributors
Load all contributors sorted from the  
contributor with most contributions to the least  
`GET`
`https://new.datasektionen.link/api/v1/contributors`    
**Params:**  
| key 			| description 							|  
| --			| --		  							| 
