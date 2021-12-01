---
sidebar_position: 4
title: WCS - Wiki Content System
---

Okay, so this wouldn't be complete documentation without mentioning the dynamic wiki content system. The "heart" of the application or the functionality that makes it possible for people to use a UI to edit, implement and delete elements.

There are two parts of this system, the storage part which is defined in the models in the server documentation, and the interactive part (including rendering).

## The data
Everything is stored in redux state field `activeProgramSubjects` in the content reducer. The data is stored within an array with the type:
```typescript
interface SubjectData {
    _id: string,
    name: string,
    code: string,
    description: string,
    logo: LOGO,
    color: string,
    group: Group,
    archived: boolean,
    createdAt: Date,
    updatedAt: Date,
    __v: number
}
```

## Rendering
When entering a subject screen what happens is that we recursively go through our data object. Our data is built up using groups and content. A group may contain as many content objects as possible and even other groups too. 

A content object can either be a text, link, or a deadline.

Rendering is done in the file `RenderData.tsx` located in `components/templates/content_rendering`