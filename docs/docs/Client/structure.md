---
sidebar_position: 2
title: Structure
---

# Folder structure
## The general folder structure for the client project
The core structure comes from [create-react-app](https://create-react-app.dev/), if you are familiar with this you will feel relatively at home.
```
<root>
  └─client
      ├─public
      └─src
         ├─@types
         ├─assets
         ├─components
         |   ├─screens
         |   |   └─components
         |   ├─templates
         |   └─utilities
         ├─functions
         |   └─hooks
         └─state
             ├─actions
             └─reducers
```

### @types
This is a typescript folder for type declarations. Generally, interfaces and types are defined in the same component as they're used in but if the interface is used in multiple places it's moved to this folder.
### assets
The assets folder is quite self-explanatory. It hosts all images, svgs, and other bits and bobs that are not code.
### components
All react-specific components are restricted to this folder. Neither class nor function components should exist outside of this folder. 

:::tip
React components are all files ending with `.tsx` instead of `.ts`
:::
#### screens
"Screens" represent each landing page that a user can visit in the application, eg Home, Subjects, Subject, archived, etc... Each screen also contains a folder also named "components" which has all react components that are specific for that single screen. Aka components that aren't reusable outside the context.

Read more about which screens exists [here](screens)
#### templates
This directory holds very general components such as text, inputs, content objects, etc... Everything that isn't primarily for one specific screen.
#### utilities
The utilities folder is deprecated and should be merged with the "functions" folder.
### functions
Utility functions that are not necessarily linked to react. An example of this is network requests.
#### hooks
React hooks
### state
[Redux](https://redux.js.org) state folder
#### actions
[Redux actions](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions)
#### reducers
[Redux reducers](https://redux.js.org/usage/structuring-reducers/basic-reducer-structure)