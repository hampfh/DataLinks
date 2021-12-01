---
sidebar_position: 2
title: Structure
---

# Folder structure
## Okay so how is this project organized?  
The project is using flavour of the MVC model, aka Model, View, Controller. A way to split different into logical parts, thus making it easier to maintain. Lets have a look at the actual file structure:
```
<root>
  └─server
     └─src
        ├─controllers
        ├─middlewares
        ├─models
        ├─routes
        └─utilities
```

### Controllers
Controllers are the actual business logic in the API, they take some data as input, perform some task, and then emits an output. More about them [here](controllers).
### Middlewares
Middlewares are highly reusable functions that can be put between an actual request and a controller, these are often used to verify that a user has some form of data that is required for it to perform the request. An example of a common middleware is an authentication function that assures that the user performing the request has the privilege to perform the action (such as deleting an item or creating a new one).
### Models
Models are definitions of how data is stored in the database. These functions do not contain any logic. All models are defined using [typegoose](https://typegoose.github.io/).
### Routes
Routes have the responsibility to redirect an incoming request to the correct corresponding controller. Incoming requests will always have a URI such as `/<program>/content`. This information is used to determine which controller to use. A route path can have one out of four different "http verbs", `POST`, `GET`, `UPDATE` and `DELETE`.
### Utilities
Utilities are highly reusable (very general) functions that don't necessarily belong to a specific place in the codebase. Think of utilities as small libraries.
