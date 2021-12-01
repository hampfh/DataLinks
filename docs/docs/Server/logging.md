---
sidebar_position: 3
title: Logging
---

DataLinks have a relatively robust logging system to track changes over time. With the implementation of [kth OpenID Connect](https://intra.kth.se/en/it/natverk/identitetshantering/konfigurationsinformation-for-saml-openid-connect-1.1045571) it is now also possible to track, with certainty, who has performed changes. This is very important as it makes it easier to perform rollbacks and manage abusive behavior of the application. 

The logging system uses the function log:

:::note
This function is also directly connected to the implemented contribution system for the application 
:::
```typescript title=controllers/Log.ts
const log = async (
    userId: mongoose.Types.ObjectId,
    operation: OperationType, 
    type: ContentType, 
    to: string[], 
    from?: string[]
): Promise<void> => {

    const newLog = new Log({
        user: userId,
        operation,
        to,
        type,
        from: from ?? []
    })

    await newLog.save()

    await User.contribute(
        userId.toString(), 
        operation, 
        type
    )
}
```

Logs are called from all controller actions (except GET requests), meaning that as soon as someone performs a `POST`, `PATCH` or `DELETE` the request will be logged and the user will change its contribution score.