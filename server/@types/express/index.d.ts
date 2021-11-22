/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Express {
    interface User {
        id: import("mongoose").Types.ObjectId
        username: string
        displayName: string
        privilege: import("models/user.model").Privilege
        settings: number // UserSettings bitwise number
        memberOf: unknown
    }
}