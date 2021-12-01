---
sidebar_position: 3
title: Controllers
---

## What is a controller?
A controller guards the flow of data to a specific resource. A common example of a "resource" is a user object. There are multiple ways that we might want to interact with this stored object, generally, there are four different actions that we can perform on data:  
+ `POST` - We create a new resource
+ `GET` - We read data from the database (without changing its content)
+ `PATCH` - We update an already existing resource
+ `DELETE` - We remove the resource from the database

Since all controllers have the same structure and manage data in a very similar way an abstract class has been implemented called `CrudController.ts` located in the controller directory. This class enforces each controller to implement these four actions (even if not all of the actions are used for that controller). All controllers are instantiated **once** in `controllers/index.ts` on server startup. All routes use the same controller instances, the reasons that controllers are using classes are primarily for code containment and not to use additional functionality such as inheritance. 

## Joi
All controllers use the library [joi](https://github.com/sideway/joi) which is a data validation package. All controller actions always have a joi statement in the beginning which is verifying that the incoming requests have the appropriate data which is required to perform the request. If these requirements aren't sufficed then the controller will respond with a 400 status code, indicating that the arguments are mal-formatted.

:::note
Joi not only enforces specific parameters it also prevents additional parameters by default, preventing requests to perform malicious requests by overpopulating fields
:::

:::tip
All joi validation schemas are located in at `controllers/schemas.ts`
:::